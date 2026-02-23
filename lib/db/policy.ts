import { supabaseServer } from '@/lib/supabase/server';

export async function listPolicies(orgId: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('policies')
    .select('id,branch,end_date,policy_no,premium_amount,currency,customers(name),insurers(name)')
    .eq('org_id', orgId)
    .order('end_date', { ascending: true })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}
