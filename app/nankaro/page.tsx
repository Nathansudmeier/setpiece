import type { Metadata } from "next";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { Button, Badge, BigQuote, Card } from "@/components/ds";

export const metadata: Metadata = {
  title: "Nankaro — het clubplatform van Setpiece",
  description:
    "Nankaro is een compleet digitaal clubplatform, gebouwd door Setpiece. Planning, spelersontwikkeling, wedstrijden, scouting, taken en de clubwebsite in één omgeving.",
};

const AUDIENCES = [
  {
    title: "Voor trainers",
    items: ["Betere voorbereiding", "Minder losse administratie", "Meer houvast in ontwikkeling"],
  },
  {
    title: "Voor spelers",
    items: ["Eigen planning en statistieken", "Reflecties en doelen", "Meer eigenaarschap"],
  },
  {
    title: "Voor ouders",
    items: ["Duidelijke planning", "Afmelden en updates", "Wel informatie, geen gevoelige stafdata"],
  },
  {
    title: "Voor bestuur en TC",
    items: ["Overzicht op processen", "Rollen en rechten", "Continuïteit bij vrijwilligerswissels"],
  },
];

const CLUSTERS = [
  { n: "01", title: "Cluborganisatie", body: "Dashboard, planning, aanwezigheid, rollen, clubbeheer en basiscommunicatie." },
  { n: "02", title: "Voetbalontwikkeling", body: "Trainingen, spelprincipes, beoordelingen, testen, speelminuten, gesprekken en reflecties." },
  { n: "03", title: "Wedstrijdorganisatie", body: "Resultaten, verslagen, live registratie, publieke live viewer en wedstrijdarchief." },
  { n: "04", title: "Speler- en ouderervaring", body: "Persoonlijke portalen met planning, aanwezigheid, stats, updates en veilige zichtbaarheid." },
  { n: "05", title: "Scouting en werving", body: "Dossiers, observaties, wervingslijsten, opdrachten en statusflows." },
  { n: "06", title: "Taken en aanvragen", body: "Van losse opvolging naar eigenaar, deadline, checklist, comments en activity log." },
  { n: "07", title: "Clubwebsite", body: "CMS, nieuws, teams, sponsors, documenten, formulieren, SEO en eigen domein." },
  { n: "08", title: "Platformlaag", body: "Multi-tenant basis, veiligheid, rollen, feature-gating, branding en schaalbaarheid." },
];

const PACKAGES = [
  {
    name: "Starter",
    tagline: "Grip op de clubdag.",
    featured: false,
    items: [
      "Clubdashboard",
      "Planning en aanwezigheid",
      "Mededelingen",
      "Spelersbeheer (basis)",
    ],
  },
  {
    name: "Pro",
    tagline: "Sportieve ontwikkeling.",
    featured: true,
    items: [
      "Alles uit Starter",
      "Training en oefenvormen",
      "Spelprincipes",
      "Beoordelingen en testen",
      "Ontwikkelgesprekken",
      "Taken (basis)",
    ],
  },
  {
    name: "Club+",
    tagline: "Volledige clubregie.",
    featured: false,
    items: [
      "Alles uit Pro",
      "Live wedstrijdregistratie",
      "Scouting en werving",
      "Taken en aanvragen",
      "Website CMS en eigen domein",
    ],
  },
];

