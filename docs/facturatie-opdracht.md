# Bouwopdracht voor Codex: facturatie in Setpiece-beheer

Versie: 31 oktober 2026. Dit is een zelfstandige, aangescherpte vervanging van `bouwopdracht-codex.md`. Gebruik de oude opdracht niet daarnaast als tweede specificatie. Deze opdracht beschrijft de bouw; zij is geen bewijs dat functies al bestaan of zijn getest.

## 1. Opdracht en eerste resultaat

Bouw een facturatiemodule in de bestaande Setpiece-beheeromgeving `/beheer`. Gebruik dezelfde applicatie, database, authenticatie, commandstructuur en huisstijl. Nathan wil facturen beheren zonder een apart boekhoudabonnement.

Voer in deze run **alleen fase 1** uit. Werk door tot de lokaal uitvoerbare implementatie, verificatie, documentatie en lokale commits gereed zijn. Latere fasen zijn de routekaart, geen opdracht om ze nu alvast te bouwen. Als toegang voor een controle ontbreekt, rond onafhankelijk werk af en rapporteer die controle als niet uitgevoerd.

Fase 1 levert instellingen, klanten, concepten, definitieve facturen, herstelbare PDF-opslag, volledige en gedeeltelijke creditfacturen, handmatige betalingen, de verzendwachtrij voor Jarvis en de bijbehorende UI en documentatie. Een klein archiefexport hoort al bij deze fase; bankimport en fiscale kwartaalrapportage volgen later.

Het eerste praktijkscenario is Nes Ammim. Nathan moet een concept kunnen controleren, zelf definitief maken en als PDF downloaden. Jarvis kan daarna via zijn bestaande koppeling een Gmail-concept voorbereiden. Nathan verstuurt zelf; Jarvis registreert pas daarna de verzending. De app bevat geen facturatiemailkoppeling.

Een nieuwe taak in de database activeert Jarvis niet vanzelf. Oplevering van de app, beschikbaarheid van Jarvis en een werkelijk doorlopen Gmail-ketentest zijn afzonderlijke resultaten.

## 2. Werkgrenzen en toestemming

- Deze bouwopdracht staat lokale implementatie, lokale tests, geïsoleerde testdata en lokale commits toe. Geen push, PR, productiemigratie of productiedeployment zonder Nathans expliciete akkoord voor die fase.
- Lever een preview als een bestaande, geschikte testomgeving beschikbaar is en het publiceren ervan is toegestaan. De preview moet uitsluitend een geïsoleerde database en storage gebruiken. Ontbreekt dat, lever het gereedstaande werk en de exacte benodigde vervolgstap; claim geen previewacceptatie.
- Geen `db reset`, ongerichte `db push`, migratie-repair of wijziging van bestaande migratiehistorie op de gedeelde database. Testmigraties alleen op een aantoonbaar geïsoleerde lokale omgeving of Supabase-branch. Productie pas na faseakkoord, met de gecontroleerde migratie en registratie volgens de repodocumentatie.
- Geen echte personen, facturen of bankgegevens verwijderen. Geen definitieve testfacturen op productie, ook niet binnen een rollbacktest. Schrijf bij deze bouwrun geen echte klantconcepten op productie; lever daarvoor een beoordeelbaar voorstel of voer het pas uit na expliciete toestemming.
- Geen Gmail-concept, bericht of contactactie naar echte klanten tijdens de bouw. De live ketentest met Jarvis vereist apart akkoord en gebruikt een bevestigd testadres van Nathan.
- Bewaar geheimen uitsluitend in de bestaande veilige omgevingsconfiguratie. Geen sleutels, sessietokens, PDF-tokens, bankbestanden of volledige payloads in commits, screenshots, logs of activiteiten. Een IBAN is bedrijfsinformatie in beveiligde instellingen en op de factuur; geen API-geheim en geen hardcoded broncodewaarde.
- De publieke website en bestaande beheerfuncties moeten blijven werken. Wijzig alleen wat voor deze module nodig is.

## 3. Verken eerst de echte situatie

Repository: `Nathansudmeier/setpiece`. Beoogde basis: `codex/setpiece-beheer`. Controleer vóór wijzigingen de remote, branch, HEAD en werkstatus. Gebruik een aparte werkboom als de bestaande checkout ander werk bevat. Maak `codex/facturatie` vanaf de geverifieerde basis; overschrijf geen bestaande branch. Rapporteer afwijkingen en behoud later werk als de opgegeven basis achterloopt.

Lees eerst:

- `AGENTS.md` en overige geldende projectinstructies;
- `package.json`, lockfile, `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`;
- `docs/jarvis-instructie.md`, `docs/beheer-koppeling.md`, `docs/beheer-voortgang.md`;
- `docs/superpowers/specs/2026-10-20-beheer-design.md`;
- alle migraties die de actuele workspace-, CMS-, rechten- en conflictfuncties vormen, inclusief `20261020104625_setpiece_workspace.sql` en `20261020111609_setpiece_conflict_responses.sql`;
- `app/beheer/work-actions.ts`, `lib/beheer/{data,model,auth,format}.ts`;
- `lib/supabase/{server,admin}.ts`, `lib/security/rate-limit.ts`;
- `components/beheer/{Navigation,PersonPicker}.tsx`, de beheerlayouts, bestaande export en tests.

Op de opgegeven GitHub-branch zijn op 31 oktober 2026 Next.js 16.2.11, React 19.2.7, Supabase SSR 0.12.0 en supabase-js 2.110.0 aangetroffen. Verifieer dit opnieuw. `npm run verify` voert lint, tests en build uit; `npm run typecheck` is aanvullend. De app gebruikt eigen CSS, `bw-*`-klassen en `--ws-*`-tokens, geen Tailwind.

Volg het repo-AGENTS-bestand: lees relevante geïnstalleerde Next.js-documentatie in `node_modules/next/dist/docs/` vóór routes, server actions of caching. Zoek actuele librarydocumentatie met Context7 wanneer API-syntaxis of configuratie nodig is. Installeer ontbrekende dependencies met de package manager en conventies uit de repo, met bijgewerkte lockfile.

Bekende omgeving, opnieuw read-only controleren als toegang beschikbaar is: Supabase `rgtpeugwsxfqlyugfrbq`, eu-west-2; productie `https://www.setpiece.nl/beheer`. De oude opdracht beschrijft contacten in `contacten.personen`, bestaande `sp_*`-werktabellen en nog geen storage-buckets. Behandel die databasestand als een te verifiëren aanname, niet als actuele zekerheid.

De huidige server-adminclient gebruikt `SUPABASE_SECRET_KEY` en heeft beperkte TypeScript-databasetypes. Verbreed die zorgvuldig of voeg een passend getypeerde billingclient toe. Omzeil typen niet met `any` of ongecontroleerde casts.

Leg vóór implementatie een beknopt plan met fase-1-scope, toestanden, rechtenmatrix en testomgeving vast in `docs/facturatie-plan.md`. Los keuzes uit deze opdracht zelfstandig op; vraag alleen om ontbrekende gegevens die werkelijk een afhankelijke stap blokkeren.

## 4. Ontwerp en skills

Gebruik Impeccable, `design-taste-frontend` en UI UX Pro Max voor de UI. Lees hun daadwerkelijk beschikbare `SKILL.md` en relevante app-screen-referenties. Gebruik bestaande installaties als ze geschikt zijn. Installeer ontbrekende skills projectlokaal volgens de geverifieerde upstreamdocumentatie. Geen globale installatie, automatische projecthook-goedkeuring of verplichte sessieherstart als onderdeel van het bouwscript.

De oude opdracht noemt versies en commando's voor deze tools. Neem die niet ongecontroleerd over. Leg de gebruikte versie of commit vast en voer alleen daadwerkelijk ondersteunde scripts uit. Een ontbrekende skillcontrole is een expliciet open punt; verzin geen groene uitkomst. Commit uitsluitend bedoelde gedeelde skillartefacten. Schakel eventuele telemetrie uit volgens de ondersteunde configuratie voordat besloten inhoud wordt verwerkt.

Het Werkspoor-design uit de repo heeft voorrang op skillvoorstellen voor palet, fonts, componenten en schaal. Gebruik Impeccable in modus Operate, Taste voor app-schermen en UI UX Pro Max voor formulieren, tabellen en toegankelijkheid. Behoud Space Grotesk en het bestaande palet. Leg de schermkeuzes vast in `.impeccable/surfaces/beheer-facturen.md`.

