create table if not exists public.founder_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  profile_payload_masked text not null,
  competency_scores jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  startup_pattern_id text not null,
  match_score integer not null check (match_score between 0 and 100),
  created_at timestamptz not null default now(),
  unique (user_id, startup_pattern_id)
);

create table if not exists public.match_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  startup_pattern_id text not null,
  match_score integer not null check (match_score between 0 and 100),
  roadmap jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.founder_profiles enable row level security;
alter table public.saved_matches enable row level security;
alter table public.match_history enable row level security;

create policy "Users manage their own profiles" on public.founder_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own saved matches" on public.saved_matches for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read their own match history" on public.match_history for select using (auth.uid() = user_id);
create policy "Users create their own match history" on public.match_history for insert with check (auth.uid() = user_id);
