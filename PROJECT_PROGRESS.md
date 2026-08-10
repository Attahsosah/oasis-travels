# Project Progress — Kazeline Agency

Living status doc. Updated at the end of every phase so any developer can
understand the project's current state at a glance.

**Status:** 🎉 **ALL 11 PHASES COMPLETE.** Build green (Next 15.5.21, 44 static routes), unit + E2E + axe tests green.
**Phase 11 — Docs:** COMPLETE — `README.md` (overview, stack, architecture, setup, scripts, testing, Supabase, deploy), `CREDITS.md`, and this living doc.

### Post-launch — UX & Feature Overhaul (living)

**Design & motion overhaul**
- Photographic depth-parallax hero (pointer + scroll layers) replacing the procedural WebGL scene; bespoke AI-generated window-seat hero image (Higgsfield connector, referenced from CDN — move to `public/` for production permanence).
- Fixed aurora WebGL background (scroll-driven dawn→dusk palette) + CSS fallback; global flight-path scroll-progress rail; spring-smoothed parallax across chapters + gallery.
- Full-bleed parallax "chapter" bands and a scroll-scrubbed cinematic descent (`FlightSequence`, single-image push) between sections. Plane theme throughout; reduced-motion honored.

**Content & UX**
- About section near the top; homepage trimmed (removed categories/experiences/gallery; Partners kept; Packages retitled "Popular travel packages"); currency switched to USD.
- Mobile nav rebuilt via `createPortal` (fixes stacking/tap bug) + always-visible EN|FR toggle beside the title.
- Wishlist cleared on sign-out (was leaking across users on shared browsers).

**Auth**
- Password reset flow: `/forgot-password` + `/reset-password` pages, `requestPasswordReset` / `updatePassword` actions, wired to `/auth/callback`. (Requires Supabase Site URL set to the live domain.)

**Agency features (functional)**
- Persistence wired: bookings (guests included), `contact_messages`, `newsletter_subs`. Booking wizard captures customer name + email. Migration `0002_bookings_customer.sql` (customer fields + nullable `user_id`).
- Email notifications via Resend (`src/lib/email.ts`, env-gated): new booking / message alerts + customer confirmation.
- **Admin dashboard** `/[locale]/admin` (gated by `ADMIN_EMAILS`, reads via service role): bookings list with status controls, messages inbox, subscribers, CSV export.

**Phase 1 — conversion & core UX**
- Homepage **quick-enquiry widget** (floats over hero; feeds `createBooking`; plane-takeoff success animation).
- **Rich itinerary package pages**: at-a-glance facts, generated day-by-day **flight-route timeline** (plane travels the route as it draws in), what's-included, good-to-know, sticky enquiry aside.
- Global **floating "Talk to a travel designer"** speed-dial CTA.

**Phase 2 — discovery (in progress)**
- **Packages filtering** (style + length) with spring reflow.
- **Meet the travel designers** page (`/designers`) with tilt/reveal cards + footer link.
- Reviews already render star ratings (testimonials). *Next:* review JSON-LD schema, and a **Journal/blog**.

**Phase 3 (planned):** saved trip proposals in the client account, secure deposit/payment links, multi-currency, additional services (transfers/concierge).

**New env vars:** `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS`, `RESEND_API_KEY`, `EMAIL_FROM`, `BOOKINGS_NOTIFY_EMAIL`.

### Remaining to go fully live (not code — your inputs)
- Supabase project URL + keys in `.env.local`; apply `supabase/` migrations + seed.
- (Optional) real GLB models tuned in `scene.tsx`; local image pipeline; brand name/logo.

### Phase 10 — Testing — COMPLETE, verified
- **Vitest** unit tests (`tests/unit/`, jsdom, `@/` alias set directly in `vitest.config.ts`): `cn`, `formatPrice`, i18n `config` + `resolveText`, Zod schemas (newsletter/contact/booking incl. refinements), wishlist + booking Zustand stores, content repository. Scripts: `test`, `test:watch`.
- **Playwright** E2E (`tests/e2e/`, `test:e2e`): root→/en redirect + hero heading, EN→FR language switch, booking wizard advancing a step, wishlist save toggle, and **axe** accessibility scans (no critical violations) on home/destinations/booking. Runs serially with generous timeouts (dev compiles routes on first hit). Auto-starts the dev server.
- Test tooling **excluded from the app tsconfig** so it can't break `next build`'s type-check.
- **Deps:** `vitest` 4.1.7, `jsdom` 29.1.1, `@playwright/test` 1.60.0, `@axe-core/playwright` ^4.10.1 (dev). (Requires `npx playwright install` once for browsers.)
- Both suites **green**.

