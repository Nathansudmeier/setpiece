-- New objects created by postgres in public no longer get automatic Data API grants.
-- Every migration must grant explicitly (see AGENTS.md).
-- No global 'revoke execute on functions from public': that would also affect the contacten schema.
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated, service_role;
alter default privileges for role postgres in schema public revoke execute on functions from anon, authenticated, service_role;
