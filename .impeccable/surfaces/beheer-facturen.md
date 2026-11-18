# Facturatie in beheer

## Overview

**Mode: Operate. Bestaande wereld: Het Werkspoor.**

Deze surface beschrijft de gebouwde lokale facturatie-uitbreiding van 31 oktober 2026. De gebruiker maakt en controleert concepten, maakt een document bewust definitief en volgt daarna PDF, verzending, ontvangsten en credits. De eerstvolgende handeling is leidend. Dit is een uitbreiding van de bestaande beheerschil binnen de gepinde identiteit uit [DESIGN.md](../../DESIGN.md).

Primaire route: `/beheer/facturen`. Aanverwante routes: `/nieuw`, `/[id]`, `/klanten` en `/instellingen` onder die route. Een concept op `/[id]` toont de editor; een definitief document toont het detail. Een vervallen concept zonder bevroren gegevens toont een korte verklaring en een teruglink.

Bronnen: facturatieroutes onder `app/beheer/(postvak)/facturen`, [billingcomponenten](../../components/beheer/billing), [beheer.css](../../app/styles/beheer.css) en [workspoor.css](../../app/styles/workspoor.css). [PRODUCT.md](../../PRODUCT.md) borgt de merkidentiteit; [docs/facturatie.md](../../docs/facturatie.md) beschrijft functionele, technische en operationele grenzen.

Dit document geldt uitsluitend voor deze surface en wijzigt geen globale tokens. De bestaande `.impeccable/design.json` is ouder dan `DESIGN.md`; die bestaande afwijking is geen onderdeel van deze uitbreiding of vastlegging.

## Colors

De surface gebruikt de bestaande `--ws-*`-tokens. Paper is de leesgrond, Ink draagt tekst en structuur, Mist scheidt ondersteunende informatie. Er is geen aparte facturatiepalette.

| Bestaand token | Waarde | Gebruik in deze surface |
| --- | --- | --- |
| `--ws-paper` | `#FAF9FB` | Beheerwerkvlak en witruimte |
| `--ws-ink` | `#17141F` | Hoofdtekst, actieve tablijn en focus |
| `--ws-slate` | `#4A4556` | Secundaire tekst en invoerranden |
| `--ws-mist` | `#ECEAF2` | Scheidingen, notices, bevestiging en foutsummary |
| `--ws-paper-raised` | `#FFFFFF` | Velden, secundaire knoppen en factuurvoorbeeld |
| `--ws-rose` | `#E8558A` | Eén primaire actie; ook tekstselectie |
| `--ws-rose-hover` | `#F06E9C` | Hover van de primaire actie |

**The One Intervention Rule.** De lijst gebruikt Rose voor `Nieuwe factuur`, de editor voor `Opslaan als concept`. Het detail kiest één hoofdactie op basis van de actuele situatie: eerst `PDF maken`, daarna bij positief factuursaldo `Betaling vastleggen`, anders `Download PDF`. Klanten gebruikt `Bewaar klant`; instellingen gebruikt alleen voor bedrijfsgegevens een Rose-opslagknop. Overige acties blijven secundair.

Status en fouten hebben tekstuele betekenis. Documentstatus, betaalstatus en creditstatus blijven afzonderlijk zichtbaar. Foutsummary en bevestigingsvlak gebruiken Mist met Ink-tekst. Er is geen nieuwe kleurcodering voor betaald, te laat of gecrediteerd.

## Typography

Space Grotesk erft uit de beheerschil via `var(--font-space), Arial, sans-serif`. Het goedgekeurde woordmerk blijft een bestaand asset. De facturatie-interface introduceert geen extra lettertype.

| Rol | Gebouwde maat en gedrag |
| --- | --- |
| Paginakop | `2.3rem`, op maximaal 640px `2rem`; regelhoogte `1.08`, tracking `-0.025em` uit de schil |
| Sectiekop | `1.5rem`, regelhoogte `1.25`; onderruimte `20px` |
| Subkop | `1.15rem`, regelhoogte `1.4` |
| Intro onder paginakop | `17px`, Slate, regelhoogte `1.6`, maximaal `65ch` |
| Invoer | `16px`; zichtbare labels `15px` met gewicht `500` |
| Lijsttabel | `15px`; kolomkoppen gewicht `500`, eerste cel gewicht `600` |
| Factuurvoorbeeld | `14px`; documenttitel en Setpiece-naam `1.5rem` |
| Samenvattingsbedrag | `1.25rem`, Ink; label `15px`, Slate |
| Ondersteunende tekst | Notities `14px`; kleine tekst, hash en tijdlijnmetadata `13px` |

