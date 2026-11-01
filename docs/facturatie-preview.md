# Cloudpreviewonderzoek — 1 november 2026

## Besluit

Nathan gaf akkoord voor de vervolgstap: eerst een geïsoleerde cloudpreview, daarna de branch pushen en een PR openen. Nadat bleek dat daarvoor een nieuwe abonnementskost nodig was, koos hij expliciet: **“Geen nieuwe abonnementskosten; voorlopig lokaal houden.”**

De facturatiebranch blijft daarom lokaal. Geen push, PR, cloudpreview, productiemigratie of deployment uitgevoerd. Geen betaald abonnement of andere betaalde voorziening aangemaakt. De bestaande Setpiece- en Nankaro-projecten zijn niet gepauzeerd, verwijderd of aangepast.

## Werkelijke controles

- Werkboom `app`, branch `codex/facturatie`, implementatie en acceptatie tot en met `78ea742`; schoon bij aanvang. Na fetch was `origin/main` nog `0ef4dd1`, dezelfde basis als bij de lokale bouw.
- Supabase-project Setpiece `rgtpeugwsxfqlyugfrbq`: gezond, regio eu-west-2, geen bestaande previewbranches.
- Een previewbranch aanmaken werd geweigerd: `Branching is supported only on the Pro plan or above`.
- Een apart project `setpiece-facturatie-preview` in de bestaande organisatie werd vooraf op $0 geraamd, maar aanmaken werd geweigerd wegens de limiet van twee actieve gratis projecten. De twee bestaande projecten zijn Setpiece en Nankaro. Er is geen nieuw project aangemaakt.
- Supabase quoteerde branchcompute op US$0,01344 per uur; branches vereisen bovendien Pro. Als alternatief is een aparte Pro-testorganisatie met één project vanaf US$25 per maand plus eventueel extra verbruik voorgelegd. Nathan heeft die kosten niet goedgekeurd.
- Het bestaande Vercel-project `setpiece` is gevonden en heeft deploymentbescherming. De plugin gaf 403 bij het opvragen van omgevingsvariabelen. CLI 64.7.0 en de ondersteunde fallback zijn onderzocht; geen omgevingsvariabelen uitgelezen of gewijzigd. Het CLI-traject is niet voortgezet nadat de cloudpreviewroute is gestopt.

Dit onderzoek heeft geen nieuwe functionele code gewijzigd en voegt geen acceptatieclaim toe. De [lokale resultaten](facturatie.md) blijven gelden; de echte Gmail-keten staat apart open.

## Later hervatten

Eerst een goedgekeurde geïsoleerde cloud-database én storage beschikbaar maken. Bevestig de kosten en de organisatie als dat een nieuwe betaalde voorziening vraagt. Configureer daarna uitsluitend branchspecifieke Preview-variabelen, zonder productiecredentials of echte productiegegevens over te nemen. Verifieer database/storage en de vertrouwde PDF-basis-URL vóór de eerste push. Open vervolgens de PR en voer geauthenticeerde previewacceptatie uit. Merge, productiemigratie/deploy en de Gmail-ketentest blijven afzonderlijke stappen.

Bronnen: [Supabase Free-projectlimiet](https://supabase.com/docs/guides/platform/billing-on-supabase), [branchingkosten](https://supabase.com/docs/guides/platform/manage-your-usage/branching), [prijzen](https://supabase.com/pricing) en [Vercel branchspecifieke omgevingsvariabelen](https://vercel.com/docs/environment-variables). De genoemde beperkingen zijn ook rechtstreeks door de aangesloten diensten teruggegeven.
