'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer, requireUser } from '@/lib/supabase/server';
import { getActiveOrgId } from '@/lib/db/org';

export async function setRenewalStateAction(formData: FormData) {
  await requireUser();
  const orgId = await getActiveOrgId();
  if (!orgId) throw new Error('NO_ORG');

  const renewalId = String(formData.get('renewal_id') || '').trim();
  const state = String(formData.get('state') || '').trim();
  const outcome_reason = String(formData.get('outcome_reason') || '').trim() || null;
  if (!renewalId || !state) throw new Error('Missing fields');

  const supabase = supabaseServer();
  const { error } = await supabase
    .from('renewal_tasks')
    .update({ state, outcome_reason, last_touch_at: new Date().toISOString() })
    .eq('id', renewalId)
    .eq('org_id', orgId);
  if (error) throw error;

  revalidatePath('/app/dashboard');
  revalidatePath('/app/renewals');
}
