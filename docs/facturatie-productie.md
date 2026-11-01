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

Uitgerold via [PR #6](https://github.com/Nathansudmeier/setpiece/pull/6), CI `verify` en Vercel-build geslaagd. PR gemerged als **a5b671f9036bd2ac244f5530b719a9fefc789dee**. Vercel-productiedeployment **dpl_FCFUwcwCvmzNMziS9ee4wViDPVV8**, READY, toegewezen aan `www.setpiece.nl`. De previewbuild was een gewone build op de bestaande configuratie; geen geïsoleerde cloudpreviewacceptatie geclaimd.

Live gecontroleerd met de bestaande echte Chrome-eigenaarsessie:

- Bestaand Vandaag-scherm bleef bruikbaar na de databasemigratie en kreeg na deployment de nieuwe navigatielink Facturen.
- Facturenlijst geladen met nul documenten en beginactie voor bedrijfsgegevens.
- Instellingen met afzonderlijke secties, klanten met de bestaande project-/personenkeuze en de nieuwe factuureditor geladen. Niets opgeslagen; ontbrekende echte gegevens blijven leeg.
- Beveiligde archiefexport gedownload en als ZIP geopend; leeg manifest met nul documenten bevestigd.
- Productievariabelen `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL` en `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` zijn in de Vercel-interface op aanwezigheid en environment-scope gecontroleerd. Geen waarde onthuld of gewijzigd. Dit bevestigt configuratie-aanwezigheid, geen afzonderlijke live PDF-uploadtest.
- Anonieme verzoeken naar lijst, klanten, instellingen en export worden naar login gestuurd. GET/HEAD zonder token op de PDF-route geven 404 en no-referrer.
- Alle 18 sitemap-pagina's geven 200 en dezelfde publieke tekst als vóór de appuitrol; scripts, styles en HTML-markup zijn bij deze tekstvergelijking buiten beschouwing gelaten.
- Geen error/fatal-resultaten in de opgevraagde runtime-logperiode van deze deployment. Dit is een beperkte controle, geen algemene foutvrijgarantie.

Na deze controles nog steeds nul instellingen, klanten, facturen, betalingen, dispatches, auditregels, PDF-objecten en tellerregels. Geen nummer verbruikt. [Controle-uitkomsten](acceptatie/facturatie/productie-controles.json) en [live screenshot](acceptatie/facturatie/live-lijst.png).

Niet op productie uitgevoerd: een financiële mutatie, definitief maken, volledige PDF-upload/herstelketen, credit/betaling of Gmail-actie. Die logica is geïsoleerd getest; het eerste echte gebruik vereist de bevestigde bedrijfs- en klantgegevens. De Gmail-ketentest vraagt apart akkoord en een bevestigd testadres.

## Herstel

Bij een appregressie terug naar de vorige werkende Vercel-deployment `dpl_J2v7Wiz4Z3J8aLxVKo898y1ZBVDA` (basis `0ef4dd1`). De bestaande publieke app werkt met de toegevoegde tabellen. Geen DROP/DELETE-rollback op financiële gegevens. Eventuele databasecorrectie via een nieuwe gecontroleerde migratie; originele regels, nummers en audit behouden.
