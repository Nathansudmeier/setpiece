create schema if not exists contacten;
revoke all on schema contacten from public, anon, authenticated;

create table contacten.personen (
  id uuid primary key default gen_random_uuid(),
  naam text not null,
  roepnaam text,
  rollen text[] not null,
  functie text,
  organisatie text,
  telefoon text,
  email text,
  linkedin text,
  verjaardag date,
  geboortejaar_bekend boolean not null default false,
  laatste_contact date,
  laatste_kanaal text,
  notitie text,
  bron text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint personen_rollen_check check (cardinality(rollen) > 0 and rollen <@ array['fcg','setpiece','mv_artemis','prive']::text[])
);
comment on table contacten.personen is 'Persoonlijke contactenbase van Nathan Sudmeier (beheerd door Jarvis). Geen minderjarige speelsters. RLS aan, geen policies: alleen service role / SQL.';

create table contacten.momenten (
  id uuid primary key default gen_random_uuid(),
  persoon_id uuid not null references contacten.personen(id) on delete cascade,
  datum date not null default current_date,
  kanaal text,
  omschrijving text not null,
  created_at timestamptz not null default now()
);
comment on table contacten.momenten is 'Contactgeschiedenis per persoon (korte neutrale regels).';

create index personen_naam_lower_idx on contacten.personen (lower(naam));
create index personen_verjaardag_idx on contacten.personen (verjaardag);
create index personen_email_lower_idx on contacten.personen (lower(email));
create index momenten_persoon_idx on contacten.momenten (persoon_id, datum desc);

create or replace function contacten.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger personen_set_updated_at before update on contacten.personen
for each row execute function contacten.set_updated_at();

alter table contacten.personen enable row level security;
alter table contacten.momenten enable row level security;

revoke all on all tables in schema contacten from public, anon, authenticated;
revoke all on all functions in schema contacten from public, anon, authenticated;
alter default privileges in schema contacten revoke all on tables from public, anon, authenticated;
alter default privileges in schema contacten revoke all on functions from public, anon, authenticated;