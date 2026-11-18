-- Explicit Data API grants (Supabase 30 Oct 2026 default change).
-- service_role: server-side contact form insert, export and maintenance.
grant select, insert, update, delete on
  public.sp_owners, public.sp_items, public.sp_activity, public.sp_request_links,
  public.sp_cms_documents, public.sp_cms_revisions,
  public.contact_submissions, public.admin_users
to service_role;
grant usage, select on sequence public.sp_activity_id_seq to service_role;

-- anon never reads these tables directly (contact form goes via the server with service_role).
revoke all on public.contact_submissions, public.admin_users from public, anon;

-- authenticated keeps only SELECT + UPDATE(status, read_at, notes) on contact_submissions
-- and SELECT on admin_users.
revoke insert, delete, truncate, references, trigger on public.contact_submissions from authenticated;
revoke insert, update, delete, truncate, references, trigger on public.admin_users from authenticated;
