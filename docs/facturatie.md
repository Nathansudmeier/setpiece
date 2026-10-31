# Facturatie in Setpiece-beheer — fase 1

Status op 31 oktober 2026: lokaal geïmplementeerd en in geïsoleerde Supabase/browser getest. Geen push, PR, productiemigratie of deployment uitgevoerd. De werkelijke Gmail-keten en externe acceptatie staan apart open.

## Wat is gebouwd

Binnen `/beheer/facturen`: facturenlijst met URL-filters en gelijk gefilterde totalen, klanten met bestaande PersonPicker, sectiegewijze bedrijfsinstellingen, onvolledige concepten, stabiele/historische regels, expliciete definitiefbevestiging, bevroren document/mail, herstelbare private PDF-opslag, concept-PDF zonder archief, volledige/deelcredits, atomaire correctie plus nieuw concept, handmatige ontvangsten/terugdraaien, klanttegoed, handmatige verzendregistratie, annuleren/opnieuw klaarzetten en begrensde ZIP-export met hashmanifest.

Document-, betaal- en creditstatus blijven afzonderlijk. Betaald vóór verzending mag; negatief saldo blijft klanttegoed. Credits krijgen geen incassovervaldatum of fictieve negatieve betaling. Alleen EUR en reguliere Nederlandse `nl_standard/nl_21/21` en `nl_reduced/nl_9/9`; geen kasstelsel, 0%, vrijstelling, verlegging, internationale beslisboom, bankimport, abonnementen, herinneringen of fiscale kwartaalrapportage.

Er is geen facturatiemailkoppeling. De app maakt een SQL-outbox en werkactie; Jarvis maakt na aparte aansluiting uitsluitend een Gmail-concept. Nathan verstuurt zelf. [Jarvis-instructie](jarvis-instructie.md) beschrijft het connectorcontract en herstel na een onzekere Gmail-/SQL-uitkomst. [Nes Ammim](nes-ammim-conceptvoorstel.md) is een voorstel, geen echte opgeslagen klant/factuur.

## Bron en wijzigingen

Basis `origin/main` **0ef4dd1**, geverifieerde opvolger van opgegeven `codex/setpiece-beheer` **6f0537d**. Daarmee blijven latere rechtenmigraties, formulierherstel en Next **16.4.3** / React **19.3.1** behouden. Supabase SSR **0.12.0**, JS **2.110.0**. Branch `codex/facturatie`, aparte werkboom `Documents/ChatGPT/Setpiece/app`; oorspronkelijke checkout behouden.

Lokale commits en definitieve controles worden hieronder aan het eind geregistreerd. Hoofdbestanden: `supabase/migrations/20261031134510_setpiece_billing.sql`, `lib/billing/`, `components/beheer/billing/`, facturatieroutes onder `app/beheer/`, tokenroute `app/api/factuur-pdf/`, uitbreiding `app/styles/beheer.css` en navigatie, tests/scripts en deze documentatie. Bestaande workspace/CMS-commandfuncties blijven via delegatie intact.

## Omgeving en migratie

Productie `rgtpeugwsxfqlyugfrbq` uitsluitend read-only gecontroleerd: nog geen facturatietabel, nul storage-buckets, bestaande authenticated admin-read aanwezig. Geen productiegegevens naar tests gekopieerd.

De migratie is uitsluitend uitgevoerd op Docker-project **setpiece-billing-local**, API `http://127.0.0.1:55321`, Postgres `127.0.0.1:55322`, eigen Docker-volumes/netwerk en private bucket `facturen`. Er is een echte synthetische Auth-eigenaarsessie. De lokale Supabase-CLI bindt services standaard aan alle hostinterfaces; de testinhoud is synthetisch en de stack wordt na acceptatie gestopt. Dit is data-isolatie, geen netwerkisolatieclaim. Er is geen gedeelde cloudpreview met geïsoleerde database/storage beschikbaar gesteld.

`supabase/config.toml` is lokale testconfiguratie: automatische migraties en seed uit. Start met `supabase start -x studio,realtime,edge-runtime,imgproxy,logflare,vector,mailpit,postgres-meta,supavisor`, voer eenmalig `node scripts/billing/local-setup.mjs` uit. De bootstrap controleert exact loopbackpoort 55322 en weigert een bestaande billinginstallatie te resetten. Hij maakt uitsluitend minimale historische testafhankelijkheden, synthetische Auth en benodigde oude leesgrants buiten productiemigraties. Secrets komen alleen in genegeerde `.env.local`. App: `npm run dev -- --port 3017 --hostname 127.0.0.1`. Testlogin staat uitsluitend als herkenbare lokale fixture in het bootstrap-script.

