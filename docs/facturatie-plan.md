# Facturatie fase 1 — implementatieplan

Doel: één controleerbare EUR-facturatieflow in de bestaande beheeromgeving, inclusief credits, ontvangsten, herstelbare archief-PDF en Jarvis-outbox. Specificatie: [facturatie-opdracht.md](facturatie-opdracht.md), uitsluitend fase 1. Nathan heeft lokale uitvoering en commits vooraf toegestaan; geen extra ontwerpgoedkeuring, push, PR of productiehandeling.

## Basis en omgeving

- Remote geverifieerd: Nathansudmeier/setpiece. Opgegeven basis `6f0537d` is voorouder van actuele `origin/main` `0ef4dd1`; de laatste bevat rechtenmigraties, formulierherstel en Next 16.4.3 / React 19.3.1. Deze wijzigingen blijven behouden.
- Branch `codex/facturatie`, werkboom `Documents/ChatGPT/Setpiece/app`; oorspronkelijke schone main-checkout blijft behouden. Native werkboomtool weigerde de bron buiten de chatmappen; daarom normale Git-werkboom.
- Supabase SSR 0.12.0 / JS 2.110.0, npm-lockfile. Basis: 17 tests groen.
- Uitsluitend lokale Docker-Supabase met eigen project-ID, loopback-poorten, eigen volume/database/storage en synthetische gebruikers. Historische ontbrekende afhankelijkheden via testbootstrap buiten productiemigraties. Nooit productiegegevens kopiëren. Geen gedeelde database als uitwijk.

## Contracten en toestanden

Document: concept → definitief → klaar_voor_verzending → verstuurd; concept → vervallen. Credits worden direct definitief met oorspronkelijke snapshots. Betaling/credit/saldo zijn afzonderlijke afleidingen. Saldo kan negatief zijn. Volledige credit sluit open dispatch en taak. Deelcredit alleen na verzending. Correctie maakt resterende credit en nieuw ongenummerd concept atomair.

Geld: bigint-centen, JSON-strings. Aantal schaal 1000, maximaal 1.000.000; prijs maximaal 10.000.000.000.000 cent; maximaal 100 regels en 10.000.000.000.000 cent per document. Symmetrisch half van nul af; btw eenmaal per groep. Alleen `nl_standard/nl_21/21` en `nl_reduced/nl_9/9`. Buitenland, nul, vrijstelling en verlegging zijn niet beschikbaar bij finalize. Templates: `{nummer}`, `{klant}`, `{totaal}`, `{vervaldatum}`, `{referentie}`. Onbekende/onopgeloste velden blokkeren finalize.

Snapshots bevatten verkoper, afnemer, bank, regels, datums, betaaltermijn, totalen, originele creditverwijzing, documentversie en verzendseed. Alleen deze gegevens renderen de PDF. Nummerreeks vast `sales`, teller per jaar; wijzigbare prefix wijzigt de telleridentiteit niet. Minimaal vier cijfers.

PDF-herstel: finalize → server render → `invoice.prepare_pdf` registreert verwachte hash/bytes/pad eenmaal → upload zonder upsert → bestaand object ophalen/verifiëren → attach via eigenaarsessie. Een object met afwijkende hash wordt nooit vervangen. Als voorbereiding bestaat maar upload ontbreekt en her-render niet dezelfde bytes produceert: concrete integriteitsfout, geen automatische vervanging. Stabiele renderer/assets/metadata worden vastgelegd. Na upload wordt het bestaande object altijd als archief gebruikt. Attach maakt dispatch + taak in dezelfde SQL-transactie.

Tokens via losse RPC, uitsluitend hash opgeslagen, 15 minuten/3 GET-pogingen, dispatchgebonden. Transport via Authorization-header naar vaste `/api/factuur-pdf` om tokenpaden in hostinglogs te vermijden. Geen token in URL/cache/audit. HEAD geeft uniforme 404. Browserdownload via eigen sessie. Logging van Authorization door externe infrastructuur kan de app niet garanderen.

