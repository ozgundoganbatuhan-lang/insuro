'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) {
        setError(error.message);
        return;
      }
      // If email confirmations are enabled, session may be null.
      if (data.session) {
        router.push('/app/dashboard');
        router.refresh();
      } else {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 shadow-soft">
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium">Ad Soyad</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Örn. Ali Veli" />
        </div>
        <div>
          <label className="text-sm font-medium">E-posta</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="ornek@acente.com" />
        </div>
        <div>
          <label className="text-sm font-medium">Şifre</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="En az 8 karakter" />
        </div>
        {error ? (
          <div className="rounded-xl border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">{error}</div>
        ) : null}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Hesap oluşturuluyor…' : 'Hesap Oluştur'}
        </Button>
        <p className="text-xs text-foreground/60">
          Devam ederek KVKK ve Gizlilik metinlerini okuduğunuzu kabul etmiş olursunuz.
        </p>
      </form>
    </Card>
  );
}
