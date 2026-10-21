-- Postvak: werkvelden voor beheer
alter table public.contact_submissions
  add column status text not null default 'nieuw'
    constraint contact_submissions_status_check
    check (status in ('nieuw', 'in_behandeling', 'afgerond', 'gearchiveerd')),
  add column read_at timestamptz,
  add column notes text
    constraint contact_submissions_notes_check
    check (notes is null or char_length(notes) <= 10000);

comment on column public.contact_submissions.status is 'Werkstatus in het beheer-postvak';
comment on column public.contact_submissions.read_at is 'Moment waarop de aanvraag voor het eerst geopend is in het postvak';
comment on column public.contact_submissions.notes is 'Interne notities van de beheerder';

-- Beheerders: alleen accounts in deze tabel mogen het postvak lezen en bewerken
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
comment on table public.admin_users is 'Accounts met toegang tot /beheer. Alleen via SQL te beheren; geen API-schrijfrechten.';

alter table public.admin_users enable row level security;

-- Een ingelogde gebruiker mag alleen de eigen admin-rij zien; nodig voor de
-- exists-check in de policies op contact_submissions.
create policy "Eigen admin-rij zichtbaar" on public.admin_users
  for select to authenticated
  using (user_id = (select auth.uid()));

-- Geen insert/update/delete policies op admin_users: alleen via SQL te muteren.
revoke insert, update, delete on public.admin_users from anon, authenticated;

-- Postvak-policies
create policy "Admins lezen aanvragen" on public.contact_submissions
  for select to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

create policy "Admins werken aanvragen bij" on public.contact_submissions
  for update to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

-- Kolomrechten aanscherpen: beheer mag alleen de werkvelden bijwerken,
-- de inhoud van de aanvraag zelf blijft via de API onveranderbaar.
revoke update on public.contact_submissions from anon, authenticated;
grant update (status, read_at, notes) on public.contact_submissions to authenticated;