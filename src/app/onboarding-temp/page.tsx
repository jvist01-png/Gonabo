'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function OnboardingPage() {
  const supabase = createPagesBrowserClient();
  const router = useRouter();

  const [status, setStatus] = useState<'init' | 'auth' | 'ready' | 'saving' | 'done' | 'error'>('init');
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');

  // Tværbanen 2–36 (even numbers)
  const addresses = useMemo(
    () => Array.from({ length: 18 }, (_, i) => `Tværbanen ${2 + i * 2}`),
    []
  );

  useEffect(() => {
    (async () => {
      try {
        setStatus('auth');

        // tokens from #access_token=...&refresh_token=...&type=invite
        const hash = window.location.hash?.replace(/^#/, '');
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw error;
          // clean hash
          window.history.replaceState({}, '', '/onboarding');
        }

        const { data } = await supabase.auth.getUser();
        if (!data.user) throw new Error('Kunne ikke logge ind fra invitationen.');

        // --- Typed result: households may be array or object in TS types
        type ProfileWithHousehold = {
          full_name: string | null;
          households: { address?: string }[] | { address?: string } | null;
        };

        const { data: prof } = await supabase
          .from('profiles')
          .select('full_name, households(address)')
          .eq('id', data.user.id)
          .maybeSingle()
          .returns<ProfileWithHousehold>();

        if (prof?.full_name) setFullName(prof.full_name);
        const hh = prof?.households;
        const addr = Array.isArray(hh) ? hh[0]?.address : hh?.address;
        if (addr) setAddress(addr);

        setStatus('ready');
      } catch (e: any) {
        setError(e.message ?? 'Uventet fejl under login fra invitationen.');
        setStatus('error');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setStatus('saving');
      setError(null);

      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) throw new Error('Ingen bruger fundet. Åbn invitationslinket igen.');

      // Ensure household for address
      let { data: hh, error: hhErr } = await supabase
        .from('households')
        .select('id')
        .eq('address', address)
        .maybeSingle();
      if (hhErr) throw hhErr;

      if (!hh) {
        const { data: inserted, error: insErr } = await supabase
          .from('households')
          .insert({ address })
          .select('id')
          .single();
        if (insErr) throw insErr;
        hh = inserted;
      }

      const avatar_url = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=16A34A&color=fff`;

      const { error: profErr } = await supabase
        .from('profiles')
        .upsert({ id: user.id, full_name: fullName, avatar_url, household_id: hh.id });
      if (profErr) throw profErr;

      setStatus('done');
      router.replace('/directory');
    } catch (e: any) {
      setError(e.message ?? 'Fejl under oprettelse af profil.');
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5f1] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border bg-white shadow-card p-6">
        <h1 className="text-xl font-semibold mb-4">Velkommen til Go' Nabo</h1>

        {status === 'init' || status === 'auth' ? (
          <div className="text-sm text-gray-600">Validerer din invitation…</div>
        ) : status === 'error' ? (
          <>
            <div className="text-sm text-red-600 mb-3">{error}</div>
            <a href="/" className="text-sm underline">Til forsiden</a>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-sm">
              Fulde navn
              <input
                className="mt-1 w-full border rounded-xl px-3 py-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>

            <label className="text-sm">
              Adresse
              <select
                className="mt-1 w-full border rounded-xl px-3 py-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              >
                <option value="" disabled>Vælg adresse…</option>
                {addresses.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </label>

            <button
              className="rounded-xl px-3 py-2 border bg-green-600 text-white disabled:opacity-60"
              disabled={status === 'saving'}
              type="submit"
            >
              {status === 'saving' ? 'Gemmer…' : 'Fortsæt'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
