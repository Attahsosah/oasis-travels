# Kazeline Agency — Luxury Travel Experience

## Implementation Plan (Planning Phase — awaiting approval before any code)

**Locked decisions:** phased build in this workspace · live Supabase with typed mock fallback · sub-path i18n (`/en`, `/fr`) · Vercel deployment.

Brand working name: **Kazeline Agency**. Placeholder, trivially renameable via one config file.

---

## 1. Analysis: Challenges & Recommended Improvements

Before the plan, the honest engineering read on the brief.

**Challenge 1 — 3D hero vs. Lighthouse > 90.** A cinematic Three.js scene (island, animated ocean, plane, clouds, birds, HDR, bloom, fog) is the single biggest threat to the performance target, especially on mobile and to Lighthouse's throttled Moto-G test profile. A heavy WebGL canvas that blocks the main thread will cap the score well below 90 regardless of everything else.
*Recommendation:* The hero renders a **high-quality static poster image (LQIP → full)** as the LCP element. The WebGL canvas mounts **after** first paint, lazily, behind the poster, and cross-fades in. Lighthouse scores the poster; users on capable hardware get the scene. This is how Apple/Stripe-tier sites ship heavy hero media without tanking CWV. Non-negotiable for hitting the target.

**Challenge 2 — "Never use mock implementations when a free production solution exists" vs. "live Supabase with mock fallback."** These are reconciled by a **repository/data-access layer**: a single typed interface (`DestinationRepository`, `BookingRepository`, etc.) with two implementations — Supabase and local. The app codes against the interface. Not a "mock" in the throwaway sense; it's a real, typed, swappable adapter. Set `SUPABASE_URL` and it goes live; omit it and it serves seeded local JSON. Clean, production-legitimate, and lets us build/demo before you provision a project.

**Challenge 3 — 3–5 "immersive transitions" vs. 60 FPS + reduced-motion + SEO.** Full-screen WebGL scene transitions between routes are fragile and hurt accessibility and INP. *Recommendation:* implement transitions as **GSAP/CSS/Canvas 2D overlays** (cloud wipe, airplane sweep, sunrise→sunset gradient), not additional Three.js scenes. Cheaper, controllable, respect `prefers-reduced-motion`, and just as cinematic. Reserve real 3D for the one hero.

**Challenge 4 — Scope realism.** The full brief is genuinely a multi-week senior-team effort. Building it "in one shot" would produce exactly the placeholder/TODO code the brief forbids. The phased workflow (with your approval gate per phase) is therefore not optional — it is how we keep every phase production-real. I will hold the line on "no placeholders, no TODOs" by keeping each phase small enough to finish properly.

**Challenge 5 — Tailwind v4 + shadcn/ui maturity.** Tailwind v4 (CSS-first `@theme`) and shadcn are compatible but the ecosystem moves fast. *Recommendation:* pin exact versions in Phase 1 and record them in `PROJECT_PROGRESS.md` so the build is reproducible.

**Recommended additions to the brief:**
- **Error/loading/not-found** boundaries per route segment (App Router `error.tsx`, `loading.tsx`, `not-found.tsx`) — the brief omits these and they are table stakes.
- **Content layer**: destinations/packages as typed data (seedable to Supabase) rather than hardcoded JSX, so content scales without redeploys.
- **Analytics/consent**: a lightweight, cookie-consented analytics hook (Vercel Analytics) — needed for a "believable brand," gated for GDPR given the FR market.
- **Image pipeline**: standardize on `next/image` + a small script to pre-generate blur placeholders for Unsplash/Pexels assets.

---

## 2. Overall Architecture

