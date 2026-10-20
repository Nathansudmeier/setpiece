# Setpiece

Next.js 16-website en besloten persoonlijke werkomgeving voor Nathan. Het CMS omvat de zeventien huidige Werkspoor-inhoudspagina’s: de homepage, diensten/aanbod, AI-geletterdheid, kennisartikelen, praktijkvoorbeelden, werkwijze, over en contact. Privacy, cookies en bestaande aanvraaglogica blijven behouden. Bestaande oude routes behouden hun redirects.

Onder /beheer: Vandaag, projecten, acties/opvolging, het bestaande personenbestand, aanvragen, beslissingen, activiteit, JSON-export en het getypeerde website-CMS. Supabase-login, actuele admincontrole, eigenaargebonden RLS en transactionele functies beschermen het werk. Toewijzing aan een bot activeert geen externe uitvoering.

Het CMS heeft besloten concepten/preview, expliciet publiceren, revisies en herstel als concept. De publieke website leest uitsluitend de geselecteerde gepubliceerde inhoud. Vormgeving volgt DESIGN.md, Space Grotesk en bestaande Werkspoor-merkassets. PRODUCT.md en ACCEPTATIE.md bevatten context en de eerdere publieke acceptatie.

Technische koppeling/herstel: [docs/beheer-koppeling.md](docs/beheer-koppeling.md). Direct bruikbare botinstructie: [docs/jarvis-instructie.md](docs/jarvis-instructie.md). Huidige opleverstatus: [docs/beheer-voortgang.md](docs/beheer-voortgang.md).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Kopieer `.env.example` naar `.env.local` en vul in:

```bash
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project-URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=  # Supabase publishable key
SUPABASE_SECRET_KEY=            # Alleen server-side; nooit NEXT_PUBLIC_
RATE_LIMIT_SECRET=              # Optioneel apart HMAC-geheim
ANTHROPIC_API_KEY=              # Alleen server-side
ANTHROPIC_INTAKE_MODEL=claude-haiku-4-5
ANTHROPIC_INTAKE_FALLBACK_MODEL=claude-sonnet-5
INTAKE_DAILY_LIMIT=80
NEXT_PUBLIC_TURNSTILE_SITE_KEY= # Publieke Turnstile site key
TURNSTILE_SECRET_KEY=           # Alleen server-side
RESEND_API_KEY=                 # Alleen server-side
CONTACT_NOTIFICATION_FROM=Setpiece Website <onboarding@resend.dev>
CONTACT_NOTIFICATION_TO=nathan@setpiece.nl
```

Dezelfde variabelen staan in Vercel als project environment variables.
Het verzenddomein van `CONTACT_NOTIFICATION_FROM` moet in Resend geverifieerd
zijn. De notificatie gebruikt het e-mailadres van de inzender als Reply-To.
Een mailfout verwijdert of weigert de al in Supabase opgeslagen aanvraag niet.
De huidige acceptatieconfiguratie gebruikt Resends testafzender en kan daardoor
alleen naar het accountadres `nathan@setpiece.nl` verzenden. Verifieer
`setpiece.nl` in een Resend-account met een vrij domeinslot voordat de afzender
wordt gewijzigd naar `website@setpiece.nl` en de ontvanger eventueel naar
`hallo@setpiece.nl`.

### Database en deployment

Pas vóór de eerste deployment van de beveiligde formulieren de migratie in
`supabase/migrations/` toe. Deze maakt de gedeelde limiter aan en trekt directe
anonieme inserts op `contact_submissions` in. Deploy de applicatie pas nadat
`SUPABASE_SECRET_KEY` en de Turnstile-variabelen in Vercel staan.
Voor notificaties moeten ook de drie Resend-variabelen zijn ingesteld.

```bash
supabase db push
npm run verify
```

## Structuur en ontwerp

- app/beheer en components/beheer: besloten werkomgeving en bestaande aanvragen.
- lib/beheer: autorisatie, werkmodel en eigenaargebonden data.
- lib/cms en components/cms: vaste inhoudsvelden, publicatiereader, editor en herbruikbare publieke renderers.
- components/workspoor: gedeelde publieke vormgeving en homepage.
- supabase/migrations en supabase/tests: additieve schema's en live transactionele controles.
- app/styles/workspoor.css en beheer.css: actuele Werkspoor-identiteit. Oudere styles blijven uitsluitend voor bestaande ondersteunende componenten.

## Kwaliteitschecks

```bash
npm run lint
npm run test
npm run build
# of alle drie:
npm run verify
```
