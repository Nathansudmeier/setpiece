import Link from "next/link";

import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Cookiebeleid",
  description:
    "Lees welke noodzakelijke en privacyvriendelijke technieken Setpiece gebruikt en waarom de website geen marketing- of trackingcookies plaatst.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <WorkspoorShell>
      <section className="ws-page-hero ws-legal-hero">
        <div className="ws-frame">
          <p className="ws-context">Cookies</p>
          <h1>Geen marketingcookies. Geen verborgen volgprofiel.</h1>
          <p className="ws-lead">
            Setpiece gebruikt alleen technieken die nodig zijn voor een veilige,
            bruikbare website en beperkte, privacyvriendelijke meting.
          </p>
          <p className="ws-legal-updated">Laatst bijgewerkt op 25 juli 2026.</p>
        </div>
      </section>

      <section className="ws-legal-section" aria-labelledby="cookies-summary-title">
        <div className="ws-frame ws-legal-layout">
          <aside className="ws-legal-summary">
            <h2 id="cookies-summary-title">De hoofdzaak</h2>
            <ul>
              <li>Geen marketing- of advertentiecookies.</li>
              <li>Geen tracking over andere websites.</li>
              <li>Geen webstatistieken op basis van ingevulde formuliertekst.</li>
              <li>Wel noodzakelijke beveiliging rond formulieren en beheer.</li>
            </ul>
          </aside>

          <div className="ws-legal-content">
            <section aria-labelledby="cookies-definition-title">
              <h2 id="cookies-definition-title">Wat zijn cookies en vergelijkbare technieken?</h2>
              <p>
                Een cookie is een klein bestand dat een website in je browser kan
                bewaren. Websites kunnen ook scripts, lokale opslag en tijdelijke
                identifiers gebruiken. Sommige technieken zijn nodig om een dienst te
                laten werken. Andere volgen bezoekers voor advertenties. Dat laatste doet
                Setpiece niet.
              </p>
            </section>

            <section aria-labelledby="cookies-use-title">
              <h2 id="cookies-use-title">Wat gebruikt deze website?</h2>
              <dl className="ws-legal-data">
                <div>
                  <dt>Cloudflare Turnstile</dt>
                  <dd>
                    Bij formulieren controleert Turnstile of een aanvraag waarschijnlijk
                    door een mens wordt verstuurd. Daarvoor verwerkt Cloudflare
                    kortstondige technische signalen en kan noodzakelijke browseropslag
                    worden gebruikt. Dit dient uitsluitend om misbruik te beperken.
                  </dd>
                </div>
                <div>
                  <dt>Vercel Web Analytics</dt>
                  <dd>
                    Vercel telt geanonimiseerde paginaweergaven zonder cookies. Een
                    tijdelijke hash helpt bezoekers binnen één dag te onderscheiden en
                    wordt niet gebruikt om iemand over dagen of websites te volgen.
                  </dd>
                </div>
                <div>
                  <dt>Vercel Speed Insights</dt>
                  <dd>
                    Technische prestatiemetingen laten zien hoe snel en stabiel pagina&apos;s
                    laden. De uitkomsten worden gebruikt om de website te verbeteren, niet
                    voor advertenties of persoonlijke aanbiedingen.
                  </dd>
                </div>
                <div>
                  <dt>Beheersessie</dt>
                  <dd>
                    Alleen de afgeschermde beheeromgeving gebruikt noodzakelijke
                    sessiecookies om een bevoegde beheerder ingelogd en beveiligd te
                    houden. Deze zijn niet bedoeld voor gewone websitebezoekers.
                  </dd>
                </div>
              </dl>
            </section>

            <section aria-labelledby="cookies-consent-title">
              <h2 id="cookies-consent-title">Waarom zie je geen cookiebanner?</h2>
              <p>
                De website plaatst geen marketingcookies en gebruikt geen technieken om
                je over verschillende websites te volgen. De aanwezige beveiliging is
                noodzakelijk voor de gevraagde formulierfunctie. De webstatistieken zijn
                beperkt en privacyvriendelijk ingericht. Daarom toont Setpiece op dit
                moment geen toestemmingsbanner.
              </p>
              <p>
                Worden later technieken toegevoegd waarvoor voorafgaande toestemming
                nodig is, dan worden die pas actief nadat je een vrije keuze hebt gemaakt.
                Deze pagina wordt dan ook bijgewerkt.
              </p>
            </section>

            <section aria-labelledby="cookies-control-title">
              <h2 id="cookies-control-title">Wat kun je zelf instellen?</h2>
              <p>
                Via je browser kun je cookies en lokale opslag bekijken, blokkeren of
                verwijderen. Het blokkeren van noodzakelijke technieken kan ervoor zorgen
                dat een formulier of beveiligde beheerfunctie niet werkt.
              </p>
            </section>

            <section aria-labelledby="cookies-contact-title">
              <h2 id="cookies-contact-title">Een vraag over deze technieken?</h2>
              <p>
                Mail naar <a href="mailto:hallo@setpiece.nl">hallo@setpiece.nl</a>. Meer
                informatie over persoonsgegevens en je rechten staat in de{" "}
                <Link href="/privacy">privacyverklaring</Link>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </WorkspoorShell>
  );
}