- **Rendering:** Next.js 15 App Router. Server Components by default; Client Components only for interactivity (3D canvas, carousels, forms, motion). Marketing pages are statically generated / ISR; booking & profile are dynamic (auth-gated, server actions).
- **Data flow:** UI → typed **repository interface** → (Supabase adapter | local adapter). Server Components read via server-side Supabase client; mutations via **Server Actions** guarded by Zod + auth.
- **Auth:** Supabase Auth via `@supabase/ssr` with middleware session refresh; cookie-based, works with `/en`/`/fr` middleware.
- **i18n:** `[locale]` route segment + middleware locale negotiation; dictionaries loaded server-side, hydrated to client via a provider.
- **Styling/theming:** Tailwind v4 `@theme` design tokens → CSS variables → shadcn components consume tokens.
- **3D:** isolated, lazy-loaded R3F scene mounted client-side post-paint with adaptive quality tiers.
- **State:** mostly server + URL state; Zustand only for genuinely client-global UI (wishlist drawer, booking wizard draft, menu/transition orchestration).

---

## 3. Folder Structure

```
kazeline-agency/
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx            # locale provider, fonts, Lenis, header/footer
│  │  │  ├─ page.tsx              # landing (all marketing sections)
│  │  │  ├─ destinations/         # explorer + [slug] detail
│  │  │  ├─ packages/             # list + [slug]
│  │  │  ├─ booking/              # wizard (auth-gated steps)
│  │  │  ├─ account/              # profile, wishlist, booking history
│  │  │  ├─ (auth)/               # sign-in, sign-up, callback
│  │  │  ├─ error.tsx | loading.tsx | not-found.tsx
│  │  ├─ api/                     # route handlers (webhooks, og-image)
│  │  ├─ sitemap.ts | robots.ts | manifest.ts
│  │  └─ globals.css              # Tailwind v4 @theme tokens
│  ├─ features/                   # feature-based domains
│  │  ├─ hero-3d/                 # scene, meshes, hooks, quality manager
│  │  ├─ destinations/            # components, data, hooks, types
│  │  ├─ packages/  booking/  auth/  wishlist/
│  │  ├─ partners/  testimonials/  gallery/  faq/  contact/  newsletter/
│  │  └─ transitions/             # cinematic overlay transitions
│  ├─ components/
│  │  ├─ ui/                      # shadcn primitives
│  │  ├─ layout/                  # header, footer, nav, lang-switcher
│  │  └─ motion/                  # magnetic button, reveal, parallax, ripple
│  ├─ lib/
│  │  ├─ supabase/                # server, client, middleware, adapters
│  │  ├─ data/                    # repository interfaces + local adapter + seeds
│  │  ├─ i18n/                    # config, dictionaries, get-dictionary
│  │  ├─ validation/              # zod schemas (shared client/server)
│  │  ├─ seo/                     # metadata + JSON-LD builders
│  │  └─ utils/                   # cn(), formatters, gpu-tier, hooks
│  ├─ hooks/                      # useReducedMotion, useMediaQuery, useGpuTier…
│  ├─ stores/                     # zustand slices
│  └─ styles/
├─ messages/  en.json  fr.json    # translation dictionaries
├─ public/                        # optimized images, models (draco), hdris, logos
├─ scripts/                       # asset optimization, blur-gen, db seed
├─ supabase/                      # migrations, seed.sql, config
├─ tests/                         # unit + e2e
├─ PROJECT_PROGRESS.md
└─ config: next, tailwind, tsconfig(strict), eslint, prettier, playwright, vitest
```

---

## 4. Component & Page Hierarchy

**Page hierarchy:** `/[locale]` (home) · `/destinations` · `/destinations/[slug]` · `/packages` · `/packages/[slug]` · `/booking` · `/account` (+ wishlist, history, profile) · `/sign-in`, `/sign-up` · legal pages.

**Home composition (each a `features/` section, lazy below the fold):**
Header → **Hero3D** → FeaturedDestinations → DestinationExplorer → VacationPackages → TravelCategories → PopularExperiences → OurPartners → WhyChooseUs → Testimonials → Gallery → FAQ → Contact → Booking (entry) → Newsletter → Footer.

