# PDF-assets v1

Deze bestanden horen bij `setpiece-invoice-v1`. Bewaar ze samen met renderer 4.9.0 en de v1-layout zolang een genummerde factuur nog niet volledig is gearchiveerd. Een nieuwe documentversie krijgt eigen assets; bestaande archief-PDF's worden niet vervangen.

- `SpaceGrotesk-Regular.ttf` en `SpaceGrotesk-Bold.ttf`: statische fonts uit [Space Grotesk upstream](https://github.com/floriankarsten/space-grotesk/tree/master/fonts/ttf/static). SIL Open Font License staat in `OFL.txt`.
- `logo.png`: deterministische rasterexport van het bestaande `public/logos/workspoor/setpiece-logo-ink.svg`, breedte 600px. Geen nieuw logo of nieuw lettertype; bestaande vectoridentiteit van Setpiece.

De daadwerkelijke bytes staan in Git. PDF-metadata bevat template- en rendererversie; SHA-256 over de opgeslagen PDF is de integriteitsgrondslag. Bytegelijkheid is alleen in de geteste runtime aangetoond, geen algemene rendererbelofte.
