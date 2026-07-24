---
name: Setpiece
description: Een uitgesproken werkgerichte identiteit die zichtbaar maakt hoe terugkerend werk verandert in een geborgde werkwijze.
colors:
  signal-rose: "#E8558A"
  signal-rose-hover: "#F06E9C"
  signal-rose-active: "#D34579"
  signal-rose-link: "#B72D62"
  signal-rose-error: "#8F294F"
  solar-gold: "#F5C04A"
  ink: "#17141F"
  slate: "#4A4556"
  mist: "#ECEAF2"
  mist-disabled: "#E2DFE6"
  paper: "#FAF9FB"
  paper-raised: "#FFFFFF"
typography:
  scale:
    "12": "12px"
    "13": "13px"
    "14": "14px"
    "15": "15px"
    "16": "16px"
    "17": "17px"
    "18": "18px"
    "20": "20px"
    "21": "21px"
    "115": "1.15rem"
    "125": "1.25rem"
    "135": "1.35rem"
    "140": "1.4rem"
    "145": "1.45rem"
    "150": "1.5rem"
    "155": "1.55rem"
    "160": "1.6rem"
    "175": "1.75rem"
    "190": "1.9rem"
    "200": "2rem"
    "210": "2.1rem"
    "220": "2.2rem"
    "230": "2.3rem"
    "240": "2.4rem"
    "250": "2.5rem"
    "270": "2.7rem"
    "280": "2.8rem"
    "300": "3rem"
    "335": "3.35rem"
    "400": "4rem"
    "440": "4.4rem"
    "460": "4.6rem"
    "500": "5rem"
    "560": "5.6rem"
    "600": "6rem"
    "640": "6.4rem"
    "650": "6.5rem"
    "700": "7rem"
  display:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 5.8vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontSize: "clamp(1rem, 1.4vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  control: "2px"
  field: "2px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "48px"
  section: "clamp(64px, 9vw, 120px)"
components:
  button-primary:
    backgroundColor: "{colors.signal-rose}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 28px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.signal-rose-hover}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  field:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0 14px"
    height: "52px"
---

# Design System: Setpiece

## Overview

**Creative North Star: "Het Werkspoor"**

Het Werkspoor maakt Setpieces eigen mechanisme zichtbaar: terugkerend werk wordt eerst scherp gezien, daarna gericht veranderd en uiteindelijk overdraagbaar gemaakt. Eén doorgaande lijn verbindt frictie, keuze, ingreep, bewijs en eigenaarschap. De lijn is geen decoratie. Zij ordent informatie, draagt beslismomenten en laat zien waar de verantwoordelijkheid ligt.

De identiteit blijft rustig en precies, maar niet terughoudend. Grote Ink-velden, royale typografie, fotografie van echte handelingen en harde verschuivingen in schaal geven de website overtuiging. Paper blijft de leesgrond; Signal Rose markeert alleen de actieve ingreep of eerstvolgende beslissing.

**Key Characteristics:**

- Eén doorlopend werkspoor als structurele signatuur.
- Grote typografische uitspraken naast concrete werkdetails.
- Bewijs verschijnt vroeg en altijd met context.
- Fotografie toont handeling, test en overdracht, niet alleen overleg.
- Vlakke, scherpe componenten zonder decoratieve schaduw of zachte SaaS-kaarten.

## Colors

De kleurstrategie is beheerst maar beslist. Paper en Ink dragen volledige regio's; Signal Rose markeert de ene actieve ingreep.

### Primary

- **Signal Rose:** primaire actie, actieve ingreep, focuspunt en geselecteerd beslismoment.

### Secondary

- **Solar Gold:** uitsluitend als onderdeel van het bestaande merkverloop en nooit als tekstkleur.

### Neutral

- **Ink:** hoofdtekst, sterke structuur en beslissende donkere regio's.
- **Slate:** secundaire tekst op Paper.
- **Mist:** rustige scheiding, ondersteunende vlakken en tabelstructuur.
- **Paper:** primaire leesgrond en witruimte.
- **Paper Raised:** formele invoervelden en vlakken die van Paper moeten onderscheiden.

**The One Intervention Rule.** Signal Rose markeert per viewport maximaal één hoofdactie of actieve verandering. Herhaling maakt het signaal betekenisloos.

**The Full Field Rule.** Kleur bezit een volledige regio of een functioneel element. Geen verspreide accentstreepjes als decoratief patroon.

## Typography

**Display Font:** Space Grotesk met Arial als fallback

**Body Font:** Space Grotesk met Arial als fallback

**Character:** direct, functioneel en menselijk. De kracht komt uit schaal, ritme en precieze woordafbreking. Het Qurova-woordmerk blijft een vectorasset; Qurova wordt niet als webfont gebruikt zonder commerciële licentie.

### Hierarchy

- **Display:** merkbelofte en kernuitspraak, maximaal vijf regels op mobiel en drie op desktop.
- **Headline:** secties die een nieuwe beslissing of fase openen.
- **Title:** processtap, bewijsblok of componenttitel.
- **Body:** minimaal 16 pixels, regelafstand 1,6 en een leesmaat van 65 tot 75 tekens.
- **Label:** concrete status, fase of meetcontext. Geen breed gespatieerde kapitalen als standaard boven iedere sectie.

De vastgelegde schaal bevat ook optische tussenstappen. Die zijn bewust nodig om
dezelfde kopregel op 390, 768, 1024 en 1440 pixels leesbaar en compositorisch
stabiel te houden. Nieuwe tussenstappen worden niet lokaal toegevoegd, maar eerst
aan de schaal hierboven.

