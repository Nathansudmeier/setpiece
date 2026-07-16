# Setpiece website audit

Datum: 16 juli 2026
Scope: publieke website, representatieve routes, formulier- en API-paden, beheerarchitectuur en live deploymentheaders
Beoordelingskader: `README.md`, Setpiece-design tokens, WCAG 2.2 AA-principes, Vercel Web Interface Guidelines en Next.js 16-productierichtlijnen

## Managementsamenvatting

Setpiece heeft een sterke visuele basis: de site voelt herkenbaar, rustig en professioneel, de contenthiërarchie is goed en de belangrijkste publieke routes zijn statisch gegenereerd. De responsive layouts blijven op 375, 768 en 1280 px bruikbaar. De productiebuild slaagt, desktopperformance is uitstekend en er zijn geen gemeten layout shifts.

De grootste risico's zitten niet in de vormgeving, maar in de clientarchitectuur eronder. De `/experience`-route veroorzaakt aantoonbaar hydration errors, de homepage maakt de LCP afhankelijk van JavaScript en reveal-animatie, en de fullscreen navigatie gedraagt zich niet als een toegankelijke modal. Daarnaast zijn de publieke AI-intake en het contactformulier onvoldoende afgeschermd op applicatieniveau. De codebase bevat ook twaalf bijgehouden kopiebestanden die lint en tests vervuilen.

## Implementatiestatus na akkoord

Alle code-aanbevelingen uit deze audit zijn in de huidige worktree verwerkt. De definitieve lokale productiecontrole meet nu:

| Metric | Voor | Na |
| --- | ---: | ---: |
| Lighthouse performance mobiel | 86 | 92 |
| Lighthouse performance desktop | 99 | 100 |
| Accessibility | 99 | 100 |
| Mobiele LCP | 4,3 s | 3,4 s |
| Homepage-transfer | 551 KiB | 365 KiB |
| Lint | 6 errors, 13 warnings | groen, 0 meldingen |
| Tests | 4/8 groen | 6/6 groen |
| npm audit | 2 moderate | 0 kwetsbaarheden |

De `/experience`-hydrationfout is verdwenen, de navigatie houdt focus vast en herstelt hem correct, alle publieke pagina's hebben een main-landmark en skiplink, en de browserconsole is fout- en waarschuwingsvrij op de gecontroleerde routes.

De enige deploymentgates zijn extern: pas `supabase/migrations/20260716141452_harden_public_submissions.sql` toe en configureer `SUPABASE_SECRET_KEY`, Turnstile en de overige servervariabelen in Vercel vóór publicatie. De migratie is transactioneel met rollback tegen het gekoppelde Supabase-project gevalideerd, maar bewust nog niet op productie toegepast.

## Top 3 kritieke verbetergebieden (opgelost in de huidige worktree)

### 1. Herstel hydration en haal de LCP uit de reveal-keten

**Impact:** runtimebetrouwbaarheid, mobiele snelheid, foutvrije rendering.

- `/experience` logde bij alle drie geteste viewports React hydration error 418.
- `components/experience/XHero.tsx:50-52` geeft server-side `false` en browser-side meestal `true` aan `motionOk`.
- `components/experience/XHero.tsx:120-125` rendert daardoor tijdens de eerste browserrender een extra SVG-element dat niet in de server-HTML stond.
- `components/experience/ExperiencePage.tsx:15-22` kan hetzelfde doen met een doelgroep uit `localStorage`.
- De homepage-`h1` is de gemeten LCP, maar staat op `components/site/SiteHero.tsx:117` achter `data-reveal`.
- De combinatie van `app/styles/site.css:39-47`, `app/styles/glass.css:278-286` en `components/RevealInit.tsx:8-42` maakt boven-de-vouwcontent eerst onzichtbaar en daarna JavaScript-afhankelijk.

