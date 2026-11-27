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

-- Preserve the newest observation even across concurrent application instances.
create or replace function public.keep_newest_game_price()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.observed_at < old.observed_at then
    return old;
  end if;
  return new;
end;
$$;
drop trigger if exists keep_newest_game_price on public.game_price_history;
create trigger keep_newest_game_price before update on public.game_price_history
for each row execute function public.keep_newest_game_price();
revoke execute on function public.keep_newest_game_price() from public, anon, authenticated;