Paragrafen en lijstitems hebben regelhoogte `1.6` en kunnen lange waarden afbreken. Bedragen en totalen gebruiken tabulaire cijfers; geldkolommen staan rechts en bedragen breken niet af. Aantal en eenheid blijven in het documentvoorbeeld bij elkaar. Lange adressen, hashes en dispatchreferenties mogen afbreken binnen hun eigen vlak.

## Layout

De bestaande beheerschil blijft eigenaar van navigatie, skiplink en container. Het werkvlak is gecentreerd en maximaal `1488px` breed, met `48px` bovenruimte, `80px` onderruimte en horizontaal `clamp(20px, 4vw, 64px)`. Bij maximaal 600px wordt de bovenruimte `32px`.

Facturatie heeft eigen tabnavigatie met Facturen, Klanten en Instellingen. De tabrij heeft `28px` tussenruimte, een Mist-onderlijn en `32px` onderruimte. Tabs zijn minimaal `52px` hoog; de actieve tab gebruikt `aria-current="page"`, gewicht `700` en een Ink-onderlijn van `3px`. De rij kan lokaal horizontaal scrollen.

De lijst ordent kop en hoofdactie, filters, een inklapbare selectiesamenvatting, documenttabel of lege toestand en ten slotte de archieflink. Totalen staan als tekst naast elkaar in een disclosure, zonder losse KPI-tegels. Filters staan in de URL als `q`, `year` en `state`; samenvatting en export volgen dezelfde selectie.

De editor heeft boven 1100px twee kolommen: formulier (`1.1fr`) en HTML-document (`0.9fr`), met `36px` ertussen. Detail gebruikt twee gelijke kolommen met `48px` ertussen. Klanten gebruikt een lijst en formulier in een verhouding van `1fr` tot `2fr`, met minimaal `220px` voor de lijst en `48px` tussenruimte. Formuliervelden staan standaard in twee gelijke kolommen met `20px` tussenruimte; tekstvakken nemen de volle rij in. Secties hebben een Mist-bovenlijn, `28px` binnenruimte boven en `32px` buitenruimte boven.

| Breedte | Gebouwd responsief gedrag |
| --- | --- |
| Boven 1100px | Editor en detail naast elkaar; editorvoorbeeld zichtbaar zonder toggle; klantenlijst naast formulier |
| Maximaal 1100px | Editor, detail en klanten naar één kolom. In de editor staat het voorbeeldpaneel vóór het formulier en begint het voorbeeld gesloten achter `Bekijk factuurvoorbeeld`. Het detailvoorbeeld volgt de inhoud zonder previewtoggle. Klanten krijgt `24px` tussenruimte |
| Maximaal 640px | Kop en hoofdactie onder elkaar; hoofdactie volle breedte. Velden naar één kolom. Filters beginnen gesloten achter `Toon filters`, met aantal actieve filters. Samenvattingsfeiten naar twee kolommen. Partijen en mailmetadata naar één kolom |
| Maximaal 600px | Aanvullend de bestaande schilregels: compactere topbar, verborgen beheersubtitel, filterknop volle breedte en gestapelde footer |

**The Local Scroll Rule.** De pagina blijft binnen de viewport; brede tabellen scrollen in een benoemde, focusbare lokale regio (`role="region"`, `tabIndex={0}`). De lijstregio heet `Facturen in de selectie`, de voorbeeldregio `Regels in het factuurvoorbeeld`. Bij maximaal 640px heeft de lijsttabel minimaal `760px` breedte en de voorbeeldtabel `380px`. Lokale tabelscroll is een bewuste implementatiekeuze; de rijen worden niet omgezet naar kaarten.

## Elevation & Depth