Voer na de bouw de beschikbare harden-, clarify-, audit- en polish-controles uit en registreer concrete resultaten. WCAG, foutafhandeling en visuele controle horen al bij fase 1; fase 4 mag daarvoor geen uitstel worden.

## 5. Btw en verplichte gegevens

### 5.1 Reikwijdte

Maak EUR-verkoopfacturen voor de Nederlandse eenmanszaak Setpiece. Standaard: factuurstelsel. Bied geen instelbaar kasstelsel aan zolang de verwerking daarvan niet volledig is gebouwd en getoetst.

Ondersteun reguliere Nederlandse 21%- en 9%-regels. Voor 0%, vrijstelling en verlegging zijn aparte, gevalideerde fiscale categorieën en onderbouwingen nodig. Behandel een intracommunautaire dienst nooit automatisch als een gewone 0%-prestatie. Maak onderscheid tussen binnenlandse verlegging en EU-B2B-diensten. Ondersteun een categorie pas voor definitief maken als de vereiste gegevens, teksten en aangifterubricering zijn uitgewerkt en getest. Anders is de categorie expliciet niet beschikbaar; registreer die beperking.

Voeg voor die categorieën een expliciete behandeling toe aan het model, bijvoorbeeld `tax_treatment`, naast `vat_code` en het afgeleide tarief. Eén nulpercentage is onvoldoende om latere aangifterubrieken vast te stellen. Definieer de toegestane combinaties in één vastgelegde mapping en controleer ze ook in de database. Geen vrije clientinvoer voor tarief of aangifterubriek.

Voor Nes Ammim zijn juridische afnemer, factuuradres, vestigingsland en relevante hoedanigheid nog niet bevestigd. **De genoemde 21% is een scenarioaanname.** Leid de btw-behandeling niet af uit de contactpersoon, organisatienaam of Nederlandse e-mail. Vraag Nathan om bevestiging voordat een echte factuur definitief kan worden. Bouw geen internationale fiscale beslisboom op basis van aannames. Als de benodigde behandeling nog niet ondersteund is, meld de concrete uitbreiding die nodig is.

### 5.2 Validatie bij definitief maken

Vereis factuurdatum, verkopersnaam en feitelijk adres, btw-id, KVK, afnemersnaam en adres, dienstomschrijving en omvang, prijs excl. btw, relevante dienst-/vooruitbetalingsdatum of periode, maatstaf en btw per categorie en totaal. Vereis aanvullende btw-identificatie en wettelijke tekst voor ondersteunde bijzondere behandelingen. Een credit bevat ook nummer en datum van het origineel.

Daarnaast zijn voor dit product een geldig IBAN, rekeninghouder, bruikbare ontvanger en ingevuld mailsjabloon verplicht vóór definitief maken. Dit zijn productvoorwaarden; noem een IBAN niet ten onrechte een algemene wettelijke factuureis. Ontbrekende gegevens blokkeren alleen definitief maken, niet het opslaan van een incompleet concept.

Bewaar onbekende waarden als leeg/null, geen letterlijke `{{PLACEHOLDERS}}` als geldige gegevens. Weiger bij definitief maken ook placeholderachtige waarden en oningevulde templatevelden. Datum- en adrescontroles gelden server-side én in SQL; clientvalidatie is alleen feedback.

### 5.3 Bewaren en uitreiken

Gebruik als basis een bewaarmarkering tot en met 31 december van factuurjaar + 7, bijvoorbeeld 31-12-2033 voor 2026. Documenteer dat dit een ondergrens voor het product is: de fiscale bewaartermijn kan later beginnen zolang gegevens nog actueel zijn, en voor sommige situaties gelden langere termijnen. Er komt geen automatische verwijdering op basis van deze markering.

Waarschuw voor nog niet uitgereikte facturen rond de 15e van de maand na de dienst. Definitief maken, een PDF opslaan en een Gmail-concept maken zijn geen bewijs van verzending. Toon de waarschuwing dus ook bij definitieve maar onverzonden facturen. Voor vooruitbetalingen en bijzondere situaties: geen onjuiste universele deadlineclaim.

Officiële bronnen en de grenzen van de ondersteuning staan in sectie 17. Verifieer veranderlijke fiscale regels vóór implementatie van een bijzondere categorie.

## 6. Rekenen en gegevensuitwisseling

- Sla geld op als PostgreSQL `bigint` in centen. Gebruik in TypeScript integer-/BigInt-rekenwerk. Zet bedragen bij JSON-uitwisseling om naar gevalideerde decimale **strings**, zodat geen precisie verloren gaat. Bestaande workspacevelden veranderen niet van contract.
- Aantal: maximaal drie decimalen, invoer als decimale string, intern exact op schaal 1000 of exact SQL `numeric`. Geen floating-pointvermenigvuldiging voor bedragen; geen exponentnotatie of onbeperkte invoer. Leg bovengrenzen voor regels, aantal en bedrag vast en test overflow.
- Regelnetto = exact afgerond aantal × prijs in centen, half van nul af. Positief 1,5 × 12345 cent geeft 18518 cent; een spiegelcredit geeft -18518.
- Btw = per fiscale categorie/tarief de som van regelnetto × tarief, eenmaal afgerond op centen. Kies deze methode consequent. `line_vat_cents` is informatief; presenteer de som daarvan niet als factuurtotaal als er een afrondingsverschil is.
- Half van nul af is expliciet symmetrisch: 41359,5 cent wordt 41360; -41359,5 wordt -41360. Gebruik niet blind `Math.round` voor negatieve credits.
- De SQL-commandfunctie rekent zelfstandig en is de definitieve autoriteit. Negeer geen meegestuurde vervalste totalen: weiger beschermde velden. De browser gebruikt dezelfde vastgelegde rekenregels voor preview. Gedeelde testvectoren bewijzen gelijkheid tussen SQL en TypeScript; claim geen letterlijk gedeelde functie tussen die talen.
- `formatEuro` geeft overal dezelfde Nederlandse valutaweergave, inclusief vastgelegde niet-afbrekende spaties uit `Intl`. Als omzetting naar `number` nodig is, bewaak het veilige bereik expliciet. Geen rekenen met een geformatteerd bedrag.
- Kalenderdatums blijven `YYYY-MM-DD`, zonder verschuiving door UTC-conversie. Timestamps zijn `timestamptz`; menselijke weergave en vandaag gebruiken Europe/Amsterdam.

## 7. Datamodel en invarianten

Ontwerp additieve migraties naar de bestaande patronen. Het SQL-schetsmodel uit de oude opdracht is geen uit te voeren migratie: het bevat ontbrekende velden en tegenstrijdige lifecyclekeuzes.

Fase 1 heeft minimaal:

- `sp_billing_settings`: bedrijfsgegevens, bank, betaaltermijn, nummerinstellingen, factuurmailsjabloon, versie en tijden;
- `sp_customers`: juridische/factuurnaam, optionele bestaande persoon, ontvangers, adres, land, btw-/KVK-gegevens, project, voorwaarden, actief/gearchiveerd;
- `sp_invoices`: identiteit, eigenaar, klant/project, kind, verwijzing naar origineel, documentstatus, nummerreeks, datums, referentie, teksten, bedragen, belastinguitsplitsing, bevroren documentgegevens, PDF-verwijzing/hash, auditmetadata en bewaarmarkering;
- `sp_invoice_lines`: stabiele regel-ID, volgorde, omschrijving, exact aantal, eenheid, prijs, fiscale behandeling, dienstperiode, bedragen en verwijzing naar gecrediteerde oorspronkelijke regel;
- `sp_payments`: factuur, datum, positief ontvangen bedrag, methode, notitie, geldig/teruggedraaid, terugdraaireden, wie/wanneer, versie en tijden;
- `sp_invoice_dispatches`: factuur, soort, ontvangers inclusief cc, bevroren onderwerp/tekst, bijlagenaam, status, Gmail-ID's, verzendtijd, annulering en werkactie;
- private nummerreeksen en private PDF-tokenregistratie;
- een afgeschermde, doorzoekbare factuur-auditrelatie als aanvulling op de bestaande activiteitstructuur, zonder bestaande `item_id`-relaties te misbruiken.

