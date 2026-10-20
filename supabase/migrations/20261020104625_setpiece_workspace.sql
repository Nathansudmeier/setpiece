begin;
create table public.sp_owners (owner_id uuid primary key references auth.users(id), contacts_access boolean not null default false);
insert into public.sp_owners(owner_id,contacts_access) values ('675024a7-62f2-4eac-ba25-9718bb362e74',true);
alter table public.sp_owners enable row level security;
create policy owner_read on public.sp_owners for select to authenticated using(owner_id=(select auth.uid()));
grant select on public.sp_owners to authenticated;

create table public.sp_items (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.sp_owners(owner_id),
 kind text not null check(kind in ('project','task','decision')),
 workspace text not null check(workspace in ('setpiece','nankaro','fc-groningen','mv-artemis','prive')),
 title text not null check(length(trim(title)) between 1 and 240), description text not null default '' check(length(description)<=20000),
 status text not null default 'open' check(status in ('open','bezig','wachten','beslissing','afgerond','gearchiveerd')),
 priority integer not null default 2 check(priority between 1 and 3),
 project_id uuid references public.sp_items(id), assignee text not null default 'Nathan' check(length(assignee) between 1 and 120),
 assignee_person_id uuid references contacten.personen(id), waiting_person_id uuid references contacten.personen(id),
 due_on date, follow_up_on date, source_url text not null default '',source_ref text not null default '',
 result text not null default '',execution_ref text not null default '',next_step text not null default '',
 people uuid[] not null default '{}',notes text not null default '',documents jsonb not null default '[]',
 version integer not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), completed_at timestamptz,
 check(kind<>'task' or status<>'bezig' or length(trim(execution_ref))>0),
 check(kind<>'task' or status<>'afgerond' or length(trim(result))>0),
 check(source_url='' or source_url ~ '^https?://[^/@[:space:]]+([/:?#]|$)'),
 check(length(notes)<=20000 and length(result)<=10000 and length(source_ref)<=2000 and length(execution_ref)<=2000),
 check(jsonb_typeof(documents)='array' and jsonb_array_length(documents)<=30)
);
create index sp_items_owner_context on public.sp_items(owner_id,workspace,kind,status);
create index sp_items_project on public.sp_items(project_id);
create index sp_items_person on public.sp_items(assignee_person_id);
create index sp_items_waiting on public.sp_items(waiting_person_id);
create index sp_items_changed on public.sp_items(owner_id,updated_at,id);
create table public.sp_activity (
 id bigint generated always as identity primary key,owner_id uuid not null references public.sp_owners(owner_id),
 item_id uuid references public.sp_items(id),actor text not null,action text not null,summary text not null,created_at timestamptz not null default now()
);
create index sp_activity_owner_time on public.sp_activity(owner_id,created_at desc);
create index sp_activity_item on public.sp_activity(item_id);
create table private.sp_commands (
 owner_id uuid not null, request_id text not null check(length(request_id) between 8 and 160),
 signature jsonb not null,result jsonb,created_at timestamptz not null default now(), primary key(owner_id,request_id)
);
create table public.sp_request_links (
 submission_id uuid primary key references public.contact_submissions(id),owner_id uuid not null references public.sp_owners(owner_id),
 person_id uuid references contacten.personen(id),project_id uuid references public.sp_items(id),task_id uuid references public.sp_items(id),version integer not null default 1
);
create index sp_links_owner on public.sp_request_links(owner_id);
create index sp_links_person on public.sp_request_links(person_id);
create index sp_links_project on public.sp_request_links(project_id);
create index sp_links_task on public.sp_request_links(task_id);

create function private.sp_owner() returns uuid language plpgsql stable security definer set search_path='' as $$
declare v uuid:=auth.uid();
begin
 if v is not null then
   if not exists(select 1 from public.admin_users where user_id=v) or not exists(select 1 from public.sp_owners where owner_id=v) then raise exception 'Geen toegang' using errcode='42501';end if;
   return v;
 end if;
 -- Management SQL uses postgres. The existing shared connector is privileged;
 -- this is deliberately recorded as a connector, never a claimed bot identity.
 if session_user in ('postgres','supabase_admin') or auth.role()='service_role' then
   return '675024a7-62f2-4eac-ba25-9718bb362e74'::uuid;
 end if;
 raise exception 'Geen toegang' using errcode='42501';
