import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: "Go' Nabo", description: 'Neighbor communication app' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da"><body>{children}</body></html>
  );
}