Elke mutabele businessrij krijgt versie en wijzigingstijden. Append-only historische rijen hoeven geen kunstmatige wijzigingsroute. Interne tellers gebruiken een lock en blijven buiten publieke reads. Databaserechten, triggers en commands beschermen ook tegen wijzigingen buiten de UI.

Alle relaties moeten dezelfde eigenaar houden. Gebruik passende samengestelde FK's of gelijkwaardige databasecontroles; een losse `owner_id` plus losse FK is onvoldoende. Projecten moeten `kind=project`, eigenaar en werkgebied `setpiece` hebben. Personen mogen alleen worden gekoppeld via de bestaande contactenrechten. Er ontstaat geen tweede personenbestand en geen hardcoded Jolande-UUID.

### 7.1 Documentstatus, betaling en credit zijn aparte feiten

Bewaar documentstatus als `concept`, `definitief`, `klaar_voor_verzending`, `verstuurd` of `vervallen`. `vervallen` kan uitsluitend vanuit concept. Betaal- en creditstatus worden apart afgeleid uit geldige boekingen en definitieve credits. De UI mag combinaties tonen, bijvoorbeeld 'Betaald · wacht op verzending'.

Een betaling vóór verzending verhindert nooit `invoice.mark_sent`. Een volledig gecrediteerde factuur houdt haar oorspronkelijke bedragen, documentstatus en geschiedenis. Toon daarnaast `gecrediteerd`. Afgeleide labels overschrijven geen verzendbewijs.

Voor een gewone factuur:

`saldo = oorspronkelijk totaal - absolute definitieve credits - geldige ontvangsten`.

Toon positief saldo als open, nul als voldaan/verrekend en negatief als klanttegoed. Klem een negatief saldo niet stilzwijgend op nul. Houd ontvangen geld, gecrediteerde omzet en terug te betalen bedragen uit elkaar. Een creditfactuur heeft geen gewone incassovervalstatus en krijgt niet automatisch een fictieve negatieve betaling.

Fase 1 boekt alleen ontvangsten op gewone facturen en kan zulke boekingen terugdraaien. Blokkeer ontvangst op concepten en creditfacturen. Toon resterend klanttegoed expliciet; daadwerkelijke terugbetalingen/verrekening met andere facturen krijgen pas in fase 3 een eigen ontworpen command. Geen automatische bankactie.

`te laat` vereist een gewone definitieve factuur, positieve openstaande vordering en verstreken vervaldatum. Toon daarnaast of verzending nog ontbreekt. Herinneringen zijn later alleen toegestaan voor daadwerkelijk verstuurde facturen met openstaand saldo.

### 7.2 Onveranderbaarheid

Bij definitief maken bevriest alle documentinhoud: regels, tarieven, totalen, datums, verkoper, afnemer, IBAN/betaaltekst, juridische teksten en verwijzing naar het origineel. PDF-rendering gebruikt uitsluitend deze gegevens, geen actuele klant-/instellingenrijen.

Bevries ook de voorgenomen factuurverzending bij definitief maken: ontvangers, onderwerp en tekst. Een PDF-retry dagen later mag geen andere klantgegevens, bankgegevens of mailsjabloon gebruiken.

Triggers bewaken `INSERT`, `UPDATE` **en** `DELETE` op regels, niet alleen updates. Verplaatsen van regels tussen facturen, toevoegen aan een definitieve factuur, terugzetten naar concept, wijzigen van eigenaar of factuurnummer en verwijderen zijn verboden. Alleen expliciet toegestane systeemvelden mogen via gecontroleerde commands veranderen. Definieer de toegestane overgangen, geen algemene vrijstelling voor 'status'.

Binnen een concept mag Nathan regels verwijderen uit de zichtbare factuur. Bewaar bestaande regels daarvoor als inactief/historisch; geen fysieke delete van opgeslagen regels. Alleen actieve regels tellen mee. Regel-ID's uit de bestaande factuur blijven behouden. Gebruik een unieke actieve positie en voer herordening atomair uit.

## 8. Commandcontract, rechten en gelijktijdigheid

Alle businessmutaties lopen via de bestaande `public.sp_command(p_request_id, p_operation, p_payload, p_expected_version)`. Breid de actuele private dispatch uit; herstel geen oude functiedefinitie waardoor latere CMS- of PT409-aanpassingen verdwijnen.

Eén transactie omvat wijziging, noodzakelijke gekoppelde werkacties, audit en idempotentieresultaat. Gebruik interne helpers om gekoppelde taken atomair te maken; start geen losse, ongerelateerde commandtransactie. Houd bestaande workspace-operaties intact.

De publieke wrappers zijn, conform de repo, `security invoker`. Private mutatie-/readhelpers gebruiken waar nodig `security definer`, leeg `search_path`, volledig gekwalificeerde objectnamen, expliciete grants en eigenaarcontrole. Default `PUBLIC EXECUTE` intrekken. Geen schrijfgrant voor `authenticated` op billingtabellen; owner/admin-RLS geeft alleen lezen. Anon en niet-admin krijgen geen gegevens of toegestane billingcommands.

Een vereiste gebruikerssessie betekent **geverifieerde eigenaar én actuele adminregistratie**, niet alleen `auth.uid() is not null`. Zowel app als SQL controleren dit. Bij connector/service zonder gebruikerssessie weigeren de onderstaande mensenacties met `42501`.

| Fase-1-operatie | Eigenaarsessie vereist | Gedrag |
|---|---|---|
| `settings.update` | ja | Sectiegewijze update met versiecontrole; wijzigt geen bevroren facturen |
| `customer.create/update` | nee | Eigen klant, bestaande toegankelijke persoon; archiveren via status |
| `invoice.create/update` | nee | Alleen concept, volledige actieve regelset, exact herberekenen |
| `invoice.void` | nee | Alleen concept laten vervallen |
| `invoice.finalize` | ja | Verplichte gegevens, snapshots, nummer, audit; nog geen externe opslag |
| `invoice.attach_pdf` | ja | Eenmalige gecontroleerde PDF-koppeling plus één verzendopdracht en Jarvis-actie |
| `invoice.credit` | ja | Volledige of gedeeltelijke credit definitief maken en origineel bijwerken |
| `invoice.correct` | ja | Expliciete volledige resterende credit plus nieuw gecorrigeerd concept, atomair |
| `dispatch.draft_ready` | nee | Concept-ID vastleggen; geen verzending |
| `invoice.mark_sent` | voor handmatig: ja | Werkelijk verzendbewijs registreren; Gmail via connector toegestaan |
| `dispatch.cancel` | ja | Open opdracht annuleren, gekoppelde actie archiveren |
| `payment.record/reverse` | ja | Ontvangst vastleggen of met reden terugdraaien |

'Nee' betekent toegang voor de bestaande bevoegde connector volgens `sp_owner`, niet toegang voor willekeurige gebruikers of anon. De postgres-connector en de server-secretrol hebben ruime rechten en kunnen procedures omzeilen. Leg deze beperking eerlijk vast; claim geen technische botisolatie. Menselijke toestemming kan daarmee niet tegen een kwaadwillende superuser worden afgedwongen.

Verzoek-ID: 8–160 tekens; payload maximaal 100000 bytes volgens het bestaande contract. Onbekende velden en beschermde velden weigeren. Leg per mutatie vast op welke rij `p_expected_version` slaat: invoice voor regels/finalize/credit/correct, payment voor reverse, dispatch voor draft_ready/cancel/mark_sent, settings/customer voor hun update. Creatie gebruikt null. Gekoppelde rijen worden in dezelfde transactie vergrendeld en gecontroleerd. Documenteer de vaste lockvolgorde.

Eén stabiele request-ID hoort bij **één onveranderlijke poging met dezelfde payload, operatie en verwachte versie**. Gebruik bij dubbelklik of onzekere netwerkuitkomst dezelfde ID. Na een bevestigde opslag, gewijzigde payload of bewust opgeloste validatiefout volgt een nieuwe intentie met nieuwe ID. Gebruik niet één verborgen ID voor de hele levensduur van een formulier of voor zowel opslaan als definitief maken.

