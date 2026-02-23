import Link from 'next/link';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
        <div>
          <Link href="/" className="text-sm text-foreground/70 hover:text-foreground">
            ← Ana sayfa
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">30 Gün Ücretsiz Başla</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Kurulum yok. Kredi kartı yok. 5 dakikada değer.
          </p>
        </div>
        <SignupForm />
        <p className="text-sm text-foreground/70">
          Zaten hesabınız var mı?{' '}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
