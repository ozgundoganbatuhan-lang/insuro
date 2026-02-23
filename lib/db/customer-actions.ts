'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer, requireUser } from '@/lib/supabase/server';
import { getActiveOrgId } from '@/lib/db/org';

export async function createCustomerAction(formData: FormData) {
  await requireUser();
  const orgId = await getActiveOrgId();
  if (!orgId) throw new Error('NO_ORG');

  const name = String(formData.get('name') || '').trim();
  if (!name) throw new Error('Name required');
  const phone = String(formData.get('phone') || '').trim() || null;
  const email = String(formData.get('email') || '').trim() || null;
  const notes = String(formData.get('notes') || '').trim() || null;

  const supabase = supabaseServer();
  const { error } = await supabase.from('customers').insert({ org_id: orgId, name, phone, email, notes });
  if (error) throw error;

  revalidatePath('/app/customers');
}