**Shared motion primitives** (`components/motion/`): `<Reveal>` (stagger/fade/slide), `<Parallax>`, `<MagneticButton>`, `<RippleButton>`, `<FloatingCard>`, `<SectionTransition>`. Every section built from these so motion stays consistent and centrally tunable (and globally disabled under reduced-motion).

---

## 5. Design System

**Tokens** defined once in `globals.css` via Tailwind v4 `@theme`, exposed as CSS variables, consumed by Tailwind utilities + shadcn.

**Color system** (semantic tokens, not raw hex, in code):

| Token | Role | Approx |
|---|---|---|
| `--ocean` | primary | deep ocean blue |
| `--navy` | headings/dark surfaces | deep navy |
| `--turquoise` | interactive accent | turquoise |
| `--sand` | warm neutral bg | sand beige |
| `--warm-white` | base bg | warm white |
| `--sunset` | single accent/CTA | sunset orange |
| `--forest` | success/nature | forest green |
| `--slate` | text/dark UI | dark slate |

All pairings verified to **WCAG AA contrast** before use. Gradients reserved for hero, section seams, and the sunrise→sunset transition only.

**Typography:** display serif or high-contrast grotesque for large headings (e.g. *Fraunces* / *Clash* style via `next/font`), clean humanist sans for body (e.g. *Inter*). Fluid `clamp()` type scale, generous `line-height`, tight display tracking. Strict hierarchy: one `<h1>` per page, logical `h2/h3` order.

**Elevation & glass:** soft layered shadows; glassmorphism (subtle `backdrop-blur` + translucent surface) only on floating nav, partner cards, and booking summary.

---

## 6. State Management Strategy

- **Server state** (destinations, packages, bookings): fetched in Server Components / Server Actions — no client store.
- **URL state** (explorer filters, locale, booking step): search params — shareable, SSR-friendly.
- **Client-global UI** (Zustand slices): `wishlistStore`, `bookingDraftStore`, `uiStore` (menu, transition state, GPU tier).
- **Form state:** React Hook Form + Zod resolver, local to each form.
No global fetch cache library needed; RSC + revalidation covers it.

---

## 7. Animation Strategy

- **Lenis** smooth scroll (disabled under reduced-motion), synced to **GSAP ScrollTrigger** for scroll-driven reveals, parallax, pinned section beats.
- **Framer Motion** for component-level micro-interactions (hover elevation, card float, layout, presence).
- **GSAP** for orchestrated timelines and the cinematic transitions.
- **Global reduced-motion gate:** a single `useReducedMotion` source disables Lenis, kills ScrollTriggers, and swaps animations for instant states.
- Budget: ≤ 3–5 immersive transitions, each < 2s, GPU-composited transforms/opacity only.

---

## 8. 3D Scene Architecture (`features/hero-3d`)

- **Mount discipline:** static poster is LCP; `<Canvas>` dynamically imported (`ssr:false`) and mounted after paint / on idle, cross-faded in. Fully skipped for reduced-motion and low-GPU/mobile (poster stays).
- **Scene graph:** island (compressed GLB, Draco) · animated ocean (shader/gerstner or drei) · drifting clouds (instanced/sprites) · airplane (slow path) · birds (instanced, cheap) · palm trees (instanced) · HDRI environment (Poly Haven, compressed) · post-processing (selective bloom + subtle fog) · floating particles (points).
- **Camera:** slow autonomous orbit, eased, damped.
- **Adaptive quality manager:** detects GPU tier (`detect-gpu`) + `devicePixelRatio`, sets DPR clamp, particle count, shadow map size, and toggles postprocessing. Drops tiers automatically if frame time degrades. Pauses via `IntersectionObserver` when hero off-screen.
- **Loading:** `<Suspense>` + drei loader; Draco/KTX2 decoders lazy-loaded.

---

## 9. Internationalization Architecture

