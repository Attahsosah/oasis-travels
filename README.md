# Kazeline Agency

A cinematic luxury‑travel experience — bilingual marketing site, a procedural 3D hero, immersive page transitions, a full booking flow, wishlist, and Supabase‑ready auth. Built with Next.js 15 (App Router), React 19, TypeScript (strict), and Tailwind CSS v4.

> **Brand name is a placeholder.** "Kazeline Agency" appears in the dictionaries (`messages/*.json`) and a few components; it's trivially renameable.

---

## Highlights

- **Poster‑first 3D hero** — a static CSS/SVG dawn poster (the LCP) with a WebGL scene (React Three Fiber) that lazily cross‑fades in on capable devices: shader ocean, faceted island, drifting clouds, a GLB plane on a choreographed flight path, cursor/tilt parallax, adaptive quality. Skipped entirely under reduced motion / mobile / low‑GPU.
- **Bilingual (EN/FR)** — sub‑path routing (`/en`, `/fr`) with middleware locale negotiation, `hreflang`, and localized content.
- **Cinematic transitions** — full‑screen overlay wipes between routes (4 variants), reduced‑motion‑safe.
- **Full marketing site** — featured destinations, filterable explorer, packages, categories, experiences, partners, testimonials, gallery, FAQ, contact + newsletter (Zod‑validated Server Actions).
- **Booking wizard** — 6 URL‑stepped stages, per‑step validation, draft persisted to `sessionStorage`, Server Action submit with a confirmation reference.
- **Wishlist** — persisted (localStorage), header count, save on detail pages.
- **Auth‑ready** — Supabase Auth (`@supabase/ssr`) with sign‑in/up/callback, session middleware, and a guarded account area. Runs on a local fallback until credentials are provided.
- **SEO** — per‑locale metadata + `hreflang`, JSON‑LD (TravelAgency / TouristDestination / FAQ / Breadcrumb), `sitemap.xml`, `robots.txt`, PWA manifest.
- **Tested** — Vitest units + Playwright E2E with axe accessibility checks.

## Tech stack

Next.js 15 · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · Three.js / React Three Fiber / drei / postprocessing · Lenis · Zustand · Zod · Supabase (`supabase-js` + `ssr`) · Vitest · Playwright.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000  (redirects to /en)
```

Copy `.env.example` → `.env.local`. All variables are optional for local dev — without them the app runs on the typed local data adapter and auth shows a "not configured" state.

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=            # enables auth + Supabase persistence
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=           # server only (seeding/admin)
```

> **Windows note:** if you switch between `npm run build` and `npm run dev`, delete `.next` in between (`Remove-Item -Recurse -Force .next`) — a shared cache can corrupt and produce spurious errors.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | ESLint |
| `npm run test` / `test:watch` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E (run `npx playwright install` once) |

## Project structure

```
src/
├─ app/[locale]/          # localized routes: home, destinations, packages,
│                         #   booking, wishlist, account, auth, error/loading/not-found
│  ├─ sitemap.ts robots.ts manifest.ts
├─ components/            # layout (header/footer/nav/section/image), motion primitives, seo
├─ features/             # hero-3d, destinations, packages, booking, wishlist, auth,
│                         #   transitions, testimonials, faq, contact, newsletter, …
├─ lib/                  # data (repository + seed + types), i18n, supabase, seo,
│                         #   validation (zod), utils
├─ stores/               # zustand: wishlist, booking draft
└─ middleware.ts         # locale negotiation + Supabase session refresh
messages/                # en.json, fr.json
supabase/                # migrations, seed.sql, README (schema + RLS)
tests/                   # unit (vitest), e2e (playwright + axe)
```

## Architecture notes

- **Repository/adapter data layer.** The app codes against a typed `ContentRepository` interface. A local seed‑backed adapter is active until `NEXT_PUBLIC_SUPABASE_URL` is set, at which point a Supabase adapter implements the same interface — no call‑site changes. Localized prose is `{ en, fr }` (mirrors the planned Supabase `i18n jsonb`).
- **Poster‑first hero** protects Core Web Vitals: the poster is the LCP; the WebGL bundle (Three.js) is fully code‑split and mounted post‑idle, so it never blocks first paint.
- **Reduced motion is first‑class.** A single `useReducedMotion` gate disables Lenis, the 3D scene, transitions, and primitive animations.
- **Static by default.** Marketing + detail pages are SSG (per locale × slug). Auth‑aware personalization only turns pages dynamic once Supabase is configured (the session lookup reads no cookies when unconfigured).

## Supabase (going live)

The `supabase/` folder holds the schema, RLS policies, signup trigger, and a `seed.sql` that mirrors the local data. To activate:

1. Create a Supabase project; set the env vars above.
2. Apply `supabase/migrations/` and `supabase/seed.sql` (see `supabase/README.md`).

Auth, booking history, and content then read/write Supabase; RLS restricts `profiles`/`bookings`/`wishlists` to their owner and keeps content public‑read.

## Deployment (Vercel)

Push to a Vercel project. Set the env vars in the project settings. Images are optimized in production automatically (the dev‑only `unoptimized` flag is skipped when `NODE_ENV=production`).

## Custom 3D assets

Drop a `.glb` into `public/models/` and point the constant at it in `src/features/hero-3d/scene.tsx` (`PLANE_MODEL_URL`, `TREE_MODEL_URL`), then tune `scale`/`rotation`. Missing/failed models fall back to procedural geometry automatically. Attribute models in `CREDITS.md`.

## Known limitations / next steps

- **Images** are hot‑linked from Unsplash (optimized via Next in production). A future asset pipeline should download + locally optimize them.
- **Audit:** two remaining `npm audit` highs are transitive inside Next (`postcss` build‑time, `sharp` image optimizer) and clear when Next updates its bundled deps.
- Dark‑mode tokens exist but no toggle is wired; MobileNav lacks a full focus‑trap.

See `PROJECT_PROGRESS.md` for the full phase‑by‑phase build history and decisions, and `CREDITS.md` for asset attributions.
