import { supabaseServer } from '@/lib/supabase/server';

export async function listInsurers(orgId: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('insurers')
    .select('id,name,active')
    .eq('org_id', orgId)
    .order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}
