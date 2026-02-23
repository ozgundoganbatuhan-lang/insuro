import { AppShell } from '@/components/shell/app-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getActiveOrgId } from '@/lib/db/org';
import { listCustomers } from '@/lib/db/customer';
import { listInsurers } from '@/lib/db/insurer';
import { listPolicies } from '@/lib/db/policy';
import { createPolicyAction } from '@/lib/db/policy-actions';
import { format } from 'date-fns';

export default async function PoliciesPage() {
  const orgId = await getActiveOrgId();
  if (!orgId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h1 className="text-2xl font-semibold">Önce acente oluşturmalısınız</h1>
          <p className="mt-2 text-sm text-foreground/70">Dashboard sayfasından kurulumu tamamlayın.</p>
        </div>
      </div>
    );
  }

  const [customers, insurers, policies] = await Promise.all([
    listCustomers(orgId),
    listInsurers(orgId),
    listPolicies(orgId)
  ]);

  return (
    <AppShell activeHref="/app/policies">
      <div className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Poliçeler</h1>
            <p className="mt-1 text-sm text-foreground/70">Poliçe ekleyin, yenileme görevleri otomatik oluşsun.</p>
          </div>
          <Badge className="bg-background">Toplam: {policies.length}</Badge>
        </div>

        <Card className="p-6 shadow-soft">
          <div className="text-sm font-medium">Yeni poliçe</div>
          <form action={createPolicyAction} className="mt-4 grid gap-3 md:grid-cols-6">
            <div className="md:col-span-2">
              <label className="text-xs text-foreground/60">Müşteri</label>
              <select name="customer_id" required className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/25">
                <option value="">Seçin…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-foreground/60">Branş</label>
              <Input name="branch" required placeholder="Kasko / Trafik / Konut" className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-foreground/60">Bitiş tarihi</label>
              <Input name="end_date" required type="date" className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-foreground/60">Sigorta şirketi</label>
              <select name="insurer_id" className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/25">
                <option value="">—</option>
                {insurers.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 md:col-span-2">
              <div className="flex-1">
                <label className="text-xs text-foreground/60">Poliçe No (opsiyonel)</label>
                <Input name="policy_no" placeholder="123456" className="mt-1" />
              </div>
              <div className="w-36">
                <label className="text-xs text-foreground/60">Prim (ops.)</label>
                <Input name="premium_amount" placeholder="TRY" className="mt-1" />
              </div>
              <div className="flex items-end">
                <Button type="submit">Ekle</Button>
              </div>
            </div>
          </form>
          {customers.length === 0 ? (
            <p className="mt-3 text-sm text-foreground/60">Önce müşteri ekleyin.</p>
          ) : null}
        </Card>

        <Card className="p-0 shadow-soft overflow-hidden">
          <div className="grid grid-cols-12 gap-0 border-b border-border bg-card px-4 py-3 text-xs font-medium text-foreground/60">
            <div className="col-span-3">Müşteri</div>
            <div className="col-span-2">Branş</div>
            <div className="col-span-3">Şirket</div>
            <div className="col-span-2">Bitiş</div>
            <div className="col-span-2 text-right">Durum</div>
          </div>
          <div className="divide-y divide-border">
            {policies.length === 0 ? (
              <div className="px-4 py-10 text-sm text-foreground/60">Henüz poliçe yok.</div>
            ) : (
              policies.map((p: any) => (
                <div key={p.id} className="grid grid-cols-12 items-center gap-0 px-4 py-3 hover:bg-background">
                  <div className="col-span-3">
                    <div className="text-sm font-medium">{p.customers?.name ?? '—'}</div>
                    <div className="text-xs text-foreground/60">{p.policy_no ?? 'Poliçe no yok'}</div>
                  </div>
                  <div className="col-span-2 text-sm text-foreground/70">{p.branch}</div>
                  <div className="col-span-3 text-sm text-foreground/70">{p.insurers?.name ?? '—'}</div>
                  <div className="col-span-2 text-sm text-foreground/70">{format(new Date(p.end_date), 'dd.MM.yyyy')}</div>
                  <div className="col-span-2 text-right">
                    <Badge className="bg-background">Aktif</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
