import JsonLd from "@/components/JsonLd";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { Button, Badge, BigQuote, Card } from "@/components/ds";
import { createPageMetadata, SITE_URL } from "@/lib/seo";
import "../../styles/nankaro.css";

export const metadata = createPageMetadata({
  title: "Set In, een AI-werkomgeving op maat",
  description:
    "Voor Set In richtte Setpiece een AI-werkomgeving in die hun taal spreekt: presentaties, offertes, productbeschrijvingen, social en interne communicatie. Van verkenning tot doorlopende begeleiding.",
  path: "/cases/set-in",
});

// Use cases die we inrichten. Bron: voorstel AI-werkomgeving Set In.
const USECASES = [
  {
    n: "01",
    title: "Presentaties",
    body: "Structuur en opmaak automatisch op basis van de eigen input. Set In levert de inhoud, de werkomgeving maakt het presenteerbaar.",
  },
  {
    n: "02",
    title: "Offertes en aanbestedingen",
    body: "Templates in de eigen taal en stijl. Raamovereenkomsten worden aangepaste offertes zonder handmatig kopieerwerk.",
  },
  {
    n: "03",
    title: "Productbeschrijvingen",
    body: "Een idee uit het hoofd wordt direct een gestructureerde, opgemaakte tekst. Inclusief varianten voor verschillende doelgroepen.",
  },
  {
    n: "04",
    title: "Social media posts",
    body: "Drie varianten per onderwerp, klaar voor review. De tekstschrijver focust op de inhoud die er echt toe doet.",
  },
  {
    n: "05",
    title: "Interne communicatie",
    body: "Nieuwsbrieven, updates en aankondigingen in de eigen huisstijl, zonder dat iemand van nul hoeft te beginnen.",
  },
];

// Drie fasen van inrichting tot doorontwikkeling.
const PHASES = [
  {
    name: "Verkenning en inrichting",
    duration: "2 weken",
    items: [
      "Inventarisatie van alle use cases",
      "Keuze van de juiste AI-tooling per toepassing",
      "Eerste opzet van prompts en templates in de eigen taal",
      "Testrun met een interne beheerder",
    ],
  },
  {
    name: "Training en implementatie",
    duration: "2 weken",
    items: [
      "Hands-on training voor de beheerder en een of twee collega's",
      "Templates verfijnen op basis van eerste gebruik",
      "Documentatie zodat iedereen zelfstandig kan werken",
      "Koppeling met bestaande werkprocessen waar mogelijk",
    ],
  },
  {
    name: "Begeleiding en doorontwikkeling",
    duration: "Doorlopend",
    items: [
      "Maandelijks overleg over wat werkt en wat beter kan",
      "Nieuwe use cases toevoegen naarmate de organisatie groeit",
      "Beschikbaar voor vragen van de beheerder",
      "Nieuwe AI-mogelijkheden bijhouden die relevant zijn",
    ],
  },
];

