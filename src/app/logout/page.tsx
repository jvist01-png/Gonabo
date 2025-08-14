'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function LogoutPage() {
  const supabase = createPagesBrowserClient();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await supabase.auth.signOut();
      router.replace('/');
    })();
  }, []);

  return <div className="p-6 text-sm text-gray-600">Logger af…</div>;
}
