# Facturatie in beheer

Mode: Operate. Primary target: app/beheer/(postvak)/facturen/page.tsx.
Related: components/beheer/billing, app/styles/beheer.css.

Werkspoor blijft leidend: Space Grotesk, Paper/Ink/Mist, Signal Rose voor één hoofdactie, 52px primaire controls, 44px overige doelen, bestaande schaal. Geen nieuwe thema's, KPI-tegels, schaduw of decoratie. Code-first uitbreiding op de bestaande beheerschil.

Lijst beantwoordt: wat moet ik controleren, versturen of innen? Vaste Nieuwe factuur-knop, URL-filters, exacte gelijk gefilterde totalen, tabel op desktop en benoemde lokale scrollregio op mobiel. Editor beantwoordt: klopt deze factuur? Formulier en HTML-document naast elkaar, mobiel previewtoggle. Detail beantwoordt: wat is de stand? Gescheiden document-/betaal-/creditfeiten, herstelbare PDF, bevroren mail en echte tijdlijn. Klanten en instellingen gebruiken gelabelde secties en expliciete opslag.

Fouten houden invoer vast, summary krijgt focus met veldlinks; pending voorkomt dubbelklik. Lege, gefilterd lege, loading, conflict en integriteitsfout krijgen eigen hersteltekst. Geen Gmail-concept als verzendbewijs. Geen fictieve gegevens in echte klantvoorstellen.

Tools: geïnstalleerde Impeccable 4.1.1, Taste v2 en UI UX Pro Max; exacte bronhashes en uitgevoerde controles komen in docs/facturatie.md. Geen installatie of hooks nodig; geen externe telemetrie met besloten gegevens. Bestaande DESIGN-sidecar is ouder dan DESIGN.md; geen ongevraagde globale reparatie.
