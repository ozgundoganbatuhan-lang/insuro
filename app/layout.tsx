import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Insuro — Sigorta Acenteleri İçin Müşteri & Poliçe Yönetimi',
  description: 'Müşteri, poliçe ve yenilemeleri tek panelde yönetin. 30 gün ücretsiz deneme.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
