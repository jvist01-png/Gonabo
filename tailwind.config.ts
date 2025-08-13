import type { Config } from 'tailwindcss';
export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1F2937',
        muted: '#6B7280',
        ring: '#E5E7EB',
        accent: '#0EA5E9',
        accentSoft: '#E0F2FE',
        brand: '#16A34A',
        brandSoft: '#DCFCE7',
        page: '#F6F4EF',
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.25rem' },
      boxShadow: { card: '0 1px 2px rgba(0,0,0,0.06)' },
    },
  },
  plugins: [],
} satisfies Config;