De uitbreiding blijft vlak. Mist-lijnen, witruimte en Paper Raised onderscheiden document, invoer en hulpinformatie. Er zijn geen nieuwe schaduwen, zwevende panelen, verlopen of animaties. Het factuurvoorbeeld is een documentvlak binnen het werkvlak.

## Shapes

Knoppen en velden erven de bestaande radius (`2px`). Tabel- en sectiescheidingen zijn `1px` Mist. Het voorbeeld heeft een enkele Mist-rand en `28px` binnenruimte; bij maximaal 640px wordt dit `20px`. Factuurregels zijn fieldsets met een enkele Mist-rand, `20px` binnenruimte en een benoemde legend; mobiel is de binnenruimte `16px`. Notices en bevestigingsvlakken hebben `24px` binnenruimte, de eerste lege toestand `36px`.

## Components

### Acties en pending

Primaire en gewone secundaire knoppen erven een minimumhoogte van `52px`, gewicht `600`, regelhoogte `1.4` en `12px 22px` padding uit de schil. De primaire actie heeft Ink-tekst op Rose; secundaire acties hebben Paper Raised met een Slate-rand. Regelacties zoals omhoog, omlaag en verwijderen zijn compacter: minimaal `44px`, `14px` tekst en `8px 12px` padding. Tabel- en klantenlinks, summaries, foutlinks en exportlink hebben minimaal `44px` bedieningshoogte.

Focus gebruikt een Ink-outline van `3px` met `3px` offset; op de donkere schil erft de Paper-variant. De foutsummary krijgt dezelfde outline bij programmatische focus. Disabled knoppen gebruiken Mist en Slate. Tijdens opslaan verschijnt `Opslaan…`; de PDF-actie gebruikt `PDF maken…`. De gedeelde mutatiehook blokkeert gelijktijdige verzending, bewaart dezelfde verzoek-ID bij een onzekere herhaalde poging en toont pas na bevestiging `Opgeslagen.`.

### Lijst en selectie

De tabel toont Nummer, Klant, Factuur/verval, Totaal, Open/tegoed en Toestand. Documenten staan met de nieuwste aanmaakdatum bovenaan. `Concept` blijft expliciet zonder definitief nummer. Creditdocumenten hebben een eigen tekstlabel; een negatief saldo krijgt `Klanttegoed`. De disclosure toont direct documentaantal en saldo; uitgeklapt volgen ontvangen bedrag en creditdocumenten. Export is een tekstlink met de concrete grens van 200 documenten / 64 MB en de melding dat ontbrekende PDF’s in het manifest staan.

### Editor en documentvoorbeeld

De editor bestaat uit Klant en uitvoering, Factuurregels, Toelichting en Jouw controle. Regels gebruiken een omschrijving, aantal, eenheid, prijs en btw-behandeling; toevoegen, verplaatsen en verwijderen zijn tekstknoppen met regelnummers in hun toegankelijke naam. Bij ongeldige getallen verschijnt het documentvoorbeeld pas weer zodra de invoer geldig is.

Het HTML-document toont afzender en afnemer, concept-/documentsoort, nummer, datum, referentie, regels en bedragen per btw-groep. Onbekende gegevens krijgen concrete ontbreektekst. Totalen staan rechts in maximaal `320px`; de totaalregel krijgt een Mist-bovenlijn en sterkere typografie. Het conceptvoorbeeld benoemt dat het geen definitieve factuur of archief-PDF is. Het detailvoorbeeld gebruikt bevroren gegevens; de opgeslagen PDF blijft het archiefexemplaar.

`Maak definitief` is een secundaire actie en blijft uitgeschakeld zolang het concept nieuw of gewijzigd is of een mutatie loopt. De bevestiging toont datum, voorspeld nummer, totaal en ontvangers, en benoemt welke inhoud wordt vastgelegd. Nummerreservering, PDF maken en werkelijk versturen blijven afzonderlijke stappen. Vervallen gebruikt eveneens een expliciete bevestiging; een vervallen concept krijgt geen nummer.

### Detail, herstel en geschiedenis

Het detail toont document-, betaal- en creditfeiten afzonderlijk, gevolgd door Archief en verzending, Ontvangsten, Credit of correctie, Documentrelaties en Tijdlijn voor zover van toepassing. De tijdlijn heeft tekstuele gebeurtenissen, tijdstip en actor. Ontvangsten kunnen met reden worden teruggedraaid. Credit en correctie hebben eigen bevestigingsvlakken en concrete uitleg over het resterende bedrag en een eventueel nieuw concept.