- `[locale]` segment with `generateStaticParams` for `en`/`fr`; `en` default.
- **Middleware** negotiates locale (cookie → `Accept-Language` → default) and rewrites/redirects to the correct prefix; also refreshes Supabase session.
- Dictionaries in `messages/{locale}.json`, namespaced (nav, hero, booking, forms, errors, seo…). `getDictionary(locale)` server-side; a client provider exposes `t()` to Client Components.
- **Zod messages** localized via a message map keyed to the dictionary.
- **SEO:** per-locale `metadata`, `hreflang` alternates, localized OG.
- **RTL-ready:** logical CSS properties (`ps/pe`, `ms/me`), `dir` driven off a locale→direction map, so adding an RTL language later needs only a dictionary + config entry.
- Language switcher in nav preserves current path, swaps prefix, sets cookie — instant.

---

## 10. Supabase Schema (proposed)

```
profiles         (id → auth.users, full_name, avatar_url, locale, created_at)
destinations     (id, slug, name, country, region, summary, description,
                  hero_image, gallery[], lat, lng, tags[], featured, i18n jsonb)
packages         (id, slug, destination_id, title, type, nights, price_from,
                  currency, inclusions[], hero_image, i18n jsonb)
experiences      (id, destination_id, title, category, image, i18n jsonb)
bookings         (id, user_id, package_id, destination_id, start_date, end_date,
                  guests, budget_tier, status, total_price, created_at)
wishlists        (id, user_id, destination_id | package_id, created_at)
testimonials     (id, author, location, avatar, rating, quote, i18n jsonb)
partners         (id, name, category, logo_mono, logo_color, description, url)
newsletter_subs  (id, email, locale, confirmed, created_at)
contact_messages (id, name, email, subject, message, created_at)
```

- **RLS on:** users read/write only their own `profiles`, `bookings`, `wishlists`. Content tables public-read, admin-write. Localized fields via `i18n jsonb` (`{en:{…}, fr:{…}}`) so content scales with languages.
- Migrations + `seed.sql` mirror the local adapter's seed data (single source of truth).

---

## 11. Booking Workflow

Multi-step wizard (URL-stepped, draft persisted in `bookingDraftStore`):
**1** Destination → **2** Dates (range picker) → **3** Guests → **4** Budget tier → **5** Package type → **6** Review → **7** Confirm.

- Each step Zod-validated; Next disabled until valid; back/refresh-safe via URL + store.
- Confirm requires auth → redirect to sign-in preserving draft, return to review.
- Submit = Server Action: re-validate server-side, insert `booking` (Supabase or local), return confirmation; appears in `/account` history.
- Wishlist add/remove is an auth-gated Server Action; guests get a prompt to sign in.

---

## 12. Asset Sourcing Strategy

- **Images:** curated Unsplash/Pexels (license-clear) → downloaded, resized, compressed to AVIF/WebP via a `scripts/optimize-images` step; blur placeholders pre-generated. Served through `next/image`.
- **3D models:** Poly Pizza / Sketchfab CC / Kenney → GLTF, meshopt + **Draco** compressed, KTX2 textures.
- **HDRI:** Poly Haven, downsized to hero-appropriate resolution.
- **Textures:** AmbientCG, compressed.
- **Icons:** Lucide.
- **Partner logos:** representative/CC or generated monochrome marks (no false brand endorsement); mono→color on hover.
- **Attribution:** `CREDITS.md` + license notes; every asset's terms respected.

---

## 13. Performance Strategy

Poster-first hero (LCP) · dynamic imports for 3D/carousels/heavy sections · `next/image` AVIF/WebP + blur · Draco/KTX2 models · adaptive rendering tiers + mobile skip of 3D · route-level code splitting · Suspense streaming · font `display:swap` + preconnect · Lenis off under reduced-motion · defer non-critical JS · Vercel edge caching/ISR. Targets: **Lighthouse Perf > 90, A11y > 95, SEO > 95, Best Practices > 95**; monitored with Lighthouse CI in the pipeline.

---

## 14. Accessibility Strategy (WCAG AA)

