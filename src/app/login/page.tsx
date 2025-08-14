'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const supabase = createPagesBrowserClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else router.push('/directory'); // land inside app after login
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-3xl border bg-white shadow-card">
      <h1 className="text-xl font-semibold mb-4">Log ind</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input className="border rounded-xl px-3 py-2" type="email" placeholder="Email"
               value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="border rounded-xl px-3 py-2" type="password" placeholder="Kodeord"
               value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="rounded-xl px-3 py-2 border bg-green-600 text-white disabled:opacity-60" disabled={loading}>
          {loading ? 'Arbejder…' : 'Log ind'}
        </button>
        {msg && <div className="text-sm text-red-600">{msg}</div>}
      </form>
      <p className="text-sm mt-4 text-gray-600">
        Har du fået en invitation? Brug linket i mailen til at sætte kodeord og kom herind, så sender vi dig videre til onboarding.
      </p>
    </div>
  );
}