**Aanpak:** laat de eerste render volledig deterministisch zijn; lees `matchMedia` en `localStorage` pas na hydration zonder de initiële DOM-vorm te wijzigen. Verwijder `data-reveal` van de hero-heading en primaire CTA's of animeer alleen `transform` zonder `opacity: 0` als initiële staat.

### 2. Maak landmarks en fullscreen navigatie daadwerkelijk toegankelijk

**Impact:** toetsenbordgebruik, screenreaders, WCAG-conformiteit.

- Geen enkele publieke route heeft een `<main>`-landmark; Lighthouse vond expliciet `landmark-one-main`.
- Er is geen skiplink naar de hoofdinhoud.
- Bij het openen van het menu blijft focus op de trigger. De eerstvolgende `Tab` ging naar de hero-CTA achter de overlay, dus focus wordt niet naar de dialoog verplaatst of binnen de dialoog gehouden.
- De achtergrond krijgt geen `inert` en de trigger heeft geen `aria-controls`.
- Het menuwoord `Werkwijze` loopt in `review-menu-mobile-375.png` visueel buiten de viewport.
- De tabs in `app/styles/experience.css:150-155` hebben een klikvlak van slechts 10×10 px.
- De processtappen in `components/site/SiteProcess.tsx:50-60` zijn focusbare `<div>`-elementen zonder echte actie.

**Aanpak:** voeg per publieke pagina exact één `<main id="main-content">` en een skiplink toe. Bouw het menu als focus-managed dialog: focus naar de sluitknop, focus trap, achtergrond `inert`, Escape sluiten en focus terug naar de trigger. Gebruik echte buttons/links voor interactieve onderdelen en minimaal 44×44 px voor touch targets.

### 3. Verplaats publieke writes en AI-kosten achter een gecontroleerde servergrens

**Impact:** misbruik, operationele kosten, validatie en data-integriteit.

- De AI-intake gebruikt publiek `claude-opus-4-8` (`app/api/intake/route.ts:10`) en maximaal 700 tokens per request.
- De limiter in `app/api/intake/route.ts:15-27` leeft alleen in procesgeheugen. Op Vercel delen instanties dit geheugen niet en een cold start wist de teller.
- Er is geen gedeelde rate limiter, bot challenge, kostenbudget, request-timeout of model-fallback.
- Het contactformulier schrijft vanuit de browser rechtstreeks naar `contact_submissions` (`components/site/SiteContact.tsx:45-56`).
- Daardoor wordt de volledige Supabase browserstack meegestuurd en ligt validatie/misbruikbeheersing vrijwel volledig bij remote RLS. De RLS- en migratiedefinities staan niet in deze repo en konden dus niet worden geverifieerd.

**Aanpak:** gebruik voor beide formulieren een Server Action of Route Handler met schema-validatie, honeypot, gedeelde rate limiting en logging. Zet de intake standaard op een goedkoper/snel model, voeg een hard budget en timeout toe en reserveer Opus alleen voor expliciete escalatie. Houd RLS aan als defense-in-depth en versioneer het databaseschema in de repo.

## Meetresultaten

Gecontroleerd met een lokale productiebuild (`next build` + `next start`) om dev-overhead uit te sluiten.

| Metric | Mobiel | Desktop | Beoordeling |
| --- | ---: | ---: | --- |
| Lighthouse performance | 86 | 99 | Mobiele LCP moet verbeteren |
| Accessibility | 99 | 99 | Automatisch sterk; handmatige dialogproblemen blijven bestaan |
| Best practices | 100 | 100 | Goed |
| SEO | 100 | 100 | Alleen basale Lighthouse-checks; technische SEO-infrastructuur ontbreekt |
| FCP | 0,8 s | 0,2 s | Goed |
| LCP | 4,3 s | 0,8 s | Mobiel onvoldoende |
| Total Blocking Time | 0 ms | 0 ms | Uitstekend |
| CLS | 0 | 0 | Uitstekend |
| Totale transfer homepage | 551 KiB | 551 KiB | Redelijk, maar onnodig hoog voor een statische marketingsite |
| Geschatte ongebruikte JS | 79 KiB | 79 KiB | Directe optimalisatiekans |

