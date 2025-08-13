import { Shell, Card } from '@/components/ui';
import { supabaseServer } from '@/lib/supabaseServer';
export default async function NoticesPage() {
  const sb = supabaseServer();
  const { data: notices } = await sb
    .from('notices')
    .select('*')
    .order('created_at', { ascending: false });
  return (
    <Shell>
      <Card title="Opslagstavle">
        <div className="space-y-3">
          {(notices||[]).map(n => (
            <div key={n.id} className="rounded-2xl border border-ring p-4 bg-white">
              <div className="font-medium">{n.title}</div>
              <div className="text-xs text-muted">{new Date(n.created_at).toLocaleString()}</div>
              <p className="text-sm mt-2 whitespace-pre-wrap">{n.body}</p>
            </div>
          ))}
          {(notices||[]).length===0 && <div className="text-sm text-muted">Ingen opslag endnu.</div>}
        </div>
      </Card>
    </Shell>
  );
}
