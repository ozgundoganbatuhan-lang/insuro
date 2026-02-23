import { AppShell } from '@/components/shell/app-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createCustomerAction } from '@/lib/db/customer-actions';
import { getActiveOrgId } from '@/lib/db/org';
import { listCustomers } from '@/lib/db/customer';

export default async function CustomersPage() {
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

  const customers = await listCustomers(orgId);

  return (
    <AppShell activeHref="/app/customers">
      <div className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Müşteriler</h1>
            <p className="mt-1 text-sm text-foreground/70">Hızlı ekle, takip et, not al.</p>
          </div>
          <Badge className="bg-background">Toplam: {customers.length}</Badge>
        </div>

        <Card className="p-6 shadow-soft">
          <div className="text-sm font-medium">Yeni müşteri</div>
          <form action={createCustomerAction} className="mt-4 grid gap-3 md:grid-cols-4">
            <Input name="name" placeholder="Ad Soyad" required />
            <Input name="phone" placeholder="Telefon" />
            <Input name="email" placeholder="E-posta" type="email" />
            <div className="flex gap-2">
              <Input name="notes" placeholder="Not (opsiyonel)" className="flex-1" />
              <Button type="submit" className="shrink-0">Ekle</Button>
            </div>
          </form>
        </Card>

        <Card className="p-0 shadow-soft overflow-hidden">
          <div className="grid grid-cols-12 gap-0 border-b border-border bg-card px-4 py-3 text-xs font-medium text-foreground/60">
            <div className="col-span-4">Müşteri</div>
            <div className="col-span-3">Telefon</div>
            <div className="col-span-3">E-posta</div>
            <div className="col-span-2 text-right">Durum</div>
          </div>
          <div className="divide-y divide-border">
            {customers.length === 0 ? (
              <div className="px-4 py-10 text-sm text-foreground/60">Henüz müşteri yok. Üstten ekleyin.</div>
            ) : (
              customers.map((c) => (
                <div key={c.id} className="grid grid-cols-12 items-center gap-0 px-4 py-3 hover:bg-background">
                  <div className="col-span-4">
                    <div className="text-sm font-medium">{c.name}</div>
                    {c.notes ? <div className="text-xs text-foreground/60 line-clamp-1">{c.notes}</div> : null}
                  </div>
                  <div className="col-span-3 text-sm text-foreground/70">{c.phone ?? '—'}</div>
                  <div className="col-span-3 text-sm text-foreground/70">{c.email ?? '—'}</div>
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