Er is geen `db reset`, `db push`, repair of herschrijving van bestaande migraties gebruikt. Tijdens ontwikkeling zijn nieuwe functies gericht op de geïsoleerde database vervangen. Definitieve migratie, nieuwe objectgrants en een volledige installatiecontrole worden in het eindverslag vermeld. Productie vereist afzonderlijk akkoord; pas daarna de gecontroleerde migratie toepassen en de door Supabase toegekende versie registreren volgens AGENTS.md. Niet blind de lokale omgeving aan productie koppelen.

De vertrouwde `private.sp_billing_deployment` moet per deployment één gevalideerde basis-URL bevatten. Lokaal `http://localhost:3017`; voor productie pas na akkoord de bevestigde HTTPS-host. Geen host uit requestheaders. `BILLING_BASE_URL` in lokale omgevingsconfiguratie documenteert dezelfde waarde; SQL gebruikt de private deploymentconfiguratie. Preview krijgt een eigen database/storage én eigen URL.

## Rekenen, veiligheid en herstel

Centen zijn bigint/BigInt en gaan als decimale strings door JSON. Aantal schaal 1000, max. 1.000.000, maximaal 100 regels; prijs en document max. 10^13 cent. SQL numeric-tussenproducten zijn begrensd vóór bigint-opslag. Half van nul af, btw eenmaal per groep. Deelcredit-btw is cumulatief, zodat het laatste restant exact sluit. Nummering deelt één sales-reeks voor facturen/credits per eigenaar/jaar; prefix reset de teller niet, 10000 wordt niet afgekapt. [Plan](facturatie-plan.md) bevat staten, rechtenmatrix, versierijen en lockvolgorde.

Alle businessmutaties lopen via bestaande `sp_command`; autorisatie is vóór cachehergebruik. Owner/admin-RLS geeft authenticated alleen SELECT, geen DML. Public wrappers zijn invoker; private helpers hebben waar nodig definer, lege search_path en expliciete grants. Definitieve inhoud/regels, audit en boekingshistorie worden ook met triggers beschermd. Samengestelde FK’s bewaken eigenaarrelaties; projecttype/werkgebied en personenrechten worden gecontroleerd. De brede postgres-/secretrollen kunnen deze afspraken omzeilen: geen WORM- of botisolatieclaim.

Definitief maken reserveert één nummer en bevriest document, mailsjabloonresultaat en ontvangers. PDF v1 gebruikt vaste metadata, renderer **4.9.0**, statische Space Grotesk-fonts en meegeleverde OFL. Tekstbreedtes worden met het geladen font gemeten en op vaste A4-pagina’s geplaatst; lange regels worden in begrensde vervolgblokken gesplitst, met herhaalde tabelkop en echte paginanummers. Bronlogo is het bestaande Werkspoor-vectorasset, als raster voor de PDF; geen nieuwe identiteit.

Herstel: render → `invoice.prepare_pdf` legt hash/bytes vast → upload zonder upsert → opgeslagen bytes/hash verifiëren → `invoice.attach_pdf` maakt dispatch en Jarvis-taak atomair. Na upload wordt het bestaande object gebruikt. Na verloren attach-respons wordt geen tweede dispatch gemaakt. Ontbreekt een voorbereid object én leveren de vastgelegde assets/library andere bytes, dan blokkeert de herstelroute met concrete integriteitsmelding; herstel met de bewaarde v1-assets/renderer, geen overschrijven of nieuw nummer. Na koppeling wordt nooit opnieuw gerenderd ter vervanging.

Browserdownload controleert iedere keer sessie/eigenaar/admin en hash. De connector krijgt een vaste GET-URL plus afzonderlijke Authorization-header, minimaal 32 willekeurige tokenbytes, uitsluitend hashopslag, 15 minuten en maximaal drie atomaire GET-pogingen. Geen token in pad, cache of audit. HEAD uniforme 404, fout/ingetrokken/verlopen uniforme 404, no-store/noindex/no-referrer en rate limiter. Externe infrastructuur kan Authorization-headers loggen; de app garandeert zulke hostinglogs niet. Next-developmentlogs voor Server Function-argumenten zijn uitgeschakeld. De app logt geen tokens of volledige payloads.

