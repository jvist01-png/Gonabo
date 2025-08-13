import { Shell, Card } from '@/components/ui';
export default function CalendarPage() {
  return (
    <Shell>
      <Card title="Kalender">
        <div className="text-sm text-muted">En månedskalender kan tilføjes her (server components) med opret/rediger via server actions og Supabase.</div>
      </Card>
    </Shell>
  );
}
