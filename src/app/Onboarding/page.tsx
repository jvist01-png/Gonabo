'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

const ADDRESSES = Array.from({ length: 18 }, (_, i) => 2 + i * 2).map(n => `Tværbanen ${n}`);

export default function Onboarding() {
  const supabase = createPagesBrowserClient();
  const router = useRouter();
  const [sessionOk, setSessionOk] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState(ADDRESSES[0]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // user lands here after accepting invite + setting password
    supabase.auth.getUser().then(({ data }) => {
      setSessionOk(!!data.user);
      if (!data.user) setMsg('Ingen bruger-session. Log ind og prøv igen.');
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg('Ikke logget ind.'); setLoading(false); return; }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: name,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
      household_id: null // You can later map address->household; for now we store address in the profile row
    });

    // store address in households + link profile to it (simple first pass):'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function OnboardingPage() {
  const supabase = createPagesBrowserClient();
  const router = useRouter();

  const [status, setStatus] = useState<'init'|'auth'|'ready'|'saving'|'done'|'error'>('init');
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');

  // Build the address dropdown: Tværbanen 2-36 even
  const addresses = useMemo(
    () => Array.from({ length: 18 }, (_, i) => `Tværbanen ${2 + i * 2}`),
    []
  );

  // 1) Accept invite tokens from hash and create a session
  useEffect(() => {
    async function handleInviteHash() {
      try {
        setStatus('auth');

        // tokens arrive in the URL hash e.g. #access_token=...&refresh_token=...&type=invite
        const hash = window.location.hash?.replace(/^#/, '');
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw error;

          // clean the hash from the URL (cosmetic)
          window.history.replaceState({}, '', '/onboarding');
        }

        // if already logged in (e.g., returned here), continue
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          throw new Error('Kunne ikke logge ind fra invitationen.');
        }

        // Pre-fill from existing profile if any
        const { data: prof } = await supabase
          .from('profiles')
          .select('full_name, households(address)')
          .eq('id', data.user.id)
          .maybeSingle();

        if (prof?.full_name) setFullName(prof.full_name);
        if (prof?.households?.address) setAddress(prof.households.address);

        setStatus('ready');
      } catch (e: any) {
        setError(e.message ?? 'Uventet fejl under login fra invitationen.');
        setStatus('error');
      }
    }

    handleInviteHash();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setStatus('saving');
      setError(null);

      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) throw new Error('Ingen bruger fundet. Prøv at åbne invitationslinket igen.');

      // ensure a household for the address
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

      // upsert profile
      const { error: profErr } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          avatar_url,
          household_id: hh.id,
        });
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

    const { data: hh, error: hhe } = await supabase
      .from('households')
      .upsert({ address })
      .select()
      .single();

    if (!hhe && hh) {
      await supabase.from('profiles').update({ household_id: hh.id }).eq('id', user.id);
    }

    if (error || hhe) setMsg(error?.message || hhe?.message || 'Kunne ikke gemme');
    else router.push('/directory');
    setLoading(false);
  }

  if (sessionOk === null) return null;

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-3xl border bg-white shadow-card">
      <h1 className="text-xl font-semibold mb-4">Velkommen! Lad os sætte din profil op.</h1>
      <form onSubmit={save} className="flex flex-col gap-3">
        <input className="border rounded-xl px-3 py-2" placeholder="Fulde navn"
               value={name} onChange={e => setName(e.target.value)} required />
        <select className="border rounded-xl px-3 py-2" value={address} onChange={e => setAddress(e.target.value)}>
          {ADDRESSES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <button className="rounded-xl px-3 py-2 border bg-green-600 text-white disabled:opacity-60" disabled={loading}>
          {loading ? 'Gemmer…' : 'Fortsæt'}
        </button>
        {msg && <div className="text-sm text-red-600">{msg}</div>}
      </form>
    </div>
  );
}
