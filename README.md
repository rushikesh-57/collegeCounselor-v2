# College Counselor v2

Next.js migration in progress. The app now runs on **Next.js App Router** for SSR/SSG, better SEO, and faster first contentful paint.

## Why Next.js

- Server rendering by default (content visible without JS)
- Static generation for college listing routes
- Better SEO metadata primitives
- Route-level code splitting and performance defaults

## Run locally

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Required env vars:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

`VITE_*` values are used by the server-side Supabase function bridge. `NEXT_PUBLIC_*` values are used by the browser auth client.

## Google Sign In

Enable Google in Supabase before using the button in `/auth`:

1. Go to Supabase Dashboard > Authentication > Providers > Google.
2. Add your Google OAuth client ID and secret.
3. Add redirect URLs:
   - `http://localhost:3000/account`
   - your production domain, for example `https://college-counselor.example.com/account`
4. In Google Cloud Console, add the Supabase callback URL shown in the Supabase Google provider settings.

## New SEO/Performance Routes

- `/` SSR
- `/colleges` SSG + ISR (`revalidate = 3600`)
- `/colleges/[slug]` SSG params + ISR

## Legacy Frontend

The previous Vite frontend is still present under `src/` during migration.

- `npm run dev:vite` to run old frontend
- `npm run build:vite` to build old frontend

## Supabase Setup

```powershell
npm run supabase -- login
npm run supabase -- link --project-ref your-project-ref
npm run supabase -- db push
```