Dezelfde ID met afwijkende inhoud geeft `23505`. Een zakelijke versieconflict geeft `PT409`, nooit `40001`. Geen automatische conflictoverschrijving. Bij een echte netwerkretry: maximaal twee begrensde retries met dezelfde intentie. Bewaar invoer bij fout/conflict en toon een herstelactie.

Controleer actuele autorisatie en de eventuele eis van een gebruikerssessie ook voordat een eerder resultaat wordt teruggegeven. Een idempotentieresultaat mag geen ontsnappingsroute voor een verboden actor zijn.

Audit is onveranderbaar, herkenbaar per factuur/dispatch/payment en bevat actor uit de bestaande vertrouwde context. Geen payloadgestuurde botidentiteit. Eén businesshandeling levert precies één bedoelde billing-auditgebeurtenis; expliciete taakgebeurtenissen zijn apart herkenbaar. Een natuurlijke idempotente herhaling maakt geen tweede business-audit of taak.

## 9. Nummering en credits

Ken een nummer pas toe bij definitief maken, in dezelfde transactie na validatie. Gebruik een tellerrij per eigenaar/reeks/jaar met concurrency-veilige initialisatie en `FOR UPDATE`, geen database-sequence. Formaat `F2026-0001`; minimaal vier cijfers, zonder afkappen bij 10000. Een mislukte transactie verbruikt geen nummer.

Standaard één reeks voor facturen en credits. Nummering is uniek binnen eigenaar en reeks; prefixwijzigingen mogen bestaande reeksen niet resetten of botsingen creëren. Leg dit vast en test jaarwisseling en prefixwijziging. Een aparte creditreeks is optioneel voor een latere uitbreiding; bouw geen onbeproefde configuratie.

`invoice.credit` verwijst naar een gewone definitieve factuur van dezelfde eigenaar. De credit bewaart oorspronkelijke afnemer, verkoper en fiscale behandeling als basis; geen actuele adres-/tariefvervanging. Bij verouderde bedrijfsgegevens die correctie vereisen: leg een afzonderlijke gecontroleerde aanpak vast, wijzig nooit stil het origineel.

Vergrendel het origineel voordat resterende crediteerbare bedragen worden bepaald. De som van definitieve credits mag per oorspronkelijke regel en belastinggroep nooit het origineel overschrijden, ook niet bij twee gelijktijdige requests. Een credit op een credit weigeren.

Een volledige credit spiegelt exact de opgeslagen oorspronkelijke netto- en btw-totalen. Bij deelcredits wordt btw per groep cumulatief bepaald: afgeronde btw over de cumulatief gecrediteerde grondslag minus reeds gecrediteerde btw. Daardoor is het laatste restant exact en kunnen twee halve credits geen extra btw-cent creëren. Een definitieve credit is de blijvende grondslag voor deze telling, ook als haar PDF nog ontbreekt. Test grensgevallen met één cent en eerdere deelcredits.

Een volledige credit annuleert open verzending van het origineel en open herinneringen, met reden en taakafhandeling, in dezelfde transactie. Deelcredit: annuleer open herinneringen met een inmiddels onjuist bedrag. Als het origineel nog niet verstuurd is, sta een deelcredit daarop niet toe; bied volledige correctie aan, zodat geen verouderde factuurmail vertrekt. Vermeld deze productgrens in de UI.

De credit krijgt een eigen nummer, PDF en verzendopdracht via dezelfde herstelbare route. Reeds geboekte ontvangsten verdwijnen niet; eventueel klanttegoed blijft zichtbaar. Definitieve facturen en credits blijven beide in omzet/btw-brondata aanwezig; filter een volledig gecrediteerd origineel niet weg.

`invoice.correct` is een bewuste menselijke actie, met bevestiging. De credit en het nieuwe concept worden atomair aangemaakt en zijn gekoppeld; daarna zijn beide identiteiten terug te vinden. Het nieuwe concept krijgt geen nummer en wordt niet automatisch definitief of verzonden. Bij eerdere deelcredits: kopieer alleen de vastgelegde resterende correctiescope, geen onbedoelde dubbele volledige factuur.

## 10. PDF, storage en herstel

Gebruik bij voorkeur `@react-pdf/renderer` server-side in Node. Controleer compatibiliteit met de werkelijke versies en fonts; kies alleen gemotiveerd een alternatief. Geen Edge-runtime en geen browserrendering op productie. Neem de fontlicentie mee bij statische fontassets.

Maak een privébucket `facturen`, alleen PDF, maximaal 5 MB. Pad: `{owner_id}/{jaar}/{nummer}-{invoice_id}.pdf`. Gebruik geen publieke URL en geen upsert. Sessie-toegang vereist eigenaar plus actuele admin; server-secretgebruik is beperkt tot gecontroleerde opslag/download na autorisatie. De app bevat geen update-/deletepad voor definitieve PDF's. RLS is geen WORM-garantie tegen de brede secret-/postgresrollen.

Definitief maken bestaat uit herstartbare stappen:

1. `invoice.finalize` bevriest de inhoud en reserveert het nummer transactioneel.
2. Render uit die inhoud. Gebruik een vastgelegde document-/templateversie en stabiele metadata. Bereken SHA-256 over de daadwerkelijke bytes en upload zonder overschrijven.
3. Controleer het opgeslagen object, hash en bytes server-side. Roep met de eigenaarsessie `invoice.attach_pdf` aan; die koppelt één PDF en maakt atomair één factuurdispatch plus één Jarvis-actie.
4. Na mislukking blijft de genummerde factuur bestaan. Toon 'De PDF is nog niet gemaakt' of de concrete hervatbare stap, met **PDF maken**. Geen nieuw nummer en geen terugzetten naar concept.

Herstel is expliciet getest na renderfout, uploadfout, succesvolle upload maar mislukte attach, verloren attach-respons en dubbelklik. Bestaat het object al, overschrijf het niet en ga niet eindeloos opnieuw uploaden. Haal het bestaande object op, controleer integriteit en herkomst bij de bevroren factuur en hervat de koppeling. Sla zo nodig vóór upload gecontroleerde renderidentificatie/hash vast via een interne voorbereidingsstap; werk dat contract en de cleanupvrije herstelroute in het plan uit.

Claim geen byte-identieke rendering alleen omdat er geen datum 'nu' in de inhoud staat: PDF-metadata, libraryversie en fonts kunnen bytes veranderen. Het eenmaal opgeslagen, geverifieerde object is het archiefexemplaar. Na koppeling nooit opnieuw renderen als vervanging. Bewaar templateversie en benodigde assets voor nog niet voltooide facturen bij een volgende deployment.

De app mag geen willekeurige `pdf_path`/hash van een client vertrouwen. Controleer eigenaar, factuurpad, type, lengte en opgeslagen hash in de bevoegde serverroute. Database-attachment accepteert alleen de strikt bij de factuur passende metadata; brede rolbeperkingen blijven gedocumenteerd.

Download via `/beheer/facturen/[id]/pdf`: per request sessie/eigenaar/admin, hashcontrole, private/no-store, noindex, passende Content-Disposition en veilige bestandsnaam. PDF-viewer en download gebruiken dezelfde gecontroleerde bytes. Hashfout: niet streamen, geen link als 'geverifieerd' tonen, herstelmelding met factuur-ID zonder secrets.

PDF-opmaak: A4, marges 18 mm, logo links en titel/nummer/datums rechts, Van/Aan, dienstperiode, regelstaat met rechts uitgelijnde bedragen, btw per groep, totalen, juridische tekst en betaalinstructie. Huisstijl voor het document: navy `#0F2A52`, één oranje accent `#E8A020`, crème `#F5F2EC`, leesbare donkere tekst. Beheer-UI blijft Werkspoor. Gebruik bestaande logoassets en geschikte statische Space Grotesk-gewichten indien de renderer die nodig heeft.

Betaalinstructie gebruikt de echte betaaltermijn en bevroren bankgegevens, geen hardcoded 14 dagen. Credit: 'Te verrekenen/terug te ontvangen', geen opdracht om het negatieve bedrag over te maken. Ondersteun lange omschrijvingen en meerdere pagina's zonder overlappende regels, met herhaalde tabelkop en echte paginanummering. Titel en taal `nl-NL` in metadata. Conceptvoorbeeld: CONCEPT, geen nummer, geen archiefopslag. Bijlage: `Setpiece-factuur-F2026-0001.pdf`.

