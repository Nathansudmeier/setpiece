<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Supabase migrations en Data API grants
- Elke migration staat in `supabase/migrations/` met exact de versie die Supabase toekent (zie `supabase_migrations.schema_migrations`).
- Sinds 30 okt 2026 krijgen nieuwe objecten in `public` geen automatische grants meer. Elke migration die een tabel, view, sequence of functie maakt doet in dezelfde migration: `enable row level security`, `revoke all ... from public, anon, authenticated` en een expliciete `grant` aan `service_role`, plus `authenticated` alleen waar de beheer-client het echt nodig heeft. Functies: `revoke all on function ... from public, anon` en `grant execute` aan wie het nodig heeft. Zonder grant geeft PostgREST 42501. Nieuwe tabellen en sequences in `public` krijgen standaard geen grants meer, dus grant expliciet; nieuwe functies zijn standaard nog uitvoerbaar door PUBLIC, dus elke functiemigration moet `revoke all on function ... from public, anon` (en `authenticated` waar die niet nodig is) en expliciet granten.
