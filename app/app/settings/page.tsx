import { AppShell } from '@/components/shell/app-shell';
import { Card } from '@/components/ui/card';
import { SignOutButton } from '@/components/auth/signout-button';
import { getActiveOrgId, getOrgSummary } from '@/lib/db/org';

export default async function SettingsPage() {
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

  const org = await getOrgSummary(orgId);

  return (
    <AppShell activeHref="/app/settings">
      <div className="grid gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ayarlar</h1>
          <p className="mt-1 text-sm text-foreground/70">Hesap ve acente bilgileri.</p>
        </div>

        <Card className="p-6 shadow-soft">
          <div className="text-sm font-medium">Acente</div>
          <p className="mt-1 text-sm text-foreground/70">{org.name}</p>
        </Card>

        <Card className="p-6 shadow-soft">
          <div className="text-sm font-medium">Oturum</div>
          <div className="mt-3"><SignOutButton /></div>
        </Card>
      </div>
    </AppShell>
  );
}
