'use client';
import Image from 'next/image';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f6f5f1]">
      <header className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="font-semibold tracking-tight">Go' Nabo</div>
        <a href="/login" className="px-4 py-2 rounded-xl border bg-white shadow-card text-sm">Log ind</a>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center py-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Tal sammen. Planlæg. Del.</h1>
          <p className="text-gray-600 mb-6">
            Et lukket fællesskab for beboere — chat, kalender, opslag og begivenheder.
          </p>
          <div className="flex gap-3">
            <a href="/login" className="px-4 py-2 rounded-xl border bg-green-600 text-white">Log ind</a>
            <a href="/login" className="px-4 py-2 rounded-xl border bg-white">Jeg har en invitation</a>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border shadow-card bg-white">
          <Image
            src="https://images.unsplash.com/photo-1523419409543-25bd539f7174?q=80&w=1600&auto=format&fit=crop"
            alt="Nabolag"
            width={1600}
            height={1000}
            className="w-full h-[360px] object-cover"
            priority
          />
        </div>
      </main>
    </div>
  );
}
