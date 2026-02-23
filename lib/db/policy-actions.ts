'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer, requireUser } from '@/lib/supabase/server';
import { getActiveOrgId } from '@/lib/db/org';

export async function createPolicyAction(formData: FormData) {
  await requireUser();
  const orgId = await getActiveOrgId();
  if (!orgId) throw new Error('NO_ORG');

  const customerId = String(formData.get('customer_id') || '').trim();
  const branch = String(formData.get('branch') || '').trim();
  const end_date = String(formData.get('end_date') || '').trim();
  const insurerId = String(formData.get('insurer_id') || '').trim() || null;
  const policyNo = String(formData.get('policy_no') || '').trim() || null;
  const premiumStr = String(formData.get('premium_amount') || '').trim();
  const premiumAmount = premiumStr ? Number(premiumStr) : null;

  if (!customerId || !branch || !end_date) throw new Error('Missing fields');

  const supabase = supabaseServer();

  const { data: policy, error } = await supabase
    .from('policies')
    .insert({
      org_id: orgId,
      customer_id: customerId,
      insurer_id: insurerId,
      branch,
      end_date,
      policy_no: policyNo,
      premium_amount: premiumAmount
    })
    .select('id,end_date')
    .single();
  if (error) throw error;

  // create/refresh renewal task
  await supabase
    .from('renewal_tasks')
    .upsert({ org_id: orgId, policy_id: policy.id, due_date: policy.end_date }, { onConflict: 'org_id,policy_id' });

  revalidatePath('/app/policies');
  revalidatePath('/app/renewals');
}
