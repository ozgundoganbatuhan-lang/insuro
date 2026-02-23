import { AppShell } from '@/components/shell/app-shell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getActiveOrgId } from '@/lib/db/org';
import { listInsurers } from '@/lib/db/insurer';
import { addInsurerAction } from '@/lib/db/insurer-actions';

export default async function InsurersPage() {
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

  const insurers = await listInsurers(orgId);

  return (
    <AppShell activeHref="/app/insurers">
      <div className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Sigorta Şirketleri</h1>
            <p className="mt-1 text-sm text-foreground/70">Acentenizin satış yaptığı şirket listesini yönetin.</p>
          </div>
          <Badge className="bg-background">Toplam: {insurers.length}</Badge>
        </div>

        <Card className="p-6 shadow-soft">
          <div className="text-sm font-medium">Yeni şirket ekle</div>
          <form action={addInsurerAction} className="mt-4 flex gap-2">
            <Input name="name" placeholder="Örn. Mapfre" required />
            <Button type="submit">Ekle</Button>
          </form>
        </Card>

        <Card className="p-0 shadow-soft overflow-hidden">
          <div className="border-b border-border bg-card px-4 py-3 text-xs font-medium text-foreground/60">Şirket Adı</div>
          <div className="divide-y divide-border">
            {insurers.map((i) => (
              <div key={i.id} className="px-4 py-3 text-sm">{i.name}</div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
