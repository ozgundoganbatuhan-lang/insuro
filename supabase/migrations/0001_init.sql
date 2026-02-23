-- Insuro v20 schema (Supabase / Postgres)

create extension if not exists "pgcrypto";

-- Organizations (tenants)
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id) on delete cascade
);

-- Memberships
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

-- Profile (optional)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- Customers
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  notes text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Insurers (free-form list per org)
create table if not exists public.insurers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(org_id, name)
);

-- Policies
create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  insurer_id uuid references public.insurers(id) on delete set null,
  branch text not null,
  policy_no text,
  start_date date,
  end_date date not null,
  premium_amount numeric(12,2),
  currency text not null default 'TRY',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Renewals (tasks)
create table if not exists public.renewal_tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  policy_id uuid not null references public.policies(id) on delete cascade,
  due_date date not null,
  state text not null default 'pending',
  outcome_reason text,
  last_touch_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(org_id, policy_id)
);

-- Consents (WhatsApp opt-in etc.)
create table if not exists public.customer_consents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  type text not null, -- whatsapp, sms, email
  granted boolean not null,
  source text,
  granted_at timestamptz not null default now(),
  unique(org_id, customer_id, type)
);

-- Simple activity log
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- updated_at triggers
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_customers_updated') then
    create trigger trg_customers_updated before update on public.customers for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'trg_policies_updated') then
    create trigger trg_policies_updated before update on public.policies for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'trg_renewals_updated') then
    create trigger trg_renewals_updated before update on public.renewal_tasks for each row execute function public.set_updated_at();
  end if;
end $$;

-- Row Level Security
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.insurers enable row level security;
alter table public.policies enable row level security;
alter table public.renewal_tasks enable row level security;
alter table public.customer_consents enable row level security;
alter table public.activity_log enable row level security;

-- helper: current user's orgs
create or replace view public.my_orgs as
select m.org_id
from public.memberships m
where m.user_id = auth.uid();

-- Policies
create policy "org members can read org" on public.organizations
for select using (id in (select org_id from public.my_orgs));

create policy "users can create org" on public.organizations
for insert with check (created_by = auth.uid());

create policy "org members can read memberships" on public.memberships
for select using (org_id in (select org_id from public.my_orgs));

create policy "users can insert membership for own org" on public.memberships
for insert with check (user_id = auth.uid() and org_id in (select id from public.organizations where created_by = auth.uid()));

create policy "users can manage own profile" on public.profiles
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Customers CRUD
create policy "org members can read customers" on public.customers
for select using (org_id in (select org_id from public.my_orgs));
create policy "org members can insert customers" on public.customers
for insert with check (org_id in (select org_id from public.my_orgs));
create policy "org members can update customers" on public.customers
for update using (org_id in (select org_id from public.my_orgs)) with check (org_id in (select org_id from public.my_orgs));
create policy "org members can delete customers" on public.customers
for delete using (org_id in (select org_id from public.my_orgs));

-- Insurers
create policy "org members can read insurers" on public.insurers
for select using (org_id in (select org_id from public.my_orgs));
create policy "org members can manage insurers" on public.insurers
for all using (org_id in (select org_id from public.my_orgs)) with check (org_id in (select org_id from public.my_orgs));

-- Policies
create policy "org members can read policies" on public.policies
for select using (org_id in (select org_id from public.my_orgs));
create policy "org members can manage policies" on public.policies
for all using (org_id in (select org_id from public.my_orgs)) with check (org_id in (select org_id from public.my_orgs));

-- Renewals
create policy "org members can read renewal_tasks" on public.renewal_tasks
for select using (org_id in (select org_id from public.my_orgs));
create policy "org members can manage renewal_tasks" on public.renewal_tasks
for all using (org_id in (select org_id from public.my_orgs)) with check (org_id in (select org_id from public.my_orgs));

-- Consents
create policy "org members can read consents" on public.customer_consents
for select using (org_id in (select org_id from public.my_orgs));
create policy "org members can manage consents" on public.customer_consents
for all using (org_id in (select org_id from public.my_orgs)) with check (org_id in (select org_id from public.my_orgs));

-- Activity log
create policy "org members can read activity" on public.activity_log
for select using (org_id in (select org_id from public.my_orgs));
create policy "org members can insert activity" on public.activity_log
for insert with check (org_id in (select org_id from public.my_orgs) and actor_user_id = auth.uid());
