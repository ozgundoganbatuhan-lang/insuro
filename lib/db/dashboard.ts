import { supabaseServer } from '@/lib/supabase/server';
import { addDays, formatISO } from 'date-fns';

export async function getDashboardData(orgId: string) {
  const supabase = supabaseServer();
  const today = new Date();
  const t0 = formatISO(today, { representation: 'date' });
  const t30 = formatISO(addDays(today, 30), { representation: 'date' });

  const [renewalsSoon, overdue, customers, policyCustomerIds] = await Promise.all([
    supabase
      .from('renewal_tasks')
      .select('id,due_date,state,policies(branch,end_date,customers(name,phone),insurers(name))')
      .eq('org_id', orgId)
      .neq('state', 'won')
      .gte('due_date', t0)
      .lte('due_date', t30)
      .order('due_date', { ascending: true })
      .limit(10),
    supabase
      .from('renewal_tasks')
      .select('id')
      .eq('org_id', orgId)
      .lte('due_date', t0)
      .neq('state', 'won')
      .limit(200),
    supabase
      .from('customers')
      .select('id,name,phone,created_at')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('policies')
      .select('customer_id')
      .eq('org_id', orgId)
      .limit(500)
  ]);

  const policyIds = new Set((policyCustomerIds.data ?? []).map((x) => x.customer_id));
  const noPolicy = (customers.data ?? []).filter((c) => !policyIds.has(c.id)).slice(0, 10);

  return {
    renewalsSoon: renewalsSoon.data ?? [],
    overdueCount: overdue.data?.length ?? 0,
    noPolicy,
    errors: [renewalsSoon.error, overdue.error, customers.error, policyCustomerIds.error].filter(Boolean)
  };
}
