import { AppShell } from '@/components/shell/app-shell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getActiveOrgId } from '@/lib/db/org';
import { listRenewals } from '@/lib/db/renewal';
import { setRenewalStateAction } from '@/lib/db/renewal-actions';
import { format, differenceInCalendarDays } from 'date-fns';

function dueColor(daysLeft: number) {
  if (daysLeft <= 0) return 'text-danger';
  if (daysLeft <= 7) return 'text-warning';
  return 'text-foreground/70';
}

export default async function RenewalsPage() {
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

  const renewals = await listRenewals(orgId);

  return (
    <AppShell activeHref="/app/renewals">
      <div className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Yenilemeler</h1>
            <p className="mt-1 text-sm text-foreground/70">Tek tıkla: Yenilendi / Beklemede / Kaybedildi.</p>
          </div>
          <Badge className="bg-background">Toplam: {renewals.length}</Badge>
        </div>

        <Card className="p-0 shadow-soft overflow-hidden">
          <div className="grid grid-cols-12 gap-0 border-b border-border bg-card px-4 py-3 text-xs font-medium text-foreground/60">
            <div className="col-span-4">Müşteri</div>
            <div className="col-span-2">Branş</div>
            <div className="col-span-2">Bitiş</div>
            <div className="col-span-2">Durum</div>
            <div className="col-span-2 text-right">İşlem</div>
          </div>
          <div className="divide-y divide-border">
            {renewals.length === 0 ? (
              <div className="px-4 py-10 text-sm text-foreground/60">Henüz yenileme görevi yok. Poliçe eklediğinizde otomatik oluşur.</div>
            ) : (
              renewals.map((r: any) => {
                const due = new Date(r.due_date);
                const daysLeft = differenceInCalendarDays(due, new Date());
                return (
                  <div key={r.id} className="grid grid-cols-12 items-center gap-0 px-4 py-3 hover:bg-background">
                    <div className="col-span-4">
                      <div className="text-sm font-medium">{r.policies?.customers?.name ?? '—'}</div>
                      <div className="text-xs text-foreground/60">{r.policies?.insurers?.name ?? 'Şirket'} · {r.policies?.customers?.phone ?? '—'}</div>
                    </div>
                    <div className="col-span-2 text-sm text-foreground/70">{r.policies?.branch ?? '—'}</div>
                    <div className={`col-span-2 text-sm font-medium ${dueColor(daysLeft)}`}>{format(due, 'dd.MM.yyyy')}</div>
                    <div className="col-span-2">
                      <Badge className="bg-background">{r.state}</Badge>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <form action={setRenewalStateAction} className="flex gap-2">
                        <input type="hidden" name="renewal_id" value={r.id} />
                        <input type="hidden" name="state" value="won" />
                        <Button type="submit" size="sm" variant="secondary">Yenilendi</Button>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-soft">
          <div className="text-sm font-medium">Not</div>
          <p className="mt-1 text-sm text-foreground/70">
            Bu ekrandaki “Yenilendi” gibi değişiklikler, sigorta şirketi tarafından otomatik yapılmaz; acente işaretler.
            Bu yaklaşım veri kalitesini korur ve güven sağlar.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