Een ontbrekende PDF houdt nummer en definitieve inhoud zichtbaar en biedt `PDF maken` om dezelfde factuur te hervatten. De UI toont hash en controleerbare download. Een integriteitsprobleem blijft een herstelmelding; de interface suggereert geen stil overschrijven of vervangend nummer.

De bevroren factuurmail is een disclosure met Van, Aan, Cc, Onderwerp, Bericht en Bijlage. Gmail-concept, wachten op Jarvis en geregistreerde verzending hebben verschillende teksten. Annuleren legt uit dat een Gmail-concept niet vanzelf wordt verwijderd. Opnieuw klaarzetten vraagt bevestiging en behoudt de bevroren inhoud. Handmatige verzendregistratie vraagt het werkelijke verzendmoment, adressen en een notitie als bewijs.

### Klanten, instellingen en validatie

Klanten houdt factuurgegevens gescheiden van de bestaande contactpersoonkoppeling via PersonPicker. Onbekende gegevens kunnen leeg blijven. Instellingen heeft afzonderlijk opslaan per sectie: Bedrijfsgegevens, Bank en betaaltermijn, Nummering en Factuurmail. Het mailvoorbeeld benoemt zijn fictieve gegevens en gebruikt dezelfde templatevelden als de app.

Velden hebben zichtbare labels, Paper Raised, een Slate-rand en minimaal `52px` hoogte. Beschrijvingen en fouten zijn via `aria-describedby` gekoppeld; ongeldige velden krijgen `aria-invalid`. Checkboxes zijn `24px`, met een labelrij van minimaal `44px` en `12px` tussenruimte.

**The Current Value Rule.** Factuurontvangers en Cc worden afzonderlijk met de bestaande parser gevalideerd. Na een mislukte opslagpoging volgen hun fouttekst en `aria-invalid` de actuele waarde van het juiste veld. Een ongeldige Cc maakt het To-veld niet ongeldig. De summary verwijst naar het eerste ongeldige adresveld en verdwijnt zodra beide velden geldig zijn; een andere serverfout wordt daarbij behouden.

De gedeelde foutsummary benoemt `De wijziging is niet bevestigd`, krijgt focus en biedt waar beschikbaar een veldlink, bedrijfsgegevens en `Open actuele versie` in een apart venster. Invoer blijft staan. Een versieconflict vraagt de actuele versie te controleren zonder de lokale invoer door een nieuwe versie te vervangen. Succesfeedback gebruikt `role="status"`.

### Leeg, laden en fout

De eerste lege lijst zegt `Je eerste factuur begint als concept` en legt uit dat een nummer pas na controle volgt. Een lege selectie zegt `Geen facturen in deze selectie` en biedt `Wis de filters`. De hoofdactie voor een nieuwe factuur blijft in de paginakop. Een ontbrekende bedrijfsinstelling heeft een gerichte link; een incompleet concept kan al worden bewaard.

Loading toont `Facturatie laden…`, `aria-busy="true"` en drie statische Mist-balken van `52px`. De routefout zegt dat facturatie niet bereikbaar is, waarschuwt dat de laatste wijziging al verwerkt kan zijn en biedt `Probeer opnieuw`. Dit blijft onderscheiden van een bevestigde afwijzing of versieconflict bij opslaan.

## Do's and Don'ts

- **Do** hergebruik Werkspoor-tokens, bestaande `bw-`-schil en eigen billing-CSS. Behoud de ene Rose-hoofdactie en de beschreven prioriteit per documenttoestand.
- **Do** gebruik gelabelde secties, tekstuele toestanden, exacte bedragen en benoemde lokale tabelscroll. Houd negatieve saldi als klanttegoed herkenbaar.
- **Do** behoud invoer bij fouten en maak actuele veldvalidatie en onzekere bevestiging afzonderlijk begrijpelijk.
- **Do** maak bevestiging, definitieve inhoud, PDF en echte verzending als afzonderlijke controleerbare stappen zichtbaar.
- **Don't** voeg een generieke componentkit, KPI-tegels, nieuwe kleuren, pictogramdecoratie, schaduwen of afgeronde SaaS-kaarten toe aan deze uitbreiding.
- **Don't** presenteer een Gmail-concept, afgeronde Jarvis-taak of definitief document als bewijs van werkelijke verzending.
- **Don't** gebruik fictieve gegevens als echte klant- of bedrijfsgegevens; het instellingenvoorbeeld blijft expliciet fictief.

