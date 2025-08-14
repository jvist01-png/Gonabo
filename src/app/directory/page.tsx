'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { Shell, Card } from '@/components/ui';

export default function DirectoryPage() {
  const supabase = createPagesBrowserClient();
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/login');
      } else {
        fetchProfiles();
      }
    });
  }, []);

  async function fetchProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, households(address), household_id');

    if (error) {
      console.error(error);
      return;
    }
    setProfiles(data || []);
    setLoading(false);
  }

  // Group profiles by address
  const groups: Record<string, any[]> = {};
  profiles.forEach((p) => {
    const addr = p.households?.address || 'Ukendt adresse';
    if (!groups[addr]) groups[addr] = [];
    groups[addr].push(p);
  });

  const entries = Object.entries(groups).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <Shell>
      <Card title="Beboere og adresser">
        {loading ? (
          <div className="text-sm text-muted">Henter beboere...</div>
        ) : entries.length === 0 ? (
          <div className="text-sm text-muted">Ingen beboere endnu.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map(([address, members]) => (
              <div key={address} className="rounded-2xl border border-ring p-4 bg-white">
                <div className="font-medium mb-2">{address}</div>
                <div className="text-sm text-muted">
                  {(members as any[]).map((m) => m.full_name).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Shell>
  );
}
