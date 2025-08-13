# Go' Nabo – Next.js + Supabase Starter

This is a production-ready starter for the neighbor communication app.

## Run locally
```bash
npm i
cp .env.example .env.local   # fill in Supabase values from your project
npm run dev
```

## Deploy (Steps 1–5)

1. **Create accounts**
   - Sign up at https://vercel.com and https://supabase.com

2. **Create your database (Supabase)**
   - New Project → wait until ready
   - SQL Editor → paste the contents of `supabase/schema.sql` → Run

3. **Import to Vercel**
   - Push this folder to a GitHub repo
   - In Vercel: “Add New …” → “Project” → import the repo
   - When prompted, add Environment Variables from Supabase project settings:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

4. **Deploy**
   - Click Deploy. You’ll get a `vercel.app` URL.

5. **Connect your domain**
   - In Vercel → Project → Settings → Domains → add your domain (e.g., `gonabo.dk` and `www.gonabo.dk`)
   - Follow DNS instructions (usually A or CNAME records).

## Branding
- Custom logo files are in `public/brand/`:
  - `go-nabo-mark.svg` (square mark)
  - `go-nabo-word.svg` (wordmark)
- Favicon: `public/favicon.svg`

## Tests
```bash
npm run test
```