De mobiele LCP was de hero-`h1`. Lighthouse mat ongeveer 1,3 s element-rendervertraging, terwijl TTFB slechts circa 13 ms was. Dit wijst direct naar de reveal/hydration-keten, niet naar hosting of serverrespons.

## Architectuur en tech stack

### Framework en rendering

- Next.js `16.2.10`, App Router en Turbopack.
- React en React DOM `19.2.4`.
- TypeScript 5 met `strict: true`.
- Publieke routes zijn statisch geprerenderd (`○` in de buildoutput).
- `/api/intake` en de beheerroutes zijn dynamisch (`ƒ`).
- `proxy.ts` beschermt `/beheer/*` met een optimistische Supabase-claimcheck; `lib/beheer/auth.ts:13-33` herhaalt terecht de echte admincheck in de data-accesslaag.

### Styling en componenten

- Eigen design system in `components/ds/`.
- CSS-variabelen en tokens in `app/styles/tokens.css`.
- Globale stylesheets voor site, glass, experience en Nankaro worden in `app/layout.tsx:4-9` op iedere publieke route geladen.
- Bricolage Grotesque en DM Sans via `next/font/google`; dit vermijdt externe fontrequests.
- De README zegt DM Sans alleen op gewicht 400/500 te gebruiken, maar onder andere `app/styles/site.css:25-29`, `app/styles/experience.css:90-95` en `app/styles/nankaro.css:64-70` gebruiken 700.

### Data, CMS en AI

- Supabase voor Auth, Postgres/Data API en beheerdata.
- `@supabase/ssr` voor browser- en serverclients.
- Anthropic SDK voor de AI-intake.
- Er is geen CMS. Alle marketingcopy, cases, diensten en productinformatie staan hardcoded in TSX-arrays en props.
- Voordeel: snel, typebaar en statisch renderbaar. Nadeel: contentwijzigingen vereisen codewijziging en deployment; case-inhoud en SEO-metadata kunnen uit elkaar lopen.

### Hosting en infrastructuur