## Rechten en concurrency

Alle businessmutaties via `sp_command`; bestaande dispatcher blijft onder private delegatie behouden. Public wrappers invoker, private helpers definer met lege search_path en expliciete grants. Authenticated alleen owner/admin-read, geen DML. Append-only audit en onveranderbare definitieve inhoud ook via triggers. Samengestelde FK's en project-/personencontroles.

| Operatie | Actuele owner/admin | Eigenaarsessie | Versierij |
|---|---|---|---|
| settings.update | ja | ja | settings |
| customer.create/update | ja | nee | null/customer |
| invoice.create/update/void | ja | nee | null/invoice |
| invoice.finalize/prepare_pdf/attach_pdf/credit/correct | ja | ja | invoice |
| payment.record/reverse | ja | ja | invoice/payment |
| dispatch.cancel/requeue | ja | ja | dispatch |
| dispatch.draft_ready/cancel_ack | ja | nee | dispatch |
| invoice.mark_sent | ja | handmatig ja | dispatch |

Autorisatie vóór commandcache. Request-ID 8–160, payload ≤100000 bytes, onbekende velden geweigerd. PT409 bij zakelijke conflict. Stabiele ID voor exact één poging; nieuwe ID na gewijzigde input/afgeronde poging. Maximaal twee netwerkretries. Lockvolgorde: commandrij → owner (billing-serialisatie) → originele factuur → document → dispatch/payment → taak → teller. Owner-lock houdt ook cross-command races eenvoudig en controleerbaar; schaal passend bij één eigenaar. Werkelijke gelijktijdige sessietests blijven vereist.

## Bouwtaken en verificatie

- [x] 1. Rekenen/validatie: `lib/billing/model.ts`, gedeelde `tests/billing/vectors.json`, unit RED→GREEN. Interfaces: `calculate`, `formatEuro`, `parseQuantity`, `parseMoney`, `renderMail`, saldo/labels en kalenderregels.
- [x] 2. Database: additieve migratie, SQL-contract en parallelle tests. Interfaces: stringveilige `sp_billing_read`, bestaande `sp_command`, outbox/token-RPC's. Dek auth, triggers, credits, teller, cache, herstel en verstuurbewijs.
- [x] 3. Server/PDF: getypeerde billingclient en runtimevalidatie, render/storage/download/token/export. Test onderbrekingen, bytes/hash, credits/multipage en manifest. Geen mailimports.
- [x] 4. UI: werkende lijst/editor/detail/klanten/instellingen, bestaande navigatie/PersonPicker, `bw-bill-*` CSS. Vier breedtes, toetsenbord, fout/conflict/dubbelklik, volledige synthetische flow en publieke regressie.
- [x] 5. Docs, Jarvis-contractsimulatie, designchecks, onafhankelijke eindreview, `npm run verify` + typecheck en lokale commits. Gmail-keten, preview en productie apart gerapporteerd in `docs/facturatie.md`.

## Reviewfocus

Her-render na voorbereid maar ontbrekend object; cumulatieve btw-cent na meerdere credits; gewijzigde invoer na onzekere opslag; ingetrokken admin bij cachehit; annuleren/requeue tegelijk met tokengebruik of draft_ready. Deze gevallen krijgen gerichte integratietests. Een connector met postgres/secret blijft een brede rol; geen technische botisolatie of cross-system exactly-once-claim.

## Besluiten tijdens uitvoering

De opdracht is de ontwerpautorisatie. Uitvoering in deze chat met test-first businesslogica; geen nieuwe architectuurkeuze aan Nathan voorleggen zolang zijn specificatie die bepaalt.

Rekenbesluit: prijs en documentgrens zijn beide 10^13 cent. Daarmee zijn resterende credits/correcties ook bij grote aantallen exact als een bedrag met aantal 1 uit te drukken. SQL gebruikt numeric voor de tussenproducten en controleert vóór conversie naar bigint.