Vastgelegd bewijs: de lokale volledige ingelogde browserflow liep zonder browsererrors; [browser-resultaat.json](../../docs/acceptatie/facturatie/browser-resultaat.json) labelt verzendbewijs als simulatie. De definitieve [statesrun](../../docs/acceptatie/facturatie/states-en-toegankelijkheid.json) bevat 10 checks, 10 axe-scans en 0 violations, inclusief veldherstel, versieconflict met behoud van invoer, dubbelklik, verloren respons, lege selectie, skiplink, reflow en eerste gebruik. Twee mobiele scans hebben een onbesliste `color-contrast`-check. Reflow is op 720 CSS-pixels gecontroleerd; er is geen schermlezersessie of native browserzoomacceptatie uitgevoerd. Dit is geen volledige WCAG-acceptatie.

De oorspronkelijke onafhankelijke review had één material fix voor ontvangers/Cc. Het afgebakende [actuele verdict](../../docs/acceptatie/facturatie/impeccable-review.md) is `resolved` / `ship` voor die fix; twaalf opnieuw gemaakte lijst-, editor- en detailcaptures zijn geldig bevonden. Dat oordeel is geen nieuwe volledige review of fiscale, security-, productie-, Jarvis/Gmail- of PDF-acceptatie. De volledige statesrun is nadien afgerond; de reviewer claimde dat eindresultaat niet zelf. `npm run verify` en typecheck zijn na de laatste correctie groen gemeld. Deze documentatiepass heeft geen eigen rebuild of browsertest toegevoegd.

De volgende synthetische captures leggen de vier vereiste breedtes en twee Cc-foutstates vast:

| Toestand | 390px | 768px | 1024px | 1440px |
| --- | --- | --- | --- | --- |
| Lijst | [lijst-390](../../docs/acceptatie/facturatie/lijst-390.png) | [lijst-768](../../docs/acceptatie/facturatie/lijst-768.png) | [lijst-1024](../../docs/acceptatie/facturatie/lijst-1024.png) | [lijst-1440](../../docs/acceptatie/facturatie/lijst-1440.png) |
| Editor | [editor-390](../../docs/acceptatie/facturatie/editor-390.png) | [editor-768](../../docs/acceptatie/facturatie/editor-768.png) | [editor-1024](../../docs/acceptatie/facturatie/editor-1024.png) | [editor-1440](../../docs/acceptatie/facturatie/editor-1440.png) |
| Detail | [detail-390](../../docs/acceptatie/facturatie/detail-390.png) | [detail-768](../../docs/acceptatie/facturatie/detail-768.png) | [detail-1024](../../docs/acceptatie/facturatie/detail-1024.png) | [detail-1440](../../docs/acceptatie/facturatie/detail-1440.png) |
| Eerste gebruik | [empty-390](../../docs/acceptatie/facturatie/empty-390.png) | [empty-768](../../docs/acceptatie/facturatie/empty-768.png) | [empty-1024](../../docs/acceptatie/facturatie/empty-1024.png) | [empty-1440](../../docs/acceptatie/facturatie/empty-1440.png) |
| Ongeldige Cc | [klant-cc-fout-390](../../docs/acceptatie/facturatie/klant-cc-fout-390.png) | — | — | [klant-cc-fout-1440](../../docs/acceptatie/facturatie/klant-cc-fout-1440.png) |

Niet gecanoniseerd: oude `bh-`-decoratie uit dezelfde stylesheet, de verouderde globale sidecar en onvolledige toegankelijkheidschecks worden geen nieuwe huisstijlregels. De hier beschreven surface blijft een lokale implementatie; push/PR, cloudpreview, productiemigratie/deploy en de echte Gmail-keten hebben hun eigen acceptatie.