export default function NankaroPage() {
  const nankaroUrl = "https://nankaro.app";
  const mail =
    "mailto:hello@setpiece.nl?subject=" + encodeURIComponent("Vraag over Nankaro via setpiece.nl");

  return (
    <div>
      <SiteNav mode="page" />

      {/* Hero */}
      <section className="sp-case-hero" id="top">
        <div className="sp-container">
          <p className="sp-eyebrow sp-eyebrow--on-dark" data-reveal>Ons grootste project</p>
          <h1 data-reveal style={{ transitionDelay: "60ms" }}>
            Nankaro: een compleet clubplatform, gebouwd door Setpiece.
          </h1>
          <p className="lead" data-reveal style={{ transitionDelay: "120ms" }}>
            Een digitale clubomgeving waarin planning, spelersontwikkeling, wedstrijden, communicatie,
            scouting, taken, aanvragen en de publieke clubwebsite samenkomen. Van concept tot lancering
            in eigen beheer.
          </p>
          <div className="nk-stats" data-reveal style={{ transitionDelay: "180ms" }}>
            <div>
              <div className="nk-stat__num">8</div>
              <div className="nk-stat__label">featureclusters die samenwerken</div>
            </div>
            <div>
              <div className="nk-stat__num">3</div>
              <div className="nk-stat__label">pakketten, van organisatie tot clubregie</div>
            </div>
            <div>
              <div className="nk-stat__num">1</div>
              <div className="nk-stat__label">clubomgeving, website inbegrepen</div>
            </div>
          </div>
          <div className="nk-hero__ctas" data-reveal style={{ transitionDelay: "240ms" }}>
            <Button variant="primary" size="lg" href={nankaroUrl}>Bekijk nankaro.app →</Button>
            <Button variant="on-dark" size="lg" href={mail}>Praat over jouw club</Button>
          </div>
        </div>
      </section>

      {/* Wat is Nankaro */}
      <section className="sp-section">
        <div className="sp-container" style={{ maxWidth: 760 }}>
          <p className="sp-eyebrow" data-reveal>Het idee</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "60ms" }}>
            Geen losse teamapp. Een clubplatform.
          </h2>
          <p className="nk-intro" data-reveal style={{ transitionDelay: "120ms" }}>
            Nankaro is geen losse teamapp en ook geen klassiek ledenadministratiesysteem. Het is een
            digitaal clubplatform voor verenigingen die professioneler willen organiseren, ontwikkelen en
            communiceren zonder de menselijke clubcultuur kwijt te raken.
          </p>
          <p className="nk-intro" data-reveal style={{ transitionDelay: "160ms" }}>
            De kracht zit in de samenhang. Een proeftrainingaanvraag kan een taak, een scoutingdossier en
            uiteindelijk een spelerprofiel worden. Een wedstrijd levert input voor score, speelminuten,
            reflectie en content. De website is geen eiland, maar de publieke voorkant van dezelfde
            clubomgeving.
          </p>
          <div data-reveal style={{ transitionDelay: "220ms", marginTop: 48 }}>
            <BigQuote by="Uit het Nankaro-productoverzicht">
              Nankaro maakt van cluborganisatie geen brandjes blussen, maar bouwen.
            </BigQuote>
          </div>
        </div>
      </section>

      {/* Waarde per doelgroep */}
      <section className="sp-section" style={{ background: "var(--surface-card-tint)" }}>
        <div className="sp-container">
          <p className="sp-eyebrow" data-reveal>Waarde</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "60ms" }}>
            Voor iedereen in de club.
          </h2>
          <div className="nk-grid-2">
            {AUDIENCES.map((a, i) => (
              <div key={a.title} data-reveal style={{ transitionDelay: `${(i % 2) * 60}ms` }}>
                <Card variant="surface">
                  <h3 className="nk-card-title">{a.title}</h3>
                  <ul className="nk-list">
                    {a.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 featureclusters */}
      <section className="sp-section">
        <div className="sp-container">
          <p className="sp-eyebrow" data-reveal>Het platform</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "60ms" }}>
            Acht clusters die samenwerken.
          </h2>
          <p className="nk-intro" data-reveal style={{ transitionDelay: "100ms", marginBottom: 48 }}>
            Bekijk Nankaro niet als lange lijst knoppen, maar als acht samenwerkende productgebieden.
            Elke cluster lost een concreet clubprobleem op.
          </p>
          <div className="nk-cluster-grid">
            {CLUSTERS.map((c, i) => (
              <div key={c.n} data-reveal style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
                <Card variant={i % 2 === 0 ? "surface" : "tint"} style={{ height: "100%" }}>
                  <span className="sp-service-num">{c.n}</span>
                  <h3 className="nk-card-title">{c.title}</h3>
                  <p className="nk-card-sub">{c.body}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pakketten */}
      <section className="sp-section" style={{ background: "var(--surface-card-tint)" }}>
        <div className="sp-container">
          <p className="sp-eyebrow" data-reveal>Pakketten</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "60ms" }}>
            Instappen op organisatie, doorgroeien naar clubregie.
          </h2>
          <div className="nk-pkg-grid">
            {PACKAGES.map((p, i) => (
              <div key={p.name} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <Card variant="surface" style={{ height: "100%" }} className={p.featured ? "nk-pkg--featured" : undefined}>
                  {p.featured && <span className="nk-pkg__flag">Meestgekozen</span>}
                  <h3 className="nk-pkg__name">{p.name}</h3>
                  <p className="nk-pkg__tagline">{p.tagline}</p>
                  <ul className="nk-list">
                    {p.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
          <p className="nk-pkg__advice" data-reveal>
            Starter draait om rust in de clubdag, Pro om sportieve ontwikkeling en Club+ om volledige
            clubregie inclusief website, scouting, aanvragen en live beleving.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="sp-section">
        <div className="sp-container">
          <div className="nk-cta" data-reveal>
            <Badge variant="outline" style={{ color: "var(--text-secondary-on-dark)", borderColor: "var(--border-on-dark)", marginBottom: 20 }}>
              Een Setpiece product
            </Badge>
            <h2>Benieuwd wat Nankaro voor jouw club kan doen?</h2>
            <p>
              Bekijk het platform of stel je vraag rechtstreeks. We denken graag mee over hoe jouw
              vereniging professioneler organiseert zonder de clubcultuur te verliezen.
            </p>
            <div className="nk-cta__ctas">
              <Button variant="primary" size="lg" href={nankaroUrl}>Bekijk nankaro.app →</Button>
              <Button variant="on-dark" size="lg" href={mail}>Mail Setpiece</Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter mode="page" />
    </div>
  );
}
