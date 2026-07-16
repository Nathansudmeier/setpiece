# Setpiece — setpiece.nl

Marketingsite van Setpiece: strategie en digitale identiteit voor ondernemingen en verenigingen. Elke kans voorbereid, elke campagne raak.

Gebouwd met Next.js (App Router) op basis van het Setpiece design system. Twee oppervlakken:

1. **Standaardsite** — homepage (`/`), over (`/over`) en drie casepagina's (`/cases/*`). Licht perkament met een navy hero.
2. **Experience-onepager** — `/experience`. Een cinematische, scroll-gedreven versie van de homepage rond de voetbalmetafoor: 3D-veld hero, interactief tactics board, scroll-gedreven werkwijze en een schietbaar doelwit in de finale.

## Stack

- **Next.js 16** (App Router, TypeScript, statisch gegenereerd)
- **Design tokens** in `app/styles/tokens.css` (kleuren, typografie, spacing, motion) — de bron van waarheid voor alle styling
- **Fonts**: Bricolage Grotesque (display) + DM Sans (body) via `next/font`
- **Supabase** voor contactaanvragen, beheer-auth, RLS en gedeelde rate limiting
- **Anthropic** voor de publieke AI-intake, met budget- en misbruikgrenzen
- **Cloudflare Turnstile** voor botcontrole op publieke formulieren
- **Vercel Analytics en Speed Insights** voor productievelddata
- **Vercel** voor hosting

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
```

Dezelfde variabelen staan in Vercel als project environment variables.

### Database en deployment

Pas vóór de eerste deployment van de beveiligde formulieren de migratie in
`supabase/migrations/` toe. Deze maakt de gedeelde limiter aan en trekt directe
anonieme inserts op `contact_submissions` in. Deploy de applicatie pas nadat
`SUPABASE_SECRET_KEY` en de Turnstile-variabelen in Vercel staan.

```bash
supabase db push
npm run verify
```

## Structuur

```
app/
  page.tsx              # homepage
  over/                 # over-pagina
  cases/[slug]/         # drie casepagina's
  experience/           # de Experience-onepager
  styles/               # tokens, design system, site, experience, glass (volgorde telt)
components/
  ds/                   # design-system-componenten (Button, Badge, Toast, ...)
  site/                 # secties van de standaardsite
  experience/           # secties van de Experience-pagina
lib/
  supabase/             # Server-, sessie- en adminclients
  security/             # Rate limiting, requestvalidatie en Turnstile
supabase/migrations/    # Versiebeheer voor databasebeveiliging
public/logos/           # woordmerk, beeldmerk, favicon
```

## Huisstijlregels

- Amber (`#e8a020`) alleen als accent, nooit als groot vlak
- DM Sans alleen in gewicht 400/500; Bricolage Grotesque 600–800
- Copy: Nederlands, je/jij, sentence case, geen em-dashes in lopende tekst
- Alle motion zit achter `prefers-reduced-motion: no-preference`

## Kwaliteitschecks

```bash
npm run lint
npm run test
npm run build
# of alle drie:
npm run verify
```