end $$;
revoke all on function private.sp_owner() from public,anon;
grant execute on function private.sp_owner() to authenticated,service_role;
create function private.sp_actor() returns text language sql stable security invoker set search_path='' as $$
 select case when auth.uid() is not null then 'gebruiker:'||auth.uid()::text else 'connector:'||session_user||':'||coalesce(auth.role(),'sql') end
$$;
revoke all on function private.sp_actor() from public,anon;
grant execute on function private.sp_actor() to authenticated,service_role;

alter table public.sp_items enable row level security;
alter table public.sp_activity enable row level security;
alter table public.sp_request_links enable row level security;
alter table private.sp_commands enable row level security;
create policy owner_read on public.sp_items for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.admin_users where user_id=(select auth.uid())));
create policy owner_read on public.sp_activity for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.admin_users where user_id=(select auth.uid())));
create policy owner_read on public.sp_request_links for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.admin_users where user_id=(select auth.uid())));
revoke all on public.sp_items,public.sp_activity,public.sp_request_links,public.sp_owners from anon,authenticated;
grant select on public.sp_items,public.sp_activity,public.sp_request_links,public.sp_owners to authenticated;

create function private.sp_command(p_request_id text,p_operation text,p_payload jsonb,p_expected_version integer default null) returns jsonb
language plpgsql security definer set search_path='' as $$
declare own uuid:=private.sp_owner(); sig jsonb:=jsonb_build_object('operation',p_operation,'payload',p_payload,'version',p_expected_version);
 cached private.sp_commands; old public.sp_items; item public.sp_items; merged jsonb; answer jsonb; k text; ref uuid; d jsonb; link public.sp_request_links;
