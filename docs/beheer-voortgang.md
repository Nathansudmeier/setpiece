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
