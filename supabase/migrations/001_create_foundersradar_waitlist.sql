create extension if not exists pgcrypto;

create table if not exists public.foundersradar_waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  profile_payload_masked text,
  competency_scores jsonb
);

alter table public.foundersradar_waitlist enable row level security;

revoke all on table public.foundersradar_waitlist from anon, authenticated;
grant insert, update on table public.foundersradar_waitlist to service_role;
