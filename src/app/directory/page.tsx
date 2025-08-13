import { Shell, Card } from '@/components/ui';
import { supabaseServer } from '@/lib/supabaseServer';
export default async function DirectoryPage() {
  const sb = supabaseServer();
  const { data: profiles } = await sb
    .from('profiles')
    .select('id, full_name, avatar_url, households(address), household_id');
  const groups: Record<string, any[]> = {};
  (profiles || []).forEach((p: any) => {
    const addr = p?.households?.address || 'Ukendt adresse';
    groups[addr] = groups[addr] || [];
    groups[addr].push(p);
  });
  const entries = Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0]));
  return (
    <Shell>
      <Card title="Beboere og adresser">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.length === 0 && <div className="text-sm text-muted">Ingen beboere endnu.</div>}
          {entries.map(([address, members]) => (
            <div key={address} className="rounded-2xl border border-ring p-4 bg-white">
              <div className="font-medium mb-2">{address}</div>
              <div className="text-sm text-muted">{(members as any[]).map(m => m.full_name).join(', ')}</div>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}