## 11. Verzendwachtrij en Jarvis

### 11.1 Dispatch en berichtbewijs

Een PDF-koppeling maakt één dispatch en één open taak voor Jarvis in werkgebied `setpiece`: 'Zet mailconcept klaar: factuur {nummer} aan {klant}', absolute `source_url`, datum en correcte factuurverwijzing. Gebruik de bestaande taakconventies en interne atomische helpers. De taak is een signaal voor Jarvis, geen bewijs van uitvoering.

Dispatchstatus: `wacht_op_concept`, `concept_klaar`, `verstuurd`, `geannuleerd`. Onderwerp, body, to, cc, afzenderverwachting `nathan@setpiece.nl`, bijlagenaam en dispatchreferentie staan vast. Eén actieve factuurdispatch per factuur; geannuleerde exemplaren verdwijnen niet. Geef Nathan een gecontroleerde **Opnieuw klaarzetten**-route voor een geannuleerde, nog onverstuurde factuur, met eigenaarsessie, audit en bevestiging van ontvangers/inhoud. Voeg hiervoor `dispatch.requeue` toe; maak nooit een tweede actieve opdracht.

Jarvis leest de outbox, controleert de PDF-hash, maakt uitsluitend een concept in de juiste Gmail-mailbox en registreert het draft-ID met `dispatch.draft_ready`. Een retry met hetzelfde draft-ID levert hetzelfde resultaat. Een ander draft-ID op dezelfde actieve opdracht is een conflict dat eerst moet worden onderzocht.

Gmail en SQL vormen geen gezamenlijke transactie. Onderbreking ná conceptcreatie maar vóór `draft_ready` kan een duplicaat veroorzaken. Documenteer herstel: eerst bestaand concept zoeken op unieke dispatchreferentie, ontvangers en bijlage, daarna pas eventueel nieuw maken. Verzin geen cross-system exactly-once-garantie.

Nathan drukt zelf op Verstuur. Jarvis roept `invoice.mark_sent` pas aan na een werkelijk gevonden bericht in Verzonden met juiste mailbox, dispatchreferentie, ontvangers, nummer en bijlage/hash waar beschikbaar. Alleen dezelfde thread of een draft-ID is onvoldoende bewijs; een thread kan meerdere berichten bevatten. Gmail-bewijs blijft een verantwoordelijkheid van de connector, geen door SQL onafhankelijk geverifieerd feit.

`invoice.mark_sent` vergrendelt de dispatch en controleert juiste eigenaar, document/PDF, toegestane opdrachtstatus, to én cc, `sent_at` en `sent_via`. Geen toekomst buiten vijf minuten marge; geen tijd vóór finalize of het aanmaken van de betreffende dispatch. Gmail vereist message-ID. Handmatig vereist eigenaarsessie. Een betaalstatus verhindert registratie van echte verzending niet.

Bij dezelfde request-ID geeft het command het eerdere resultaat. Bij nieuwe request-ID en exact hetzelfde bestaande verzendbewijs geeft het dezelfde businessuitkomst zonder extra audit. Een ander message-ID of afwijkend bewijs op een al verstuurde opdracht geeft `23505`. Uniek message-ID per eigenaar; genormaliseerde, gevalideerde mailboxadressen, geen eenvoudige vergelijking van ongeparseerde kommagescheiden tekst.

De noodknop **Markeer als verstuurd** vraagt datum/tijd, ontvangers en notitie. Zij registreert alleen wat Nathan daadwerkelijk heeft verzonden. Rond de Jarvis-taak met resultaat af of archiveer hem conform de gekozen handmatige afhandeling. Leg één consistente keuze vast. Betaalstatus blijft afgeleid; herinneringsverzending verandert later niet de oorspronkelijke factuurverzendvelden.

Annuleringen blijven zichtbaar voor Jarvis zolang een bekend concept moet worden afgehandeld, niet slechts zeven dagen. Documenteer hoe Jarvis de annulering bevestigt; geen automatische verwijdering in Gmail. Requeue en credit trekken oude PDF-tokens in en sluiten een racesituatie met `draft_ready` af via locks/versiecontrole.

### 11.2 Outbox en PDF-links

`public.sp_invoice_outbox(...)` gebruikt het bestaande invoker/private-definerpatroon. Alleen bevoegde eigenaar/connector. Retourneer dispatch-ID/versie/status, soort, bevroren verzendvelden, task-ID, factuur-ID/nummer/datums/totaal/saldo, PDF-hash/bytes en bestaande contactverwijzing. Geen PDF-bytes. Gebruik keysetpaginering met cursor, stabiele volgorde en `has_more`; een limiet van 100 zonder vervolgcursor mag geen opdrachten onbereikbaar maken.

`public.sp_invoice_pdf_link(p_dispatch_id)` geeft een willekeurig token van minimaal 32 bytes, 15 minuten geldig, maximaal drie downloads, gekoppeld aan eigenaar/factuur/dispatch. Bewaar uitsluitend de tokenhash en auditmetadata. **Gebruik hiervoor geen commandresultaatcache die de plaintext-URL of het token in `private.sp_commands` opslaat.** Nieuwe aanvraag mag een nieuw token geven. Deze expliciete technische mutatie-uitzondering staat los van businesscommands.

URL-basis is een vaste, gevalideerde omgevingsinstelling voor deze deployment. Geen hardcoded productiehost op preview en geen host uit onbetrouwbare requestheaders. De browserdownload voor Nathan heeft geen bearer-token nodig.

De publieke tokenroute gebruikt server-side een strikt geprivilegieerde consume-helper met alleen de benodigde serverrechten. Een private Postgresfunctie is niet vanzelf via PostgREST bereikbaar: gebruik indien nodig een publieke RPC-wrapper met uitsluitend service-role-grant naar de private helper. Anon/authenticated mogen die helper niet rechtstreeks uitvoeren of metadata ophalen.

Valideer tokenformaat, hash, vervaltijd, resterende downloads, actieve dispatch en factuur/PDF. Verhoog de teller atomair met voorwaardelijke update; gelijktijdige requests mogen samen niet boven drie komen. Leg vast dat een toegestane GET-poging één gebruik verbruikt, ook als het streamen daarna mislukt. HEAD telt niet en retourneert geen gevoelige metadata. Ontbrekend, verlopen of ingetrokken: dezelfde 404 zonder details.

Download server-side uit de privébucket, controleer de hash en stream pas daarna. Gebruik attachment, private/no-store, noindex en `Referrer-Policy: no-referrer`. Geen analytics op deze route. Gebruik de bestaande rate-limitvoorziening en configureer request-/errorlogging zodat volledige tokenpaden niet worden vastgelegd; als hostinglogs dit niet kunnen garanderen, documenteer de beperking en kies een transport zonder token in het pad. Geen absolute claim over logs zonder controle.

Technische uitzonderingen op 'alles via sp_command': PDF-upload via Storage API, tokenuitgifte en atomaire consumptie, en bestaande rate-limitregistratie. Zakelijke status-/gegevenswijzigingen blijven via `sp_command`. Leg de uitzonderingen en hun beperkte rechten vast.

## 12. UI voor fase 1

Nieuwe navigatie **Facturen** in de bestaande beheerschil. Toon uitsluitend werkende tabs: Facturen, Klanten, Instellingen en eventueel een werkende Betalingenlijst. Geen lege tabs voor toekomstige fasen. Download archief vanuit Facturen. Gebruik het bestaande account-/eigenaarpatroon.

Gemeenschappelijk: bestaande componenten en tokens; nieuwe CSS `bw-bill-*` in het bestaande stylesheet; geen nieuwe UI-library. Eén primaire Signal Rose-actie per scherm. Stem actieve navigatie/tijdlijn daarop af; forceer geen tweede accent. Minimaal 44px klikdoelen, bestaande primaire knophoogte aanhouden, duidelijke focus, labels boven velden, rechtse bedragen, tabulaire cijfers waar het font dat ondersteunt. Geen schaduwen, dashboardtegels, zebra of decoratieve eyebrows. Rustige statustekst mag naast een betaal-/verzendlabel staan.

