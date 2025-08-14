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

    // store address in households + link profile to it (simple first pass):
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
