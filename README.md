# Setpiece — setpiece.nl

Marketingsite van Setpiece: strategie en digitale identiteit voor ondernemingen en verenigingen. Elke kans voorbereid, elke campagne raak.

Gebouwd met Next.js (App Router) op basis van het Setpiece design system. Twee oppervlakken:

1. **Standaardsite** — homepage (`/`), over (`/over`) en drie casepagina's (`/cases/*`). Licht perkament met een navy hero.
2. **Experience-onepager** — `/experience`. Een cinematische, scroll-gedreven versie van de homepage rond de voetbalmetafoor: 3D-veld hero, interactief tactics board, scroll-gedreven werkwijze en een schietbaar doelwit in de finale.

## Stack

- **Next.js 16** (App Router, TypeScript, statisch gegenereerd)
- **Design tokens** in `app/styles/tokens.css` (kleuren, typografie, spacing, motion) — de bron van waarheid voor alle styling
- **Fonts**: Bricolage Grotesque (display) + DM Sans (body) via `next/font`
- **Supabase** als database (nu nog leeg; de client staat klaar voor toekomstige features zoals de intake-module)
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
```

Dezelfde variabelen staan in Vercel als project environment variables.

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
  supabase.ts           # Supabase browser client
public/logos/           # woordmerk, beeldmerk, favicon
```

## Huisstijlregels

- Amber (`#e8a020`) alleen als accent, nooit als groot vlak
- DM Sans alleen in gewicht 400/500; Bricolage Grotesque 600–800
- Copy: Nederlands, je/jij, sentence case, geen em-dashes in lopende tekst
- Alle motion zit achter `prefers-reduced-motion: no-preference`
