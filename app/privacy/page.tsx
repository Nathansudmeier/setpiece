import Link from "next/link";

import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacyverklaring",
  description:
    "Lees welke persoonsgegevens Setpiece verwerkt, waarom dat gebeurt, hoelang gegevens worden bewaard en welke keuzes je hebt.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <WorkspoorShell>
      <section className="ws-page-hero ws-legal-hero">
        <div className="ws-frame">
          <p className="ws-context">Privacy</p>
          <h1>Duidelijk over wat we met je gegevens doen.</h1>
          <p className="ws-lead">
            Je hoeft geen juridisch document te ontcijferen om te weten wat er
            gebeurt. Hier lees je welke gegevens Setpiece gebruikt, waarom dat
            nodig is en welke keuzes je hebt.
          </p>
          <p className="ws-legal-updated">Laatst bijgewerkt op 25 juli 2026.</p>
        </div>
      </section>

      <section className="ws-legal-section" aria-labelledby="privacy-summary-title">
        <div className="ws-frame ws-legal-layout">
          <aside className="ws-legal-summary">
            <h2 id="privacy-summary-title">In het kort</h2>
            <ul>
              <li>We vragen alleen gegevens die nodig zijn voor je aanvraag.</li>
              <li>We verkopen je gegevens niet en sturen geen ongevraagde nieuwsbrief.</li>
              <li>We gebruiken geen gegevens voor advertentieprofielen.</li>
              <li>Je kunt altijd vragen wat we van je bewaren.</li>
            </ul>
          </aside>

          <div className="ws-legal-content">
            <section aria-labelledby="privacy-controller-title">
              <h2 id="privacy-controller-title">Wie is verantwoordelijk?</h2>
              <p>
                Setpiece is verantwoordelijk voor de verwerking van persoonsgegevens via
                deze website.
              </p>
              <address>
                <strong>Setpiece</strong>
                <span>Almere, Nederland</span>
                <span>KVK 99116111</span>
                <a href="mailto:hallo@setpiece.nl">hallo@setpiece.nl</a>
              </address>
            </section>

            <section aria-labelledby="privacy-data-title">
              <h2 id="privacy-data-title">Welke gegevens gebruiken we?</h2>
              <dl className="ws-legal-data">
                <div>
                  <dt>Aanvraag of contact</dt>
                  <dd>
                    Je naam, organisatie, zakelijke e-mailadres, het aantal medewerkers,
                    je omschrijving van het terugkerende werk, een mogelijke
                    proceseigenaar en, wanneer je die invult, je telefoonnummer en
                    gewenste periode.
                  </dd>
                </div>
                <div>
                  <dt>Beveiliging</dt>
                  <dd>
                    Technische gegevens die nodig zijn om misbruik te beperken. Je
                    IP-adres wordt voor de beveiligingscontrole gebruikt en voor de
                    snelheidsbeperking omgezet in een niet-terugrekenbare code.
                  </dd>
                </div>
                <div>
                  <dt>Websitegebruik</dt>
                  <dd>
                    Geanonimiseerde en samengevoegde informatie over bezochte pagina&apos;s,
                    verwijzers, land, apparaat, browser en technische prestaties. Vrije
                    tekst uit formulieren gaat niet naar de webstatistieken.
                  </dd>
                </div>
              </dl>
              <p className="ws-legal-callout">
                Deel in een open tekstveld geen medische gegevens, personeelsdossiers,
                wachtwoorden of andere vertrouwelijke persoonsgegevens. Een globaal
                werkvoorbeeld is genoeg voor een eerste beoordeling.
              </p>
            </section>

            <section aria-labelledby="privacy-purpose-title">
              <h2 id="privacy-purpose-title">Waarom gebruiken we deze gegevens?</h2>
              <p>Setpiece gebruikt persoonsgegevens om:</p>
              <ul>
                <li>je aanvraag te beoordelen en te beantwoorden;</li>
                <li>een door jou gevraagd gesprek of voorstel voor te bereiden;</li>
                <li>de website veilig en beschikbaar te houden;</li>
                <li>op hoofdlijnen te begrijpen welke pagina&apos;s werken en waar de site beter kan.</li>
              </ul>
              <p>
                Voor een aanvraag en de voorbereiding van een mogelijke opdracht is de
                grondslag het nemen van stappen op jouw verzoek vóór een overeenkomst.
                Voor algemene zakelijke vragen, beveiliging en beperkte
                websiteverbetering gebruikt Setpiece het gerechtvaardigd belang om
                zorgvuldig te reageren en de website veilig en bruikbaar te houden.
                Wettelijke administratieve verplichtingen gelden wanneer uit het contact
                een opdracht ontstaat.
              </p>
              <p>
                Setpiece neemt op basis van deze gegevens geen volledig geautomatiseerde
                beslissingen met juridische of vergelijkbaar ingrijpende gevolgen.
              </p>
            </section>

            <section aria-labelledby="privacy-sharing-title">
              <h2 id="privacy-sharing-title">Wie kan gegevens verwerken?</h2>
              <p>
                Setpiece deelt gegevens alleen met leveranciers die nodig zijn om de
                website en aanvraagroute te laten werken:
              </p>
              <ul>
                <li>Vercel voor hosting, geanonimiseerde webstatistieken en prestatiemeting;</li>
                <li>Supabase voor beveiligde opslag van aanvragen en snelheidsbeperking;</li>
                <li>Cloudflare Turnstile voor de controle op bots en misbruik;</li>
                <li>de zakelijke e-mailprovider wanneer Setpiece je aanvraag beantwoordt.</li>
              </ul>
              <p>
                Deze partijen krijgen alleen toegang voor hun taak. Setpiece verkoopt
                persoonsgegevens niet. Sommige leveranciers kunnen gegevens buiten de
                Europese Economische Ruimte verwerken. Waar dat gebeurt, gelden de
                contractuele en wettelijke waarborgen van de betreffende dienst.
              </p>
            </section>

            <section aria-labelledby="privacy-retention-title">
              <h2 id="privacy-retention-title">Hoelang bewaren we gegevens?</h2>
              <ul>
                <li>
                  Een aanvraag bewaren we maximaal twaalf maanden na het laatste
                  inhoudelijke contact, tenzij eerder verwijderen passend is.
                </li>
                <li>
                  Ontstaat er een opdracht, dan worden relevante gegevens onderdeel van
                  het klant- en administratiedossier. Financiële basisgegevens worden
                  zeven jaar bewaard wanneer de wet dat vereist.
                </li>
                <li>
                  Gecodeerde identifiers voor snelheidsbeperking worden automatisch na
                  maximaal twee dagen verwijderd.
                </li>
                <li>
                  Geanonimiseerde webstatistieken blijven alleen beschikbaar binnen de
                  ingestelde rapportageperiode van de gebruikte analysedienst.
                </li>
              </ul>
            </section>

            <section aria-labelledby="privacy-rights-title">
              <h2 id="privacy-rights-title">Welke rechten heb je?</h2>
              <p>
                Je kunt vragen om inzage, correctie, verwijdering, beperking of
                overdracht van je persoonsgegevens. Je kunt ook bezwaar maken tegen een
                verwerking op basis van een gerechtvaardigd belang.
              </p>
              <p>
                Mail je verzoek naar{" "}
                <a href="mailto:hallo@setpiece.nl">hallo@setpiece.nl</a>. Setpiece kan
                aanvullende informatie vragen om je identiteit te controleren en
                reageert in principe binnen één maand.
              </p>
              <p>
                Kom je er met Setpiece niet uit, dan kun je een klacht indienen bij de{" "}
                <a href="https://www.autoriteitpersoonsgegevens.nl/">
                  Autoriteit Persoonsgegevens
                </a>
                .
              </p>
            </section>

            <section aria-labelledby="privacy-security-title">
              <h2 id="privacy-security-title">Hoe beveiligen we gegevens?</h2>
              <p>
                De website gebruikt versleutelde verbindingen, server-side verwerking,
                afgeschermde opslag, toegangscontrole, botcontrole en snelheidsbeperking.
                Alleen bevoegde personen krijgen toegang tot aanvragen. Geen enkele
                beveiliging is absoluut, maar Setpiece beperkt de gegevens, toegang en
                bewaartermijn zoveel mogelijk.
              </p>
            </section>

            <section aria-labelledby="privacy-changes-title">
              <h2 id="privacy-changes-title">Wijzigingen</h2>
              <p>
                Verandert de website of de manier waarop Setpiece gegevens gebruikt, dan
                wordt deze verklaring aangepast. De nieuwste versie staat altijd op deze
                pagina.
              </p>
              <p>
                Lees ook welke technieken de website gebruikt in het{" "}
                <Link href="/cookies">cookiebeleid</Link>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </WorkspoorShell>
  );
}
