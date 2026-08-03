-- Azure Horizons — initial schema
-- Content tables use a single `i18n jsonb` column shaped { en: {...}, fr: {...} }
-- for localized prose, mirroring src/lib/data/types.ts. Proper nouns stay as
-- plain columns. User-owned tables reference auth.users.

-- ----------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  locale text not null default 'en',
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Content (public read)
-- ----------------------------------------------------------------------------
create table if not exists public.destinations (
  id text primary key,
  slug text unique not null,
  name text not null,
  country text not null,
  region text not null,
  hero_image text not null,
  tags text[] not null default '{}',
  price_from numeric not null,
  currency text not null default 'EUR',
  featured boolean not null default false,
  i18n jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.packages (
  id text primary key,
  slug text unique not null,
  destination_slug text not null references public.destinations (slug) on delete cascade,
  tier text not null check (tier in ('comfort', 'premium', 'ultra')),
  nights int not null check (nights > 0),
  price_from numeric not null,
  currency text not null default 'EUR',
  hero_image text not null,
  i18n jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id text primary key,
  category text not null,
  image text not null,
  i18n jsonb not null default '{}'::jsonb
);

create table if not exists public.categories (
  id text primary key,
  slug text unique not null,
  image text not null,
  i18n jsonb not null default '{}'::jsonb
);

create table if not exists public.testimonials (
  id text primary key,
  author text not null,
  location text not null,
  rating int not null check (rating between 1 and 5),
  i18n jsonb not null default '{}'::jsonb
);

create table if not exists public.partners (
  id text primary key,
  name text not null,
  category text not null
);

create table if not exists public.faqs (
  id text primary key,
  i18n jsonb not null default '{}'::jsonb
);

-- ----------------------------------------------------------------------------
-- User data
-- ----------------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  reference text not null,
  destination_slug text not null,
  package_slug text,
  start_date date not null,
  end_date date not null,
  guests int not null check (guests between 1 and 12),
  budget_tier text not null check (budget_tier in ('comfort', 'premium', 'ultra')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  check (end_date > start_date)
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('destination', 'package')),
  slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, kind, slug)
);

-- ----------------------------------------------------------------------------
-- Marketing capture (insert-only for the public)
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_subs (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  locale text not null default 'en',
  confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------
create index if not exists idx_destinations_featured on public.destinations (featured);
create index if not exists idx_packages_destination on public.packages (destination_slug);
create index if not exists idx_bookings_user on public.bookings (user_id);
create index if not exists idx_wishlists_user on public.wishlists (user_id);

-- ----------------------------------------------------------------------------
-- Auto-create a profile row on signup
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.packages enable row level security;
alter table public.experiences enable row level security;
alter table public.categories enable row level security;
alter table public.testimonials enable row level security;
alter table public.partners enable row level security;
alter table public.faqs enable row level security;
alter table public.bookings enable row level security;
alter table public.wishlists enable row level security;
alter table public.newsletter_subs enable row level security;
alter table public.contact_messages enable row level security;

-- Content: readable by anyone (incl. anon); writes reserved for service role.
create policy "content_public_read_destinations" on public.destinations for select using (true);
create policy "content_public_read_packages" on public.packages for select using (true);
create policy "content_public_read_experiences" on public.experiences for select using (true);
create policy "content_public_read_categories" on public.categories for select using (true);
create policy "content_public_read_testimonials" on public.testimonials for select using (true);
create policy "content_public_read_partners" on public.partners for select using (true);
create policy "content_public_read_faqs" on public.faqs for select using (true);

-- Profiles: a user reads/updates only their own row.
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Bookings: a user manages only their own.
create policy "bookings_select_own" on public.bookings for select using (auth.uid() = user_id);
create policy "bookings_insert_own" on public.bookings for insert with check (auth.uid() = user_id);
create policy "bookings_update_own" on public.bookings for update using (auth.uid() = user_id);
create policy "bookings_delete_own" on public.bookings for delete using (auth.uid() = user_id);

-- Wishlists: a user manages only their own.
create policy "wishlists_select_own" on public.wishlists for select using (auth.uid() = user_id);
create policy "wishlists_insert_own" on public.wishlists for insert with check (auth.uid() = user_id);
create policy "wishlists_delete_own" on public.wishlists for delete using (auth.uid() = user_id);

-- Marketing capture: anyone may insert; nobody may read via the anon/auth key.
create policy "newsletter_public_insert" on public.newsletter_subs for insert with check (true);
create policy "contact_public_insert" on public.contact_messages for insert with check (true);
