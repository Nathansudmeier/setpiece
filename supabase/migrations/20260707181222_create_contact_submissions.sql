create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  source text not null default 'homepage',
  constraint contact_name_len check (char_length(name) between 1 and 200),
  constraint contact_email_len check (char_length(email) between 3 and 320),
  constraint contact_email_shape check (position('@' in email) > 1),
  constraint contact_company_len check (company is null or char_length(company) <= 200),
  constraint contact_message_len check (char_length(message) between 1 and 5000)
);

comment on table public.contact_submissions is 'Contactaanvragen van prospects via het formulier op setpiece.nl. Anon mag alleen inserten (RLS), niet lezen.';

alter table public.contact_submissions enable row level security;

-- Publiek formulier: iedereen mag een aanvraag insturen, niemand mag lezen via de anon key.
create policy "Public kan contactaanvraag insturen"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);

create index contact_submissions_created_at_idx on public.contact_submissions (created_at desc);