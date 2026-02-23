'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer, requireUser } from '@/lib/supabase/server';
import { getActiveOrgId } from '@/lib/db/org';
import { addDays, formatISO } from 'date-fns';

export async function createOrganizationAction(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  if (!name) throw new Error('Org name is required');

  const user = await requireUser();
  const supabase = supabaseServer();

  // create org
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({ name, created_by: user.id })
    .select('id')
    .single();
  if (orgError) throw orgError;

  // add membership (policy allows owner to insert membership for own org)
  const { error: memError } = await supabase
    .from('memberships')
    .insert({ org_id: org.id, user_id: user.id, role: 'owner' });
  if (memError) throw memError;

  // seed default insurers
  await supabase.from('insurers').insert(
    ['Axa', 'Allianz', 'Anadolu Sigorta', 'Sompo', 'Zurich'].map((n) => ({ org_id: org.id, name: n }))
  );

  revalidatePath('/app');
  return { orgId: org.id };
}

export async function seedDemoDataAction() {
  const user = await requireUser();
  const supabase = supabaseServer();
  const orgId = await getActiveOrgId();
  if (!orgId) throw new Error('NO_ORG');

  // Create demo customers
  const { data: customers, error: cErr } = await supabase
    .from('customers')
    .insert(
      [
        { org_id: orgId, name: 'Mehmet Yılmaz', phone: '+90 5xx xxx xx xx', notes: 'Kasko yenileme' },
        { org_id: orgId, name: 'Ayşe Demir', phone: '+90 5xx xxx xx xx', notes: 'Trafik' },
        { org_id: orgId, name: 'Kaan Şahin', phone: '+90 5xx xxx xx xx', notes: 'Konut' }
      ]
    )
    .select('id')
    .throwOnError();

  // Fetch insurers
  const { data: insurers } = await supabase.from('insurers').select('id,name').eq('org_id', orgId).limit(5);
  const insurerId = insurers?.[0]?.id ?? null;

  // Create demo policies
  const today = new Date();
  const policiesPayload = (customers || []).map((c, i) => ({
    org_id: orgId,
    customer_id: c.id,
    insurer_id: insurerId,
    branch: i === 0 ? 'Kasko' : i === 1 ? 'Trafik' : 'Konut',
    end_date: formatISO(addDays(today, i === 0 ? 14 : i === 1 ? 7 : 30), { representation: 'date' }),
    premium_amount: i === 0 ? 14500 : i === 1 ? 4200 : 8200
  }));

  // Create policies (no need to return rows)
  await supabase.from('policies').insert(policiesPayload).throwOnError();

  // Create renewal tasks for policies ending soon
  const { data: pols } = await supabase.from('policies').select('id,end_date').eq('org_id', orgId).limit(10);
  if (pols?.length) {
    await supabase
      .from('renewal_tasks')
      .upsert(pols.map((p) => ({ org_id: orgId, policy_id: p.id, due_date: p.end_date })), { onConflict: 'org_id,policy_id' });
  }

  // Log
  await supabase.from('activity_log').insert({
    org_id: orgId,
    actor_user_id: user.id,
    entity_type: 'seed',
    action: 'seed_demo'
  });

  revalidatePath('/app');
  return { ok: true };
}