export default function SetInPage() {
  return (
    <div data-screen-label="Case — Set In">
      <SiteNav mode="page" />
      <main id="main-content">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        headline: "Set In: een AI-werkomgeving die hun taal spreekt",
        description: metadata.description,
        url: new URL("/cases/set-in", SITE_URL).toString(),
        inLanguage: "nl-NL",
        provider: { "@id": `${SITE_URL}#organization` },
      }} />

      {/* Hero */}
      <section className="sp-case-hero" id="top">
        <div className="sp-container">
          <p className="sp-eyebrow sp-eyebrow--on-dark" data-reveal>AI-werkomgeving</p>
          <h1 data-reveal style={{ transitionDelay: "60ms" }}>
            Set In: een AI-werkomgeving die hun taal spreekt.
          </h1>
          <p className="lead" data-reveal style={{ transitionDelay: "120ms" }}>
            Inrichten, trainen en beheren van AI-tooling voor presentaties, offertes,
            productbeschrijvingen, content en communicatie. Zodat waardevolle kennis sneller
            bruikbare output wordt.
          </p>
          <div className="nk-stats" data-reveal style={{ transitionDelay: "180ms" }}>
            <div>
              <div className="nk-stat__num">5</div>
              <div className="nk-stat__label">use cases, van presentatie tot interne update</div>
            </div>
            <div>
              <div className="nk-stat__num">3</div>
              <div className="nk-stat__label">fasen, van verkenning tot doorontwikkeling</div>
            </div>
            <div>
              <div className="nk-stat__num">1</div>
              <div className="nk-stat__label">interne beheerder die de omgeving draaiende houdt</div>
            </div>
          </div>
          <div className="nk-hero__ctas" data-reveal style={{ transitionDelay: "240ms" }}>
            <Button variant="primary" size="lg" href="/#contact">Plan een kennismaking</Button>
            <Button variant="on-dark" size="lg" href="#aanpak">Bekijk de aanpak</Button>
          </div>
        </div>
      </section>

      {/* De kern van de vraag */}
      <section className="sp-section">
        <div className="sp-container" style={{ maxWidth: 760 }}>
          <p className="sp-eyebrow" data-reveal>De kern van de vraag</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "60ms" }}>
            Waardevolle kennis, te veel tijd kwijt aan de output.
          </h2>
          <p className="nk-intro" data-reveal style={{ transitionDelay: "120ms" }}>
            Set In heeft waardevolle mensen en kennis, maar verloor tijd aan het omzetten van die
            kennis naar bruikbare output: presentaties, offertes, productbeschrijvingen en social
            posts. De tekstschrijver is te goed en te duur voor routinewerk. En het eigen hoofd gaat
            soms sneller dan de handen.
          </p>
          <p className="nk-intro" data-reveal style={{ transitionDelay: "160ms" }}>
            Geen extra tool die er los bij komt, maar een omgeving die de taal van de organisatie al
            kent. Zo blijft de mens aan het stuur en verdwijnt het routinewerk naar de achtergrond.
          </p>
          <div data-reveal style={{ transitionDelay: "220ms", marginTop: 48 }}>
            <BigQuote by="Uit het voorstel voor Set In">
              De oplossing is geen slimmere tool, maar een AI-werkomgeving die jullie taal spreekt.
            </BigQuote>
          </div>
        </div>
      </section>

      {/* Wat we inrichten */}
      <section className="sp-section" id="aanpak" style={{ background: "var(--surface-card-tint)" }}>
        <div className="sp-container">
          <p className="sp-eyebrow" data-reveal>Wat we inrichten</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "60ms" }}>
            Vijf soorten output, klaar voor de dagelijkse praktijk.
          </h2>
          <p className="nk-intro" data-reveal style={{ transitionDelay: "100ms", marginBottom: 48 }}>
            Elke use case lost een concreet stuk routinewerk op. De input blijft van Set In, de
            werkomgeving maakt er direct bruikbare, opgemaakte output van.
          </p>
          <div className="nk-cluster-grid">
            {USECASES.map((c, i) => (
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

      {/* Hoe we het inrichten */}
      <section className="sp-section">
        <div className="sp-container">
          <p className="sp-eyebrow" data-reveal>Hoe we het inrichten</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "60ms" }}>
            Van verkenning naar een omgeving die meegroeit.
          </h2>
          <div className="nk-pkg-grid">
            {PHASES.map((p, i) => (
              <div key={p.name} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <Card variant="surface" style={{ height: "100%" }}>
                  <h3 className="nk-pkg__name">{p.name}</h3>
                  <p className="nk-pkg__tagline">{p.duration}</p>
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
            De eerste twee fasen zetten de omgeving neer en maken het team zelfstandig. De doorlopende
            begeleiding houdt de werkomgeving scherp en breidt hem uit naarmate de organisatie groeit.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="sp-section">
        <div className="sp-container">
          <div className="nk-cta" data-reveal>
            <Badge variant="outline" style={{ color: "var(--text-secondary-on-dark)", borderColor: "var(--border-on-dark)", marginBottom: 20 }}>
              AI-transitie door Setpiece
            </Badge>
            <h2>Benieuwd wat een AI-werkomgeving voor jouw organisatie kan doen?</h2>
            <p>
              We kijken naar waar het routinewerk zit en bouwen van daaruit een omgeving die jullie
              taal spreekt. Praktisch, toepasbaar en zonder buzzwords.
            </p>
            <div className="nk-cta__ctas">
              <Button variant="primary" size="lg" href="/#contact">Plan een kennismaking</Button>
            </div>
          </div>
        </div>
      </section>

      </main>
      <SiteFooter mode="page" />
    </div>
  );
}