Behoud de typografische schaal uit de repo. Introduceer geen nieuwe arbitraire schaalratio die met `DESIGN.md` botst. Voldoende tekstcontrast, foutsummary met focus en veldlinks, `aria-invalid`/`aria-describedby`, gerichte live-feedback zonder ieder invoerteken luid aan te kondigen. Skeletons volgen echte maten, zonder shimmer. Fouten tonen oorzaak en herstel in het juiste blok; een onbekende laatste update blijft onbekend, geen verzonnen tijdstip.

### Facturenlijst `/beheer/facturen`

Vraag: 'Wat moet ik controleren, versturen of innen?' Titel, relevante bevinding met scope, primaire actie en tabel. Houd **Nieuwe factuur** op een vaste plek; toon wachtende concepten als duidelijke vervolgstap zonder de knop telkens onverwacht te vervangen.

Filters in de URL: zoekterm, jaar, concept, PDF ontbreekt, wacht op Jarvis, open, te laat, betaald/verrekend, gecrediteerd, vervallen. Kolommen: nummer/Concept, klant, factuurdatum, vervaldatum, totaal, open/tegoed en toestand. Nul is `€ 0,00`; alleen onbekend/niet van toepassing wordt een grijs streepje. Maak credits en klanttegoed herkenbaar.

Totalen komen uit exact dezelfde filterset. Bij paginering: label 'deze pagina' of haal aparte, gelijk gefilterde totalen op. Onderscheid unieke documenten, open saldo, gecrediteerd en ontvangen; tel niet dubbel. Rijacties zijn echte knoppen/links, geen geneste interactieve elementen in een rijlink.

### Editor `/nieuw` en conceptdetail

Vraag: 'Klopt deze factuur?' Klant/personenkoppeling, optioneel project, **geplande factuurdatum**, dienst-/vooruitbetalingsdatum of periode, referentie, intro/footer, regels, betaaltermijn en interne notitie. Datums zijn controleerbaar; geen automatische definitieve factuur op een toekomstige geplande datum. In fase 1 kan Nathan op de bedoelde dag zelf definitief maken.

Regels: omschrijving, aantal, eenheid, prijs excl., ondersteunde btw-behandeling en berekend netto. Toevoegen, verwijderen en met toetsenbord verplaatsen. Toon verplichte fiscale onderbouwing zodra relevant. Desktop formulier plus HTML-preview op basis van dezelfde gegevens; mobiel een toegankelijke previewtoggle.

Acties: Opslaan als concept, Maak definitief en Laat concept vervallen. Bij dirty invoer: eerst expliciet opslaan en succesvol herlezen vóór definitief maken, of één gecontroleerde samengestelde gebruikersactie met afzonderlijke request-ID's; finaliseer nooit ongemerkt de oudere opgeslagen versie.

Inline bevestiging noemt datum, verwachte nummer als voorspelling, bedrag, ontvangers en onomkeerbare inhoud. Definieer hoe een afwijkende geplande datum wordt afgehandeld. Geen stil terugdateren of toekomstfinalisatie. Bedrijfsgegevens ontbreken: gerichte link naar Instellingen, concept bewaren blijft mogelijk.

### Definitief detail

Vraag: 'Wat is de stand?' Nummer, klant, document-/betaaltoestand, open bedrag of klanttegoed. Primaire actie afhankelijk van toestand: PDF maken of Betaling vastleggen. Wacht op Jarvis en Concept staat in Gmail zijn duidelijke procesmeldingen, geen bewijs van verzending.

Toon bevroren ontvangers, onderwerp en tekst; controleerbare PDF met integriteitsstatus; tijdlijn met actor en echte gebeurtenissen; credit-/origineellinks. Geen inhoudelijke bewerkvelden. Beschikbaar: Download PDF, Maak creditfactuur, Corrigeer, Markeer als verstuurd en passende annuleren/opnieuw-klaarzetten-acties. Herinneringen verschijnen pas in fase 2.

### Klanten, instellingen en betalingen

Klanten kiezen bestaande personen via `PersonPicker`. Factuuradres hoort bij de klant, niet bij `contacten.personen`. Bij onduidelijke persoonmatch: niet gokken. Instellingen: bedrijfsgegevens, bank, nummering en factuurmailsjabloon; één opslagactie per sectie met versiecontrole en zichtbare feedback. Preview met fictieve gegevens als nog geen factuur bestaat. Toon de vaste mailbox als informatie, geen SMTP/API-velden.

Handmatige betaling vraagt datum, positief bedrag, methode en notitie. Bij overbetaling expliciete bevestiging en klanttegoed. Terugdraaien vraagt reden en bewaart de boeking. Browser en database voorkomen dubbelboeken bij dubbele submit.

### Archiefexport

Een beveiligde export met facturen, bevroren gegevens, regels, credits, betalingen, relevante verzend-/auditgegevens en opgeslagen PDF's plus hashmanifest. Geen bearer-tokens of overbodige contact-/bankdata. Stream of begrens omvang zonder stil afkappen. Benoem ontbrekende PDF's expliciet. Test dat manifest en PDF-hashes overeenkomen. Voortbouwend op bestaande export, zonder bestaande inhoud weg te halen.

## 13. Nes Ammim als praktijkscenario

Contactpersoon: Jolande Uringa, bestaande persoon zoeken met `sp_people('Uringa', null)` en verifiëren. Juridische naam, feitelijk factuuradres, land, fiscale behandeling en werkelijk factuur-e-mailadres bevestigt Nathan. Geen voorbeeldadres verzinnen.

Referentie: offerte `SP-2026-1027-01`. Bedragen hieronder gelden **als 21% is bevestigd**:

| Factuurdatum | Omschrijving | Excl. | Btw | Incl. |
|---|---|---:|---:|---:|
| 09-11-2026 | Wervingscampagne vrijwilligers: eenmalig werk, 50% bij start, offerte SP-2026-1027-01 | € 1.969,50 | € 413,60 | € 2.383,10 |
| 20-11-2026, onder voorbehoud van werkelijke livegang | Eenmalig werk, 50% bij livegang | € 1.969,50 | € 413,60 | € 2.383,10 |
| 01-12-2026 t/m 01-05-2027, zes maandfacturen | Beheer en groei, {maand jaar} | € 750,00 | € 157,50 | € 907,50 |

Hosting komt later per maand op basis van bevestigde werkelijke kosten, circa € 55 excl., met passende fiscale behandeling. Geen automatisch bevestigde schatting.

De eerste twee facturen zijn losse concepten; de zes maandfacturen komen in fase 2 uit een abonnement. In fase 1 alleen op verzoek handmatig voorbereiden. Geen automatische correctie van het centverschil: twee losse facturen van € 2.383,10 zijn samen € 4.766,20, terwijl btw over het gezamenlijke netto op € 4.766,19 kan uitkomen.

Lever voor het echte eerste concept een gereed invul-/aanmaakvoorstel met nog ontbrekende gegevens. Zet het alleen na toestemming in de echte database. Een synthetische testversie heeft een herkenbare naam, source_ref en uitsluitend Nathans bevestigde testadres. Dat testadres hoeft niet hetzelfde te zijn als `nathan@setpiece.nl`.

## 14. Testomgeving en bouwvolgorde

1. Controleer de repo en beschikbare tooling; leg basiscommit en faseplan vast.
2. Verifieer de geïsoleerde database **en storage**, endpoint/project-ID en bestaande schema-afhankelijkheden. Een Vercel-preview alleen is geen data-isolatie. Een Supabase-branch is niet vanzelf een kopie van contacten of gebruikers; maak minimale synthetische testfixtures en een echte test-eigenaarsessie. Exporteer geen echte productiegegevens om tests makkelijker te maken.
3. Ontwerp rekencontract, rechtenmatrix, statustransities, creditregels en PDF-herstel. Voeg betekenisvolle tests met gedeelde vectoren toe.
4. Bouw migratie/commands en test rechten en invarianten; daarna serveractions, PDF/storage, wachtrij, UI en export. Zorg dat elke nieuwe mutatie dezelfde autorisatie- en foutconventies volgt.
5. Voer integratie-, concurrency-, browser-, PDF- en designcontroles uit. Leg ontbrekende toegang/ondersteuning vast zonder productie als uitwijk te gebruiken.
6. Werk `docs/facturatie.md` en `docs/jarvis-instructie.md` bij, maak lokale commits en lever het rapport met beperkingen, screenshots en eventuele preview op.
7. Stop vóór push, PR en productie. Vraag daarna alleen het concrete nog benodigde faseakkoord. De gebruiker beoordeelt een afgeronde, controleerbare wijziging, geen abstract voorstel.

