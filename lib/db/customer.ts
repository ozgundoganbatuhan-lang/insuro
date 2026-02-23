import { supabaseServer } from '@/lib/supabase/server';

export async function listCustomers(orgId: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('customers')
    .select('id,name,phone,email,notes,created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}
