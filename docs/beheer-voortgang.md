# Setpiece beheer — voortgang

Plan: docs/superpowers/plans/2026-10-20-beheer.md
Spec: docs/superpowers/specs/2026-10-20-beheer-design.md
Branch: codex/setpiece-beheer. Basis: 606db21 (spec/plan).

## Onderzoek
- Bestaande repo schoon; aparte featurebranch in expliciet aangewezen checkout.
- Systeem-git vraagt Xcode-licentie. Bundled fallback-git werkt; geen licentie geaccepteerd.
- Supabase MCP herauth vereist; CLI Management API werkt op Setpiece. Personenbron in contacten-schema gevonden, 566 personen. Geen volledige export gelezen.
- Vercel-project/id bevestigd. Supabase rgtpeugwsxfqlyugfrbq; Nankaro ongemoeid.
- Grok Bot/Jarvis actief bereikbaar. Read-only verificatie gevraagd via zijn bestaande gesprek; resultaat volgt.
- Baseline npm test: 7/7 geslaagd.
- Uitvoering native volgens executing-plans; user gaf vooraf akkoord voor alle fasen. Geen extra worktree nodig in schone aangewezen checkout met featurebranch.

## Acceptatie
Nog niet uitgevoerd. Geen productieclaim. Taak 1 gestart.

## Implementatie en controles (20 oktober)
- Beide additieve migraties toegepast en afzonderlijk als applied geregistreerd. Basistabellen/personen niet overschreven.
- Unitregels: 14/14. Lint groen. Eerste productiebuild groen. Typecheck had tijdelijk dubbele gegenereerde .next-types tijdens dev/build; laatste build heeft de gegenereerde types hersteld, aparte typecheck wordt opnieuw uitgevoerd.
- Live SQL: dedupe, botsende request-id, versieconflict, bewijs/resultaat/URL-regels, audit; eigenaarisolatie met een tijdelijke tweede admin/eigenaar (rollback); CMS-conceptisolatie/publicatie/herstel (rollback).
- REST: anonieme private RPC/tabeltoegang geweigerd; ingelogd tijdelijk account zonder rechten geweigerd en daarna verwijderd; publieke lezer krijgt uitsluitend publicatie.
- Echte browser: project en actie aanmaken/opslaan/verversen; gekoppeld project/werkgebied; afronden/heropenen/uitstellen/overdragen; beslissing met oordeel; bestaande personen/context; alle overzichten; export; 390/768/1024/1440 zonder pagina-overloop. CMS-concept in private preview, afwezig in publieke HTML/API; publicatie van exact oorspronkelijke inhoud geeft nieuwe openbare revisie; vorige versie als concept teruggezet. Anonieme preview leidt naar login.
- Browser gevonden/hersteld: toegankelijke namen van ingevulde tekstvelden/selects en revalidatie van bestaande beheer-layout bij CMS-save.
- Grok/Jarvis heeft zelf via bestaande connector testactie 1487e6dd-c00c-4c36-9ce3-77a5ead1bb01 aangemaakt, herhaald en dezelfde id teruggelezen. App heeft de notitie gewijzigd en persistentie bewezen. Jarvis gevraagd om teruglezen en afronden; eindcontrole volgt.
- Native git push mist credentials; GitHub Desktop heeft bestaande accounttoegang en Setpiece correct geselecteerd. Vercel connector project/deploymentmetadata werkt, environment-list krijgt 403; CLI heeft geen login. Er zijn geen nieuwe environment-variabelen nodig voor de nieuwe RPC-appfuncties. Bestaande Vercel-configuratie blijft uitgangspunt.
- Onafhankelijke code-review gestart volgens executing-plans; bevindingen worden voor publicatie verwerkt.