### Phase 9 — Optimization — COMPLETE, verified
- **SEO infrastructure:** `sitemap.ts` (all locales × every static route + destination/package, with hreflang `alternates`), `robots.ts` (disallows `/account`), PWA `manifest.ts`. New routes: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`.
- **Structured data** (`src/lib/seo/json-ld.tsx`): `JsonLd` component + builders. TravelAgency + FAQPage on the home page; TouristDestination + BreadcrumbList on destination detail.
- **Image optimization:** `ImageWithFallback` now only sets `unoptimized` in **dev** (`NODE_ENV === "development"`), so production (Vercel) serves real optimized AVIF/WebP; dev still bypasses the timing-out local optimizer.
- **Security:** bumped `next` / `eslint-config-next` `15.5.18 → 15.5.21`. This **cleared all the direct Next.js CVEs** (Server-Action DoS, SSRF, cache confusion, image-opt SVG DoS, endpoint disclosure, etc.).
- **Build verified:** Next 15.5.21, typecheck clean, 44 static pages incl. the new metadata routes.

### Known issues / notes
- **Remaining audit highs are transitive inside Next** — `postcss` (build-time only; not runtime-exposed) and `sharp` (image optimizer; on Vercel, image opt runs on Vercel's platform, not the bundled sharp). Not fixable by us without a future Next patch or a risky `overrides` block; **accepted + documented**. The 2 lows are a dev-only ReDoS in eslint's `@eslint/plugin-kit`.
- **swc/native-binary EPERM during the reinstall:** old `.node` binaries (`@next/swc`, `@tailwindcss/oxide`, `lightningcss`) were locked (dev server/editor open). Build still succeeded, but do one more `npm install` with the dev server **closed** to fully sync `@next/swc`.

### Carry-forward (deferred, non-blocking)
- Real asset pipeline: download + optimize the Unsplash photos into `public/`, drop remote loading (Phase 12 / future).
- Lighthouse CI budget gate (Phase 10 area).
- Optional `overrides` to force-patch `postcss`/`sharp` if a fully clean audit is required (needs testing).

### Phase 8 — Supabase Auth — COMPLETE, verified
- **Clients** (`src/lib/supabase/`): `config.ts` (`isSupabaseConfigured` guard), `server.ts` (`@supabase/ssr` server client, cookie-bound), `auth.ts` (`getSessionUser`).
- **Middleware** refreshes the session (when configured) alongside locale negotiation.
- **Auth routes:** `/[locale]/sign-in`, `/sign-up` (shared `AuthForm` + `signIn`/`signUp` Server Actions), `/auth/callback` route handler (`exchangeCodeForSession`), `signOut` action. Graceful "not configured" state everywhere.
- **Account** `/[locale]/account` (guarded → redirects to sign-in): profile email, sign-out, booking history (queried from `bookings`), wishlist link.
- **Header/mobile-nav** show Account vs Sign-in from `getSessionUser()` (passed via layout). Because the guard returns null *without reading cookies* when unconfigured, pages stay static in the current build; they become dynamic only once credentials are added.
- **Bookings persist** to Supabase for signed-in users (`createBooking`); local reference-only otherwise.
- **Deps:** `@supabase/ssr` 0.10.3, `@supabase/supabase-js` 2.106.1. Middleware now 90.5 kB (Edge, fine).
- Dictionary `auth` namespace + `nav.signIn`/`nav.account` (EN/FR).
- **To go live:** set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` and run `supabase/` migrations + seed.

### ⚠️ Dev note
Switching between `npm run build` and `npm run dev` in the same folder corrupts `.next` (symptoms: `Cannot read properties of undefined (reading '/_app')`, spurious import errors, unstyled pages). **Always `Remove-Item -Recurse -Force .next` between the two.**

