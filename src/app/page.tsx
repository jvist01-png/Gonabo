import { Shell, Card } from '@/components/ui';
import Link from 'next/link';
export default async function Page() {
  return (
    <Shell>
      <div className="relative overflow-hidden rounded-3xl border border-ring p-8 md:p-10" style={{ backgroundImage: 'linear-gradient(135deg, #DCFCE7, #E0F2FE)' }}>
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Go' Nabo</h1>
          <p className="mt-3 text-lg">Den lette måde at holde styr på naboer, beskeder, begivenheder og bestyrelsesopslag.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/chat" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow bg-white border border-ring">Prøv chatten</Link>
            <Link href="/calendar" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow bg-white border border-ring">Opret en begivenhed</Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card title="Seneste opslag" action={<a className="text-sm underline" href="/notices">Se alle</a>}>
          <div className="text-sm text-muted">Forbind til databasen for at se rigtige opslag.</div>
        </Card>
        <Card title="Kommende begivenheder" action={<a className="text-sm underline" href="/events">Se alle</a>}>
          <div className="text-sm text-muted">Forbind til databasen for at se begivenheder.</div>
        </Card>
      </div>
    </Shell>
  );
}
