# Vindbaarheid en publicatie

De publieke site heeft per 2026-09-25 aparte bestemmingen voor de bestaande diensten en een kennisoverzicht. De bedrijfsbronbestanden blijven leidend voor aanbod en prijzen. Het volledige auditrapport staat in de Setpiece-bedrijfsmap: `05_Marketing/seo-audit-2026-09-25.md`.

## Onderhoud bij een inhoudelijke wijziging

Eigenaar: Nathan of de aangewezen websitebeheerder. Uitvoeren vóór en direct na publicatie.

1. Controleer aanbod, prijs, onderbouwing en auteur. Een nieuw resultaatcijfer vraagt bewijs en toestemming.
2. Geef de pagina een unieke titel, beschrijving, één hoofdkop en een canoniek adres via `createPageMetadata`. Verbind haar met relevante diensten en kennis.
3. Gebruik de gedeelde `ORGANIZATION_ID` en `PERSON_ID`. Gestructureerde gegevens moeten overeenkomen met zichtbare inhoud. Voeg geen verzonnen beoordelingen of vestigingsadres toe.
4. Werk `app/sitemap.ts` bij. Zet een wijzigingsdatum alleen als de inhoud daadwerkelijk is gewijzigd. Aanvraag- en beheerpagina's horen niet in de sitemap.
5. Voer `npm run verify` uit en controleer desktop, mobiel, links en de passende formuliercontext in een preview.
6. Controleer productie na publicatie. Meld alleen gewijzigde publieke adressen bij IndexNow, bijvoorbeeld `node scripts/submit-indexnow.mjs /diensten /ai-implementatie`. Op deze Windows-installatie gebruikt Node de systeemcertificaten via `NODE_OPTIONS=--use-system-ca`.
7. Controleer sitemap en indexstatus in Google Search Console. IndexNow meldt aan deelnemende zoekdiensten, niet aan Google. Een ontvangstbevestiging is geen indexeringsbewijs.

## Meten

Nathan beoordeelt op 2026-10-25 indexstatus, klikken, vertoningen, relevante zoekvragen, aanvragen en opdrachten. Vergelijk met de vastgelegde nulmeting en noteer meetperiode en vertraging. Vraag bij kennismaking hoe iemand Setpiece vond. Een vermelding in een AI-antwoord is iets anders dan een bezoek of opdracht.

Gebruik echte bezoekersmetingen voor Core Web Vitals wanneer die beschikbaar zijn. Lighthouse is een labtest; TBT is geen INP. Niet-beschikbare API-gegevens zijn onbekend, niet nul. De heuristische noodscores uit het Codex SEO-performancescript zijn geen meetbewijs.

## Zoek- en AI-crawlers

De publieke HTML is op de server opgebouwd. `robots.txt` laat publieke inhoud toe en sluit beheer/API-routes uit. Er is geen aparte AI-versie, betaalde indexering of llms.txt vereist om bij Google AI-features te kunnen verschijnen. GPTBot betreft training, OAI-SearchBot zoeken; verwar die rollen niet.

Bronnen: [Google AI-features](https://developers.google.com/search/docs/appearance/ai-features), [OpenAI-crawlers](https://developers.openai.com/api/docs/bots), [IndexNow](https://www.indexnow.org/documentation).