begin
 if jsonb_typeof(p_payload)<>'object' or octet_length(p_payload::text)>100000 then raise exception 'Ongeldige invoer';end if;
 insert into private.sp_commands(owner_id,request_id,signature) values(own,p_request_id,sig) on conflict do nothing;
 select * into cached from private.sp_commands where owner_id=own and request_id=p_request_id for update;
 if cached.signature<>sig then raise exception 'Verzoek-ID is al voor een andere handeling gebruikt' using errcode='23505';end if;
 if cached.result is not null then return cached.result;end if;
 if p_operation='request.link' then
   if not exists(select 1 from public.contact_submissions where id=(p_payload->>'submission_id')::uuid) then raise exception 'Aanvraag bestaat niet';end if;
   select * into link from public.sp_request_links where submission_id=(p_payload->>'submission_id')::uuid for update;
   if link.submission_id is not null and (link.owner_id<>own or p_expected_version is distinct from link.version) then raise exception 'Versieconflict: ververs de pagina' using errcode='40001';end if;
   if nullif(p_payload->>'person_id','') is not null and (not exists(select 1 from public.sp_owners where owner_id=own and contacts_access) or not exists(select 1 from contacten.personen where id=(p_payload->>'person_id')::uuid)) then raise exception 'Persoon niet beschikbaar';end if;
   foreach k in array array['project_id','task_id'] loop
    ref:=nullif(p_payload->>k,'')::uuid;
    if ref is not null and not exists(select 1 from public.sp_items where id=ref and owner_id=own and kind=case k when 'project_id' then 'project' else 'task' end) then raise exception 'Ongeldige koppeling';end if;
   end loop;
   insert into public.sp_request_links(submission_id,owner_id,person_id,project_id,task_id) values((p_payload->>'submission_id')::uuid,own,nullif(p_payload->>'person_id','')::uuid,nullif(p_payload->>'project_id','')::uuid,nullif(p_payload->>'task_id','')::uuid)
   on conflict(submission_id) do update set person_id=excluded.person_id,project_id=excluded.project_id,task_id=excluded.task_id,version=public.sp_request_links.version+1 returning to_jsonb(sp_request_links.*) into answer;
   insert into public.sp_activity(owner_id,actor,action,summary) values(own,private.sp_actor(),p_operation,'Aanvraag '||(p_payload->>'submission_id')||' gekoppeld');
 else
   if p_operation not in ('project.create','project.update','task.create','task.update','decision.create','decision.update') then raise exception 'Onbekende handeling';end if;
   k:=split_part(p_operation,'.',1);
   if p_operation like '%.update' then
    select * into old from public.sp_items where id=(p_payload->>'id')::uuid and owner_id=own and kind=k for update;
    if old.id is null then raise exception 'Onderdeel niet gevonden' using errcode='42501';end if;
    if p_expected_version is distinct from old.version then raise exception 'Versieconflict: iemand wijzigde dit werk. Ververs en probeer opnieuw.' using errcode='40001';end if;
    if old.status in ('afgerond','gearchiveerd') and coalesce(p_payload->>'status',old.status) not in (old.status,'open','gearchiveerd') then raise exception 'Heropen het werk eerst';end if;
    merged:=to_jsonb(old)||p_payload;
   else
    merged:=jsonb_build_object('id',gen_random_uuid(),'workspace','setpiece','title','','description','','status','open','priority',2,'assignee','Nathan','source_url','','source_ref','','result','','execution_ref','','next_step','','notes','','people','[]'::jsonb,'documents','[]'::jsonb)||p_payload;
   end if;
   -- Only allow business fields: owner, kind, identity and timestamps cannot be supplied.
   if p_payload ?| array['owner_id','kind','version','created_at','updated_at','completed_at'] or (p_operation like '%.create' and p_payload ? 'id') then raise exception 'Beschermd veld';end if;
   merged:=merged||jsonb_build_object('owner_id',own,'kind',k);
   item:=jsonb_populate_record(null::public.sp_items,merged);
   if item.project_id is not null then
    if k='project' then raise exception 'Een project kan geen onderdeel van een project zijn';end if;
    if not exists(select 1 from public.sp_items where id=item.project_id and owner_id=own and kind='project' and workspace=item.workspace) then raise exception 'Project en werkgebied moeten overeenkomen';end if;
   end if;
   if old.id is not null and old.kind='project' and old.workspace<>item.workspace and exists(select 1 from public.sp_items where project_id=old.id) then raise exception 'Werkgebied wijzigen kan pas als gekoppelde acties zijn verplaatst';end if;
   foreach ref in array coalesce(item.people,'{}')||array[item.assignee_person_id,item.waiting_person_id] loop
    if ref is not null and (not exists(select 1 from public.sp_owners where owner_id=own and contacts_access) or not exists(select 1 from contacten.personen where id=ref)) then raise exception 'Persoon niet beschikbaar';end if;
   end loop;
   if cardinality(item.people)>100 then raise exception 'Maximaal 100 betrokken personen';end if;
   if item.kind='decision' and item.status='afgerond' and item.result not in ('goedgekeurd','afgewezen','teruggegeven') then raise exception 'Kies een geldig oordeel';end if;
   for d in select value from jsonb_array_elements(item.documents) loop
    if jsonb_typeof(d)<>'object' or length(coalesce(d->>'title',''))=0 or (d->>'url') is null or (d->>'url') !~ '^https?://[^/@[:space:]]+([/:?#]|$)' then raise exception 'Ongeldige documentverwijzing';end if;
   end loop;
   item.version:=coalesce(old.version,0)+1;item.created_at:=coalesce(old.created_at,now());item.updated_at:=now();item.completed_at:=case when item.status='afgerond' then coalesce(old.completed_at,now()) else null end;
   insert into public.sp_items select item.* on conflict(id) do update set
    workspace=excluded.workspace,title=excluded.title,description=excluded.description,status=excluded.status,priority=excluded.priority,project_id=excluded.project_id,
    assignee=excluded.assignee,assignee_person_id=excluded.assignee_person_id,waiting_person_id=excluded.waiting_person_id,due_on=excluded.due_on,follow_up_on=excluded.follow_up_on,
    source_url=excluded.source_url,source_ref=excluded.source_ref,result=excluded.result,execution_ref=excluded.execution_ref,next_step=excluded.next_step,
    people=excluded.people,notes=excluded.notes,documents=excluded.documents,version=excluded.version,updated_at=excluded.updated_at,completed_at=excluded.completed_at;
   answer:=to_jsonb(item);
   insert into public.sp_activity(owner_id,item_id,actor,action,summary) values(own,item.id,private.sp_actor(),p_operation,item.title||' · '||item.status||' · versie '||item.version);
 end if;
 update private.sp_commands set result=answer where owner_id=own and request_id=p_request_id;
 return answer;