Ontbreken historische schema's voor een lokale start, maak een gedocumenteerde, minimale testbootstrap buiten productiemigraties of gebruik een daarvoor geschikte geïsoleerde omgeving. Nooit bestaande migraties herschrijven om tests kunstmatig groen te krijgen.

## 15. Verificatie en acceptatie fase 1

Voer de repochecks uit: `npm run verify` en `npm run typecheck`. Werkelijke testuitkomsten met aantallen, geen afgeleide claims. Betekenisvolle SQL-integratietests zijn aanvullend op tests die alleen broncodepatronen inspecteren.

### Berekeningen en validatie

- 196950 cent bij 21% → btw 41360, totaal 238310; 75000 → 15750 en 90750.
- Gemengde 21/9%-factuur, kleine regels met verschil tussen regel- en groepsafronding, 1,5 × 12345 → 18518, nul, grensbedragen en negatieve spiegelbeelden.
- Full credit en opeenvolgende partial credits, inclusief centrestanten: nooit te veel netto/btw; samen exact origineel wanneer volledig.
- Gelijke SQL-/TypeScriptresultaten, veilige JSON-strings, geweigerde overflow/ongeldige schaal en beschermde velden.
- Fiscale categorieën, ontbrekende onderbouwing, datums, onbekende klantgegevens, oningevulde placeholders en mailsjabloonvalidatie.
- Templates vervangen alleen ondersteunde velden, onbekende placeholders geven fout; bedragen gebruiken dezelfde formatter. E-mailheader-/adresinvoer is begrensd en gevalideerd.

### Database, autorisatie en concurrency

- Anon, niet-admin, admin zonder owner en verkeerde eigenaar: geen reads/mutaties/links. Ingetrokken admin krijgt ook geen eerder commandresultaat. Connector mag de bedoelde concept-/dispatchacties, maar krijgt `42501` op alle mensenacties.
- Geen directe DML voor authenticated; dezelfde-eigenaarrelaties, projecttype/werkgebied, personenrechten, definitieve regels toevoegen/wijzigen/verplaatsen/verwijderen en nummer/status/eigenaar aanpassen zijn beschermd.
- Zelfde request exact herhalen, afwijkende payload geeft `23505`, actuele zakelijke versieconflict `PT409`. Correct gedrag na gewijzigde formulierinvoer en dubbelklik.
- Eerste tellerrij, twee concepten omgekeerd definitief maken, rollback na toegewezen nummer, twee gelijktijdige finalisaties en jaarwisseling. Geen dubbele nummers of verbruik na mislukte transactie.
- Gelijktijdige credits, betalingen/reverse, attach en mark_sent: correcte lockvolgorde, geen overcredit, dubbele boekingen, extra dispatch of verloren taakupdate.
- Betaling vóór verzending, deelbetaling, overbetaling, reverse en credit na betaling behouden alle onafhankelijke feiten.
- Corrigeer is atomair: geen nieuwe genummerde factuur zonder credit, en geen automatisch definitief nieuw concept.

Transactionele SQL-tests gebruiken rollback op de geïsoleerde database. Parallelle sessietests draaien apart met vastgelegde fixture-ID's; een enkele SQL-transactie bewijst geen concurrency. Geen destructieve cleanup op echte data.

### PDF en connectorcontract

- Upload/attach-herstel voor alle onderbrekingspunten uit sectie 10; één nummer, één gekoppeld archiefobject, één actieve dispatch en één Jarvis-actie.
- Definitieve inhoud en dispatchseed veranderen niet na klant-/instellingenwijziging. Oudere templateversie blijft herstelbaar.
- PDF visueel inspecteren: één pagina, meerdere pagina's, lange namen/omschrijvingen, credits, special characters, fonts, btw en betaaltermijn. Controleer downloadhash, metadata en archiefmanifest.
- Verkeerde eigenaar of hash levert geen PDF; publieke buckettoegang ontbreekt. Authenticated kan de service-consumehelper niet aanroepen.
- Tokenhash-only inclusief commandresultaten/audit, verlopen of ingetrokken link, maximaal drie parallelle GET's, HEAD en rate-limit. Geen plaintext-token in rapport of screenshots.
- Outboxpaginering met meer dan 100 opdrachten, annulering met bestaand draft en requeue; oude tokens worden ongeldig.
- draft_ready en mark_sent zijn idempotent; afwijkend bewijs/ontvangers/tijd wordt geweigerd. Geen tweede audit of taakafronding bij dezelfde businessuitkomst.
- Geautomatiseerde connectorcontracttest mag met synthetisch Gmail-bewijs testen. Label dit expliciet als simulatie, geen Gmail-ketenacceptatie.

### Browser en UX

Echte geverifieerde test-eigenaarsessie; volledige flow klant → concept → opslaan/bewerken → bevestiging → definitief → PDF → wachtrij → gesimuleerd draft/verzonden → betaling/reverse → credit/correctie → export. Controleer ook de handmatige verzendknop en herstart na een PDF-fout.

Screenshots en controles op 390, 768, 1024 en 1440 pixels. Geen horizontale paginascroll, zichtbare focus en werkende skiplink/tabvolgorde. Test lege lijst, leeg filter, laden, fout, versieconflict en snelle dubbele submit. Controleer bestaande beheer-/CMS-routes en publieke site op regressies.

Beschikbare skillchecks met versies en bevindingen registreren. Een toolscore alleen bewijst geen WCAG 2.2 AA; beschrijf geautomatiseerde en handmatige controles afzonderlijk. Zoek facturatiecode op daadwerkelijke mailverzendimports en SMTP-/sendMail-aanroepen; bestaande Resend-code voor andere functies blijft bestaan.

### Werkelijke Gmail-ketentest

Alleen na afzonderlijk akkoord, op testomgeving met bevestigd testadres. Jarvis leest outbox/PDF, maakt concept, Nathan verstuurt zelf en Jarvis registreert het gevonden verzonden bericht. Leg appacceptatie en deze ketentest apart vast. Als Jarvis/Gmail niet beschikbaar is, is fase 1 technisch voorbereid maar externe ketenacceptatie nog open. Rapporteer dat letterlijk.

## 16. Latere fasen: routekaart, nu niet implementeren

| Fase | Doel en richtdatum | Aandachtspunten |
|---|---|---|
| 1 | MVP vóór 9 november 2026 | Volledige geïsoleerde appflow, eerste Nes Ammim-concept voorbereid, afzonderlijke ketenacceptatie |
| 2 | Terugkerend vóór 28 november 2026 | Abonnementen, dagelijks concepten, herinneringen, billing-snapshot en Jarvis-routine |
| 3 | Bank en overzichten vóór 31 januari 2027 | CSV, bevestigde matching, verkoop-btw-overzicht, omzet/uren en uitbreiding export |
| 4 | Verdere afwerking | Optionele EPC-QR en extra polish; geen uitgestelde basisveiligheid/a11y |

Fase 2:

- `subscription.create/update/generate_due`, `reminder.request/queue_due` en `sp_billing_snapshot` met cursors. Cron maakt uitsluitend concepten of dispatchopdrachten, nooit definitieve facturen of betalingen.
- Schema voor abonnementen en periodes pas in deze fase. Eén periode-identiteit blijft bestaan ook als een concept vervalt; een verlopen concept mag niet door de volgende cronrun ongemerkt opnieuw ontstaan. Bewuste vervanging krijgt een expliciete gecontroleerde handeling.
- Gebruik ankerdatum plus periode-index, zodat de 31e en februari geen datumdrift veroorzaken. Test december–mei precies zes periodes, gemiste runs, overlap, pauzeren, beëindigen en max_occurrences.
- Nes Ammim: 01-12-2026 start, maand, zes keer, drie dagen vooruit; decemberconcept op 28-11-2026. Hostingbedrag is onbevestigd tot Nathan het per periode controleert; finalize blokkeert zolang die bevestiging ontbreekt.
- Controleer actuele Supabase-pg_cronmogelijkheden en kosten/toegang. Als exact 07:00 Amsterdam nodig is: gebruik een frequente UTC-tick met een idempotente lokale datum-/tijdguard of een aantoonbaar ondersteunde tijdzoneconfiguratie. Een vaste UTC-cron is geen vaste Amsterdamtijd. Documenteer actor en doelowner uit vertrouwde configuratie, geen willekeurige payload.
- Eerste herinnering op vervaldatum + 7 dagen, volgende minimaal 14 dagen na de laatste werkelijk verstuurde herinnering; geen nieuwe als een open opdracht bestaat. Alleen werkelijk verstuurde facturen met positief saldo. Betaal-/creditmutaties annuleren verouderde opdrachten atomair; nieuwe PDF-tokens voor geannuleerde opdrachten worden geweigerd.

