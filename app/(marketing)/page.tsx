import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

const features = [
  {
    title: 'Yenileme Motoru',
    desc: 'Bitiş tarihlerini kaçırmadan takip edin. Bugün / 7 gün / 30 gün görünümü.'
  },
  {
    title: 'Müşteri & Poliçe Kartları',
    desc: 'Müşteri geçmişi, poliçeler, notlar, evraklar — tek yerde.'
  },
  {
    title: 'Takip Listesi',
    desc: 'Poliçesi olmayan yeni müşterileri otomatik takip listesine alın.'
  },
  {
    title: 'Kurumsal Güven',
    desc: 'KVKK odaklı tasarım: izin kayıtları, log’lar ve dışa aktarım.'
  }
];

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight">
            Insuro
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-foreground/70 hover:text-foreground">
              Giriş
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">30 Gün Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/70 shadow-soft">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent" />
                Kurulum yok · Kredi kartı yok · 30 gün deneme
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                Sigorta acenteniz için
                <span className="text-primary"> müşteri</span>, <span className="text-primary">poliçe</span> ve
                <span className="text-primary"> yenileme</span> kontrol odası.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-foreground/70">
                Insuro, acentelerin gün içinde en çok yaptığı işleri hızlandırır: müşteri kartları, poliçe takibi,
                yenileme hatırlatmaları ve operasyonel görünürlük.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup">Ücretsiz Başla</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/login">Demo hesabım var</Link>
                </Button>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-foreground/70">
                {[
                  '5 dakikada değer: demo verisi + checklist',
                  'Yenileme kaçırma riskini düşürür',
                  'Light UI: kurumsal, ferah, göz yormaz'
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-success" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="p-6 shadow-soft">
              <div className="grid gap-3">
                <div className="text-sm font-medium">Bugün</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-background p-4">
                    <div className="text-xs text-foreground/60">Yapılacak</div>
                    <div className="mt-1 text-2xl font-semibold">3</div>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-4">
                    <div className="text-xs text-foreground/60">Riskli Yenileme</div>
                    <div className="mt-1 text-2xl font-semibold">1</div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="text-xs text-foreground/60">Yaklaşan yenilemeler</div>
                  <div className="mt-2 space-y-2">
                    {[
                      { n: 'Mehmet Yılmaz', d: 'Kasko', t: '14 gün' },
                      { n: 'Ayşe Demir', d: 'Trafik', t: '7 gün' }
                    ].map((x) => (
                      <div key={x.n} className="flex items-center justify-between rounded-lg bg-card px-3 py-2">
                        <div>
                          <div className="text-sm font-medium">{x.n}</div>
                          <div className="text-xs text-foreground/60">{x.d}</div>
                        </div>
                        <div className="text-xs font-medium text-warning">{x.t}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((f) => (
              <Card key={f.title} className="p-6 shadow-soft">
                <div className="text-lg font-semibold">{f.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{f.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-border/70 bg-card">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center">
            <div>
              <div className="text-2xl font-semibold">Bugün başlayın.</div>
              <p className="mt-1 text-sm text-foreground/70">30 gün ücretsiz. Kredi kartı istemiyoruz.</p>
            </div>
            <Button asChild size="lg">
              <Link href="/signup">Ücretsiz Başla</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-foreground/60">© {new Date().getFullYear()} Insuro</div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link className="text-foreground/70 hover:text-foreground" href="/kvkk">
              KVKK
            </Link>
            <Link className="text-foreground/70 hover:text-foreground" href="/privacy">
              Gizlilik
            </Link>
            <Link className="text-foreground/70 hover:text-foreground" href="/terms">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
