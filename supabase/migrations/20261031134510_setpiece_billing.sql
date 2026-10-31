begin;
-- Billing v1 is additive. Existing workspace/CMS dispatch implementations remain intact.
create table public.sp_billing_settings (
 owner_id uuid primary key references public.sp_owners(owner_id),
 data jsonb not null default '{"name":"","street":"","postal_code":"","city":"","country":"NL","vat_id":"","kvk":"","iban":"","account_holder":"","payment_days":14,"prefix":"F","mail_subject":"","mail_body":""}',
 version integer not null default 1,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.sp_customers (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null references public.sp_owners(owner_id),
 person_id uuid references contacten.personen(id),project_id uuid references public.sp_items(id),
 data jsonb not null default '{}',active boolean not null default true,
 version integer not null default 1,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(owner_id,id)
);
create table public.sp_invoices (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null references public.sp_owners(owner_id),
 customer_id uuid,project_id uuid references public.sp_items(id),kind text not null default 'invoice' check(kind in ('invoice','credit')),
 original_id uuid,correction_of uuid,status text not null default 'concept' check(status in ('concept','definitief','klaar_voor_verzending','verstuurd','vervallen')),
 series text not null default 'sales' check(series='sales'),number text,sequence_year integer,sequence_value bigint,
 invoice_on date,due_on date,service_from date,service_until date,service_kind text not null default 'service' check(service_kind in ('service','advance')),
 payment_days integer not null default 14 check(payment_days between 0 and 120),reference text not null default '' check(length(reference)<=240),
 intro text not null default '' check(length(intro)<=5000),footer text not null default '' check(length(footer)<=5000),notes text not null default '' check(length(notes)<=10000),
 net_cents bigint not null default 0,vat_cents bigint not null default 0,total_cents bigint not null default 0,tax_groups jsonb not null default '[]',
 frozen jsonb,dispatch_seed jsonb,template_version text,finalized_at timestamptz,retain_until date,
 pdf_path text,pdf_hash text,pdf_bytes integer,pdf_prepared_hash text,pdf_prepared_bytes integer,
 version integer not null default 1,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(owner_id,id),unique(owner_id,number),unique(owner_id,series,sequence_year,sequence_value),
 foreign key(owner_id,customer_id) references public.sp_customers(owner_id,id),
 foreign key(owner_id,original_id) references public.sp_invoices(owner_id,id),
 foreign key(owner_id,correction_of) references public.sp_invoices(owner_id,id),
 check(abs(net_cents)<=10000000000000 and abs(total_cents)<=10000000000000),check(total_cents=net_cents+vat_cents),
 check(service_until is null or service_from is null or service_until>=service_from),
 check(status in ('concept','vervallen') or (number is not null and frozen is not null and finalized_at is not null)),
 check((kind='credit')=(original_id is not null))
);
create table public.sp_invoice_lines (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null,invoice_id uuid not null,position integer not null check(position between 1 and 100),active boolean not null default true,
 description text not null default '' check(length(description)<=2000),quantity_milli bigint not null check(quantity_milli between 0 and 1000000000),unit text not null default '' check(length(unit)<=60),
 unit_price_cents bigint not null check(unit_price_cents between 0 and 10000000000000),vat_code text not null,tax_treatment text not null,vat_rate integer not null,
 service_from date,service_until date,net_cents bigint not null,line_vat_cents bigint not null,original_line_id uuid,
 version integer not null default 1,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(owner_id,id),
 foreign key(owner_id,invoice_id) references public.sp_invoices(owner_id,id),foreign key(owner_id,original_line_id) references public.sp_invoice_lines(owner_id,id),
 check((vat_code='nl_21' and tax_treatment='nl_standard' and vat_rate=21) or (vat_code='nl_9' and tax_treatment='nl_reduced' and vat_rate=9)),
 check(service_until is null or service_from is null or service_until>=service_from)
);
create unique index sp_bill_line_position on public.sp_invoice_lines(invoice_id,position) where active;
create table public.sp_payments (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null,invoice_id uuid not null,received_on date not null,amount_cents bigint not null check(amount_cents between 1 and 10000000000000),
 method text not null check(method in ('bank','cash','other')),note text not null default '' check(length(note)<=2000),status text not null default 'valid' check(status in ('valid','reversed')),
 reversed_reason text,reversed_at timestamptz,reversed_by text,actor text not null,
 version integer not null default 1,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 foreign key(owner_id,invoice_id) references public.sp_invoices(owner_id,id),unique(owner_id,id)
);
create table public.sp_invoice_dispatches (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null,invoice_id uuid not null,kind text not null default 'invoice' check(kind='invoice'),
 recipients jsonb not null,cc jsonb not null default '[]',subject text not null,body text not null,sender text not null default 'nathan@setpiece.nl',attachment_name text not null,
 status text not null default 'wacht_op_concept' check(status in ('wacht_op_concept','concept_klaar','verstuurd','geannuleerd')),
 gmail_draft_id text,gmail_message_id text,gmail_thread_id text,sent_at timestamptz,sent_via text,sent_note text,cancel_reason text,cancelled_at timestamptz,cancel_ack_at timestamptz,
 task_id uuid references public.sp_items(id),version integer not null default 1,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 foreign key(owner_id,invoice_id) references public.sp_invoices(owner_id,id),unique(owner_id,id),unique(owner_id,gmail_message_id)
);
create unique index sp_bill_one_dispatch on public.sp_invoice_dispatches(invoice_id) where status<>'geannuleerd';
create table public.sp_billing_audit (
 id bigint generated always as identity primary key,owner_id uuid not null references public.sp_owners(owner_id),invoice_id uuid,dispatch_id uuid,payment_id uuid,
 action text not null,actor text not null,summary text not null,created_at timestamptz not null default now(),
 foreign key(owner_id,invoice_id) references public.sp_invoices(owner_id,id),foreign key(owner_id,dispatch_id) references public.sp_invoice_dispatches(owner_id,id),foreign key(owner_id,payment_id) references public.sp_payments(owner_id,id)
);
grant usage,select on sequence public.sp_billing_audit_id_seq to service_role;
create table private.sp_billing_counters(owner_id uuid not null references public.sp_owners(owner_id),series text not null,year integer not null,last_value bigint not null,primary key(owner_id,series,year));
create table private.sp_invoice_tokens (
 token_hash text primary key,owner_id uuid not null,invoice_id uuid not null,dispatch_id uuid not null,expires_at timestamptz not null,uses integer not null default 0 check(uses between 0 and 3),created_at timestamptz not null default now(),actor text not null,
 foreign key(owner_id,invoice_id) references public.sp_invoices(owner_id,id),foreign key(owner_id,dispatch_id) references public.sp_invoice_dispatches(owner_id,id)
);
create table private.sp_billing_deployment (singleton boolean primary key default true check(singleton),base_url text not null check(base_url ~ '^https://[^/[:space:]]+$' or base_url ~ '^http://(localhost|127\.0\.0\.1):[0-9]+$'));
-- Configure this per deployment by trusted SQL; never infer the host from request headers.
create index sp_bill_invoice_owner on public.sp_invoices(owner_id,created_at,id);
create index sp_bill_lines_invoice on public.sp_invoice_lines(owner_id,invoice_id);
create index sp_bill_payment_invoice on public.sp_payments(owner_id,invoice_id);
create index sp_bill_dispatch_owner on public.sp_invoice_dispatches(owner_id,created_at,id);
create index sp_bill_audit_invoice on public.sp_billing_audit(owner_id,invoice_id,id);

create function private.sp_bill_guard() returns trigger language plpgsql set search_path='' as $$
declare old_doc public.sp_invoices;new_doc public.sp_invoices;
begin
 if tg_op='DELETE' then raise exception 'Facturatiegegevens worden niet verwijderd' using errcode='42501';end if;
 if current_setting('setpiece.billing_write',true) is distinct from 'on' then raise exception 'Gebruik sp_command voor facturatie' using errcode='42501';end if;
 if tg_op='UPDATE' then
  if tg_table_name='sp_billing_audit' then raise exception 'Audit is onveranderbaar' using errcode='42501';end if;
  if new.owner_id<>old.owner_id then raise exception 'Eigenaar is onveranderbaar' using errcode='42501';end if;
  if tg_table_name='sp_invoices' then
  if old.status<>'concept' then
   if (to_jsonb(new)-array['status','pdf_path','pdf_hash','pdf_bytes','pdf_prepared_hash','pdf_prepared_bytes','version','updated_at']) is distinct from (to_jsonb(old)-array['status','pdf_path','pdf_hash','pdf_bytes','pdf_prepared_hash','pdf_prepared_bytes','version','updated_at']) then raise exception 'Definitieve inhoud is onveranderbaar' using errcode='42501';end if;
   if new.status<>old.status and not ((old.status='definitief' and new.status='klaar_voor_verzending') or (old.status='klaar_voor_verzending' and new.status='verstuurd')) then raise exception 'Ongeldige documentovergang' using errcode='42501';end if;
   if old.pdf_hash is not null and (new.pdf_hash is distinct from old.pdf_hash or new.pdf_path is distinct from old.pdf_path or new.pdf_bytes is distinct from old.pdf_bytes) then raise exception 'Archief-PDF is onveranderbaar' using errcode='42501';end if;
   if old.pdf_prepared_hash is not null and (new.pdf_prepared_hash is distinct from old.pdf_prepared_hash or new.pdf_prepared_bytes is distinct from old.pdf_prepared_bytes) then raise exception 'PDF-voorbereiding is onveranderbaar' using errcode='42501';end if;
  end if;
  end if;
  if tg_table_name='sp_payments' then
   if ((to_jsonb(new)-array['status','reversed_reason','reversed_at','reversed_by','version','updated_at']) is distinct from (to_jsonb(old)-array['status','reversed_reason','reversed_at','reversed_by','version','updated_at']) or old.status='reversed') then raise exception 'Boeking is onveranderbaar; gebruik terugdraaien' using errcode='42501';end if;
  end if;
  if tg_table_name='sp_invoice_dispatches' and (to_jsonb(new)-array['status','gmail_draft_id','gmail_message_id','gmail_thread_id','sent_at','sent_via','sent_note','cancel_reason','cancelled_at','cancel_ack_at','version','updated_at']) is distinct from (to_jsonb(old)-array['status','gmail_draft_id','gmail_message_id','gmail_thread_id','sent_at','sent_via','sent_note','cancel_reason','cancelled_at','cancel_ack_at','version','updated_at']) then raise exception 'Verzendinhoud is bevroren' using errcode='42501';end if;
 end if;
 if tg_table_name='sp_invoice_lines' then
  select * into new_doc from public.sp_invoices where id=new.invoice_id;
  if new_doc.status<>'concept' then raise exception 'Regels van definitieve factuur zijn onveranderbaar' using errcode='42501';end if;
  if tg_op='UPDATE' then
   select * into old_doc from public.sp_invoices where id=old.invoice_id;
   if old_doc.status<>'concept' or old.invoice_id<>new.invoice_id then raise exception 'Regel niet verplaatsbaar' using errcode='42501';end if;
  end if;
 end if;
 if tg_op='UPDATE' then new.version:=old.version+1;new.updated_at:=now();end if;
 return new;
end $$;

-- All new exposed tables are owner/admin read only. Private tables have no API grants.
do $$ declare t text;begin
 foreach t in array array['sp_billing_settings','sp_customers','sp_invoices','sp_invoice_lines','sp_payments','sp_invoice_dispatches','sp_billing_audit'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated',t);
  execute format('grant select on public.%I to authenticated,service_role',t);
  execute format('create policy owner_read on public.%I for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.admin_users where user_id=(select auth.uid())) and exists(select 1 from public.sp_owners where owner_id=(select auth.uid())))',t);
  execute format('create trigger billing_guard before insert or update or delete on public.%I for each row execute function private.sp_bill_guard()',t);
 end loop;
 foreach t in array array['sp_billing_counters','sp_invoice_tokens','sp_billing_deployment'] loop
  execute format('alter table private.%I enable row level security',t);
  execute format('revoke all on private.%I from public,anon,authenticated',t);
 end loop;
end $$;

create function private.sp_bill_keys(p jsonb,allowed text[]) returns void language plpgsql immutable set search_path='' as $$
begin
 if p is null or jsonb_typeof(p)<>'object' or exists(select 1 from jsonb_object_keys(p) k where not k=any(allowed)) then raise exception 'Onbekend of beschermd veld' using errcode='22023';end if;
end $$;
create function private.sp_bill_text(v text) returns boolean language sql immutable set search_path='' as $$select coalesce(length(trim(v))>0 and v !~ '[{}]' and v !~* '(placeholder|nader in te vullen|^tbd$|^todo$)',false)$$;
create function private.sp_bill_iban(v text) returns boolean language plpgsql immutable set search_path='' as $$
declare s text:=upper(replace(v,' ',''));digits text:='';c text;r integer:=0;i integer;
begin
 if s is null or s !~ '^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$' then return false;end if;
 s:=substring(s,5)||left(s,4);
 for i in 1..length(s) loop c:=substr(s,i,1);digits:=digits||case when c~'[A-Z]' then (ascii(c)-55)::text else c end;end loop;
 for i in 1..length(digits) loop r:=(r*10+substr(digits,i,1)::integer)%97;end loop;
 return r=1;
end $$;
create function private.sp_bill_emails(p jsonb) returns jsonb language plpgsql immutable set search_path='' as $$
declare v text;answer jsonb:='[]';begin
 if p is null or jsonb_typeof(p)<>'array' or jsonb_array_length(p)>10 then raise exception 'Ongeldige ontvangers';end if;
 for v in select value#>>'{}' from jsonb_array_elements(p) loop
  v:=lower(trim(v));
  if v is null or length(v)>254 or v ~ '[\r\n]' or v !~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$' then raise exception 'Ongeldig e-mailadres';end if;
  if not answer @> jsonb_build_array(v) then answer:=answer||jsonb_build_array(v);end if;
 end loop;
 return (select coalesce(jsonb_agg(value order by value),'[]') from jsonb_array_elements(answer));
end $$;
create function private.sp_bill_mail(t text,vals jsonb) returns text language plpgsql immutable set search_path='' as $$
declare k text;v text:=t;begin
 if not private.sp_bill_text(t) and (t is null or length(trim(t))=0 or t like '%{{%') then raise exception 'Vul het mailsjabloon volledig in';end if;
 if length(t)>10000 then raise exception 'Mailsjabloon te lang';end if;
 foreach k in array array['nummer','klant','totaal','vervaldatum','referentie'] loop v:=replace(v,'{'||k||'}',coalesce(vals->>k,''));end loop;
 if v ~ '[{}]' or length(trim(v))=0 then raise exception 'Onbekend of oningevuld sjabloonveld';end if;
 return v;
end $$;
create function private.sp_bill_euro(c bigint) returns text language sql immutable set search_path='' as $$select case when c<0 then '-' else '' end||'€'||chr(160)||replace(to_char(abs(c)/100,'FM999G999G999G999G990'),',','.')||','||lpad((abs(c)%100)::text,2,'0')$$;
create function private.sp_bill_calculate(p_lines jsonb) returns jsonb language plpgsql immutable set search_path='' as $$
declare l jsonb;q numeric;price bigint;rate integer;groups jsonb;net numeric;vat numeric;
begin
 if jsonb_typeof(p_lines)<>'array' or jsonb_array_length(p_lines)>100 then raise exception 'Maximaal 100 regels';end if;
 for l in select value from jsonb_array_elements(p_lines) loop
  if jsonb_typeof(l->'quantity') is distinct from 'string' or jsonb_typeof(l->'unit_price_cents') is distinct from 'string' or l->>'quantity' !~ '^(0|[1-9][0-9]{0,6})(\.[0-9]{1,3})?$' or l->>'unit_price_cents' !~ '^(0|[1-9][0-9]{0,13})$' or l->>'quantity' is null or l->>'unit_price_cents' is null then raise exception 'Ongeldige schaal of centen';end if;
  q:=(l->>'quantity')::numeric;price:=(l->>'unit_price_cents')::bigint;
  if q>1000000 or price>10000000000000 then raise exception 'Aantal of prijs te groot';end if;
  if not coalesce(((l->>'vat_code'='nl_21' and l->>'tax_treatment'='nl_standard') or (l->>'vat_code'='nl_9' and l->>'tax_treatment'='nl_reduced')),false) then raise exception 'Btw-behandeling niet beschikbaar';end if;
 end loop;
 select coalesce(jsonb_agg(jsonb_build_object('vat_code',code,'tax_treatment',treatment,'rate',r,'net_cents',n::text,'vat_cents',round(n*r/100)::bigint::text) order by code),'[]'),coalesce(sum(n),0),coalesce(sum(round(n*r/100)),0) into groups,net,vat
 from (select value->>'vat_code' code,value->>'tax_treatment' treatment,case value->>'vat_code' when 'nl_21' then 21 else 9 end::numeric r,sum(round((value->>'quantity')::numeric*(value->>'unit_price_cents')::numeric)) n from jsonb_array_elements(p_lines) group by 1,2,3) g;
 if abs(net)>10000000000000 or abs(net+vat)>10000000000000 then raise exception 'Factuurtotaal te groot';end if;
 return jsonb_build_object('net_cents',net::text,'vat_cents',vat::text,'total_cents',(net+vat)::text,'tax_groups',groups);
end $$;
create function private.sp_bill_version(actual integer,expected integer) returns void language plpgsql immutable set search_path='' as $$begin if actual is distinct from expected then raise exception 'Versieconflict: laad de actuele versie en vergelijk je invoer' using errcode='PT409';end if;end $$;
create function private.sp_bill_refs(own uuid,project uuid,person uuid default null) returns void language plpgsql set search_path='' as $$
begin
 if project is not null and not exists(select 1 from public.sp_items where id=project and owner_id=own and kind='project' and workspace='setpiece') then raise exception 'Kies een eigen Setpiece-project';end if;
 if person is not null and (not exists(select 1 from public.sp_owners where owner_id=own and contacts_access) or not exists(select 1 from contacten.personen where id=person)) then raise exception 'Persoon niet beschikbaar' using errcode='42501';end if;
end $$;
create function private.sp_bill_invoice_json(i public.sp_invoices) returns jsonb language sql stable set search_path='' as $$
 select to_jsonb(i)||jsonb_build_object('sequence_value',i.sequence_value::text,'net_cents',i.net_cents::text,'vat_cents',i.vat_cents::text,'total_cents',i.total_cents::text,
 'credited_cents',coalesce((select -sum(total_cents) from public.sp_invoices where original_id=i.id and status not in ('concept','vervallen')),0)::text,
 'received_cents',coalesce((select sum(amount_cents) from public.sp_payments where invoice_id=i.id and status='valid'),0)::text)
$$;
create function private.sp_bill_line_json(l public.sp_invoice_lines) returns jsonb language sql immutable set search_path='' as $$select to_jsonb(l)||jsonb_build_object('quantity',trim(trailing '.' from trim(trailing '0' from to_char(l.quantity_milli::numeric/1000,'FM9999990.000'))),'quantity_milli',l.quantity_milli::text,'unit_price_cents',l.unit_price_cents::text,'net_cents',l.net_cents::text,'line_vat_cents',l.line_vat_cents::text)$$;
create function private.sp_bill_date(v text) returns date language plpgsql immutable set search_path='' as $$begin if v is null or v='' then return null;end if;if v !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then raise exception 'Gebruik een geldige kalenderdatum';end if;return v::date;end $$;
create function private.sp_bill_next_number(own uuid,yr integer,prefix text) returns jsonb language plpgsql set search_path='' as $$
declare seq bigint;label text;begin
 if yr not between 2000 and 2200 or prefix !~ '^[A-Z]{1,4}$' then raise exception 'Ongeldige nummerreeks';end if;
 insert into private.sp_billing_counters values(own,'sales',yr,0) on conflict do nothing;
 select last_value+1 into seq from private.sp_billing_counters where owner_id=own and series='sales' and year=yr for update;
 update private.sp_billing_counters set last_value=seq where owner_id=own and series='sales' and year=yr;
 label:=prefix||yr||'-'||case when seq<10000 then lpad(seq::text,4,'0') else seq::text end;
 return jsonb_build_object('number',label,'value',seq::text);
end $$;
create function private.sp_bill_finalize(p_id uuid,own uuid,p_credit boolean default false) returns public.sp_invoices language plpgsql set search_path='' as $$
declare i public.sp_invoices;s jsonb;c jsonb;l public.sp_invoice_lines;k text;seq bigint;yr integer;vals jsonb;seed jsonb;dispatch_ref uuid:=gen_random_uuid();today date:=(now() at time zone 'Europe/Amsterdam')::date;
begin
 select * into i from public.sp_invoices where id=p_id and owner_id=own for update;
 if i.status<>'concept' then raise exception 'Alleen concepten kunnen definitief worden';end if;
 if p_credit then s:=i.frozen->'seller';c:=i.frozen->'customer';else
 select data into s from public.sp_billing_settings where owner_id=own;
 select data into c from public.sp_customers where id=i.customer_id and owner_id=own;
 end if;
 if i.invoice_on is distinct from today then raise exception 'Controleer de geplande datum en kies vandaag vóór definitief maken';end if;
 foreach k in array array['name','street','postal_code','city','country'] loop
  if not private.sp_bill_text(s->>k) or not private.sp_bill_text(c->>k) then raise exception 'Bedrijfsnaam en volledig feitelijk factuuradres zijn verplicht (%).',k;end if;
 end loop;
 if s->>'country'<>'NL' or c->>'country'<>'NL' or coalesce((c->>'tax_confirmed')::boolean,false) is not true then raise exception 'Bevestig Nederlandse klantgegevens en btw-behandeling; buitenland is nog niet ondersteund';end if;
 if s->>'street' ~* '(postbus|p\.?o\.? box)' or c->>'street' ~* '(postbus|p\.?o\.? box)' or s->>'postal_code' !~ '^[1-9][0-9]{3} ?[A-Za-z]{2}$' or c->>'postal_code' !~ '^[1-9][0-9]{3} ?[A-Za-z]{2}$' then raise exception 'Gebruik een feitelijk adres en geldige Nederlandse postcode';end if;
 if s->>'vat_id' !~ '^NL[0-9]{9}B[0-9]{2}$' or s->>'kvk' !~ '^[0-9]{8}$' or not private.sp_bill_iban(s->>'iban') or not private.sp_bill_text(s->>'account_holder') then raise exception 'Controleer btw-id, KVK, IBAN en rekeninghouder in Instellingen';end if;
 if i.service_from is null or i.service_until is null then raise exception 'Vul de dienst- of vooruitbetalingsdatum/periode in';end if;
 if not exists(select 1 from public.sp_invoice_lines where invoice_id=i.id and active) then raise exception 'Voeg minimaal één factuurregel toe';end if;
 for l in select * from public.sp_invoice_lines where invoice_id=i.id and active loop
  if not private.sp_bill_text(l.description) or not private.sp_bill_text(l.unit) or l.quantity_milli=0 then raise exception 'Vul omschrijving, omvang en eenheid in voor iedere regel';end if;
 end loop;
 if i.total_cents=0 then raise exception 'Een factuur moet een niet-nul totaal hebben';end if;
 seed:=jsonb_build_object('recipients',private.sp_bill_emails(coalesce(c->'recipients','[]')),'cc',private.sp_bill_emails(coalesce(c->'cc','[]')));
 if jsonb_array_length(seed->'recipients')=0 then raise exception 'Vul een bruikbare ontvanger in bij de klant';end if;
 yr:=extract(year from i.invoice_on)::integer;
 seq:=(private.sp_bill_next_number(own,yr,coalesce(nullif(s->>'prefix',''),'F'))->>'value')::bigint;
 i.number:=coalesce(nullif(s->>'prefix',''),'F')||yr||'-'||case when seq<10000 then lpad(seq::text,4,'0') else seq::text end;
 i.due_on:=case when i.kind='credit' then null else i.invoice_on+i.payment_days end;
 vals:=jsonb_build_object('nummer',i.number,'klant',c->>'name','totaal',private.sp_bill_euro(i.total_cents),'vervaldatum',coalesce(to_char(i.due_on,'DD-MM-YYYY'),'te verrekenen'),'referentie',i.reference);
 seed:=seed||jsonb_build_object('subject',private.sp_bill_mail(s->>'mail_subject',vals),'body',private.sp_bill_mail(s->>'mail_body',vals),'sender','nathan@setpiece.nl','dispatch_id',dispatch_ref,'attachment_name','Setpiece-factuur-'||i.number||'.pdf');
 seed:=seed||jsonb_build_object('body',(seed->>'body')||E'\n\nDispatchreferentie: setpiece-dispatch:'||dispatch_ref);
 if seed->>'subject' ~ '[\r\n]' or length(seed->>'subject')>240 then raise exception 'Gebruik één onderwerpregel van maximaal 240 tekens';end if;
 i.frozen:=jsonb_build_object('seller',s,'customer',c,'invoice',jsonb_build_object('id',i.id,'kind',i.kind,'number',i.number,'invoice_on',i.invoice_on,'due_on',i.due_on,'service_from',i.service_from,'service_until',i.service_until,'service_kind',i.service_kind,'payment_days',i.payment_days,'reference',i.reference,'intro',i.intro,'footer',i.footer,'net_cents',i.net_cents::text,'vat_cents',i.vat_cents::text,'total_cents',i.total_cents::text,'tax_groups',i.tax_groups),
 'original',case when i.original_id is null then null else (select jsonb_build_object('id',id,'number',number,'invoice_on',invoice_on) from public.sp_invoices where id=i.original_id) end,
 'lines',(select jsonb_agg(private.sp_bill_line_json(x) order by position) from public.sp_invoice_lines x where invoice_id=i.id and active),'template_version','setpiece-invoice-v1');
 update public.sp_invoices set number=i.number,sequence_year=yr,sequence_value=seq,due_on=i.due_on,status='definitief',frozen=i.frozen,dispatch_seed=seed,template_version='setpiece-invoice-v1',finalized_at=now(),retain_until=make_date(yr+7,12,31) where id=i.id returning * into i;
 return i;
end $$;
create function private.sp_bill_dispatch(i public.sp_invoices) returns public.sp_invoice_dispatches language plpgsql set search_path='' as $$
declare d public.sp_invoice_dispatches;t uuid;base text;dispatch_id uuid;mail_body text;begin
 select base_url into base from private.sp_billing_deployment where singleton;
 if base is null then raise exception 'Facturatiehost is nog niet veilig geconfigureerd';end if;
 insert into public.sp_items(owner_id,kind,workspace,title,description,assignee,source_url,source_ref,follow_up_on)
 values(i.owner_id,'task','setpiece',left('Zet mailconcept klaar: factuur '||i.number||' aan '||(i.frozen->'customer'->>'name'),240),'Maak uitsluitend een Gmail-concept volgens de factuurdispatch. Nathan verstuurt zelf.','Jarvis',base||'/beheer/facturen/'||i.id,'invoice:'||i.id,(now() at time zone 'Europe/Amsterdam')::date) returning id into t;
 insert into public.sp_activity(owner_id,item_id,actor,action,summary) values(i.owner_id,t,private.sp_actor(),'billing.task.created','Factuurverzending klaargezet voor Jarvis');
 dispatch_id:=case when not exists(select 1 from public.sp_invoice_dispatches where invoice_id=i.id) then coalesce((i.dispatch_seed->>'dispatch_id')::uuid,gen_random_uuid()) else gen_random_uuid() end;
 mail_body:=regexp_replace(i.dispatch_seed->>'body',E'\n\nDispatchreferentie: setpiece-dispatch:[a-f0-9-]+$','')||E'\n\nDispatchreferentie: setpiece-dispatch:'||dispatch_id;
 insert into public.sp_invoice_dispatches(id,owner_id,invoice_id,recipients,cc,subject,body,attachment_name,task_id) values(dispatch_id,i.owner_id,i.id,i.dispatch_seed->'recipients',i.dispatch_seed->'cc',i.dispatch_seed->>'subject',mail_body,i.dispatch_seed->>'attachment_name',t) returning * into d;
 return d;
end $$;
create function private.sp_bill_cancel(own uuid,p_invoice uuid,reason text) returns void language plpgsql set search_path='' as $$
declare d public.sp_invoice_dispatches;begin
 for d in select * from public.sp_invoice_dispatches where owner_id=own and invoice_id=p_invoice and status in ('wacht_op_concept','concept_klaar') for update loop
  update public.sp_invoice_dispatches set status='geannuleerd',cancel_reason=reason,cancelled_at=now() where id=d.id;
  delete from private.sp_invoice_tokens where dispatch_id=d.id;
  update public.sp_items set status='gearchiveerd',result=reason,version=version+1,updated_at=now() where id=d.task_id and owner_id=own;
  insert into public.sp_activity(owner_id,item_id,actor,action,summary) values(own,d.task_id,private.sp_actor(),'billing.task.cancelled',reason);
 end loop;
end $$;
create function private.sp_bill_credit(orig public.sp_invoices,p jsonb) returns public.sp_invoices language plpgsql set search_path='' as $$
declare c public.sp_invoices;l public.sp_invoice_lines;prev bigint;take bigint;selected jsonb;g record;prev_net bigint;prev_vat bigint;group_net bigint;group_vat bigint;groups jsonb:='[]';net bigint:=0;vat bigint:=0;pos integer:=0;left_total bigint;
begin
 if orig.kind<>'invoice' or orig.status in ('concept','vervallen') then raise exception 'Credit vereist een gewone definitieve factuur';end if;
 if p ? 'lines' and orig.status<>'verstuurd' then raise exception 'Deelcredit kan pas na verzending; kies volledige correctie';end if;
 if p ? 'lines' then
  if jsonb_typeof(p->'lines')<>'array' or jsonb_array_length(p->'lines') not between 1 and 100 or (select count(*)<>count(distinct value->>'original_line_id') from jsonb_array_elements(p->'lines')) then raise exception 'Ongeldige creditregels';end if;
  for selected in select value from jsonb_array_elements(p->'lines') loop
   perform private.sp_bill_keys(selected,array['original_line_id','net_cents']);
   if selected->>'net_cents' !~ '^[1-9][0-9]{0,13}$' or not exists(select 1 from public.sp_invoice_lines where id=(selected->>'original_line_id')::uuid and invoice_id=orig.id and active) then raise exception 'Ongeldige oorspronkelijke regel of creditbedrag';end if;
  end loop;
 end if;
 insert into public.sp_invoices(owner_id,customer_id,project_id,kind,original_id,invoice_on,service_from,service_until,service_kind,payment_days,reference,intro,footer,frozen)
 values(orig.owner_id,orig.customer_id,orig.project_id,'credit',orig.id,(now() at time zone 'Europe/Amsterdam')::date,orig.service_from,orig.service_until,orig.service_kind,orig.payment_days,orig.reference,'Credit op '||orig.number,orig.footer,orig.frozen) returning * into c;
 for l in select * from public.sp_invoice_lines where invoice_id=orig.id and active order by position for update loop
  select coalesce(-sum(x.net_cents),0) into prev from public.sp_invoice_lines x join public.sp_invoices v on v.id=x.invoice_id where x.original_line_id=l.id and x.active and v.status not in ('concept','vervallen');
  if p ? 'lines' then select value into selected from jsonb_array_elements(p->'lines') where value->>'original_line_id'=l.id::text;take:=coalesce((selected->>'net_cents')::bigint,0);else take:=l.net_cents-prev;end if;
  if take<0 or take>l.net_cents-prev then raise exception 'Credit overschrijdt het resterende regelbedrag';end if;
  if take>0 then
   pos:=pos+1;
   insert into public.sp_invoice_lines(owner_id,invoice_id,position,description,quantity_milli,unit,unit_price_cents,vat_code,tax_treatment,vat_rate,service_from,service_until,net_cents,line_vat_cents,original_line_id)
   values(orig.owner_id,c.id,pos,l.description,1000,case when take=l.net_cents then l.unit else 'deel ('||l.unit||')' end,take,l.vat_code,l.tax_treatment,l.vat_rate,l.service_from,l.service_until,-take,-round(take::numeric*l.vat_rate/100)::bigint,l.id);
  end if;
 end loop;
 if pos=0 then raise exception 'Er is niets meer te crediteren';end if;
 for g in select value from jsonb_array_elements(orig.tax_groups) loop
  select coalesce(-sum((value->>'net_cents')::bigint),0),coalesce(-sum((value->>'vat_cents')::bigint),0) into prev_net,prev_vat from public.sp_invoices v cross join lateral jsonb_array_elements(v.tax_groups) where v.original_id=orig.id and v.status not in ('concept','vervallen') and value->>'vat_code'=g.value->>'vat_code';
  select coalesce(-sum(net_cents),0) into group_net from public.sp_invoice_lines where invoice_id=c.id and active and vat_code=g.value->>'vat_code';
  if group_net>0 then
   group_vat:=case when prev_net+group_net=(g.value->>'net_cents')::bigint then (g.value->>'vat_cents')::bigint-prev_vat else round((prev_net+group_net)::numeric*(g.value->>'rate')::integer/100)::bigint-prev_vat end;
   if prev_vat+group_vat>(g.value->>'vat_cents')::bigint then raise exception 'Credit overschrijdt btw';end if;
   groups:=groups||jsonb_build_array(jsonb_build_object('vat_code',g.value->>'vat_code','tax_treatment',g.value->>'tax_treatment','rate',(g.value->>'rate')::integer,'net_cents',(-group_net)::text,'vat_cents',(-group_vat)::text));net:=net-group_net;vat:=vat-group_vat;
  end if;
 end loop;
 update public.sp_invoices set net_cents=net,vat_cents=vat,total_cents=net+vat,tax_groups=groups where id=c.id;
 c:=private.sp_bill_finalize(c.id,orig.owner_id,true);
 update public.sp_invoices set updated_at=now() where id=orig.id;
 select orig.total_cents+coalesce(sum(total_cents),0) into left_total from public.sp_invoices where original_id=orig.id and status not in ('concept','vervallen');
 if left_total=0 then perform private.sp_bill_cancel(orig.owner_id,orig.id,'Volledig gecrediteerd met '||c.number);end if;
 return c;
end $$;
-- Rename the current implementation rather than restoring a stale workspace definition.
alter function private.sp_command(text,text,jsonb,integer) rename to sp_workspace_command;
create function private.sp_command(p_request_id text,p_operation text,p_payload jsonb,p_expected_version integer default null) returns jsonb language plpgsql security definer set search_path='' as $$
declare own uuid:=private.sp_owner();sig jsonb;cached private.sp_commands;answer jsonb;p jsonb:=p_payload;allowed text[];human boolean;
 i public.sp_invoices;orig public.sp_invoices;c public.sp_customers;s public.sp_billing_settings;d public.sp_invoice_dispatches;pay public.sp_payments;credit public.sp_invoices;replacement public.sp_invoices;
 l jsonb;data jsonb;calc jsonb;merged jsonb;k text;pos integer;lid uuid;q bigint;price bigint;net bigint;rate integer;is_replay boolean:=false;today date:=(now() at time zone 'Europe/Amsterdam')::date;balance bigint;base text;sent timestamptz;
begin
 if p_operation not in ('settings.update','customer.create','customer.update','invoice.create','invoice.update','invoice.void','invoice.finalize','invoice.prepare_pdf','invoice.attach_pdf','invoice.credit','invoice.correct','payment.record','payment.reverse','dispatch.draft_ready','dispatch.cancel','dispatch.cancel_ack','dispatch.requeue','invoice.mark_sent') then return private.sp_workspace_command(p_request_id,p_operation,p_payload,p_expected_version);end if;
 human:=p_operation in ('settings.update','invoice.finalize','invoice.prepare_pdf','invoice.attach_pdf','invoice.credit','invoice.correct','payment.record','payment.reverse','dispatch.cancel','dispatch.requeue') or (p_operation='invoice.mark_sent' and p->>'sent_via'='manual');
 if human and auth.uid() is distinct from own then raise exception 'Deze handeling vereist een ingelogde eigenaar en actuele adminregistratie' using errcode='42501';end if;
 if p_request_id is null or length(p_request_id) not between 8 and 160 or p is null or jsonb_typeof(p)<>'object' or octet_length(p::text)>100000 then raise exception 'Ongeldig verzoek' using errcode='22023';end if;
 allowed:=case p_operation
 when 'settings.update' then array['data'] when 'customer.create' then array['data','person_id','project_id','active'] when 'customer.update' then array['id','data','person_id','project_id','active']
 when 'invoice.create' then array['customer_id','project_id','invoice_on','service_from','service_until','service_kind','payment_days','reference','intro','footer','notes','lines']
 when 'invoice.update' then array['id','customer_id','project_id','invoice_on','service_from','service_until','service_kind','payment_days','reference','intro','footer','notes','lines']
 when 'invoice.prepare_pdf' then array['id','hash','bytes','template_version'] when 'invoice.attach_pdf' then array['id','hash','bytes','path']
 when 'invoice.credit' then array['id','lines','confirmed'] when 'invoice.correct' then array['id','confirmed']
 when 'payment.record' then array['id','received_on','amount_cents','method','note','confirm_overpayment'] when 'payment.reverse' then array['id','reason']
 when 'dispatch.draft_ready' then array['id','gmail_draft_id','gmail_thread_id'] when 'dispatch.cancel' then array['id','reason'] when 'dispatch.cancel_ack' then array['id','note'] when 'dispatch.requeue' then array['id','confirmed']
 when 'invoice.mark_sent' then array['id','recipients','cc','sent_at','sent_via','gmail_message_id','gmail_thread_id','note'] else array['id'] end;
 perform private.sp_bill_keys(p,allowed);
 sig:=jsonb_build_object('operation',p_operation,'payload',p,'version',p_expected_version);
 insert into private.sp_commands(owner_id,request_id,signature) values(own,p_request_id,sig) on conflict do nothing;
 select * into cached from private.sp_commands where owner_id=own and request_id=p_request_id for update;
 if cached.signature<>sig then raise exception 'Verzoek-ID hoort bij een andere handeling' using errcode='23505';end if;
 if cached.result is not null then return cached.result;end if;
 perform owner_id from public.sp_owners where owner_id=own for update;
 perform set_config('setpiece.billing_write','on',true);
 insert into public.sp_billing_settings(owner_id) values(own) on conflict do nothing;
 if p_operation='settings.update' then
  select * into s from public.sp_billing_settings where owner_id=own for update;perform private.sp_bill_version(s.version,p_expected_version);
  perform private.sp_bill_keys(p->'data',array['name','street','postal_code','city','country','vat_id','kvk','iban','account_holder','payment_days','prefix','mail_subject','mail_body']);
  merged:=s.data||(p->'data');
  if merged->>'payment_days' !~ '^[0-9]{1,3}$' or (merged->>'payment_days')::integer>120 or merged->>'prefix' !~ '^[A-Z]{1,4}$' then raise exception 'Betaaltermijn 0–120 dagen; prefix 1–4 hoofdletters';end if;
  for k in select key from jsonb_each(merged) where key<>'payment_days' loop if jsonb_typeof(merged->k)<>'string' or length(merged->>k)>10000 then raise exception 'Ongeldig instellingenveld';end if;end loop;
  update public.sp_billing_settings set data=merged where owner_id=own returning to_jsonb(sp_billing_settings.*) into answer;
 elsif p_operation in ('customer.create','customer.update') then
  if p_operation='customer.update' then
   select * into c from public.sp_customers where id=(p->>'id')::uuid and owner_id=own for update;
   if c.id is null then raise exception 'Klant niet beschikbaar' using errcode='42501';end if;perform private.sp_bill_version(c.version,p_expected_version);
  else
   perform private.sp_bill_version(null,p_expected_version);c.id:=gen_random_uuid();c.owner_id:=own;c.active:=true;c.data:='{"name":"","street":"","postal_code":"","city":"","country":"","vat_id":"","kvk":"","recipients":[],"cc":[],"payment_days":14,"tax_confirmed":false}';
  end if;
  perform private.sp_bill_keys(p->'data',array['name','street','postal_code','city','country','vat_id','kvk','recipients','cc','payment_days','tax_confirmed']);
  merged:=c.data||(p->'data');merged:=merged||jsonb_build_object('recipients',private.sp_bill_emails(merged->'recipients'),'cc',private.sp_bill_emails(merged->'cc'));
  if merged->>'payment_days' !~ '^[0-9]{1,3}$' or (merged->>'payment_days')::integer>120 or jsonb_typeof(merged->'tax_confirmed')<>'boolean' then raise exception 'Controleer betaaltermijn en btw-bevestiging';end if;
  for k in select key from jsonb_each(merged) where key not in ('payment_days','tax_confirmed','recipients','cc') loop if jsonb_typeof(merged->k)<>'string' or length(merged->>k)>500 then raise exception 'Ongeldig klantveld';end if;end loop;
  c.person_id:=case when p ? 'person_id' then nullif(p->>'person_id','')::uuid else c.person_id end;c.project_id:=case when p ? 'project_id' then nullif(p->>'project_id','')::uuid else c.project_id end;
  perform private.sp_bill_refs(own,c.project_id,c.person_id);
  insert into public.sp_customers(id,owner_id,person_id,project_id,data,active) values(c.id,own,c.person_id,c.project_id,merged,coalesce((p->>'active')::boolean,c.active)) on conflict(id) do update set data=excluded.data,person_id=excluded.person_id,project_id=excluded.project_id,active=excluded.active returning to_jsonb(sp_customers.*) into answer;
 elsif p_operation in ('invoice.create','invoice.update') then
  if p_operation='invoice.update' then
   select * into i from public.sp_invoices where id=(p->>'id')::uuid and owner_id=own for update;
   if i.id is null then raise exception 'Factuur niet beschikbaar' using errcode='42501';end if;perform private.sp_bill_version(i.version,p_expected_version);
   if i.status<>'concept' then raise exception 'Alleen concepten zijn bewerkbaar';end if;
  else
   perform private.sp_bill_version(null,p_expected_version);insert into public.sp_invoices(owner_id) values(own) returning * into i;
  end if;
  if not p ? 'lines' then raise exception 'Stuur de volledige actieve regelset';end if;
  perform private.sp_bill_refs(own,nullif(p->>'project_id','')::uuid);
  if nullif(p->>'customer_id','') is not null and not exists(select 1 from public.sp_customers where id=(p->>'customer_id')::uuid and owner_id=own) then raise exception 'Klant niet beschikbaar' using errcode='42501';end if;
  calc:=private.sp_bill_calculate(p->'lines');pos:=0;
  update public.sp_invoice_lines set active=false where invoice_id=i.id and active;
  for l in select value from jsonb_array_elements(p->'lines') loop
   perform private.sp_bill_keys(l,array['id','description','quantity','unit','unit_price_cents','vat_code','tax_treatment','service_from','service_until']);
   lid:=coalesce(nullif(l->>'id','')::uuid,gen_random_uuid());
   if exists(select 1 from public.sp_invoice_lines where id=lid and (invoice_id<>i.id or owner_id<>own)) then raise exception 'Regel hoort bij een andere factuur' using errcode='42501';end if;
   pos:=pos+1;q:=((l->>'quantity')::numeric*1000)::bigint;price:=(l->>'unit_price_cents')::bigint;net:=round(q::numeric*price/1000)::bigint;rate:=case l->>'vat_code' when 'nl_21' then 21 else 9 end;
   insert into public.sp_invoice_lines(id,owner_id,invoice_id,position,active,description,quantity_milli,unit,unit_price_cents,vat_code,tax_treatment,vat_rate,net_cents,line_vat_cents,service_from,service_until)
   values(lid,own,i.id,pos,true,coalesce(l->>'description',''),q,coalesce(l->>'unit',''),price,l->>'vat_code',l->>'tax_treatment',rate,net,round(net::numeric*rate/100)::bigint,private.sp_bill_date(l->>'service_from'),private.sp_bill_date(l->>'service_until'))
   on conflict(id) do update set position=excluded.position,active=true,description=excluded.description,quantity_milli=excluded.quantity_milli,unit=excluded.unit,unit_price_cents=excluded.unit_price_cents,vat_code=excluded.vat_code,tax_treatment=excluded.tax_treatment,vat_rate=excluded.vat_rate,net_cents=excluded.net_cents,line_vat_cents=excluded.line_vat_cents,service_from=excluded.service_from,service_until=excluded.service_until;
  end loop;
  if (select count(*) from public.sp_invoice_lines where invoice_id=i.id and active)<>pos then raise exception 'Dubbele regel-ID';end if;
  update public.sp_invoices set customer_id=nullif(p->>'customer_id','')::uuid,project_id=nullif(p->>'project_id','')::uuid,invoice_on=private.sp_bill_date(p->>'invoice_on'),service_from=private.sp_bill_date(p->>'service_from'),service_until=private.sp_bill_date(p->>'service_until'),service_kind=coalesce(p->>'service_kind','service'),payment_days=coalesce((p->>'payment_days')::integer,14),reference=coalesce(p->>'reference',''),intro=coalesce(p->>'intro',''),footer=coalesce(p->>'footer',''),notes=coalesce(p->>'notes',''),net_cents=(calc->>'net_cents')::bigint,vat_cents=(calc->>'vat_cents')::bigint,total_cents=(calc->>'total_cents')::bigint,tax_groups=calc->'tax_groups' where id=i.id returning * into i;
  answer:=private.sp_bill_invoice_json(i);
 elsif p_operation like 'dispatch.%' or p_operation='invoice.mark_sent' then
  select * into d from public.sp_invoice_dispatches where id=(p->>'id')::uuid and owner_id=own for update;
  if d.id is null then raise exception 'Verzendopdracht niet beschikbaar' using errcode='42501';end if;
  select * into i from public.sp_invoices where id=d.invoice_id and owner_id=own for update;
  if p_operation='dispatch.draft_ready' and d.status='concept_klaar' and d.gmail_draft_id=p->>'gmail_draft_id' and d.gmail_thread_id is not distinct from nullif(p->>'gmail_thread_id','') then is_replay:=true;
  elsif p_operation='invoice.mark_sent' and d.status='verstuurd' then
   if d.gmail_message_id is distinct from nullif(p->>'gmail_message_id','') or d.sent_at is distinct from (p->>'sent_at')::timestamptz or d.sent_via is distinct from p->>'sent_via' or d.recipients<>private.sp_bill_emails(p->'recipients') or d.cc<>private.sp_bill_emails(p->'cc') or d.sent_note is distinct from coalesce(p->>'note','') or d.gmail_thread_id is distinct from nullif(p->>'gmail_thread_id','') then raise exception 'Ander verzendbewijs op reeds verstuurde opdracht' using errcode='23505';end if;is_replay:=true;
  end if;
  if not is_replay then
   perform private.sp_bill_version(d.version,p_expected_version);
   if p_operation='dispatch.draft_ready' then
    if d.status<>'wacht_op_concept' or not private.sp_bill_text(p->>'gmail_draft_id') or length(p->>'gmail_draft_id')>200 then raise exception 'Opdracht is niet meer beschikbaar of concept-ID ontbreekt' using errcode='23505';end if;
    update public.sp_invoice_dispatches set status='concept_klaar',gmail_draft_id=p->>'gmail_draft_id',gmail_thread_id=nullif(p->>'gmail_thread_id','') where id=d.id returning * into d;
   elsif p_operation='dispatch.cancel' then
    if not private.sp_bill_text(p->>'reason') or length(p->>'reason')>2000 or d.status not in ('wacht_op_concept','concept_klaar') then raise exception 'Alleen open opdracht annuleren met reden';end if;
    perform private.sp_bill_cancel(own,i.id,p->>'reason');select * into d from public.sp_invoice_dispatches where id=d.id;
   elsif p_operation='dispatch.cancel_ack' then
    if d.status<>'geannuleerd' or not private.sp_bill_text(p->>'note') then raise exception 'Bevestig de afhandeling van het geannuleerde Gmail-concept';end if;
    update public.sp_invoice_dispatches set cancel_ack_at=now() where id=d.id returning * into d;
   elsif p_operation='dispatch.requeue' then
    if d.status<>'geannuleerd' or p->>'confirmed' is distinct from 'true' or i.status='verstuurd' or exists(select 1 from public.sp_invoice_dispatches where invoice_id=i.id and status<>'geannuleerd') or (select coalesce(-sum(total_cents),0) from public.sp_invoices where original_id=i.id and status not in ('concept','vervallen'))>=i.total_cents and i.kind='invoice' then raise exception 'Controleer ontvangers en inhoud; deze opdracht kan niet opnieuw klaar';end if;
    delete from private.sp_invoice_tokens where invoice_id=i.id;d:=private.sp_bill_dispatch(i);
   elsif p_operation='invoice.mark_sent' then
    sent:=(p->>'sent_at')::timestamptz;
    if d.status not in ('wacht_op_concept','concept_klaar') or i.status<>'klaar_voor_verzending' or i.pdf_hash is null or not coalesce(p->>'sent_via' in ('gmail','manual'),false) or sent is null or sent>now()+interval '5 minutes' or sent<i.finalized_at or sent<d.created_at or d.recipients<>private.sp_bill_emails(p->'recipients') or d.cc<>private.sp_bill_emails(p->'cc') then raise exception 'Controleer opdracht, ontvangers en werkelijk verzendmoment';end if;
    if p->>'sent_via'='gmail' and (not private.sp_bill_text(p->>'gmail_message_id') or length(p->>'gmail_message_id')>200) then raise exception 'Gmail-verzending vereist een werkelijk message-ID';end if;
    if p->>'sent_via'='manual' and not private.sp_bill_text(p->>'note') then raise exception 'Beschrijf hoe de factuur daadwerkelijk is verstuurd';end if;
    update public.sp_invoice_dispatches set status='verstuurd',sent_at=sent,sent_via=p->>'sent_via',gmail_message_id=nullif(p->>'gmail_message_id',''),gmail_thread_id=nullif(p->>'gmail_thread_id',''),sent_note=coalesce(p->>'note','') where id=d.id returning * into d;
    update public.sp_invoices set status='verstuurd' where id=i.id;
    update public.sp_items set status='afgerond',result='Verzending geregistreerd via '||d.sent_via,execution_ref=coalesce(d.gmail_message_id,'handmatig'),completed_at=now(),version=version+1,updated_at=now() where id=d.task_id and owner_id=own;
    insert into public.sp_activity(owner_id,item_id,actor,action,summary) values(own,d.task_id,private.sp_actor(),'billing.task.completed','Werkelijk verzendbewijs geregistreerd');
    delete from private.sp_invoice_tokens where dispatch_id=d.id;
   end if;
  end if;
  answer:=to_jsonb(d);
 elsif p_operation='payment.reverse' then
  select * into pay from public.sp_payments where id=(p->>'id')::uuid and owner_id=own for update;
  if pay.id is null then raise exception 'Betaling niet beschikbaar' using errcode='42501';end if;
  perform private.sp_bill_version(pay.version,p_expected_version);
  if pay.status<>'valid' or not private.sp_bill_text(p->>'reason') or length(p->>'reason')>2000 then raise exception 'Terugdraaien vereist een geldige ontvangst en reden';end if;
  update public.sp_payments set status='reversed',reversed_reason=p->>'reason',reversed_by=private.sp_actor(),reversed_at=now() where id=pay.id returning * into pay;
  update public.sp_invoices set updated_at=now() where id=pay.invoice_id returning * into i;answer:=to_jsonb(pay)||jsonb_build_object('amount_cents',pay.amount_cents::text);
 else
  select * into i from public.sp_invoices where id=(p->>'id')::uuid and owner_id=own for update;
  if i.id is null then raise exception 'Factuur niet beschikbaar' using errcode='42501';end if;
  if p_operation='invoice.attach_pdf' and i.pdf_hash is not null and i.pdf_hash=p->>'hash' and i.pdf_path=p->>'path' and i.pdf_bytes=(p->>'bytes')::integer then is_replay:=true;
  elsif p_operation='invoice.prepare_pdf' and i.pdf_prepared_hash=p->>'hash' and i.pdf_prepared_bytes=(p->>'bytes')::integer then is_replay:=true;end if;
  if not is_replay then
   perform private.sp_bill_version(i.version,p_expected_version);
   if p_operation='invoice.void' then
    if i.status<>'concept' then raise exception 'Alleen concepten kunnen vervallen';end if;update public.sp_invoices set status='vervallen' where id=i.id returning * into i;
   elsif p_operation='invoice.finalize' then i:=private.sp_bill_finalize(i.id,own);
   elsif p_operation='invoice.prepare_pdf' then
    if i.status<>'definitief' or i.pdf_prepared_hash is not null or p->>'hash' is null or p->>'bytes' is null or p->>'hash' !~ '^[a-f0-9]{64}$' or (p->>'bytes')::integer not between 1 and 5242880 or p->>'template_version' is distinct from i.template_version then raise exception 'Ongeldige PDF-voorbereiding';end if;
    update public.sp_invoices set pdf_prepared_hash=p->>'hash',pdf_prepared_bytes=(p->>'bytes')::integer where id=i.id returning * into i;
   elsif p_operation='invoice.attach_pdf' then
    if i.status<>'definitief' or i.pdf_hash is not null or i.pdf_prepared_hash is null or i.pdf_prepared_bytes is null or p->>'hash' is distinct from i.pdf_prepared_hash or (p->>'bytes')::integer is distinct from i.pdf_prepared_bytes or p->>'path' is distinct from own||'/'||i.sequence_year||'/'||i.number||'-'||i.id||'.pdf' then raise exception 'PDF-metadata komt niet overeen met de factuur';end if;
    update public.sp_invoices set pdf_path=p->>'path',pdf_hash=p->>'hash',pdf_bytes=(p->>'bytes')::integer,status='klaar_voor_verzending' where id=i.id returning * into i;
    d:=private.sp_bill_dispatch(i);
   elsif p_operation in ('invoice.credit','invoice.correct') then
    if p->>'confirmed' is distinct from 'true' then raise exception 'Bevestig de onomkeerbare credit';end if;
    credit:=private.sp_bill_credit(i,p);
    if p_operation='invoice.correct' then
     insert into public.sp_invoices(owner_id,customer_id,project_id,correction_of,invoice_on,service_from,service_until,service_kind,payment_days,reference,intro,footer,notes,net_cents,vat_cents,total_cents,tax_groups)
     values(own,i.customer_id,i.project_id,credit.id,today,i.service_from,i.service_until,i.service_kind,i.payment_days,i.reference,i.intro,i.footer,'Correctie na '||credit.number,-credit.net_cents,-credit.vat_cents,-credit.total_cents,(select jsonb_agg(value||jsonb_build_object('net_cents',(-(value->>'net_cents')::bigint)::text,'vat_cents',(-(value->>'vat_cents')::bigint)::text)) from jsonb_array_elements(credit.tax_groups))) returning * into replacement;
     insert into public.sp_invoice_lines(owner_id,invoice_id,position,description,quantity_milli,unit,unit_price_cents,vat_code,tax_treatment,vat_rate,service_from,service_until,net_cents,line_vat_cents)
     select own,replacement.id,position,description,quantity_milli,unit,unit_price_cents,vat_code,tax_treatment,vat_rate,service_from,service_until,-net_cents,-line_vat_cents from public.sp_invoice_lines where invoice_id=credit.id and active;
    end if;
   elsif p_operation='payment.record' then
    if i.kind<>'invoice' or i.status in ('concept','vervallen') or p->>'amount_cents' !~ '^[1-9][0-9]{0,13}$' or (p->>'amount_cents')::numeric>10000000000000 or private.sp_bill_date(p->>'received_on')>today then raise exception 'Ontvangst vereist een gewone definitieve factuur, geldige datum en positief bedrag';end if;
    select i.total_cents+coalesce((select sum(total_cents) from public.sp_invoices where original_id=i.id and status not in ('concept','vervallen')),0)-coalesce((select sum(amount_cents) from public.sp_payments where invoice_id=i.id and status='valid'),0) into balance;
    if (p->>'amount_cents')::bigint>balance and p->>'confirm_overpayment' is distinct from 'true' then raise exception 'Bevestig overbetaling en het resterende klanttegoed';end if;
    insert into public.sp_payments(owner_id,invoice_id,received_on,amount_cents,method,note,actor) values(own,i.id,private.sp_bill_date(p->>'received_on'),(p->>'amount_cents')::bigint,p->>'method',coalesce(p->>'note',''),private.sp_actor()) returning * into pay;
    update public.sp_invoices set updated_at=now() where id=i.id returning * into i;
   end if;
  end if;
  answer:=case when credit.id is not null then private.sp_bill_invoice_json(credit)||jsonb_build_object('replacement_id',replacement.id) when pay.id is not null then to_jsonb(pay)||jsonb_build_object('amount_cents',pay.amount_cents::text) else private.sp_bill_invoice_json(i) end;
 end if;
 if not is_replay then
  insert into public.sp_billing_audit(owner_id,invoice_id,dispatch_id,payment_id,action,actor,summary) values(own,coalesce(credit.id,i.id),d.id,pay.id,p_operation,private.sp_actor(),coalesce(credit.number,i.number,'Concept / instellingen / klant')||' · '||p_operation||case when replacement.id is not null then ' · nieuw concept '||replacement.id else '' end);
 end if;
 update private.sp_commands set result=answer where owner_id=own and request_id=p_request_id;return answer;
end $$;
create or replace function public.sp_command(p_request_id text,p_operation text,p_payload jsonb,p_expected_version integer default null) returns jsonb language sql security invoker set search_path='' as $$select private.sp_command(p_request_id,p_operation,p_payload,p_expected_version)$$;
create function private.sp_billing_read(p_id uuid default null,p_after uuid default null,p_limit integer default 100) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare own uuid:=private.sp_owner();ids uuid[];last_id uuid;answer jsonb;begin
 if p_limit not between 1 and 200 then raise exception 'Ongeldige paginagrootte';end if;
 select array_agg(id order by id) into ids from (select id from public.sp_invoices where owner_id=own and (p_id is null or id=p_id) and (p_after is null or id>p_after) order by id limit p_limit) x;
 last_id:=ids[array_length(ids,1)];
 return jsonb_build_object('settings',(select to_jsonb(s) from public.sp_billing_settings s where owner_id=own),
 'customers',coalesce((select jsonb_agg(to_jsonb(c) order by c.data->>'name',id) from public.sp_customers c where owner_id=own),'[]'),
 'projects',coalesce((select jsonb_agg(jsonb_build_object('id',id,'title',title)) from public.sp_items where owner_id=own and workspace='setpiece' and kind='project'),'[]'),
 'invoices',coalesce((select jsonb_agg(private.sp_bill_invoice_json(i) order by id) from public.sp_invoices i where owner_id=own and id=any(ids)),'[]'),
 'lines',case when p_id is null then '[]'::jsonb else coalesce((select jsonb_agg(private.sp_bill_line_json(l) order by position,id) from public.sp_invoice_lines l where owner_id=own and invoice_id=p_id),'[]') end,
 'payments',case when p_id is null then '[]'::jsonb else coalesce((select jsonb_agg(to_jsonb(t)||jsonb_build_object('amount_cents',t.amount_cents::text) order by created_at) from public.sp_payments t where owner_id=own and invoice_id=p_id),'[]') end,
 'dispatches',case when p_id is null then '[]'::jsonb else coalesce((select jsonb_agg(to_jsonb(d) order by created_at) from public.sp_invoice_dispatches d where owner_id=own and invoice_id=p_id),'[]') end,
 'audit',case when p_id is null then '[]'::jsonb else coalesce((select jsonb_agg(to_jsonb(a)||jsonb_build_object('id',a.id::text) order by a.id) from public.sp_billing_audit a where owner_id=own and (invoice_id=p_id or invoice_id in(select id from public.sp_invoices where original_id=p_id and owner_id=own))),'[]') end,
 'related',case when p_id is null then '[]'::jsonb else coalesce((select jsonb_agg(private.sp_bill_invoice_json(i)) from public.sp_invoices i where owner_id=own and (original_id=p_id or correction_of=p_id or id=(select original_id from public.sp_invoices where id=p_id and owner_id=own) or id=(select correction_of from public.sp_invoices where id=p_id and owner_id=own))),'[]') end,
 'cursor',last_id,'has_more',p_id is null and exists(select 1 from public.sp_invoices where owner_id=own and id>last_id));
end $$;
create function public.sp_billing_read(p_id uuid default null,p_after uuid default null,p_limit integer default 100) returns jsonb language sql security invoker set search_path='' as $$select private.sp_billing_read(p_id,p_after,p_limit)$$;
create function private.sp_invoice_outbox(p_after jsonb default null,p_limit integer default 100) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare own uuid:=private.sp_owner();items jsonb;cursor jsonb;more boolean;begin
 if p_limit not between 1 and 100 then raise exception 'Paginagrootte 1–100';end if;
 with rows as (select d.*,row_number() over(order by d.created_at,d.id) rn from public.sp_invoice_dispatches d where d.owner_id=own and (d.status in ('wacht_op_concept','concept_klaar') or (d.status='geannuleerd' and d.gmail_draft_id is not null and d.cancel_ack_at is null)) and (p_after is null or (d.created_at,d.id)>((p_after->>'created_at')::timestamptz,(p_after->>'id')::uuid)) order by d.created_at,d.id limit p_limit+1)
 select coalesce(jsonb_agg(to_jsonb(r)-'rn'||jsonb_build_object('dispatch_ref','setpiece-dispatch:'||r.id,'invoice',private.sp_bill_invoice_json(i),'person_id',c.person_id,'pdf_hash',i.pdf_hash,'pdf_bytes',i.pdf_bytes,'balance_cents',(i.total_cents+coalesce((select sum(total_cents) from public.sp_invoices where original_id=i.id and status not in ('concept','vervallen')),0)-coalesce((select sum(amount_cents) from public.sp_payments where invoice_id=i.id and status='valid'),0))::text) order by r.created_at,r.id) filter(where rn<=p_limit),'[]'),coalesce(bool_or(rn>p_limit),false) into items,more from rows r join public.sp_invoices i on i.id=r.invoice_id left join public.sp_customers c on c.id=i.customer_id;
 cursor:=case when jsonb_array_length(items)>0 then jsonb_build_object('id',items->-1->>'id','created_at',items->-1->>'created_at') else null end;
 return jsonb_build_object('dispatches',items,'cursor',cursor,'has_more',more);
end $$;
create function public.sp_invoice_outbox(p_after jsonb default null,p_limit integer default 100) returns jsonb language sql security invoker set search_path='' as $$select private.sp_invoice_outbox(p_after,p_limit)$$;
create function private.sp_invoice_pdf_link(p_dispatch_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare own uuid:=private.sp_owner();d public.sp_invoice_dispatches;i public.sp_invoices;token text;base text;begin
 perform owner_id from public.sp_owners where owner_id=own for update;
 select * into d from public.sp_invoice_dispatches where id=p_dispatch_id and owner_id=own for update;
 select * into i from public.sp_invoices where id=d.invoice_id and owner_id=own;
 if d.status not in ('wacht_op_concept','concept_klaar') or i.pdf_hash is null then raise exception 'Geen actieve PDF-opdracht' using errcode='42501';end if;
 select base_url into base from private.sp_billing_deployment where singleton;
 if base is null then raise exception 'Facturatiehost ontbreekt';end if;
 token:=encode(extensions.gen_random_bytes(32),'hex');
 insert into private.sp_invoice_tokens(token_hash,owner_id,invoice_id,dispatch_id,expires_at,actor) values(encode(extensions.digest(token,'sha256'),'hex'),own,i.id,d.id,now()+interval '15 minutes',private.sp_actor());
 return jsonb_build_object('url',base||'/api/factuur-pdf','authorization','Bearer '||token,'expires_at',now()+interval '15 minutes','max_downloads',3,'pdf_hash',i.pdf_hash,'pdf_bytes',i.pdf_bytes);
end $$;
create function public.sp_invoice_pdf_link(p_dispatch_id uuid) returns jsonb language sql security invoker set search_path='' as $$select private.sp_invoice_pdf_link(p_dispatch_id)$$;
create function private.sp_invoice_pdf_consume(p_hash text) returns jsonb language plpgsql security definer set search_path='' as $$
declare t private.sp_invoice_tokens;i public.sp_invoices;own uuid;begin
 if auth.role() is distinct from 'service_role' or auth.uid() is not null or p_hash !~ '^[a-f0-9]{64}$' then return null;end if;
 select owner_id into own from private.sp_invoice_tokens where token_hash=p_hash;
 if own is null then return null;end if;
 perform owner_id from public.sp_owners where owner_id=own for update;
 update private.sp_invoice_tokens x set uses=uses+1 where token_hash=p_hash and expires_at>now() and uses<3 and exists(select 1 from public.sp_invoice_dispatches d where d.id=x.dispatch_id and d.status in ('wacht_op_concept','concept_klaar')) returning * into t;
 if t.token_hash is null then return null;end if;
 select * into i from public.sp_invoices where id=t.invoice_id and owner_id=t.owner_id;
 if i.pdf_hash is null then return null;end if;
 return jsonb_build_object('path',i.pdf_path,'hash',i.pdf_hash,'bytes',i.pdf_bytes,'filename','Setpiece-factuur-'||i.number||'.pdf');
end $$;
create function public.sp_invoice_pdf_consume(p_hash text) returns jsonb language sql security invoker set search_path='' as $$select private.sp_invoice_pdf_consume(p_hash)$$;

-- Cross-owner references and referenced work remain valid if the workspace changes later.
create unique index sp_items_owner_id_unique on public.sp_items(owner_id,id);
alter table public.sp_customers add foreign key(owner_id,project_id) references public.sp_items(owner_id,id);
alter table public.sp_invoices add foreign key(owner_id,project_id) references public.sp_items(owner_id,id);
alter table public.sp_invoice_dispatches add foreign key(owner_id,task_id) references public.sp_items(owner_id,id);
create function private.sp_bill_work_guard() returns trigger language plpgsql set search_path='' as $$begin
 if (new.owner_id,new.kind,new.workspace) is distinct from (old.owner_id,old.kind,old.workspace) and (exists(select 1 from public.sp_invoices where project_id=old.id) or exists(select 1 from public.sp_customers where project_id=old.id) or exists(select 1 from public.sp_invoice_dispatches where task_id=old.id)) then raise exception 'Werk is gekoppeld aan facturatie; eigenaar, type en werkgebied blijven behouden';end if;return new;end $$;
create trigger billing_work_reference before update on public.sp_items for each row execute function private.sp_bill_work_guard();
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('facturen','facturen',false,5242880,array['application/pdf']);
create policy billing_pdf_read on storage.objects for select to authenticated using(bucket_id='facturen' and exists(select 1 from public.sp_invoices i where i.owner_id=(select auth.uid()) and i.pdf_path=name and exists(select 1 from public.admin_users where user_id=(select auth.uid()))));
-- No Storage INSERT/UPDATE/DELETE policy; authorized server uploads only, never upsert.
do $$declare f record;begin
 for f in select p.oid::regprocedure signature,p.proname,n.nspname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where (n.nspname='private' and (p.proname like 'sp_bill%' or p.proname like 'sp_invoice_%' or p.proname='sp_command')) or (n.nspname='public' and p.proname in ('sp_billing_read','sp_invoice_outbox','sp_invoice_pdf_link','sp_invoice_pdf_consume','sp_command')) loop
  execute format('revoke all on function %s from public,anon,authenticated,service_role',f.signature);
  if f.proname in ('sp_command','sp_billing_read','sp_invoice_outbox','sp_invoice_pdf_link') then execute format('grant execute on function %s to authenticated,service_role',f.signature);end if;
  if f.proname='sp_invoice_pdf_consume' then execute format('grant execute on function %s to service_role',f.signature);end if;
 end loop;
end $$;
commit;