**The Plain Work Rule.** Koppen benoemen werk, keuze, resultaat of verantwoordelijkheid. `AI Consultancy`, `AI-oplossing` en `AI-workflow` maken de categorie en het middel concreet, maar worden altijd gekoppeld aan zichtbaar werk of resultaat. Geen abstracte technologietaal.

## Layout

De website gebruikt een twaalfkolomsraster op desktop en één kolom op mobiel. De compositie wisselt bewust tussen drie ritmes:

1. een brede uitspraak met één concreet werkdetail;
2. een dicht bewijs- of beslisvlak;
3. een rustige leespassage.

Het werkspoor loopt door deze ritmes en mag horizontaal, verticaal of als responsieve rand worden uitgevoerd. Op mobiel blijft de volgorde altijd lineair: uitspraak, bewijs, actie. Tabellen worden herordend tot semantische rijen of krijgen een benoemde, focusbare lokale scrollregio.

De homepage plaatst aanbod, prijs, termijn en eerste resultaat in de eerste viewport. Bewijs volgt vóór een uitgebreide probleeminventarisatie.

## Elevation & Depth

Het systeem is vlak. Diepte ontstaat door schaal, overlap van echte fotografie, snijvlakken en het contrast tussen Paper en Ink. Er zijn geen decoratieve slagschaduwen. De vaste header gebruikt alleen backdrop blur wanneer onderliggende content werkelijk zichtbaar doorschemert.

**The Flat Evidence Rule.** Bewijs staat niet in zwevende kaarten. Het krijgt plaats door raster, lijn, typografie en context.

## Shapes

Componenten zijn vrijwel recht met een radius van 2 pixels. Het zeshoekige beeldmerk blijft de enige uitgesproken geometrische vorm. Lijnen zijn één pixel, behalve het werkspoor dat maximaal drie pixels dik mag zijn wanneer het een echte procesverbinding toont.

Pills worden uitsluitend gebruikt voor compacte statussen of filters. Formulieren, CTA's en bewijsblokken zijn nooit pillvormig.

## Components

### Buttons

- **Shape:** bijna recht, radius 2 pixels.
- **Primary:** Signal Rose met Ink-tekst, minimaal 52 pixels hoog.
- **Hover:** lichtere Signal Rose; actief gebruikt de donkere variant.
- **Focus:** 3 pixels Ink-outline op lichte ondergrond en Paper-outline op Ink.
- **Secondary:** beschrijvende tekstlink met duidelijke onderstreping.

### Cards / Containers

- **Corner Style:** recht, maximaal 2 pixels.
- **Background:** Paper, Paper Raised of Ink.
- **Shadow Strategy:** geen schaduw.
- **Border:** maximaal één rustige Mist-lijn.
- **Internal Padding:** 24 tot 36 pixels, afhankelijk van informatiedichtheid.

### Inputs / Fields

- **Style:** Paper Raised, één pixel Slate-rand en zichtbare tekstlabels.
- **Focus:** 3 pixels Ink-outline met offset.
- **Error:** fouttekst benoemt oorzaak en herstelactie; `aria-invalid` verdwijnt direct nadat de actuele waarde geldig is.
- **Disabled:** Mist-achtergrond met tekstuele status.

### Navigation

De desktopnavigatie blijft compact. De actieve route gebruikt `aria-current` en één Rose-markering. Op mobiel gebruikt het menu expliciete labels, grote doelen en een sluitactie die focus behoudt. Iedere route bevat dezelfde skiplink en verplaatst focus na navigatie naar de hoofdkop.

### Werkspoor

Het Werkspoor is de onderscheidende structurele component. Iedere halte bevat een concrete toestand, een actie of ingreep, een bewijsdetail en een eigenaar. Alleen de actuele of primaire halte gebruikt Signal Rose. Op smalle schermen wordt het spoor een verticale leeslijn zonder horizontale afhankelijkheid.

### Bewijsregel

Een bewijsregel toont altijd situatie, verandering, uitkomst en context. Een cijfer verschijnt alleen met meetcontext. Voorlopige publicatienotities staan nooit in de publieke component.

## Do's and Don'ts

### Do:

- **Do** gebruik het werkspoor om een echte volgorde, overdracht of verantwoordelijkheid zichtbaar te maken.
- **Do** plaats bewijs en de afgebakende eerste stap vroeg in iedere Persuade-route.
- **Do** laat fotografie een medewerker aan het werk, testen of overdragen tonen.
- **Do** gebruik bestaande merkassets en tokens uit `01_Strategie/huisstijl`.
- **Do** maak in de eerste viewport duidelijk dat Setpiece AI Consultancy levert.
- **Do** toets 390, 768, 1024 en 1440 pixels en WCAG 2.2 AA.

### Don't:

- **Don't** bouw opnieuw een generieke split hero met losse overlegfoto.
- **Don't** gebruik herhaalde genummerde lijsten, zijstrepen of tracked uppercase als vervanging voor hiërarchie.
- **Don't** toon interne ontwerpnotities, niet-werkende links of voorlopige claims in de publieke laag.
- **Don't** gebruik gradienttekst, glassmorphism, pictogramtegels of afgeronde SaaS-kaarten.
- **Don't** laat een technisch hulpmiddel de hoofdboodschap of fotografie domineren.
- **Don't** gebruik futuristische AI-symboliek, dashboards of toolnamen als vervanging voor echte handelingen.
