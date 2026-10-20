begin;
create or replace function private.sp_command(p_request_id text,p_operation text,p_payload jsonb,p_expected_version integer default null) returns jsonb
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
   -- The existing submission is the serialization point even before a link exists.
   perform id from public.contact_submissions where id=(p_payload->>'submission_id')::uuid for update;
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

commit;