## Onafhankelijke review en herstel
- Review: geen kritieke lekken; twee belangrijke bevindingen: race bij de eerste aanvraagkoppeling en onbereikbaar werk na 1000 snapshotregels.
- Herstel aanvraagkoppeling: additieve functiecorrectie `20261020111321_setpiece_link_serialization.sql` vergrendelt eerst de bestaande aanvraagrij; daarna linkversie/eigenaar controleren. Eerste koppelingen worden zo ook geserialiseerd.
- Herstel ophalen: app haalt eigen werk/relaties in begrensde pagina's volledig op; detail gebruikt directe eigenaargebonden lookup. Regressietest met 1001 rijen RED→GREEN. De begrensde botsnapshot blijft expliciet has_more melden.
- Oordeel over kleinere reviewbevinding: onterecht label botwerk schaadt herleidbaarheid; daarom als inhoudelijke acceptatiecorrectie hernoemd naar Recent afgerond werk met toegewezen verantwoordelijke. Kosten: geen automatische bevestiging van botidentiteit; actor blijft apart zichtbaar.
- Gelijktijdigheidstest reproduceerde een PostgREST-14 retrylus op toepassingscode 40001. Actuele Supabase-documentatie bevestigt de oorzaak (high-cpu-and-infinite-transaction-retries-when-using-custom-error-codes-in-rpc-functions). Corrigerende migratie `20261020111609_setpiece_conflict_responses.sql` gebruikt PT409 voor zakelijke versieconflicten. De vastgelopen testbackends zijn op exacte PID/rol/app geïdentificeerd en beëindigd; API-herstel en concurrentietests worden opnieuw gecontroleerd.
- Reviewer heeft deployment, live Grok-eindcontrole, definitieve documentatie en live rechten niet zelfstandig beoordeeld. Deze controles blijven mijn verantwoordelijkheid en blokkeren afronding tot geverifieerd. Postgres/service_role-bypass is bewust gedocumenteerd, geen botisolatieclaim.

## Gereed voor preview
- Laatste lint, typecheck en 15 unit-/regressietests groen; productiebuild groen.
- PT409 API-regressie: parallelle dedupe één UUID; parallelle updates één succes en één HTTP 409; twee acties met dezelfde bron blijven afzonderlijk. Eerste aanvraagkoppeling parallel: één succes/één conflict.
- 1001 herkenbare tijdelijke archiefrijen toegevoegd voor grenscontrole. Browser opent een UUID die de botsnapshot niet bevat; app-overzichten blijven volledig door pagina-ophaling. Exacte fixture-UUID's in tijdelijk acceptatiemanifest, worden na productiecontrole gericht opgeruimd.
- Laatste browser op productiebuild: echte Jarvis-afronding versie 5/resultaat/actorhistorie bevestigd; ingevulde/foutieve formulieren gecontroleerd; aanvraagdetail/koppeling werkt; preview heeft één main, echt uitgeschakeld contactformulier en private no-store; screenshots na geladen kop op 390/768/1024/1440 gecontroleerd; geen pageerror/console-error.
- Echte Grok-test geslaagd: Jarvis las appnotitie exact terug bij versie 4, rondde via sp_command af naar versie 5 en controleerde resultaat/5 auditregels; daarna dezelfde gegevens in ingelogde app gecontroleerd. Geen klantbericht/publicatie of andere projectwijziging via deze test uitgevoerd.
- Advisor: geen ERROR. Bewust publieke read-only publicatie-RPC wordt als SECURITY DEFINER-waarschuwing gemeld; dit is de gecontroleerde openbare leesmogelijkheid. Bestaande waarschuwing over wachtwoordlekcontrole ongewijzigd.
- Voor preview moeten commit/push/deployment en hostgebonden ingelogde controles nog worden uitgevoerd. Productie is nog niet bijgewerkt.

## Previewacceptatie
- Commit `7001ece4bfa4a27ca4666933168b30e170e037fd` gepusht via bestaande GitHub Desktop-sessie.
- Preview `dpl_FGNcMmmuCpME5rnLtZt8zu4nQiuz`: READY, https://setpiece-6tt4jn2ma-setpiece-s-projects.vercel.app.
- Vercel-beveiliging bereikt met tijdelijk previewgebonden share-token; daarna afzonderlijk echte appauth getest. Acht publieke routes gecontroleerd, anonieme beheerredirect, echte Jarvis-afronding in ingelogde app, actie via Vercel aangemaakt/opgeslagen/ververst/afgerond, CMS-preview/noindex, vier viewportbreedtes en foutvrije console.
- Kleine laatste correctie: export sorteert ook items op unieke ID zodat gelijke aanmaaktijden de paginering niet onbepaald maken. Formulieracceptatie met bestaande Turnstile loopt nog.

