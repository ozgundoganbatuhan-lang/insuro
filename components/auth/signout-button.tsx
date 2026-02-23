'use client';

import { supabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      onClick={async () => {
        const supabase = supabaseBrowser();
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
      }}
    >
      Çıkış yap
    </Button>
  );
}
