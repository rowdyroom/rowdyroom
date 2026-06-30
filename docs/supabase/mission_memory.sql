create table if not exists public.mission_memory (
  id uuid primary key,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('note', 'decision', 'task', 'error', 'credential-status')),
  title text not null,
  content text not null,
  source text not null default 'mission-control'
);

create index if not exists mission_memory_created_at_idx on public.mission_memory (created_at desc);
create index if not exists mission_memory_kind_idx on public.mission_memory (kind);

alter table public.mission_memory enable row level security;

-- Mission Control uses SUPABASE_SERVICE_ROLE_KEY on the server side.
-- No public browser policy is required for this table.
