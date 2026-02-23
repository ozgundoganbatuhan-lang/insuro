# Insuro (v20) — Türkiye Sigorta Acenteleri için Müşteri & Poliçe Yönetimi

Bu repo, **Vercel + Supabase** üzerinde çalışacak şekilde hazırlanmış, **hafif**, **hızlı onboarding** odaklı bir SaaS iskeletidir.

## Ne var?
- Landing (kurumsal, modern, açık arka plan)
- Auth: login / signup (Supabase Auth)
- Multi-tenant: organization + membership modeli
- Modüller:
  - Dashboard (yenilemeler + takip listesi)
  - Müşteriler (hızlı ekle + liste)
  - Poliçeler (poliçe ekle + liste, otomatik renewal task)
  - Yenilemeler (tek tık “Yenilendi”)
  - Sigorta Şirketleri (liste + ekle)
- KVKK/Gizlilik/Koşullar sayfaları (şablon)
- Testler: vitest (unit) + playwright (smoke)

> Not: Otomatik “poliçe yenilendi” sinyali sigorta şirketinden gelmedikçe mümkün değil. V1/20’de doğru yaklaşım: **acente işaretler** (güvenli & izlenebilir). İleride entegrasyon varsa otomasyon eklenir.

---

## 1) Lokal çalıştırma

```bash
pnpm i   # veya npm i / yarn
pnpm dev
```

## 2) Supabase kurulum

1. Supabase’te yeni proje oluşturun.
2. SQL Editor → `supabase/migrations/0001_init.sql` içeriğini çalıştırın.
3. Auth → (hızlı onboarding için) email confirmation'ı kapatabilirsiniz.

### Env vars
Kök dizinde `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 3) Vercel deploy

- Repo’yu GitHub’a push edin
- Vercel → Import Project
- Environment Variables → yukarıdaki 2 değişkeni ekleyin
- Deploy

## 4) Domain bağlama
Vercel → Project Settings → Domains → domain ekleyin.

---

## Yol haritası (gerçek “v10 hissi” için)
Bu repo bilerek **hızlı değer** odaklı bırakıldı.

### “Vazgeçilmez” olacak 10 hamle
1. **Hatırlatma motoru**: Supabase cron + Edge Function → e-posta/SMS/WhatsApp (opt-in ile)
2. **KVKK uyum paketleri**: aydınlatma + açık rıza + veri saklama süreleri + log
3. **Görev akışı**: “Arandı / Teklif verildi / Bekliyor / Yenilendi / Kaybedildi”
4. **Doküman kasası**: poliçe PDF + kimlik vb. (şifreli depolama + role bazlı)
5. **Hızlı arama**: isim/telefon/poliçe no
6. **Akıllı öneriler (AI)**: görüşme notu → sonraki adım önerisi + otomatik görev açma
7. **Tek ekran müşteri profili**: tüm poliçeler + iletişim geçmişi
8. **Raporlama**: yenileme başarı oranı, kayıp nedenleri, branş bazlı prim
9. **Rol & yetki**: owner/agent/viewer
10. **Deneme & planlar**: Stripe + kullanım limitleri

