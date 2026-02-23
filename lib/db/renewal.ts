import { supabaseServer } from '@/lib/supabase/server';

export async function listRenewals(orgId: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('renewal_tasks')
    .select('id,due_date,state,outcome_reason,last_touch_at,policies(branch,policy_no,end_date,customers(id,name,phone),insurers(name))')
    .eq('org_id', orgId)
    .order('due_date', { ascending: true })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}
