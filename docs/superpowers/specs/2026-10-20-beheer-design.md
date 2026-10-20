# Setpiece besloten werkomgeving

## Doel en autorisatie
Nathan overziet en organiseert zijn werk en stuurt Jarvis aan via dezelfde actuele gegevens. De opdracht in de aangeleverde briefing geeft vooraf akkoord voor specificatie, plan, implementatie, niet-destructieve migraties, preview en gecontroleerde productie-uitrol. Er volgt geen nieuwe fasegoedkeuring. Alleen Setpiece wordt gewijzigd.

## Actuele uitgangssituatie
Next 16.2.11 / React 19.2.7, Supabase rgtpeugwsxfqlyugfrbq, Vercel prj_QSGIkNoHnne5CZM1cfiQlnbCGMTC. Bestaande admin 675024a7-62f2-4eac-ba25-9718bb362e74. Personenbron: contacten.personen (566 UUID's), contacten.momenten. Bestaande aanvragen en login blijven behouden. README beschrijft een oude visuele richting; DESIGN.md en workspoor.css zijn actueel. Supabase MCP heeft herauthenticatie nodig; de geauthenticeerde CLI Management API werkt.

## Keuze
Bestaande Next-app uitbreiden, geen nieuwe backend/MCP of chat. Supabase-tabellen met eigenaar, werkgebied, versie en audit; transactionele RPC voor wijzigingen en idempotentie. Alternatieven: directe botwrites missen conflictcontrole; een aparte integratieserver voegt onnodige infrastructuur toe. Bestaande personen worden gelezen via gecontroleerde RPC, nooit gekopieerd of automatisch samengevoegd.

## Gegevens en toegang
Vijf vaste werkgebieden: setpiece, nankaro, fc-groningen, mv-artemis, prive. Eigenaar is expliciet en vereist een actuele admin-registratie. Werkgebieden zijn geen tenants; RLS controleert eigenaar op iedere rij. Geen uitnodigingen/registratie. Tabellen krijgen geen publieke schrijfrechten; geverifieerde RPC controleert eigenaar en context, valideert verwijzingen, status, URL en verwachte versie, schrijft audit in dezelfde transactie. Betrouwbare actor komt uit auth.uid()/database-rol. Een botnaam is slechts verantwoordelijke. De bestaande beheerconnector met postgres/service_role kan RLS omzeilen en vormt geen grens tussen bots; dit wordt zichtbaar gedocumenteerd.

Projecten: naam, resultaat, context, verantwoordelijke persoon of bot, status, prioriteit, volgende stap, einddatum, betrokken personen, notities/documentverwijzingen, versie/tijden. Acties: titel, toelichting, optioneel project, context, verantwoordelijke, status, prioriteit, deadline (datum), opvolgdatum (datum), wachtpersoon, bron, resultaat, uitvoeringsbewijs, versie/tijden. Statussen: open, bezig, wachten, beslissing, afgerond, gearchiveerd. Bezig vereist uitvoeringsbewijs. Afronden vereist resultaat. Heropenen bewaart de historie. Beslissingen bewaren voorstel, bron, terugkoppeling en oordeel; goedkeuring activeert geen niet-geïmplementeerde externe actie. Aanvragen krijgen expliciete relaties zonder nieuwe contacten.

Wijzigingsverzoeken hebben een unieke request-id per afzonderlijke handeling. Herhaling met dezelfde payload retourneert hetzelfde resultaat; afwijkende payload wordt geweigerd. Updates vereisen een versienummer. Datum en tijdstip blijven gescheiden. Activiteit toont wie, wat, wanneer, resultaat en geverifieerde actor. Export is uitsluitend ingelogd en bevat eigen projecten/acties/relaties.

## Gebruikerservaring
Werkspoor: Space Grotesk, Paper/Ink, scherpe lijnen, één Rose-hoofdactie. Navigatie Vandaag / Projecten / Acties / Personen / Aanvragen / Beslissingen / Activiteit / Website. Lijsten, tekstuele status en zoek-/contextfilters. Vandaag groepeert echte deadlines, opvolging, beslissingen en recent botresultaat; geen verzonnen statistiek. Formulieren met labels, fout-/pendingstatus, herstel en versieconflict. Responsive op 390/768/1024/1440; toetsenbordfocus en skiplink.

## CMS
Vaste getypeerde velden voor alle zeventien huidige Werkspoor-inhoudspagina’s (aangescherpt na vergelijking met productie/main d02ecfc), bestaande secties, gedeelde diensten/bewijs/FAQ/CTA/contact en SEO. Bestaande inhoud wordt exact vastgelegd als eerste gepubliceerde versie. Geen vrije HTML of pagebuilder. Concept/revisies en gepubliceerde pointer zijn apart. Publieke lezer ontvangt uitsluitend gepubliceerde inhoud, nooit concepttabellen. Preview onder /beheer is per request geautoriseerd, noindex en no-store; rendert dezelfde componenten. Publicatie en herstel zijn expliciete menselijke handelingen met versiecontrole en audit. Herstel maakt een nieuwe versie op basis van de gekozen vorige inhoud. Bestaande media blijven behouden. Geen upload nodig. Publieke formulieren en beveiliging blijven functioneren.

## Verificatie en uitrol
Unitregels en live transactionele SQL-tests voor onbevoegde rollen/eigenaar, idempotentie, conflict, verwijzingen en CMS. Lint/typecheck/tests/build. Echte ingelogde browserflows inclusief persistence, project/actie, beslissing, aanvraagkoppeling, CMS preview/publicatie/herstel en responsiviteit. Jarvis-pad: testactie aanmaken, in app wijzigen, teruglezen, afronden met resultaat, audit controleren. Codex/Supabase is afzonderlijk bewijs van een werkelijke Grok-test. Preview voor productie; geen nieuwe commerciële tekst publiceren. Migraties additief, oude public site blijft compatibel. Herstel: vorige Vercel-deployment en vorige CMS-publicatie; nieuwe tabellen behouden, geen destructieve rollback.

## Zelfcontrole
Alle briefingonderdelen hebben een plek. Externe botactivering blijft alleen geïmplementeerd als de bestaande Grok-toegang dit werkelijk ondersteunt. Ontbrekende login of bottoegang wordt precies gevraagd; onafhankelijke bouw gaat door. Het doel blijft actief tot productie en vereiste controles aantoonbaar werken.
