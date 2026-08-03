-- 0002 — capture customer contact on bookings and allow guest (logged-out) bookings.
-- Admin reads/writes go through the service-role key, which bypasses RLS, so no
-- new policies are required here.

alter table public.bookings
  add column if not exists customer_name text,
  add column if not exists customer_email text;

-- Guests (not signed in) can book too; user_id is set only when we know them.
alter table public.bookings
  alter column user_id drop not null;
