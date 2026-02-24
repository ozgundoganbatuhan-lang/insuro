'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') ?? '/app/dashboard';

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(url, anon);

    (async () => {
      const { data } = await supabase.auth.getSession();
      const authed = !!data.session?.user;

      if (authed) {
        router.replace(next);
        return;
      }

      setChecking(false);
    })();
  }, [router, next]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-foreground/70">Oturum kontrol ediliyor...</div>
      </div>
    );
  }

  // ✅ Burada mevcut login formun / component'in neyse onu render et
  // Örn: <LoginForm next={next} />
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border bg-card p-6">
        <h1 className="text-xl font-semibold">Giriş yap</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Lütfen e-posta ve şifrenizle giriş yapın.
        </p>

        {/* TODO: burada sizin login form component'iniz olmalı */}
      </div>
    </div>
  );
}