### Phase 7 — Chunk C (Supabase schema) — COMPLETE (SQL only, no app build impact)
- `supabase/migrations/0001_init.sql`: all tables (profiles, destinations, packages, experiences, categories, testimonials, partners, faqs, bookings, wishlists, newsletter_subs, contact_messages), indexes, `handle_new_user` trigger (auto-profile on signup), and **RLS** (content public-read; profiles/bookings/wishlists user-owned via `auth.uid()`; marketing tables public-insert only). Localized prose in an `i18n` jsonb (`{en,fr}`).
- `supabase/seed.sql`: content mirroring `src/lib/data/seed.ts` (dollar-quoted jsonb so French apostrophes need no escaping).
- `supabase/README.md`: apply steps + RLS summary + how the Phase 8 adapter slots in.
- Not wired to the app yet — the Supabase client + adapter are Phase 8; local seed adapter remains active until `NEXT_PUBLIC_SUPABASE_URL` is set.

### Phase 7 — Chunk B (booking wizard) — COMPLETE, verified
- **`/[locale]/booking` wizard** (`features/booking/booking-wizard.tsx`): 6 URL-stepped stages (destination → dates → guests → budget → package → review) via `?step=`, back/refresh-safe. Stepper header; **Continue** gated by per-step validity; **Confirm** calls the `createBooking` Server Action (Zod re-validation) → confirmation screen with a generated reference.
- **Draft store** `useBookingDraft` (Zustand, `sessionStorage` persist, `partialize`). Detail-page CTAs deep-link with `?destination=` / `?package=` to prefill.
- `bookingSchema` + `createBooking` added (persistence stubbed until Phase 8). Booking page wraps the wizard in `Suspense` (required for `useSearchParams`). Dictionary `booking` namespace (EN/FR).
- **Build verified:** 35 static pages; `/booking` 22.8 kB / 185 kB.

