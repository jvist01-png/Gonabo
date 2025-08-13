'use client';
import React from 'react';
import Image from 'next/image';

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 flex gap-6">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export function Header() {
  return (
    <header className="border-b border-ring bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl shadow-sm flex items-center justify-center bg-brandSoft">
            <Image src="/brand/go-nabo-mark.svg" alt="Go' Nabo" width={18} height={18} />
          </div>
          <div>
            <div className="font-bold tracking-tight text-lg flex items-center gap-2">
              <Image src="/brand/go-nabo-word.svg" alt="Go' Nabo" width={100} height={20} />
            </div>
            <div className="text-sm text-muted">Det venlige nabolag – tal sammen, planlæg, del</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Sidebar() {
  const nav = [
    { href: '/', label: 'Forside' },
    { href: '/directory', label: 'Beboere' },
    { href: '/chat', label: 'Chat' },
    { href: '/notices', label: 'Opslagstavle' },
    { href: '/calendar', label: 'Kalender' },
    { href: '/events', label: 'Begivenheder' },
  ];
  return (
    <aside className="w-56 hidden md:block">
      <div className="sticky top-4">
        <nav className="flex flex-col gap-2">
          {nav.map(n => (
            <a key={n.href} href={n.href} className="px-3 py-2 rounded-xl border border-ring bg-white shadow-card text-sm hover:bg-gray-50">
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-ring bg-white p-4 md:p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-10 border-t border-ring">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 text-xs flex items-center justify-between text-muted">
        <div>© {new Date().getFullYear()} Go' Nabo</div>
        <div>Blød butiksstil · rolige farver · store rundinger</div>
      </div>
    </footer>
  );
}
