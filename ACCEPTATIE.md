# Acceptatiehandoff Setpiece-website

**Status op 2026-07-24:** klaar voor een nieuwe menselijke acceptatieronde. Nog
niet klaar voor publicatie.

## Besluit

De huidige publieke website is in de code gemigreerd naar zes samenhangende
Werkspoor-routes:

1. Home
2. Kansenscan
3. Werkwijze
4. Praktijkvoorbeelden
5. Over Setpiece
6. Contact

De oude publieke routes blijven bereikbaar via permanente redirects. De
bestaande beheeromgeving, serverroutes, Turnstile-controle, rate limiting en
Supabase-opslag zijn niet vervangen.

## Wat nu geaccepteerd kan worden

- De B+C-richting is herkenbaar als een eigen Setpiece-wereld.
- De eerste viewport toont investering, termijn, 90-dagenroute en eerste
  werkende AI-oplossing.
- De eerste viewport benoemt Setpiece ondubbelzinnig als AI Consultancy, terwijl
  het werkprobleem en resultaat de inhoudelijke ingang blijven.
- Bewijs staat vóór de uitgebreide probleemherkenning.
- De kansenscan is afgebakend op prijs, scope, klantbijdrage en vervolg.
- De praktijkvoorbeelden gebruiken het Werkspoor in plaats van generieke
  volgordenummers.
- De nieuwe illustratieve werkbeelden tonen kansenscan, procesanalyse, test en
  overdracht. Zij worden niet als klantbewijs of testimonial ingezet.
- Desktop, tablet en mobiel hebben een eigen bruikbare compositie.
- Navigatie, skiplink, routefocus, formulierfouten en succesfocus zijn
  semantisch ingericht.
- De publieke vormgeving en productrichting zijn vastgelegd in
  [DESIGN.md](DESIGN.md) en [PRODUCT.md](PRODUCT.md).

## Open acceptatiegates

### P1. Privacy bij de aanvraag

- **Eigenaar:** Nathan, met juridische controle waar nodig.
- **Voorwaarde:** vóór publicatie.
- **Uitgevoerd in code:** een volledige privacyverklaring op `/privacy`, een
  cookiebeleid op `/cookies`, links in het formulier en de footer en concrete
  bewaartermijnen voor aanvragen en beveiligingsgegevens.
- **Te bevestigen:** verwerkingsdoel, grondslag, bewaartermijn, betrokken
  verwerkers, rechten en de feitelijke uitvoerbaarheid van de genoemde
  bewaartermijnen.
- **Acceptatie:** de korte uitleg bij het formulier verwijst naar een volledige,
  juridisch bevestigde privacyverklaring.

### P2. Bron en toestemming voor resultaatclaims

- **Eigenaar:** Nathan.
- **Voorwaarde:** vóór publicatie van klantnamen en percentages.
- **Te bevestigen:** meetobject, periode, voor- en namethode, bron en
  publicatietoestemming voor Nankaro, Cameranu en A.Vogel.
- **Acceptatie:** iedere publieke claim heeft een controleerbare meetcontext.
  Als die niet openbaar mag worden, wordt de precisie van de claim verlaagd of
  de klantnaam verwijderd.

### P2. Productie-inzending

- **Eigenaar:** Nathan of technisch beheerder.
- **Voorwaarde:** op een afgeschermde preview met productie-equivalente
  configuratie, vóór livegang.
- **Te testen:** Turnstile, `/api/contact`, rate limiting, Supabase-opslag,
  ontvangst en foutafhandeling.
- **Acceptatie:** één herkenbare testaanvraag komt volledig en slechts eenmaal
  aan. Verwijder de testdata daarna volgens de afgesproken bewaarroutine.

### P3. Ondersteunende technologie

- **Eigenaar:** acceptant.
- **Voorwaarde:** tijdens deze acceptatieronde.
- **Te testen:** toetsenbordvolgorde, mobiele menuknop, routefocus, skiplink,
  inlinefouten en successtatus met VoiceOver.
- **Acceptatie:** de nieuwe paginacontext en iedere fout- of successtatus worden
  zonder muis begrijpelijk aangekondigd.

### P3. Definitieve werkfotografie

- **Eigenaar:** Nathan.
- **Voorwaarde:** vóór of kort na publicatie, afhankelijk van de gekozen
  merkproductie.
- **Te bevestigen:** of de huidige illustratieve beelden als tijdelijke
  werkfotografie mogen blijven staan.
- **Acceptatie:** vervangende beelden tonen dezelfde handelingen en
  beeldverhouding, hebben vastgelegde gebruiksrechten en worden niet als
  klantbewijs gepresenteerd.

## Reeds uitgevoerde controles

- `npm run lint`
- `npm run test`, 6 van 6 tests geslaagd
- `npm run build`
- `npm run typecheck`
- Visuele browsercontrole op 390, 768, 1024 en 1440 pixels
- Lege formulierinzending en herstel van alle vereiste velden
- Controle op horizontale overloop, consolefouten en beeldlading
- Permanente redirects voor de oude publieke routes
- Impeccable-brondetectie over alle nieuwe routes en componenten

De URL-engine van de lokale Impeccable-installatie kon niet starten omdat de
meegeleverde runtime geen Puppeteer bevat. De live browsercontrole is daarom
afzonderlijk met Playwright uitgevoerd. Er is geen extra pakket aan het project
toegevoegd.

## Definitie van gereed voor publicatie

Publicatie is pas akkoord wanneer alle vier open gates hierboven zijn
afgetekend, de checks opnieuw groen zijn en de acceptant expliciet bevestigt dat
de huidige preview de te publiceren versie is. Deze migratie is niet
gepubliceerd.