end $$;
revoke all on function private.sp_command(text,text,jsonb,integer) from public,anon;
grant execute on function private.sp_command(text,text,jsonb,integer) to authenticated,service_role;
grant usage on schema private to authenticated,service_role;
create function public.sp_command(p_request_id text,p_operation text,p_payload jsonb,p_expected_version integer default null) returns jsonb language sql security invoker set search_path='' as $$select private.sp_command(p_request_id,p_operation,p_payload,p_expected_version)$$;
revoke all on function public.sp_command(text,text,jsonb,integer) from public,anon;
grant execute on function public.sp_command(text,text,jsonb,integer) to authenticated,service_role;

create function private.sp_snapshot(p_workspace text default null,p_since timestamptz default null) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare own uuid:=private.sp_owner();begin
 if p_workspace is not null and p_workspace not in ('setpiece','nankaro','fc-groningen','mv-artemis','prive') then raise exception 'Onbekend werkgebied';end if;
 return jsonb_build_object('items',coalesce((select jsonb_agg(to_jsonb(i) order by priority,due_on nulls last,created_at desc) from (select * from public.sp_items where owner_id=own and (p_workspace is null or workspace=p_workspace) and (p_since is null or updated_at>=p_since) order by priority,due_on nulls last,created_at desc limit 1000)i),'[]'::jsonb),
 'has_more',(select count(*)>1000 from public.sp_items where owner_id=own and (p_workspace is null or workspace=p_workspace) and (p_since is null or updated_at>=p_since)),
 'activity',coalesce((select jsonb_agg(to_jsonb(a)) from (select * from public.sp_activity where owner_id=own and (p_since is null or created_at>=p_since) order by id desc limit 100)a),'[]'::jsonb),
 'links',coalesce((select jsonb_agg(to_jsonb(l)) from public.sp_request_links l where owner_id=own),'[]'::jsonb),'checked_at',now());end $$;
revoke all on function private.sp_snapshot(text,timestamptz) from public,anon;
grant execute on function private.sp_snapshot(text,timestamptz) to authenticated,service_role;
create function public.sp_snapshot(p_workspace text default null,p_since timestamptz default null) returns jsonb language sql security invoker set search_path='' as $$select private.sp_snapshot(p_workspace,p_since)$$;
revoke all on function public.sp_snapshot(text,timestamptz) from public,anon;
grant execute on function public.sp_snapshot(text,timestamptz) to authenticated,service_role;

create function private.sp_people(p_query text default '',p_id uuid default null) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare own uuid:=private.sp_owner();begin
 if not exists(select 1 from public.sp_owners where owner_id=own and contacts_access) then raise exception 'Geen toegang tot personen' using errcode='42501';end if;
 return jsonb_build_object('people',coalesce((select jsonb_agg(to_jsonb(p)) from (select id,naam,roepnaam,rollen,functie,organisatie,email,telefoon,notitie,bron,laatste_contact,updated_at from contacten.personen where (p_id is null or id=p_id) and (p_query='' or naam ilike '%'||left(p_query,120)||'%' or organisatie ilike '%'||left(p_query,120)||'%') order by naam limit 50)p),'[]'::jsonb),
 'moments',case when p_id is null then '[]'::jsonb else coalesce((select jsonb_agg(to_jsonb(m)) from (select id,datum,kanaal,omschrijving from contacten.momenten where persoon_id=p_id order by datum desc limit 30)m),'[]'::jsonb) end);
end $$;
revoke all on function private.sp_people(text,uuid) from public,anon;
grant execute on function private.sp_people(text,uuid) to authenticated,service_role;
create function public.sp_people(p_query text default '',p_id uuid default null) returns jsonb language sql security invoker set search_path='' as $$select private.sp_people(p_query,p_id)$$;
revoke all on function public.sp_people(text,uuid) from public,anon;
grant execute on function public.sp_people(text,uuid) to authenticated,service_role;
commit;
