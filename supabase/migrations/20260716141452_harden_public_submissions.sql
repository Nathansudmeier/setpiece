create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create table if not exists private.rate_limit_events (
  id bigint generated always as identity primary key,
  identifier text not null,
  action text not null,
  occurred_at timestamptz not null default now(),
  constraint rate_limit_identifier_length check (char_length(identifier) between 16 and 128),
  constraint rate_limit_action_length check (char_length(action) between 1 and 64)
);

alter table private.rate_limit_events enable row level security;
revoke all on table private.rate_limit_events from public, anon, authenticated;

create index if not exists rate_limit_events_lookup_idx
  on private.rate_limit_events (identifier, action, occurred_at desc);

create or replace function public.check_rate_limit(
  p_identifier text,
  p_action text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  recent_count integer;
begin
  if char_length(p_identifier) not between 16 and 128
    or char_length(p_action) not between 1 and 64
    or p_limit not between 1 and 10000
    or p_window_seconds not between 1 and 172800 then
    raise exception 'invalid rate limit arguments' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_identifier || ':' || p_action, 0));

  delete from private.rate_limit_events
  where occurred_at < now() - interval '2 days';

  select count(*)
    into recent_count
  from private.rate_limit_events
  where identifier = p_identifier
    and action = p_action
    and occurred_at >= now() - make_interval(secs => p_window_seconds);

  if recent_count >= p_limit then
    return false;
  end if;

  insert into private.rate_limit_events (identifier, action)
  values (p_identifier, p_action);

  return true;
end;
$$;

revoke all on function public.check_rate_limit(text, text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, text, integer, integer)
  to service_role;

drop policy if exists "Public kan contactaanvraag insturen"
  on public.contact_submissions;
revoke insert on public.contact_submissions from anon, authenticated;
