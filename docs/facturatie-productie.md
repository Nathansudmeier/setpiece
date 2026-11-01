# Finance in de bestaande Setpiece-omgeving

## Opdracht en grenzen

Op 1 november 2026 vroeg Nathan de finance-module in de bestaande Setpiece-database en backend te bouwen. Dit vervangt voor deze uitrol de eerdere keuze om voorlopig lokaal te blijven. De bestaande, lokaal geteste fase-1-module wordt gebruikt; geen nieuw abonnement, extra Supabase-project of uitbreiding naar bankimport/abonnementen/kwartaalrapportage.

Er zijn geen echte klantconcepten, definitieve facturen, betalingen, Gmail-concepten of berichten aangemaakt. De echte bedrijfsgegevens, Nes Ammim-gegevens en Gmail-ketenacceptatie blijven afzonderlijk open.

## Database: toegepast

Doel: uitsluitend Setpiece `rgtpeugwsxfqlyugfrbq`, eu-west-2. Nankaro is niet gewijzigd. Vooraf zijn ontbrekende facturatieobjecten, de bestaande commandfunctie, actuele migratiehistorie en rechten gecontroleerd.

De geteste SQL is via `apply_migration` transactioneel toegepast. De buitenste lokale `BEGIN`/`COMMIT`-regels zijn bij aanlevering weggelaten, zodat de Management API zowel DDL als migratiehistorie atomair beheert. Supabase kende versie **20261101131406** toe. De nieuwe, eerder niet op productie toegepaste migratie is daarom in Git hernoemd naar `20261101131406_setpiece_billing.sql`, conform AGENTS.md. De inhoud is ongewijzigd: SHA-256 `5003a9bdddb98bc18ffa962d715eab4b8b52b96563fd23d03c5deafe5eeb7b3c`. Geen bestaande migratiehistorie herschreven, reset, db push of repair uitgevoerd.

Vertrouwde deploymentconfiguratie: `private.sp_billing_deployment.base_url = https://www.setpiece.nl`. Deze configuratie is afzonderlijk via vertrouwde SQL gezet, niet uit requestheaders of een browserpayload.

Gecontroleerd na toepassing:

- Zeven publieke facturatietabellen en drie private hulptabellen hebben RLS; geen anon SELECT en geen authenticated INSERT. Publieke tabellen hebben expliciete service SELECT; private tabellen hebben geen directe API-grants.
- Private bucket `facturen`, uitsluitend PDF, maximaal 5 MiB, geen publieke toegang.
- Anon kan billing-read niet uitvoeren; authenticated kan de service-consumehelper niet uitvoeren.
- De actuele owner/admin kon onder de authenticated SQL-rol de lege facturatielijst en outbox lezen; nummerindicatie `F2026-0001`. Dit is een SQL-rolcontrole, geen browserloginacceptatie.
- Nul klanten, facturen en verzendopdrachten na installatie. Geen nummerreeks verbruikt.
- De bestaande commandfunctie is behouden als private delegate. De functiebodyhash bleef `eac07b1c6400e8f13a3d62c4853901fd`.
- De bestaande werktabelinhoud bleef gelijk: hash `a36de2d5b675924b99f5f9b09a692b01`; 566 personen en 18 CMS-documenten aanwezig.

Security-advisors: dezelfde drie bestaande waarschuwingen over de bewust publieke CMS-reader (anon/authenticated) en ontbrekende gelekte-wachtwoordcontrole. Toegevoegd zijn alleen drie informatieve meldingen voor RLS zonder policies op de bewust ontoegankelijke private hulptabellen; daar zijn geen clientgrants. Geen nieuwe publieke facturatiewaarschuwing. Bronnen: [RLS zonder policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy), [publieke definerfunctie](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [wachtwoordcontrole](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Appuitrol en acceptatie

De lokale releasecontrole op 1 november 2026: `npm run verify` (lint, 34 tests, productiebuild) en `npm run typecheck` geslaagd. De eerdere geïsoleerde 44 SQL- en 9 PDF/hersteltests blijven in [facturatie.md](facturatie.md) beschreven. De financiële mutatietests worden niet opnieuw op productie uitgevoerd, ook niet in rollback.

Push/PR, deployment-ID, commit en werkelijke appacceptatie worden na uitvoering hieronder geregistreerd. Een geslaagde database-installatie is nog geen bewijs dat de nieuwe beheerschermen live staan.

## Herstel

Bij een appregressie terug naar de vorige werkende Vercel-deployment `dpl_J2v7Wiz4Z3J8aLxVKo898y1ZBVDA` (basis `0ef4dd1`). De bestaande publieke app werkt met de toegevoegde tabellen. Geen DROP/DELETE-rollback op financiële gegevens. Eventuele databasecorrectie via een nieuwe gecontroleerde migratie; originele regels, nummers en audit behouden.
