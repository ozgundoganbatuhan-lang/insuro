import { supabaseServer } from '@/lib/supabase/server';

export async function getActiveOrgId() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('memberships')
    .select('org_id, organizations(name)')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.org_id ?? null;
}

export async function getOrgSummary(orgId: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase.from('organizations').select('id,name,created_at').eq('id', orgId).single();
  if (error) throw error;
  return data;
}
