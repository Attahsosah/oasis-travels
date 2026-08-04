-- 0003 — editable site settings (single row). Lets an admin change contact
-- details (WhatsApp, phone, email, address, hours) from /admin without a deploy.

create table if not exists public.site_settings (
  id int primary key default 1,
  whatsapp text,
  email text,
  phone text,
  address text,
  hours text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- Anyone may read (the site renders contact info); writes go through the
-- service role, which bypasses RLS.
create policy "site_settings_public_read" on public.site_settings
  for select using (true);
