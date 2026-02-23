import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
        <div>
          <Link href="/" className="text-sm text-foreground/70 hover:text-foreground">
            ← Ana sayfa
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Giriş</h1>
          <p className="mt-2 text-sm text-foreground/70">Insuro hesabınıza giriş yapın.</p>
        </div>
        <LoginForm />
        <p className="text-sm text-foreground/70">
          Hesabınız yok mu?{' '}
          <Link className="font-medium text-primary hover:underline" href="/signup">
            Ücretsiz hesap oluştur
          </Link>
        </p>
      </div>
    </div>
  );
}
