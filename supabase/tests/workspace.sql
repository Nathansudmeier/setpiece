begin;
do $$
declare a jsonb;b jsonb; item_id uuid;
begin
 a:=public.sp_command('codex-test-create','task.create','{"title":"[CODEX TEST] regels","workspace":"setpiece"}',null);
 b:=public.sp_command('codex-test-create','task.create','{"title":"[CODEX TEST] regels","workspace":"setpiece"}',null);
 if a<>b then raise exception 'FAIL duplicate';end if;
 item_id:=(a->>'id')::uuid;
 begin perform public.sp_command('codex-test-create','task.create','{"title":"different","workspace":"setpiece"}',null);raise exception 'FAIL collision';exception when unique_violation then null;end;
 begin perform public.sp_command('codex-test-conflict','task.update',jsonb_build_object('id',item_id,'title','stale'),0);raise exception 'FAIL conflict';exception when sqlstate 'PT409' then null;end;
 begin perform public.sp_command('codex-test-proof','task.update',jsonb_build_object('id',item_id,'status','bezig'),1);raise exception 'FAIL proof';exception when check_violation then null;end;
 begin perform public.sp_command('codex-test-result','task.update',jsonb_build_object('id',item_id,'status','afgerond'),1);raise exception 'FAIL result';exception when check_violation then null;end;
 begin perform public.sp_command('codex-test-url','task.update',jsonb_build_object('id',item_id,'source_url','javascript:alert(1)'),1);raise exception 'FAIL url';exception when check_violation then null;end;
 a:=public.sp_command('codex-test-done','task.update',jsonb_build_object('id',item_id,'status','afgerond','result','Test gereed'),1);
 if a->>'version'<>'2' or a->>'completed_at' is null then raise exception 'FAIL complete';end if;
 if (select count(*) from public.sp_activity where sp_activity.item_id=(a->>'id')::uuid)<>2 then raise exception 'FAIL audit';end if;
end $$;
rollback;

-- Owner isolation, using only temporary identities in a rolled-back transaction.
begin;
insert into auth.users(id,email) values('00000000-0000-4000-8000-000000000020','codex-test-owner@example.invalid');
insert into public.admin_users(user_id) values('00000000-0000-4000-8000-000000000020');
insert into public.sp_owners(owner_id) values('00000000-0000-4000-8000-000000000020');
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000020","role":"authenticated"}',true);
set local role authenticated;
do $$begin
 if jsonb_array_length(public.sp_snapshot()->'items')<>0 then raise exception 'FAIL owner isolation';end if;
 if exists(select 1 from public.sp_items) then raise exception 'FAIL RLS isolation';end if;
 begin perform public.sp_people();raise exception 'FAIL contact isolation';exception when insufficient_privilege then null;end;
 begin perform public.sp_command('codex-test-other-owner','task.update','{"id":"1487e6dd-c00c-4c36-9ce3-77a5ead1bb01","title":"not allowed"}',1);raise exception 'FAIL cross-owner update';exception when insufficient_privilege then null;end;
end $$;
rollback;
