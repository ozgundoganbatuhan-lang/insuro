import { Card } from '@/components/ui/card';

export default function KvkkPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">KVKK Aydınlatma</h1>
      <p className="mt-2 text-sm text-foreground/70">Bu sayfa bir şablondur. Kendi metninizi ekleyin.</p>
      <Card className="mt-6 p-6 shadow-soft">
        <div className="prose prose-slate max-w-none">
          <p>
            Insuro, kişisel verilerin korunmasına ilişkin aydınlatma yükümlülüğünü yerine getirmek için bu metni sunar.
            KVKK’ya göre aydınlatmada veri sorumlusunun kimliği, amaçlar, aktarım, yöntem ve hukuki sebep gibi unsurların
            yer alması beklenir.
          </p>
          <ul>
            <li>Veri sorumlusu: [Acente Unvanı]</li>
            <li>Veri işleyen: Insuro Yazılım Hizmetleri</li>
            <li>Amaçlar: müşteri/poliçe yönetimi, yenileme takibi</li>
            <li>Haklar: KVKK m.11 kapsamındaki haklar</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
