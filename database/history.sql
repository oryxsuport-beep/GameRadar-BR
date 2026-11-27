-- Run in the SQL editor of an authorized Supabase project.
create table if not exists public.game_price_history (
  app_id text not null check (app_id ~ '^[0-9]{1,12}$'),
  store text not null check (store = 'Steam Brasil'),
  day date not null,
  price_cents integer not null check (price_cents > 0),
  original_cents integer check (original_cents >= price_cents),
  observed_at timestamptz not null,
  primary key (app_id, store, day)
);
alter table public.game_price_history enable row level security;
revoke all on public.game_price_history from anon, authenticated;
grant select, insert, update on public.game_price_history to service_role;
-- Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Render, never in GitHub or browser JS.
