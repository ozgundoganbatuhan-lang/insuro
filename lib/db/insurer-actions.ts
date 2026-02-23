'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer, requireUser } from '@/lib/supabase/server';
import { getActiveOrgId } from '@/lib/db/org';

export async function addInsurerAction(formData: FormData) {
  await requireUser();
  const orgId = await getActiveOrgId();
  if (!orgId) throw new Error('NO_ORG');

  const name = String(formData.get('name') || '').trim();
  if (!name) throw new Error('Name required');

  const supabase = supabaseServer();
  const { error } = await supabase.from('insurers').insert({ org_id: orgId, name });
  if (error) throw error;

  revalidatePath('/app/insurers');
  revalidatePath('/app/policies');
}