Export bewaart ook documenten zonder PDF expliciet in het manifest. Maximaal 200 documenten / 64 MB opgeslagen PDF’s; te grote selectie wordt volledig geweigerd met filteradvies. De lijst heeft een expliciete grens van 2000 documenten, geen stille afkapping. Andere facturen verrekenen en echte terugbetalingen zijn fase 3.

## Fiscale grenzen en gegevens

De basisvoorwaarden zijn gecontroleerd tegen [factuureisen](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/factuureisen/factuureisen), [afronding](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/btw-bedrag_afronden), [bewaren](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/administratie_bewaren/administratie_bewaren) en [uitreiken](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/facturen_maken) op 31 oktober 2026. Bijzondere categorieën zijn niet geïmplementeerd.

IBAN, rekeninghouder, ontvangers en mailsjabloon zijn extra productvoorwaarden; IBAN is geen algemene wettelijke factuureis. Onbekende gegevens blijven leeg. Definitief maken weigert placeholders, onvolledige feitelijke adressen, ontbrekende identificatie, ongeldige IBAN en onbekende templatevelden. Geplande datum moet bewust naar vandaag worden gezet en opgeslagen; geen stil terugdateren/toekomstfinalisatie. Gebruikelijke uitreiktermijn wordt ook bij definitieve maar onverzonden dienstfacturen gemeld. Voor vooruitbetalingen wordt geen universele deadline geclaimd.

Bewaarmarkering is 31 december van jaar + 7, zonder automatische verwijdering. Dit is een ondergrens: de bewaartermijn kan later beginnen zolang gegevens actueel blijven en in bijzondere situaties langer zijn. Er is geen volledige belastingaangifte in deze fase.

Open: echte Setpiece-bedrijfsnaam/eigenaar, feitelijk adres, btw-id/KVK, IBAN/rekeninghouder, definitieve mailtekst; Nes Ammims juridische naam/adres/land/hoedanigheid/btw en ontvangers; bevestigd testadres voor de afzonderlijke Gmail-ketentest. Deze gegevens zijn niet verzonnen of op productie ingevuld.

## Verificatie en design

Zie `docs/acceptatie/facturatie/` voor uitsluitend synthetische voorbeelden, vier breedtes, standaard-/credit-/meerpagina-PDF en ZIP/hashmanifest. `browser-resultaat.json` registreert de volledige ingelogde browserflow en labelt verzendbewijs expliciet als simulatie. Definitieve aantallen, reviewers, mogelijke beperkingen en checks volgen in het afsluitende log hieronder.

Gebruikte skills: Impeccable **4.1.1** (Operate), Taste **v2**, UI UX Pro Max bestaande installatie. SKILL.md SHA-256 respectievelijk `9d124382509eb15da0862f145bca0e53be00aaddb05272e4efc9a0832de048a9`, `d955dae4ba8ab2d994f4bb06b4bf412a1d9875433a8597939c391f4bae91dd7a`, `ea087c341bfb5b23195c7302027268ede86da802554c18a5c4896a6017b439f9`. Geen installatie/hooks/telemetrie met besloten inhoud. UI UX-zoekopdracht leverde drie passende regels voor foutsummary/focus/veldfeedback. Taste-draw seed 1836403440 gaf een pastelconsumerstijl; die is afgewezen wegens expliciet Werkspoor, 2px controls en geen tegels. Huisstijl is behouden. [Surfacebrief](../.impeccable/surfaces/beheer-facturen.md).

Mechanische detector: vijf advisories, alle in bestaande CSS vóór de facturatie-uitbreiding; nul in nieuwe componenten/CSS. Taste-lint: 0 FAIL, 1 WARN over vijf Nederlandse em-dash-streepjes (inhoudelijke gedachtestreep/typografie; geen structureel patroon). Harden/clarify/audit/polish worden op de complete flow gecontroleerd. Een automatische score is geen WCAG 2.2 AA-certificering. Bestaande DESIGN.md-sidecar is ouder dan het brondocument; geen ongevraagde globale designreparatie.

## Vervolg na afzonderlijk akkoord

Review de lokale commits en deze resultaten. Daarna kan Nathan afzonderlijk toestemming geven voor push/PR, een echte geïsoleerde cloudpreview en vervolgens productiemigratie/deploy. De Gmail-ketentest heeft nog een eigen akkoord plus bevestigd testadres nodig. Lokale appacceptatie, Jarvis-beschikbaarheid, Gmail-keten en live productie zijn afzonderlijke resultaten.
