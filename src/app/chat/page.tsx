'use client';
import { Shell, Card } from '@/components/ui';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ChatPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    supabase.from('channels').select('*').then(({ data }) => {
      setChannels(data || []);
      if ((data || []).length) setActive(data![0].id);
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    supabase
      .from('messages')
      .select('*, profiles(full_name)')
      .eq('channel_id', active)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []));
    const sub = supabase
      .channel('room-' + active)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${active}` },
        payload => setMessages(prev => [...prev, payload.new])
      )
      .subscribe();
    return () => { sub.unsubscribe(); };
  }, [active]);

  async function send() {
    const t = text.trim();
    if (!t || !active) return;
    await supabase.from('messages').insert({ channel_id: active, content: t });
    setText('');
  }

  return (
    <Shell>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <Card title="Kanaler">
            <div className="space-y-1">
              {channels.map(c => (
                <button
                  key={c.id}
                  onClick={()=>setActive(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl border border-ring ${active===c.id?'bg-gray-50':''}`}
                >
                  #{c.name}
                </button>
              ))}
            </div>
          </Card>
        </div>
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <Card title="Chat">
            <div className="h-[60vh] overflow-y-auto space-y-2">
              {messages.map((m:any)=> (
                <div key={m.id} className="rounded-2xl border border-ring p-2 bg-white">
                  <div className="text-xs text-muted">{new Date(m.created_at).toLocaleString()}</div>
                  <div className="text-sm">{m.content}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={text}
                onChange={e=>setText(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter') send(); }}
                placeholder="Skriv en besked..."
                className="flex-1 rounded-xl border border-ring px-3 py-2"
              />
              <button onClick={send} className="px-4 py-2 rounded-xl border border-ring bg-white">Send</button>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
