import { AppShell } from '@/components/shell/app-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createOrganizationAction, seedDemoDataAction } from '@/lib/db/actions';
import { getActiveOrgId, getOrgSummary } from '@/lib/db/org';
import { getDashboardData } from '@/lib/db/dashboard';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import Link from 'next/link';

export default async function DashboardPage() {
  const orgId = await getActiveOrgId();

  if (!orgId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h1 className="text-3xl font-semibold tracking-tight">Hoş geldiniz</h1>
          <p className="mt-2 text-sm text-foreground/70">Insuro’yu kullanmaya başlamak için acentenizi oluşturun. 30 gün ücretsiz denemeniz otomatik başlar.</p>

          <div className="mt-6 grid gap-4">
            <Card className="p-6 shadow-soft">
              <form action={createOrganizationAction} className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Acente / Şirket adı</label>
                  <input name="name" className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/25" placeholder="Örn. Doğan Sigorta" required />
                </div>
                <Button type="submit" size="lg">Kurulumu Tamamla</Button>
              </form>
            </Card>

            <Card className="p-6 shadow-soft">
              <div className="text-sm font-medium">5 dakikada değer</div>
              <p className="mt-1 text-sm text-foreground/70">Kurulumdan sonra demo verisini tek tıkla ekleyip dashboard’ı dolu görebilirsiniz.</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const org = await getOrgSummary(orgId);
  const trialDaysLeft = Math.max(0, 30 - differenceInCalendarDays(new Date(), new Date(org.created_at)));
  const trialBadge = <Badge className="bg-background">Deneme: {trialDaysLeft} gün</Badge>;

  const data = await getDashboardData(orgId);

  return (
    <AppShell activeHref="/app/dashboard" trialBadge={trialBadge} headerRight={<Link href="/app/settings" className="text-sm text-foreground/70 hover:text-foreground">{org.name}</Link>}>
      <div className="grid gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-foreground/70">Bugün odak: yenilemeler ve takip listesi.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-5 shadow-soft">
            <div className="text-xs text-foreground/60">Yaklaşan Yenilemeler (30g)</div>
            <div className="mt-2 text-3xl font-semibold">{data.renewalsSoon.length}</div>
          </Card>
          <Card className="p-5 shadow-soft">
            <div className="text-xs text-foreground/60">Gecikmiş / Bugün</div>
            <div className="mt-2 text-3xl font-semibold text-warning">{data.overdueCount}</div>
          </Card>
          <Card className="p-5 shadow-soft">
            <div className="text-xs text-foreground/60">Takip Gereken</div>
            <div className="mt-2 text-3xl font-semibold">{data.noPolicy.length}</div>
          </Card>
          <Card className="p-5 shadow-soft">
            <div className="text-xs text-foreground/60">Durum</div>
            <div className="mt-2 text-sm text-foreground/70">{trialDaysLeft > 0 ? 'Deneme aktif' : 'Plan seçimi gerekli'}</div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Yaklaşan yenilemeler</div>
                <div className="mt-1 text-sm text-foreground/70">Önümüzdeki 30 gün içinde</div>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link href="/app/renewals">Tümünü gör</Link>
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {data.renewalsSoon.length === 0 ? (
                <div className="text-sm text-foreground/60">Henüz yenileme görevi yok.</div>
              ) : (
                data.renewalsSoon.map((r: any) => (
                  <Link
                    key={r.id}
                    href={`/app/renewals`}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-3 hover:bg-card"
                  >
                    <div>
                      <div className="text-sm font-medium">{r.policies?.customers?.name ?? '—'}</div>
                      <div className="text-xs text-foreground/60">
                        {r.policies?.branch ?? 'Poliçe'} · {r.policies?.insurers?.name ?? 'Şirket'}
                      </div>
                    </div>
                    <div className="text-xs font-medium text-warning">{format(new Date(r.due_date), 'dd.MM.yyyy')}</div>
                  </Link>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Takip listesi</div>
                <div className="mt-1 text-sm text-foreground/70">Poliçesi olmayan yeni müşteriler</div>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link href="/app/customers">Müşteriler</Link>
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {data.noPolicy.length === 0 ? (
                <div className="text-sm text-foreground/60">Takip gerektiren müşteri yok.</div>
              ) : (
                data.noPolicy.map((c: any) => (
                  <Link key={c.id} href="/app/customers" className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-3 hover:bg-card">
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-foreground/60">{c.phone ?? '—'}</div>
                    </div>
                    <Badge className="bg-background">Takip</Badge>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6 shadow-soft">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">Demo verisi</div>
              <div className="mt-1 text-sm text-foreground/70">Dashboard’ı gerçekçi örneklerle doldurun (tek tık).</div>
            </div>
            <form action={seedDemoDataAction}>
              <Button type="submit" variant="secondary">Demo verisi ekle</Button>
            </form>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
