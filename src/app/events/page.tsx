import { Shell, Card } from '@/components/ui';
import { supabaseServer } from '@/lib/supabaseServer';
export default async function EventsPage() {
  const sb = supabaseServer();
  const { data: events } = await sb
    .from('events')
    .select('*')
    .gte('starts_at', new Date(0).toISOString())
    .order('starts_at');
  return (
    <Shell>
      <Card title="Kommende begivenheder">
        <div className="space-y-3">
          {(events||[]).map(e => (
            <div key={e.id} className="rounded-2xl border border-ring p-4 bg-white">
              <div className="font-medium text-lg">{e.title}</div>
              <div className="text-sm text-muted">{new Date(e.starts_at).toLocaleString()} · {e.location || '—'}</div>
              {e.description && <p className="mt-2 text-sm whitespace-pre-wrap">{e.description}</p>}
            </div>
          ))}
          {(events||[]).length===0 && <div className="text-sm text-muted">Ingen kommende begivenheder.</div>}
        </div>
      </Card>
    </Shell>
  );
}
