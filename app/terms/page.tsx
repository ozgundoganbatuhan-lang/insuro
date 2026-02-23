import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Kullanım Koşulları</h1>
      <p className="mt-2 text-sm text-foreground/70">Bu sayfa bir şablondur. Avukatınızla birlikte finalize edin.</p>
      <Card className="mt-6 p-6 shadow-soft">
        <div className="prose prose-slate max-w-none">
          <p>
            Insuro bir yazılım hizmetidir; sigorta satışı, fiyatlandırma veya danışmanlık hizmeti vermez. Tüm kayıtlar ve
            kararlar kullanıcı sorumluluğundadır.
          </p>
          <ul>
            <li>Deneme süresi: 30 gün</li>
            <li>Hizmet kesintileri ve plan değişiklikleri: [buraya]</li>
            <li>Veri dışa aktarma ve silme: [buraya]</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
