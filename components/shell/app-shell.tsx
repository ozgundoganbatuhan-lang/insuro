import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Users, FileText, Bell, Building2, Settings } from 'lucide-react';

const nav = [
  { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/customers', label: 'Müşteriler', icon: Users },
  { href: '/app/policies', label: 'Poliçeler', icon: FileText },
  { href: '/app/renewals', label: 'Yenilemeler', icon: Bell },
  { href: '/app/insurers', label: 'Sigorta Şirketleri', icon: Building2 },
  { href: '/app/settings', label: 'Ayarlar', icon: Settings }
];

export function AppShell({
  children,
  headerRight,
  activeHref,
  trialBadge
}: {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  activeHref?: string;
  trialBadge?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-b border-border/70 bg-card md:min-h-screen md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-5 py-4">
            <Link href="/app/dashboard" className="font-semibold tracking-tight">
              Insuro
            </Link>
            <Badge className="hidden md:inline-flex">TR</Badge>
          </div>
          <nav className="flex flex-col gap-1 px-3 pb-4">
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = activeHref ? activeHref.startsWith(item.href) : false;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition',
                    isActive ? 'bg-background font-medium' : 'text-foreground/70 hover:bg-background hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                {trialBadge}
              </div>
              <div className="flex items-center gap-2">{headerRight}</div>
            </div>
          </header>

          <main className="px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
