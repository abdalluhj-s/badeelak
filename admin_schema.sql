-- SQL Migration for Pharmacies

CREATE TABLE pharmacies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  phone text,
  created_at timestamp default now()
);

-- Note: In Supabase, if RLS is enabled, you'll need to create policies.
-- By default, if RLS is not enabled on this new table, it will be readable/writable by authenticated/anon keys.
-- We will assume standard setup without strict RLS for now since this is MVP.
