# Lokale acceptatie facturatie

Uitsluitend synthetische testinhoud. Geen echte klantfacturen of Gmail-acties. Bedragen, namen, nummers en het voorbeeld-IBAN zijn testfixtures, geen bevestigde bedrijfsgegevens.

`browser-resultaat.json` registreert de volledige ingelogde flow, vier exportdocumenten, gecontroleerde PDF-hashes en eventuele browserfouten. `states-en-toegankelijkheid.json` registreert aanvullende states en axe-resultaten. `schone-installatie.json` bewijst installatie op een tweede, nieuwe lege lokale Supabase-instantie.

De screenshots `lijst-*`, `editor-*`, `detail-*` en `empty-*` hebben de breedtes 390, 768, 1024 en 1440, met een viewport van 1000 pixels hoog. Ze tonen het eerste scherm; een viewportbeeld bewijst geen inhoud buiten beeld. De kleinere tabel heeft een afzonderlijke benoemde scrollregio. `leeg-filter.png`, `versieconflict.png` en `klant-cc-fout-*` tonen herstelstates. De onafhankelijke visuele review en het afgebakende hersteloordeel staan in `impeccable-review.md`.

`standaard.pdf`, `credit.pdf` en `meerdere-paginas.pdf` komen uit renderer-/inhoudstests; `browser-factuur.pdf` en `concept.pdf` uit echte lokale routes. De stresstest gebruikt 100 lange regels, accenten, herhaalde tabelkoppen en werkelijke paginanummers. De tekstextractietest controleert ook de laatste tekstmarker van alle 100 regels. Visueel zijn standaard, credit en een vervolgpagina geïnspecteerd.

`synthetisch-archief.zip` bevat vier documenten, JSON en een PDF-hashmanifest. Ontbrekende PDF's staan expliciet in dat manifest. ZIP-hashes zijn in de browsertest vergeleken met de daadwerkelijke bestanden.

Reproduceren: volg de lokale setup in [facturatie.md](../../facturatie.md), start de app op 127.0.0.1:3017 en stel alleen de geïsoleerde `BILLING_TEST_DATABASE_URL` op poort 55322 in. Draai `npm run verify`, `npm run typecheck`, `npm run test:billing:sql`, `npm run test:billing:pdf`, `npm run test:billing:browser` en `node scripts/billing/browser-states.mjs`. De scripts weigeren een andere databasehost/poort. Geen volledige payloads, Auth-sessies, sleutels of PDF-bearertokens in deze artefacten.
