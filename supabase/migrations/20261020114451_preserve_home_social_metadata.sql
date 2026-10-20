-- Match the existing homepage's distinct browser/social title ordering.
begin;
do $guard$ begin
 if not exists(select 1 from public.sp_cms_documents where slug='home' and draft->>'seo_og_title'='Setpiece | AI Consultancy voor beter dagelijks werk' and draft->>'seo_twitter_title'='Setpiece | AI Consultancy voor beter dagelijks werk') then
  raise exception 'Controleer gewijzigde homepage-metadata vóór de migratie';
 end if;
end $guard$;
update public.sp_cms_documents set draft=draft||jsonb_build_object('seo_og_title','AI Consultancy voor beter dagelijks werk | Setpiece','seo_twitter_title','AI Consultancy voor beter dagelijks werk | Setpiece'),version=version+1,updated_at=now() where slug='home';
with revision as(insert into public.sp_cms_revisions(slug,owner_id,content,actor,action) select slug,owner_id,draft,'migratie:productie-d02ecfc','Bestaande sociale metadata behouden' from public.sp_cms_documents where slug='home' returning id)
update public.sp_cms_documents set published_id=(select id from revision),published_at=now() where slug='home';
commit;
