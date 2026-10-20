begin;
select set_config('request.jwt.claims','{"sub":"675024a7-62f2-4eac-ba25-9718bb362e74","role":"authenticated"}',true);
do $$
declare before_public jsonb;doc jsonb;draft jsonb;a jsonb;old_revision uuid;
begin
 before_public:=public.sp_public_content('home');doc:=public.sp_cms_admin('home');old_revision:=(before_public->>'revision')::uuid;
 draft:=(doc->'draft')||'{"seo_title":"[CODEX TEST] besloten concept"}'::jsonb;
 a:=public.sp_cms_command('codex-cms-test-save','home','save',draft,(doc->>'version')::integer,null);
 if public.sp_public_content('home')<>before_public then raise exception 'FAIL draft leak';end if;
 begin perform public.sp_cms_command('codex-cms-test-stale','home','save',draft,(doc->>'version')::integer,null);raise exception 'FAIL stale CMS';exception when sqlstate 'PT409' then null;end;
 a:=public.sp_cms_command('codex-cms-test-publish','home','publish',null,(a->>'version')::integer,null);
 if public.sp_public_content('home')->'content'->>'seo_title'<>'[CODEX TEST] besloten concept' then raise exception 'FAIL publish';end if;
 a:=public.sp_cms_command('codex-cms-test-restore','home','restore',null,(a->>'version')::integer,old_revision);
 if public.sp_cms_admin('home')->'draft'<>before_public->'content' then raise exception 'FAIL restore draft';end if;
 a:=public.sp_cms_command('codex-cms-test-republish','home','publish',null,(a->>'version')::integer,null);
 if public.sp_public_content('home')->'content'<>before_public->'content' then raise exception 'FAIL restored public';end if;
end $$;
rollback;
