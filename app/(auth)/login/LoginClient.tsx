'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginClient() {
  const sp = useSearchParams();
  const next = sp.get('next') ?? '/app/dashboard';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border bg-card p-6">
        <h1 className="text-xl font-semibold">Giriş yap</h1>

        {/* burada mevcut login formun varsa AYNEN kalabilir */}
        <p className="mt-2 text-sm text-foreground/70">
          Giriş yaptıktan sonra yönlendirileceksiniz.
        </p>

        <Link
          href={next}
          className="mt-4 inline-block text-sm text-primary underline"
        >
          Devam
        </Link>
      </div>
    </div>
  );
}