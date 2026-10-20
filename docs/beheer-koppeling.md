# Setpiece beheer — technische koppeling en herstel

## Omgeving en contract

Repository: Setpiece. Supabase `rgtpeugwsxfqlyugfrbq` (eu-west-2), Vercel-project `prj_QSGIkNoHnne5CZM1cfiQlnbCGMTC`, team `team_XtDmGi2QFreHXEQrgvnSncXG`. Bestaande productie: https://www.setpiece.nl. Geen DNS of Nankaro-code/data gewijzigd.

Zie [Jarvis-instructie](jarvis-instructie.md) voor het volledige geïmplementeerde SQL-contract. Er is geen extra MCP-server of AI-chat toegevoegd. De app gebruikt de sessieclient en RPC; geheimen blijven server-side. De publieke CMS-reader gebruikt uitsluitend de public key en de specifieke publicatie-RPC.

`sp_owners` registreert de eigenaar en toegang tot de bestaande contactenbron. `sp_items` bevat werk; `sp_request_links` relaties met bestaande aanvragen; `sp_activity` onveranderbare audit via de commandfuncties. `private.sp_commands` bewaart idempotentieresultaten. Normale gebruikers hebben geen directe schrijfrechten. RLS op alle nieuwe publieke tabellen vereist eigenaarschap en actuele adminregistratie. Privéfuncties hebben een leeg search_path, expliciete rechten en geverifieerde eigenaarcontrole. De publieke wrappers zijn security invoker. De enige bewust publieke security-definer is de begrensde read-only `sp_public_content`, die uitsluitend de geselecteerde gepubliceerde revisie retourneert.

De bestaande Jarvis Management-connector werkt als postgres met bypassrls. Ook een service_role heeft brede serverrechten. Deze verbindingen kunnen controles en audit omzeilen door direct SQL te schrijven. Botverantwoordelijken zijn geen authenticatie-identiteiten. Technische botisolatie vereist later afzonderlijk uitgegeven, beperkte toegang; die wordt hier niet geclaimd. De app zelf heeft geen service_role nodig voor de nieuwe werkfuncties.

## CMS

`lib/cms/schema.ts` beschrijft zeven vaste documenten: zes hoofdroutes en gedeelde inhoud. Bestaande structuur, vormgeving, media en routes zijn behouden. Er is geen vrije HTML. `sp_cms_documents` bewaart het concept, veldschema, werkversie en publicatiepointer. `sp_cms_revisions` bewaart revisies. De publieke lezer kan geen concepten lezen. Metadata haalt dezelfde gepubliceerde inhoud op.

De preview staat uitsluitend onder `/beheer/website/[slug]/preview`, controleert per request de sessie/eigenaar en heeft noindex/private caching. Het is geen openbare preview-URL met een deelbaar geheim. Formulierverzending is daar uitgeschakeld. Publiceren vereist een eigenaarsessie, versiecontrole, expliciete handeling en audit; de Next-serveractie herbevestigt de betreffende routes. Shared-publicatie ververst alle publieke pagina's. Herstel maakt een nieuw concept van een gekozen revisie; expliciet publiceren zet dit openbaar.

Bij een onbereikbare publieke database gebruikt de website de exact overgenomen oorspronkelijke inhoud als beperkte beschikbaarheidsfallback. De beheeromgeving meldt leesfouten en toont geen verzonnen lege data. Alle publieke reads gebruiken no-store; conceptdata komt niet in de gedeelde publieke cache. Bestaande intake/contact/Turnstile/Resend-grenzen zijn behouden.

## Migraties en volgorde

1. `20261020104625_setpiece_workspace.sql`: additieve eigenaar-/werktabellen, RLS, command-/snapshot-/personenfuncties en audit. Verwijst naar bestaande personen-UUID's en aanvragen; wijzigt ze niet.
2. `20261020105347_setpiece_cms.sql`: additieve CMS-tabellen/functies en exact overgenomen eerste gepubliceerde inhoud.

Beide SQL-bestanden zijn via de geauthenticeerde CLI Management API op Setpiece uitgevoerd, daarna afzonderlijk in de migratiehistorie geregistreerd. De bestaande oudere app blijft ermee werken. Schema eerst, daarna preview, acceptatie, dan productie. Er zijn oudere remote migraties die niet in deze checkout staan; voer daarom geen ongerichte db push/reset uit. Pas uitsluitend de gecontroleerde nieuwe migratie toe en controleer de geschiedenis.

## Herstel

- App: herstel de vorige werkende Vercel-productiedeployment of deploy de vorige Git-commit. De nieuwe tabellen mogen blijven bestaan; de vorige publieke app en het postvak werken zonder ze.
- Inhoud: kies de vorige CMS-revisie, zet die als concept terug, controleer de private preview en publiceer expliciet. Dit bewaart de historie.
- Database: geen automatische DROP/DELETE-rollback op werkelijke data. Bij fouten corrigerende additieve migratie; exporteer eerst het getroffen eigen werk. Gebruik geen reset op deze gedeelde bestaande database.
- Export: `/beheer/export` downloadt eigen werk, aanvraagrelaties en activiteiten als JSON, in begrensde pagina's opgehaald. Personen blijven in de bestaande bron en worden niet als tweede contactenbestand geëxporteerd.
- Tijdelijke acceptatiegegevens dragen `[CODEX TEST 20261020]` of `[TEST JARVIS 20261020]`. Ruim uitsluitend de vastgelegde test-UUID's op na controles, inclusief hun testrelaties/audit/idempotentieresultaten. Raak echte aanvragen/personen niet aan.

## Verificatie

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Betekenisvolle unitregels in tests/workspace.test.mjs en tests/cms.test.mjs. Live transactionele tests: `supabase db query --linked --file supabase/tests/workspace.sql` en `supabase/tests/cms.sql`; testwijzigingen worden teruggedraaid. Browseracceptatie gebruikt een echte Supabase-eigenaarsessie en daadwerkelijke serveracties/opslag, niet alleen een loginredirect. De huidige voortgang en concrete productiestatus staan in [voortgang](beheer-voortgang.md).

Aanvullende herstelmigraties: `20261020111321_setpiece_link_serialization.sql` serialiseert eerste aanvraagkoppelingen op de bestaande aanvraagrij. `20261020111609_setpiece_conflict_responses.sql` gebruikt `PT409`/HTTP 409 voor zakelijke versieconflicten. SQLSTATE 40001 mag hiervoor niet terugkomen: PostgREST 14 kan daarop oneindig retryen. Bij daadwerkelijke platformretries identificeer de betrokken test-RPC-backends, beëindig uitsluitend die verbindingen en herlaad de schema-cache. De bij deze tests vastgelopen verbindingen zijn hersteld en de API-concurrentietest geeft nu één succes en één HTTP 409.

De app haalt eigen werk en relaties in pagina's van 200 volledig op, met een stabiele ID-sortering; detailopvragingen gebruiken bovendien rechtstreeks de eigenaar en UUID. De 1000-regellimiet geldt voor de afzonderlijke botsnapshot, niet voor de beheerapp. Voor live API-regressies is `scripts/verify-workspace-api.mjs` beschikbaar met een eigenaars-testtoken en een vooraf aangemaakte herkenbare nieuwe testaanvraag. Het script schrijft alleen nieuwe herkenbare testacties en koppelt die testaanvraag; het schrijft een manifest met exact op te ruimen UUID's. Geef secrets alleen via een beveiligd lokaal env-bestand, nooit als argument of commit.
