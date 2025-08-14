'use client';
import { useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function InvitePage() {
  const supabase = createPagesBrowserClient();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(null);

    // Server: call our API route (uses service role) to send the actual invite
    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setMsg(data.ok ? 'Invitation sendt.' : `Fejl: ${data.error}`);
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-3xl border bg-white shadow-card">
      <h1 className="text-xl font-semibold mb-4">Send invitation</h1>
      <form onSubmit={sendInvite} className="flex gap-2">
        <input className="flex-1 border rounded-xl px-3 py-2" type="email" placeholder="email@eksempel.dk"
               value={email} onChange={e => setEmail(e.target.value)} required />
        <button className="px-4 py-2 rounded-xl border bg-green-600 text-white" disabled={loading}>
          {loading ? 'Sender…' : 'Send'}
        </button>
      </form>
      {msg && <div className="text-sm mt-3">{msg}</div>}
      <p className="text-xs text-gray-500 mt-4">Kun bestyrelsen bør bruge denne side.</p>
    </div>
  );
}