### Phase 7 — Chunk A (detail/list routes + wishlist) — COMPLETE, verified
- **Wishlist:** `useWishlist` Zustand store (localStorage `persist`), `WishlistButton` (save/unsave), header `WishlistIndicator` (live count badge, desktop + mobile), `/[locale]/wishlist` page (`WishlistView`). `useHasMounted` guards SSR/client hydration for the persisted state.
- **Detail routes** (SSG via `generateStaticParams` + `generateMetadata`): `/[locale]/destinations/[slug]` (photo hero, overview, tags, price, wishlist + booking CTAs, related packages) and `/[locale]/packages/[slug]` (inclusions, tier, price, linked destination, CTAs).
- **List routes:** `/[locale]/destinations` and `/[locale]/packages` grids.
- Repository gained `getPackageBySlug`. Dictionary gained `detail` + `wishlist` namespaces (EN/FR).
- **Dep:** `zustand` 5.0.13 (matches R3F's transitive version).
- **Build verified:** 33 static pages (all locale × slug detail routes prerendered); detail pages ~200 B. Booking CTAs (`/booking?...`) still 404 until Chunk B.

### Post-Phase-6 enhancements (user-requested, verified)
- **Hero cursor/tilt parallax:** camera eases toward the pointer (and `deviceorientation` tilt on mobile) via a shared input ref + damped `CameraRig`, with a gentle idle sway. Replaced the auto-orbit. Plane now banks toward the pointer.
- **GLB plane slot:** `PLANE_MODEL_URL` in `scene.tsx` (currently `null` → procedural plane). Drop a `.glb` into `public/models/`, set the constant, and tune `scale`/`rotation` on the `<primitive>`. A `PlaneErrorBoundary` + `Suspense` fall back to the procedural plane if the model is missing/fails. Draco decoder requested by default. Sources noted: Poly Pizza / Quaternius / Kenney (CC0), Sketchfab (check licence).
- **Image fix:** `ImageWithFallback` now uses `unoptimized` — Next's dev image optimizer was timing out fetching remote Unsplash photos (all tiles fell back to gradients). Direct-from-CDN loads fixed it. **For production, pre-download + optimize images locally in the Phase 9 asset pipeline and remove the flag.**

**Project location:** `programming-projects/oasis-travels/` (all app files live in this
subfolder; run all commands from here). `IMPLEMENTATION_PLAN.md` remains at the
`programming-projects/` root as the overall brief.

---

## Phase 1 — Project Setup

### Completed
- Next.js 15 (App Router) + React 19 + TypeScript **strict** scaffold, authored by hand with **pinned exact versions** for reproducibility.
- Tailwind CSS v4 configured CSS-first (`@tailwindcss/postcss`, `@import "tailwindcss"`), with brand design tokens declared in `@theme` (`src/app/globals.css`).
- shadcn/ui base config (`components.json`, new-york style, RSC, Lucide icons); `cn()` utility at `src/lib/utils/cn.ts`.
- ESLint 9 flat config (`next/core-web-vitals` + `next/typescript` + `prettier`) and Prettier with the Tailwind class-sorting plugin.
- Root layout wires `next/font` (Inter body + Fraunces display) to token CSS variables; global reduced-motion guard and focus-visible styles in `globals.css`.
- Feature-based folder skeleton created (`features/`, `components/{ui,layout,motion}`, `lib/{supabase,data,i18n,validation,seo,utils}`, `hooks/`, `stores/`, `messages/`, `scripts/`, `tests/`, `supabase/`).
- `.env.example`, `.gitignore`, `README.md`.

### Architectural decisions
- **Poster-first 3D hero** (decided in plan): static image is the LCP element; WebGL mounts lazily behind it. Protects Lighthouse ≥ 90.
- **Repository/adapter data layer**: app codes against typed interfaces; Supabase adapter + local seed adapter. Env presence selects the implementation. Reconciles "live Supabase with mock fallback" without throwaway mocks.
- **i18n**: `/en` `/fr` sub-path routing via `[locale]` segment (Phase 3).
- **Tokens as CSS variables** via Tailwind v4 `@theme` — single source of truth consumed by utilities + shadcn.
- Pinned versions to keep the fast-moving Tailwind v4 / React 19 / Next 15 combination reproducible.

### Dependencies added (pinned)
next 15.1.6 · react/react-dom 19.0.0 · typescript 5.7.3 · tailwindcss 4.0.0 · @tailwindcss/postcss 4.0.0 · tw-animate-css 1.2.0 · lucide-react 0.469.0 · clsx 2.1.1 · tailwind-merge 2.6.0 · class-variance-authority 0.7.1 · eslint 9.18.0 · eslint-config-next 15.1.6 · eslint-config-prettier 9.1.0 · prettier 3.4.2 · prettier-plugin-tailwindcss 0.6.9 · @eslint/eslintrc 3.2.0 · @types/{node,react,react-dom}

### Known issues / notes
- Project relocated into `kazeline-agency/` subfolder (move verified on disk). All files intact at the new path.
- **Build verification PASSED** (run manually by the user): `npm install` → `npm run typecheck` (tsc --noEmit, clean) → `npm run build` (compiled successfully, 4 static routes, `/` ≈ 105 kB First Load JS).
- **Tailwind version fix:** `tailwindcss` and `@tailwindcss/postcss` bumped `4.0.0 → 4.3.0`. The original `4.0.0` pin crashed the build with `Missing field 'negated' on ScannerOptions.sources` — a skew between the pinned `@tailwindcss/postcss@4.0.0` JS and a newer transitively-resolved `@tailwindcss/oxide`. `@tailwindcss/postcss@4.3.0` pins `@tailwindcss/oxide` to an exact matching version, eliminating the skew. Requires a clean reinstall (delete `node_modules` + `package-lock.json`).
- **Security:** `npm audit` reports 5 vulnerabilities (1 critical, 1 high, 1 moderate, 2 low); `next@15.1.6` flagged (CVE-2025-6647). **Scheduled: bump Next to a patched `15.x` at the start of Phase 3** (per decision) and re-audit.
- Design connectors (Figma/Linear/Notion/etc.) require authorization in claude.ai connector settings; not required for the build.

### Suggested improvements (carry forward)
- Add Lighthouse CI budget gate in Phase 9/10.
- Pre-generate image blur placeholders via a `scripts/` step once real imagery is sourced (Phase 6).

---

## Phase 2 — Design System

### Completed
- **Semantic token system (shadcn/ui):** full light + dark token sets in `:root` / `.dark` (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`) mapped to Tailwind color utilities via `@theme inline`. AA-verified foreground/background pairings. Brand palette (`ocean`, `navy`, `turquoise`, `sand`, `sunset`, `forest`, `slate`, …) retained as direct utilities in `@theme`.
- **Fluid type scale:** `--text-fluid-{sm,base,lg,xl,2xl,3xl,display}` via `clamp()`, with tighter line-height + letter-spacing baked into the display steps. Exposed as `text-fluid-*` utilities.
- **Elevation:** navy-tinted layered shadows `shadow-{soft,elevated,float,glass}`.
- **Glassmorphism:** `glass` / `glass-strong` custom utilities (`@utility`, `backdrop-blur` + translucent surface + inset highlight) for floating nav, cards, booking summary. Plus a `text-balance` helper.
- **Motion easing tokens:** `ease-{out-expo,out-back,in-out-soft}`.
- **Radius scale** derived from a single `--radius` (`radius-sm/md/lg/xl`).
- **Motion primitives** (`src/components/motion/`, barrel `index.ts`): `Reveal` (scroll-triggered fade/slide), `Parallax` (scroll-linked translate), `MagneticButton` (cursor-follow spring), `RippleButton` (pointer ripple), `FloatingCard` (idle float + hover lift). Every primitive routes through the shared `useReducedMotion` hook (`src/hooks/use-reduced-motion.ts`) and degrades to an instant/static state under `prefers-reduced-motion`.
- **Landing preview** (`src/app/page.tsx`) rebuilt to exercise the tokens + all five primitives end to end (validates the system compiles and renders).

### Dependencies added (pinned)
- `framer-motion` 12.40.0 (React 19 compatible via peer `^18 || ^19`). Sole new runtime dep; Lenis/GSAP remain deferred to Phase 3+ per plan.

### Architectural decisions
- **Two-tier color model:** brand palette as literal utilities for expressive/marketing use; shadcn semantic tokens for component theming and dark mode. `@theme inline` bridges semantic vars → utilities so both coexist without name collisions (`muted` text moved to `text-muted-foreground`).
- **Motion primitives are the single animation vocabulary** — sections in later phases compose from these so motion stays consistent and globally disable-able.
- **Reduced motion is a first-class branch** in every primitive, not an afterthought.

### Known issues / notes
- Motion primitives are `"use client"`; they render fine inside Server Components (as in `page.tsx`).
- Dark mode tokens are defined but no theme toggle is wired yet (planned with the layout shell / nav in Phase 3).

### Suggested improvements (carry forward)
- Add a `next-themes`-style class toggle to activate `.dark`.
- Consider a small Storybook/preview route for primitives during Phase 6 section work.

---

## Phase 3 — Nav & Layout Shell

### Completed
- **Security bump:** `next` and `eslint-config-next` `15.1.6 → 15.5.18` (latest 15.x, clears CVE-2025-6647 and the audit criticals). Stayed on 15.x rather than jumping to the freshly-released Next 16 to avoid a mid-project major migration.
- **Sub-path i18n routing** (`/en`, `/fr`): app restructured under `src/app/[locale]/` with `generateStaticParams` (both locales prerendered). Per Next's documented pattern, `[locale]/layout.tsx` is the **root layout** (renders `<html lang dir>` / `<body>`); the old `src/app/layout.tsx` + `src/app/page.tsx` were removed to avoid nested `<html>`.
- **i18n system** (`src/lib/i18n/`): `config.ts` (locales, default, direction map, `isLocale`, cookie key — single source; adding a language = 1 code + 1 name + 1 dictionary), `dictionaries.ts` (`server-only`, per-locale code-split JSON loader), `provider.tsx` (client `I18nProvider` + `useI18n().t()` dot-path lookup with fallback). Dictionaries in `messages/{en,fr}.json` (namespaced: meta, nav, hero, footer, notFound, error, common).
- **Middleware** (`src/middleware.ts`): dependency-free locale negotiation (cookie → `Accept-Language` → default), redirect to the prefixed path, persist cookie. Matcher skips API/_next/static/files.
- **Layout chrome** (`src/components/layout/`): floating glass `Header` (brand, nav, language switcher, booking CTA), full-screen `MobileNav` (scroll-lock, Escape-to-close, staggered links), `LanguageSwitcher` (path-preserving locale swap + cookie), `Footer` (localized columns). Shared nav keys in `nav.ts`.
- **Lenis smooth scroll** (`SmoothScroll`): app-wide, RAF-driven, fully disabled under reduced motion (no instance created); required Lenis base CSS added to `globals.css`.
- **Route boundaries** for the locale segment: `loading.tsx` (brand spinner), `not-found.tsx` (localized 404), `error.tsx` (segment boundary), plus `src/app/global-error.tsx` (root-level, own `<html>/<body>`). Error/404 boundaries are **self-contained** (own bundled strings, locale from path) so they don't depend on provider state that may itself have failed.
- **SEO:** per-locale `generateMetadata` with title template, description, canonical, and `hreflang` alternates (incl. `x-default`) + OpenGraph. `metadataBase` from `NEXT_PUBLIC_SITE_URL`.
- **Landing preview** (`[locale]/page.tsx`) now fully localized from the dictionary.

### Dependencies added (pinned)
- `lenis` 1.3.23 (smooth scroll; React peer optional, framework-agnostic core).
- `next` / `eslint-config-next` moved to `15.5.18`.

### Architectural decisions
- **`[locale]/layout.tsx` as root layout** (no `app/layout.tsx`) — the documented App-Router i18n pattern; gives server-rendered `lang`/`dir` and static generation, which a passthrough root layout can't.
- **Boundaries are provider-independent** — they read the locale from the URL and bundle their own strings, so a failure in the i18n tree still renders a localized error.
- **RTL-ready** via `dir` from the locale→direction map; adding an RTL language needs only config + dictionary.

### Known issues / notes
- **Build verified** on Next 15.5.18: typecheck clean; `/[locale]` prerendered (SSG) for `/en` + `/fr`; middleware 34.2 kB.
- Fixed a `noUncheckedIndexedAccess` gotcha in `generateMetadata` (cast dictionary namespaces to concrete object types, not `Record<string,string>`, so named access stays `string`).
- Set `outputFileTracingRoot` in `next.config.ts` — Next was inferring a stray parent-dir `package-lock.json` (`C:\Users\Admin\`) as the workspace root; now pinned to the project.
- **Requires a clean reinstall** for the Next bump (delete `node_modules` + `package-lock.json`).
- Nav links point to real future routes (`/{locale}/destinations`, `/booking`, etc.) that don't exist until Phases 4/6/7 — they resolve to the localized 404 for now (expected).
- Dark-mode tokens exist but no toggle is wired yet (deferred; low priority).
- MobileNav closes on Escape/backdrop but does not yet full focus-trap — hardening deferred to the Phase 9/10 a11y pass.

### Suggested improvements (carry forward)
- Add focus-trap + `inert` background to MobileNav in the a11y pass.
- Wire a theme toggle for the dark tokens.
- Add `sitemap.ts` / `robots.ts` (Phase 6/9 per plan).

---

## Phase 4 — 3D Hero (poster-first, procedural)

### Completed
- **Poster-first architecture** (`src/features/hero-3d/`): `HeroPoster` is a pure CSS+SVG dawn scene (island silhouette, sun glow, sea sheen, vignette) — the **LCP element**, zero JS/binary. `Hero` (Server Component) renders the poster + localized headline/CTA overlay server-side for SEO; `HeroCanvas` is a lazy client island that cross-fades the WebGL scene in over the poster.
- **Mount gating** (`HeroCanvas`): the scene is skipped entirely (poster stays) under reduced motion, on small screens (`max-width: 767px`), and on low-core devices (`hardwareConcurrency < 4`). When allowed, mounting is deferred to `requestIdleCallback` so it never competes with first paint. `IntersectionObserver` pauses the render loop (`frameloop="never"`) when the hero scrolls out of view.
- **Procedural scene** (`scene.tsx`, dynamically imported `ssr:false`): Gerstner-ish **ocean shader** (vertex wave displacement + depth/horizon color mix), low-poly **island** with palms, drei **`<Sky>`** gradient atmosphere + scene fog, drifting **cloud** sprites (generated canvas texture), **bird** chevrons, an **airplane** on a slow high orbit, floating **particles**, a slow **auto-orbit camera** (drei `OrbitControls autoRotate`, interaction disabled), and hemisphere/ambient/directional lighting matched to the sun.
- **Adaptive quality:** `useDetectGPU` (via drei) tiers cloud/bird/particle counts and toggles **bloom** postprocessing; DPR clamped to `[1, 1.75]`.

### Dependencies added (pinned)
- `three` 0.184.0 · `@react-three/fiber` 9.6.1 (React 19) · `@react-three/drei` 10.7.7 · `@react-three/postprocessing` 3.0.4 · `@types/three` 0.184.1 (dev). GPU tiering comes free via drei's `useDetectGPU` (no separate `detect-gpu` dep).

### Architectural decisions
- **Fully procedural, no binary assets** (per decision) — protects Lighthouse (tiny payload), fully brand-tunable, no licensing. The poster-first shell is deliberately **swap-ready**: a photographic poster and/or a real GLB island + HDRI can drop into the same structure later with no rewrite.
- **Server-rendered hero content** — headline/CTA are passed as children from the page so the `<h1>` stays in the SSR/SSG HTML for SEO, while the canvas stays a client-only island.
- **3D never runs on the server or blocks LCP** — `ssr:false` + idle-deferred mount + poster-first.

### Known issues / notes
- **Build verified** on Next 15.5.18: typecheck clean; `/en` + `/fr` SSG. three.js is code-split out of First Load JS (page 160 kB shared + framer-motion; WebGL loads lazily post-idle).
- **Security:** audit now **0 critical / 2 high** (down from 1 critical + 1 high after the Next bump). The 2 highs trace to the R3F dependency chain; to be triaged in the Phase 9 optimization/security pass.
- New deps require `npm install` (no clean wipe needed).
- Visual output is **untested in-session** (no GPU/browser here) — the scene is written to known-good R3F/drei patterns; any tuning (wave scale, colors, camera framing, bloom) is a visual pass to do in the browser (`npm run dev`). Note: GLSL/scene errors surface at **runtime**, not in `next build`, so a green build doesn't fully validate the visuals.
- Reduced-motion / mobile / low-core users see the static poster only (by design).

### Suggested improvements (carry forward)
- Browser tuning pass on the scene (wave amplitude, palette, camera path, bloom threshold).
- **User feedback (Phase 4 review): hero reads as low-poly — plan to make it more realistic later.** Path: swap the procedural island for a real GLB (Draco/KTX2) + HDRI environment, and/or move to the hybrid photographic poster. Architecture already supports this drop-in.
- Consider `AdaptiveDpr` / `PerformanceMonitor` for dynamic DPR under sustained load.

---

## Phase 5 — Cinematic Overlay Transitions

### Completed
- **Transition system** (`src/features/transitions/`), built on framer-motion + CSS — no WebGL, no GSAP (kept lean; GSAP still reserved for Phase 6 scroll work):
  - `TransitionProvider` (mounted in the locale layout so its state survives navigations): `navigate(href)` plays the cover animation, pushes the route once covered, then plays the reveal. Reduced motion bypasses the overlay entirely and navigates instantly.
  - `TransitionOverlay`: a full-screen panel that slides up to cover, signals the route swap, then slides off the top to reveal. Idle repositioning is instant/off-screen so it's never visible between navigations. Decorative (`aria-hidden`), inert when idle.
  - **4 variants** rotated per navigation: `sunrise` (night→gold gradient), `clouds` (soft white puffs), `ocean` (deep blue→turquoise), `airplane` (sky gradient + a plane crossing the screen).
  - `TransitionLink`: drop-in `next/link` replacement — intercepts left-click to play the transition; modifier/middle clicks and caller `onClick` still work; keeps prefetch.
- **Wired** header (logo, nav, booking CTA), footer columns, and mobile-nav links to `TransitionLink`. Language switcher stays instant; route boundaries keep plain `next/link`.

### Architectural decisions
- **Provider in the layout, not per-page** — transition state must persist across the navigation it's animating, so it lives above `{children}`.
- **framer-motion over GSAP for transitions** — already a dependency, declarative, and its reduced-motion story is clean. No new package.
- **Overlay is decorative + inert** — never traps focus or blocks assistive tech when idle.

### Known issues / notes
- **Build verified** on Next 15.5.18: typecheck clean, `/en` + `/fr` SSG. (Needed a `.next` cache clear first — the stale cache from the 15.1.6→15.5.18 bump threw a spurious `Cannot find module for page: /_not-found`; `Remove-Item -Recurse -Force .next` fixed it. Worth clearing `.next` if that error recurs.)
- No new dependencies — verification is `typecheck` + `build` only (no `npm install` needed).
- **Untested in-session** (no browser): the cover→push→reveal timing is written to commit the SSG route during the ~0.65s reveal; if a brief old-page flash appears on slow navigations, nudge the reveal delay. A visual pass belongs with the Phase 4 browser tuning.
- Transitions currently fire on internal nav links; the hero CTAs are buttons (no navigation yet) and will hook in when their routes exist (Phase 6/7).

### Suggested improvements (carry forward)
- Tune reveal timing / add a short hold at full cover if navigations flash.
- Optionally add a Canvas 2D cloud-wipe variant for extra texture later.

---

## Phase 6 — Marketing Sections (Chunks A + B)

### Completed — content layer
- **Typed content model** (`src/lib/data/types.ts`): `Destination`, `Package`, `Experience`, `TravelCategory`, `Testimonial`, `Partner`, `Faq`. Prose fields are `Localized<string>` (`{ en, fr }`) mirroring the planned Supabase `i18n jsonb`; `pick(localized, locale)` selects.
- **Repository pattern** (`repository.ts`): `ContentRepository` interface + `localContentRepository` (seed-backed, async to mirror the network adapter). `getContentRepository()` selects the adapter — Supabase slots in at Phase 7+ with no call-site changes.
- **Seed** (`seed.ts`): 6 destinations, 5 packages, 6 experiences, 6 categories, 4 testimonials, 8 partners, 6 FAQs — bilingual EN/FR. Images are Unsplash CDN URLs.

### Completed — Chunk A sections
- Shared primitives: `Section` / `SectionHeading` (`components/layout/section.tsx`), `ImageWithFallback` (real Unsplash `src` + brand-gradient fallback on error, so nothing looks broken), `formatPrice` (locale currency), server-side `resolveText` dot-path helper.
- Sections: **FeaturedDestinations**, **DestinationExplorer** (client-side tag filter — keeps home static), **VacationPackages**, **Testimonials**, **Faqs** (accordion), **Contact** + **Newsletter** (Zod-validated **Server Actions** via `useActionState`, persistence stubbed for Phase 8).

### Completed — Chunk B sections
- **TravelCategories**, **PopularExperiences**, **OurPartners** (mono→colour type marks), **WhyChooseUs** (icon value props), **Gallery** (mosaic from destination/experience imagery).
- Home composed in plan order: Hero → Featured → Explorer → Packages → Categories → Experiences → Partners → WhyUs → Testimonials → Gallery → FAQ → Contact → Newsletter.
- Dictionary expanded with a `sections` + `tiers` namespace (EN/FR).

### Dependencies added (pinned)
- `zod` 4.4.3 (form + content validation; uses v4 top-level `z.email()`).

### Architectural decisions
- **Server sections fetch their own data; client sections receive props** — data stays server-side; interactive bits (Explorer filter, FAQ accordion, forms) are client islands. Cards take pre-localized strings so they work in both.
- **Real photos with graceful fallback** (per decision) — Unsplash URLs via `next/image`; any that 404 degrade to a brand gradient. Each is a single `image` field in `seed.ts` for easy swapping.
- **Home stays static** — the explorer filters client-side rather than via searchParams (which would force dynamic rendering of the whole page); URL-param filtering is deferred to the dedicated `/destinations` route.

### Known issues / notes
- **Build verified** (Chunks A+B together, first try): typecheck clean; `/en` + `/fr` SSG; home page 15.8 kB / 172 kB First Load JS.
- **Security:** audit now 5 vulns (2 low, **3 high**), up from 2 high — a new high entered via a Phase-6 transitive dep. Still 0 critical. Triage the highs in the Phase 9 optimization/security pass (`npm audit` for detail).
- Unsplash photo URLs are unverified in-session; broken ones show the gradient fallback. Spot-check + swap in `seed.ts` during the browser pass.
- Section CTAs/links point to routes that don't exist until Phase 7 (`/booking`, `/destinations/[slug]`, `/packages/[slug]`) — they resolve to the localized 404 for now.
- Form submissions validate but don't persist yet (Supabase in Phase 8).

### Suggested improvements (carry forward)
- Add a client lightbox to the Gallery.
- GSAP ScrollTrigger for scrubbed/pinned section beats if desired (currently framer-motion `whileInView` reveals).
- Dedicated `/destinations` + `/packages` list/detail routes with URL-param filters (Phase 7 area).