Semantic landmarks · single logical heading order · keyboard-operable everything (wizard, carousels, menu, lang switcher) · visible focus rings · ARIA labels/roles where semantics fall short · `prefers-reduced-motion` fully honored (no parallax/scroll-jack/3D) · AA-verified contrast tokens · `dir`/logical properties · descriptive alt text (localized) · form errors announced via `aria-live`. Verified with axe + manual keyboard/screen-reader passes.

---

## 15. SEO Strategy

Per-page/per-locale `generateMetadata` · Open Graph + Twitter cards (dynamic OG route) · canonical + `hreflang` · JSON-LD (`TravelAgency`, `Trip`/`TouristDestination`, `FAQPage`, `BreadcrumbList`) · `sitemap.ts` (both locales) + `robots.ts` · SSR/ISR content · semantic headings · fast CWV. Localized metadata from dictionaries.

---

## 16. Testing Strategy

- **Unit** (Vitest + Testing Library): utils, Zod schemas, repository adapters, i18n `t()`, hooks.
- **Component:** motion primitives, forms, wizard steps (validation/keyboard).
- **E2E** (Playwright): booking flow, auth, language switch, wishlist, filters — Chromium + mobile viewport; axe checks in-run.
- **Perf:** Lighthouse CI budget gate.
- **Types:** `tsc --noEmit` strict in CI.
Each phase ends with its own verification step (build passes, targeted tests, screenshot/console check).

---

## 17. Deployment Strategy (Vercel)

Vercel project, preview deploy per branch, production on `main`. Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server), analytics keys. Supabase migrations applied via CLI. CI (GitHub Actions or Vercel): typecheck → lint → unit → build → Lighthouse budget → E2E on preview. Absent Supabase env, app runs on the local adapter so previews always work.

---

## 18. Phase Roadmap & Complexity

At the end of **every** phase I will: explain what was built, verify it works, note improvements, update `PROJECT_PROGRESS.md`, and **stop for your approval** before continuing.

| Phase | Scope | Complexity |
|---|---|---|
| 1 · Setup | Next 15/React 19/TS strict, Tailwind v4, shadcn, lint/prettier, deps pinned, Vercel + repo, `PROJECT_PROGRESS.md` | **S** |
| 2 · Design system | Tokens, color, fluid type, motion primitives, base shadcn theming, glass/shadow utilities | **M** |
| 3 · Nav & layout | `[locale]` shell, header/footer, mobile nav, lang switcher, Lenis, i18n scaffold, middleware, error/loading/not-found | **M** |
| 4 · 3D hero | Poster-first hero, R3F scene, adaptive quality, reduced-motion/mobile fallback, asset pipeline | **XL** |
| 5 · Transitions | 3–5 cinematic overlay transitions, reduced-motion-safe | **M** |
| 6 · Sections | All marketing sections incl. Our Partners, testimonials, gallery, FAQ, contact, newsletter | **XL** |
| 7 · Booking | Wizard, validation, Server Actions, wishlist, history, repository + Supabase schema/migrations/seed | **XL** |
| 8 · Auth | Supabase Auth (`@supabase/ssr`), sign-in/up/callback, session middleware, guarded routes, profile | **L** |
| 9 · Optimization | Lighthouse tuning, code-split audit, image/model compression, adaptive tuning, CWV | **L** |
| 10 · Testing | Unit + component + Playwright E2E + axe + Lighthouse CI | **L** |
| 11 · Docs | README, architecture decisions, CREDITS, final `PROJECT_PROGRESS.md` | **S** |

Legend: S ≈ small, M ≈ moderate, L ≈ large, XL ≈ largest/highest-risk (4, 6, 7).

---

## 19. What I Need From You To Go Live (not blocking the build)

Supabase project URL + keys (Phase 7/8; local fallback until then), and any brand name/logo preference (defaults to *Kazeline Agency*). Everything else proceeds on the plan above.

---

**End of plan. Per your instructions, I am stopping here and will not write any code until you approve.** Reply with approval to start **Phase 1**, or tell me what to adjust.
