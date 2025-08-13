import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function supabaseServer() {
  // Works with auth-helpers-nextjs v0.10.x in the App Router
  return createServerComponentClient({ cookies });
}
