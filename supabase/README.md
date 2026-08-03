# Supabase

Schema, security, and seed for Azure Horizons. These files define the backend;
they are **not** wired into the app yet — the Supabase client + adapter land in
**Phase 8** (auth). Until `NEXT_PUBLIC_SUPABASE_URL` is set, the app runs on the
local seed adapter (`src/lib/data/repository.ts`).

## Files

- `migrations/0001_init.sql` — tables, indexes, the `handle_new_user` trigger
  (auto-creates a `profiles` row on signup), and **Row Level Security** policies.
- `seed.sql` — content rows mirroring `src/lib/data/seed.ts`. Localized prose is
  stored in an `i18n` jsonb column shaped `{ "en": {...}, "fr": {...} }`.

## Apply

With the Supabase CLI, from the project root:

```bash
supabase db reset          # local: runs migrations + seed
# or against a project:
supabase db push           # apply migrations
psql "$DATABASE_URL" -f supabase/seed.sql
```

## RLS summary

- **Content** (`destinations`, `packages`, `experiences`, `categories`,
  `testimonials`, `partners`, `faqs`): public read; writes via the service role
  only (seed / admin).
- **`profiles`, `bookings`, `wishlists`**: each user reads/writes only their own
  rows (`auth.uid()`).
- **`newsletter_subs`, `contact_messages`**: public insert, no public read.

## Adapter (Phase 8)

`getContentRepository()` will return a Supabase-backed adapter when env is
present, implementing the same `ContentRepository` interface — plus booking and
wishlist repositories that read/write the user-owned tables. The `i18n` jsonb is
mapped back to the `Localized<T>` shape the app already uses, so no UI changes.