Fase 3:

- Vraag welke bank en welk CSV-formaat gebruikt wordt; bouw één parser op basis van een veilig aangeleverde representatieve fixture. Geen parser gebaseerd op `{{BANK}}` of gegokte kolommen. Parse server-side, valideer encoding/scheidingsteken en begrens omvang/regels.
- Geen opgeslagen ruwe CSV. Importeer relevante bijschrijvingen voor matching. Terugbetalingen/afschrijvingen niet stil weggooien als de functie die moet ondersteunen: ontwerp die expliciet en rapporteer niet-ondersteunde regels.
- Ontdubbel bij voorkeur met stabiele banktransactie-ID plus rekening. Een hash van datum/bedrag/naam/omschrijving kan twee echte identieke betalingen verwarren. Zonder unieke bank-ID: detecteer ambiguïteit en vraag bevestiging; geen automatische financiële verwijdering als 'dubbel'. Fingerprint berekent de server, geen vertrouwde clientinvoer.
- Batches voldoen aan zowel aantal- als bytelimiet. Maak importresumptie idempotent, met consistente totalen en herkenbare onvolledige import. Bevestigde matching boekt atomair; niet meer toewijzen dan beschikbaar, geen dubbele koppeling.
- Verkoop-btw per kwartaal op definitieve factuurdatum, inclusief definitieve credits in hun eigen kwartaal; ontbrekende PDF of onverzonden status verbergt geen genummerde factuur uit de brondata. Markeer zulke uitzonderingen zichtbaar.
- Categorie-/landmapping bepaalt rubriek. Binnenlandse verlegging kan in 1e, EU-diensten in 3b; vrijstelling is geen automatische 1e. Niet-ondersteunde internationale gevallen blijven herkenbaar buiten de berekening, nooit stil in de verkeerde rubriek.
- Toon exacte centen plus afzonderlijke aangifte-euro's met benoemde afronding en tests voor negatieve kwartalen. Bewaar de broncenten. Leg de keuze vast; rekenkundig afronden op hele euro's is een heldere consistente productkeuze, toegestaan afronden in eigen voordeel vereist een expliciete getoetste veld-/tekenregel.
- Het resultaat is een **verkoop-btw-overzicht**, geen volledige aangifte: inkoop, voorbelasting en mogelijk verlegde inkoop zijn niet uit deze verkoopdatabase af te leiden. Toon bij ontbrekende gegevens 'Niet opgenomen; controleer andere administratie', geen nul of 'niet van toepassing'.
- Omzet is netto facturen plus credits; ontvangen is werkelijke geldontvangst. Urenindicator is alleen geregistreerde tijd, geen bewijs dat Nathan fiscaal aan het urencriterium voldoet.

Elke fase eindigt met eigen commits, checks, geïsoleerde acceptatie, rapport en apart productieakkoord. Maak bij vervolgfases geen nieuwe wijziging op basis van een verouderde fase-1-branch.

## 17. Open gegevens, bronnen en opleverrapport

Niet verzinnen: btw-id, juridische bedrijfsnaam/eigenaar, feitelijk adres/postcode, IBAN/rekeninghouder, definitieve mailsjabloontekst, Nes Ammims juridische naam/adres/land/hoedanigheid/btw-behandeling en ontvangers, bevestigd testadres en later bankformaat. Onbekende gegevens blokkeren de bijbehorende echte handeling, niet onafhankelijk bouw- of testwerk.

Bij deze beoordeling zijn op 31 oktober 2026 alleen geselecteerde bestanden op de opgegeven GitHub-branch gelezen; geen volledige code-/securityaudit, database-inspectie of functionele test. Codex verifieert de actuele bron opnieuw bij de bouw.

Bronbestanden:

- [AGENTS.md](https://github.com/Nathansudmeier/setpiece/blob/codex/setpiece-beheer/AGENTS.md)
- [package.json](https://github.com/Nathansudmeier/setpiece/blob/codex/setpiece-beheer/package.json)
- [beheer-koppeling.md](https://github.com/Nathansudmeier/setpiece/blob/codex/setpiece-beheer/docs/beheer-koppeling.md)
- [jarvis-instructie.md](https://github.com/Nathansudmeier/setpiece/blob/codex/setpiece-beheer/docs/jarvis-instructie.md)
- [DESIGN.md](https://github.com/Nathansudmeier/setpiece/blob/codex/setpiece-beheer/DESIGN.md)
- [server-adminclient](https://github.com/Nathansudmeier/setpiece/blob/codex/setpiece-beheer/lib/supabase/admin.ts)
- [authenticatie](https://github.com/Nathansudmeier/setpiece/blob/codex/setpiece-beheer/lib/beheer/auth.ts)
- [workspace-basismigratie](https://github.com/Nathansudmeier/setpiece/blob/codex/setpiece-beheer/supabase/migrations/20261020104625_setpiece_workspace.sql); lees ook alle latere vervangingen.

Fiscale broncontrole, 31 oktober 2026:

- Verplichte factuurgegevens en opeenvolgende nummering: [Belastingdienst: factuureisen](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/factuureisen/factuureisen).
- Consistent rekenkundig afronden op centen; aangifte gebruikt hele euro's: [Belastingdienst: btw-bedrag afronden](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/btw-bedrag_afronden).
- Binnenlandse en EU-verlegging zijn verschillende aangiftesituaties: [Belastingdienst: hoe werkt btw verleggen](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/btw_berekenen_aan_uw_klanten/waarover_btw_berekenen/verleggingsregeling/hoe_werkt_btw_verleggen).
- Behandeling van EU-diensten en klantstatus: [Belastingdienst: diensten aan afnemers in andere EU-landen](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/zakendoen_met_het_buitenland/goederen_en_diensten_naar_andere_eu_landen/btw_berekenen_bij_diensten/).
- Bij buitenlandse diensten is plaats/hoedanigheid relevant, niet alleen een Nederlands contact: [Ondernemersplein: btw bij diensten in het buitenland](https://ondernemersplein.overheid.nl/internationaal-ondernemen/douane-en-belastingen/btw-bij-diensten-in-het-buitenland/).
- Zeven jaar is niet altijd simpelweg zeven jaar vanaf factuurdatum: [Belastingdienst: administratie bewaren](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/administratie_bewaren/administratie_bewaren).
- Gebruikelijke uitreiktermijn: [Belastingdienst: facturen maken](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/facturen_maken).

Rapporteer na fase 1 in `docs/facturatie.md` en kort aan Nathan:

1. Wat gebouwd is, welke bewuste scopekeuzes zijn gemaakt en wat nog ontbreekt.
2. Basiscommit, branch, lokale commits en gewijzigde bestanden.
3. Migratiebestanden met exacte doelomgeving en uitvoerstatus; productie expliciet apart.
4. Unit-, SQL-, concurrency-, browser-, PDF- en designresultaten, aantallen en niet-uitgevoerde controles.
5. Screenshots op vier breedtes, zonder gevoelige inhoud.
6. Previewlink en bewijs dat database/storage geïsoleerd zijn, of waarom geen preview beschikbaar is.
7. Open bedrijfs-/klantgegevens, ondersteunde fiscale categorieën, herstelroutes en bekende grenzen van de brede connectorrol.
8. Status van Jarvis-documentatie, connectorcontracttest en afzonderlijke werkelijke Gmail-ketentest.
9. Een concreet voorstel voor de nog goed te keuren push/PR/productiemigratie/deploy, pas nadat het reviewbare werk gereed is.

Claim alleen wat daadwerkelijk is gecontroleerd. Maak onderscheid tussen lokaal gereed, getest op geïsoleerde omgeving, extern geaccepteerd en werkelijk live.