## Actuele productie-inhoud behouden
- Laatste live vergelijking vond dat de lokale startcheckout ouder was dan de actieve main/deployment. Eerst main d02ecfc geïntegreerd, inclusief diensten, AI-geletterdheid, kennis, lokale font en actuele formulier-/SEO-logica. Geen productie-uitrol van de oude inventaris.
- CMS uitgebreid naar 17 huidige inhoudspagina's plus gedeelde navigatie/diensten/kennis/contact. Productie-inhoud overgenomen, zonder nieuwe commerciële claims of bedragen. Alle 22 gecontroleerde URL-varianten komen qua tekst, links, relevante metadata en formuliervelden overeen met het vooraf bewaarde productiesnapshot. Turnstile's tijdelijke widget-DOM is buiten deze inhoudsvergelijking gehouden.
- Migraties 20261020114248 en 20261020114451 bewaren de historie en stoppen bij onverwacht gewijzigde concept/publicatie. Oude veldindelingen blijven als naslag bewaard; alleen passende revisies kunnen via de editor worden teruggezet.
- Lint, typecheck, 16 tests en productiebuild groen. Cloudflare blokkeert de automatische formuliercontrole met 300030, ook op de bestaande productie. Geen testbypass of versoepeling toegevoegd; één echte formulierhandeling aan Nathan gevraagd terwijl onafhankelijke acceptatie doorgaat.
- Jarvis bevestigt via Grok dat hij beide instructiebestanden op GitHub (7001ece) heeft gelezen. UI toont daadwerkelijk bijgewerkte routines Ochtendoverzicht en Avondoverzicht; beginnen met sp_snapshot, has_more-afhandeling, bronfouten en testitems overslaan. Frequentie/bestemming ongewijzigd; geen nieuwe routine.

## Productieacceptatie
- Nieuwe preview c3dbfc4 / dpl_BZZwAPoMZgUZLCgC8HvySfMcDki8 READY. Ingelogde serveracties, Jarvis-data, CMS-conceptisolatie/publicatie/herstel en vier breedtes geslaagd. Alle 22 publieke URL-varianten behouden inhoud, links, SEO en formuliervelden; alleen de verwachte Vercel-previewhost voor automatische OG-afbeeldingen is genormaliseerd.
- Productie c3dbfc4 / dpl_88ytG6Jj4t9quRUN5rvDudm7891Z READY, www.setpiece.nl. Echte eigenaarssessie: project + gekoppelde actie aangemaakt, aparte deadline/opvolgdatum en toewijzing bewaard, ververst en afgerond. Jarvis-test versie 5/resultaat/audit aanwezig. Eigen export, alle beheerroutes, besloten CMS/no-store/noindex, uitgeschakeld previewformulier, 390/768/1024/1440 en anonieme afscherming geslaagd. Publieke vergelijking op productie: 0 verschillen voor 22 URL-varianten.
- Laatste datumregressie gereproduceerd met UTC-browser rond wintertijd: oude morgenberekening bleef op dezelfde Amsterdamse kalenderdag. Kleine correctie gebruikt eerst de Amsterdamse kalenderdatum en telt daarna één kalenderdag. RED→GREEN, inclusief jaarwisseling; 17 tests, lint en build groen. Deze correctie doorloopt nog preview en productie.
- Externe formuliercontrole blijft apart: bestaande Cloudflare controle blokkeert browserautomatisering (300030). Herkenbare testaanvraag staat in Chrome klaar voor een echte handeling van Nathan; de serverbeveiliging is behouden.
- Laatste opdrachtnacontrole: de app stond in het verantwoordelijkeveld alleen bekende bots/Nathan toe, terwijl de server ook personen ondersteunt. Veld accepteert nu een naam met bestaande bots als suggesties; de afzonderlijke UUID-koppeling naar de bestaande persoon blijft expliciet. Geen automatische herkenning of samenvoeging.
- Browsercontrole op productiebuild: vrije verantwoordelijke blijft na verversen bewaard. Met UTC-browser en klok op 24 oktober 22:30 UTC bewaart Morgen opvolgen 26 oktober; de echte deadline blijft 23 oktober. Lint/build/typecheck na opschonen van identieke gegenereerde typekopieën geslaagd.