- Productie draait aantoonbaar op Vercel: live responses geven `server: Vercel`, `x-vercel-cache: HIT` en `x-nextjs-prerender: 1`.
- `setpiece.nl` redirect met 308 naar `www.setpiece.nl`.
- HSTS is actief met `max-age=63072000`.
- Er zijn geen eigen security headers voor CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` of framebescherming gevonden.
- De publieke statische shell is goed cachebaar; de build toont 14 succesvol gegenereerde statische pagina's.

## Performance en snelheidsknelpunten

### Wat goed gaat

- Statische prerendering en Vercel-cache leveren een zeer lage TTFB.
- Geen gemeten CLS.
- Geen main-thread blocking in de Lighthouse-run.
- `next/image` wordt goed gebruikt voor de founderfoto en MV Artemis-casebeelden.
- Fonts worden self-hosted door Next.js.

### Belangrijkste knelpunten

1. **JavaScript-afhankelijke LCP.** De hero-heading is onzichtbaar totdat de clientcode de reveal-class toevoegt. Dit is de belangrijkste verklaring voor mobiel LCP 4,3 s.
2. **Te brede client boundary.** `components/site/HomePage.tsx:1-36` is volledig client-side en trekt ook statische secties zoals diensten, cases, testimonial en footer de clientgraph in.
3. **Zware Supabase-client voor één insert.** De productiechunk met Supabase is circa 244 KiB oncompressed en 66 KiB transfer. Lighthouse rekent een groot deel hiervan als ongebruikte JavaScript.
4. **Eager footerlogo.** `public/logos/setpiece-logo-wit.png` is 128 KiB en 3000×600, maar wordt in `components/site/SiteFooter.tsx:24` op 24 px hoogte met `<img>` geladen. Dit was het grootste individuele netwerkbestand.
5. **Globale route-CSS.** `experience.css` en `nankaro.css` zitten via de rootlayout ook op de homepage. De gezamenlijke CSS is circa 72 KiB oncompressed en was de enige render-blocking request in Lighthouse.
6. **Alle reveal-elementen starten verborgen.** Als hydration of IntersectionObserver faalt, blijven grote delen van de site visueel leeg. Dit gebeurde ook in de eerste snelle full-page capture.
7. **Mousemove-layoutmetingen.** `components/site/SiteHero.tsx:40-48` leest op iedere mousemove `getBoundingClientRect()` en schrijft direct `transform`, zonder `requestAnimationFrame`-throttling.

### Aanbevolen performancevolgorde

1. Maak hero-content direct zichtbaar en herstel de experience-hydration.
2. Verplaats statische homepageonderdelen naar Server Components; houd alleen nav, formulieren en interactieve motieven client-side.
3. Verplaats de Supabase-insert naar de server en verwijder de browserclient uit de homepagebundle.
4. Scope `experience.css` en `nankaro.css` naar route-layouts.
5. Vervang/eindimensioneer het witte PNG-logo met SVG of `next/image` en lazy loading.
6. Meet daarna opnieuw met echte Web Vitals uit productie.

## UI/UX-review

### Sterke punten

- De visuele hiërarchie is overtuigend: duidelijke hero, compacte eyebrow, sterke H1/H2-schaal en consistente CTA-kleur.
- Amber blijft daadwerkelijk accentkleur en domineert geen grote vlakken.
- De homepage vertelt een logisch verhaal: belofte → aanbod → werkwijze → bewijs → persoon → intake → contact.
- De custom casepagina's en Nankaro-pagina maken resultaten concreet met statistieken, outputs en doelgroepwaarde.
- Cards, radii, borders en surfaces voelen consistent over de geteste routes.
- De mobile layouts reorganiseren echt; grids worden kolommen en teksten blijven binnen de viewport.
- Empty/loading/error-gedrag is aanwezig voor beheer, contact en intake.

### Verbeterpunten

- De homepage is op mobiel zeer lang. Er zijn 3 propositiekaarten, 6 disciplinekaarten, een doelgroepblok, 4 processtappen en 3 cases vóór de persoonlijke en intake-conversie. Overweeg een compacte mobiele samenvatting of horizontale, toegankelijke disclosure.
- Het fullscreen menu gebruikt enorme outlined woorden. Op 375 px wordt `Werkwijze` afgesneden, waardoor de vorm boven leesbaarheid gaat.
- De 340vh scrollsectie op `/experience` (`app/styles/experience.css:157-160`) voelt op mobiel lang en leeg; geef een verkorte reduced-motion/mobilevariant of een zichtbare voortgang.
- De drie generieke experience-cases noemen geen klantnaam. Dat maakt ze visueel verzorgd maar bewijs-technisch minder geloofwaardig dan MV Artemis, Set In en Nankaro.
- Primaire CTA's zijn inhoudelijk duidelijk, maar knoppen voor interne ankers zijn JavaScriptbuttons. Echte ankerlinks zijn robuuster, deelbaar en werken zonder hydration.
- De contactvorm is mooi, maar op mobiel neemt de kaart vrijwel een volledige pagina in. De copy kan compacter zonder vertrouwen te verliezen.

## Accessibility-audit

### Positief

- `lang="nl"` staat correct op `<html>`.
- Koppen volgen in de geteste pagina's grotendeels een logische H1 → H2 → H3-hiërarchie.
- Formvelden hebben zichtbare, gekoppelde labels en passende inputtypes/autocomplete.
- Async status en foutmeldingen gebruiken `role="status"`, `role="alert"` en `aria-live`.
- Decoratieve SVG's zijn meestal `aria-hidden`.
- `prefers-reduced-motion` is breed toegepast.
- Lighthouse vond geen kleurcontrastfalen.
- Belangrijke knoppen hebben zichtbare focusstijlen.

### Tekortkomingen

- Geen `<main>` en geen skiplink op publieke routes.
- Menu-dialog heeft geen focus management of inert background.
- De visuele focus van menu-items vervangt de outline door alleen kleur/positie (`app/styles/glass.css:142-158`); dit is kwetsbaar bij forced colors.
- 10×10 px service-tabs in de experience zijn te klein voor touch.
- Processtappen zijn focusbaar zonder semantische actie.
- De verborgen honeypot staat met `aria-hidden` rond een focus-uitgeschakeld veld; functioneel goed, maar `hidden`/server-only botveld zou semantisch schoner zijn.
- Sommige formfocusstijlen gebruiken `:focus` in plaats van `:focus-visible`; dit geeft muisgebruikers onnodige focusfeedback en maakt consistentie moeilijker.

## Codekwaliteit en onderhoudbaarheid

### Checks

- `npm run build`: geslaagd.
- TypeScript tijdens build: geslaagd.
- `npm run lint`: mislukt met 6 errors en 13 warnings.
- `node --test tests/*.test*.mjs`: 8 tests uitgevoerd, 4 geslaagd en 4 mislukt.
- `npm audit --omit=dev`: 0 critical, 0 high, 2 moderate; beide lopen via de door Next.js meegeleverde PostCSS `8.4.31`.

### Oorzaken

- Er staan 12 tracked bestanden met suffix ` 2` in `components/` en `tests/`.
- Elf componentkopieën zijn gedivergeerd; de dubbele test is identiek.
- De lint-errors zitten in ongebruikte experience/nav-kopieën, maar blokkeren wel de repositorybrede lintcheck.
- De dubbele commerciële copy-test verwacht tekst die niet meer in de huidige homepage staat.
- Statische componenten zoals `SiteServices`, `SiteCases`, `SiteTestimonial`, `SiteFooter` en `SiteCaseDetail` zijn onnodig Client Components.
- Herhaalde inline style-objecten en grote globale CSS-bestanden maken route-specifieke optimalisatie lastiger.
- Er zijn geen custom publieke `not-found.tsx`, `error.tsx` of `global-error.tsx`; productie valt terug op de generieke Next.js-foutpagina.
- Er is geen CI-configuratie gevonden die build, lint en tests als mergegate afdwingt.

### Advies

1. Verwijder of archiveer de ` 2`-kopieën en herstel één canonieke implementatie per component.
2. Werk de commerciële copy-tests bij naar de actuele productbeslissing en voorkom tests die alleen exacte marketingzinnen bevriezen.
3. Voeg CI toe met `npm run lint`, tests en `npm run build`.
4. Introduceer route-level error/404 UI in dezelfde Setpiece-stijl.
5. Houd client boundaries klein en laat statische content Server Component blijven.

## SEO-audit

### Wat goed gaat

- Homepage, Over, Nankaro, Experience, MV Artemis en Set In hebben unieke titels.
- De belangrijkste commerciële routes hebben descriptions.
- Er is één duidelijke H1 per geteste route.
- Content staat server-side in de initiële HTML en routes zijn statisch.
- Interne links gebruiken grotendeels Next `Link` of echte anchors.
- De canonieke domeinvariant wordt via 308 naar `www` gestuurd.

### Ontbrekend of zwak

- `/robots.txt` retourneert live 404.
- `/sitemap.xml` retourneert live 404.
- Er zijn geen canonical tags.
- Er zijn geen Open Graph- of Twitter Card-tags en geen social preview image.
- Er is geen `metadataBase`.
- Er is geen JSON-LD voor `Organization`/`ProfessionalService`, `Person`, cases of softwareproduct Nankaro.
- De generieke casepagina's hebben alleen een title en erven de algemene homepage-description.
- Er is geen manifest of Apple touch icon.
- Er is geen productie-analytics of Web Vitals-rapportage zichtbaar in de code, dus er is geen velddata om Lighthouse tegen te toetsen.

### Aanpak

1. Voeg `app/robots.ts`, `app/sitemap.ts`, `metadataBase`, canonical alternates en globale OG/Twitter metadata toe.
2. Geef iedere case een eigen description en social image.
3. Voeg minimale, feitelijke JSON-LD toe en vermijd claims die niet publiek verifieerbaar zijn.
4. Meet Search Console, Web Vitals en formulierconversie na deployment.

## Gefaseerde verbeterroadmap

### Binnen 1–3 dagen

1. Herstel de `/experience` hydration mismatch.
2. Haal hero-LCP uit `data-reveal`.
3. Voeg `<main>`, skiplink en correct menu-focusmanagement toe.
4. Verwijder de ` 2`-bestanden en maak lint/tests groen.
5. Zet een gedeelde limiter en kostenlimiet vóór de AI-intake.

### Binnen 1 week

1. Verplaats contactsubmit naar een Server Action/Route Handler met validatie.
2. Splits de homepage in servercontent en kleine interactieve islands.
3. Scope route-CSS en optimaliseer het footerlogo.
4. Voeg robots, sitemap, canonical, OG/Twitter en case descriptions toe.
5. Voeg custom fout- en 404-pagina's toe.

### Daarna

1. Voeg CI en productie-Web Vitals toe.
2. Evalueer een licht contentmodel of CMS wanneer niet-technische contentupdates vaker worden.
3. Test met VoiceOver, toetsenbord-only en echte mid-range Androidhardware.
4. Herhaal Lighthouse met mobiele netwerkthrottling en vergelijk velddata.

## Screenshots captured

| Bestand | Viewport | Pagina |
| --- | --- | --- |
| `screenshots/review-homepage-desktop-1280.png` | 1280×800 | Homepage |
| `screenshots/review-homepage-tablet-768.png` | 768×1024 | Homepage |
| `screenshots/review-homepage-mobile-375.png` | 375×812 | Homepage |
| `screenshots/review-menu-mobile-375.png` | 375×812 | Open fullscreen menu |
| `screenshots/review-over-desktop-1280.png` | 1280×800 | Over |
| `screenshots/review-over-tablet-768.png` | 768×1024 | Over |
| `screenshots/review-over-mobile-375.png` | 375×812 | Over |
| `screenshots/review-case-mv-artemis-desktop-1280.png` | 1280×800 | MV Artemis-case |
| `screenshots/review-case-mv-artemis-tablet-768.png` | 768×1024 | MV Artemis-case |
| `screenshots/review-case-mv-artemis-mobile-375.png` | 375×812 | MV Artemis-case |
| `screenshots/review-nankaro-desktop-1280.png` | 1280×800 | Nankaro |
| `screenshots/review-nankaro-tablet-768.png` | 768×1024 | Nankaro |
| `screenshots/review-nankaro-mobile-375.png` | 375×812 | Nankaro |
| `screenshots/review-experience-desktop-1280.png` | 1280×800 | Experience |
| `screenshots/review-experience-tablet-768.png` | 768×1024 | Experience |
| `screenshots/review-experience-mobile-375.png` | 375×812 | Experience |

## Beperkingen van de audit

- Lighthouse is labdata uit een lokale productiebuild, geen echte gebruikersdata.
- De live deployment is op headers, routes en metadata gecontroleerd; Lighthouse is lokaal gedraaid om de code onder gecontroleerde omstandigheden te meten.
- De Supabase-database, RLS-policies en Vercel-projectinstellingen waren niet onderdeel van de repository en konden niet direct worden geverifieerd.
- Het beheergedeelte is architecturaal en statisch beoordeeld, maar niet met een echte beheerderssessie doorlopen.
