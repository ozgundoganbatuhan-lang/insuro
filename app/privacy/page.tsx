import { Card } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Gizlilik Politikası</h1>
      <p className="mt-2 text-sm text-foreground/70">Bu sayfa bir şablondur. Kendi politikanızı ekleyin.</p>
      <Card className="mt-6 p-6 shadow-soft">
        <div className="prose prose-slate max-w-none">
          <p>
            Insuro, hizmeti sunmak için zorunlu olan verileri işler. Üçüncü taraf servisler (ör. barındırma, analiz)
            kullanılıyorsa burada açıkça belirtilmelidir.
          </p>
          <p>
            Çerez ve ölçüm: üretimde kullanıyorsanız, onay mekanizması ve hangi metriklerin toplandığı burada listelenmelidir.
          </p>
        </div>
      </Card>
    </div>
  );
}
