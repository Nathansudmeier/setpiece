import type { Metadata } from "next";
import Image from "next/image";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { Button, Badge, BigQuote, Card } from "@/components/ds";

const SITE_URL = "https://mv-artemis.nl/";

export const metadata: Metadata = {
  title: "MV Artemis — clubidentiteit door Setpiece",
  description:
    "Voor MV Artemis, de enige zelfstandige vrouwenvoetbalclub in Noord-Nederland met BVO-ambitie, bouwde Setpiece een herkenbare clubidentiteit: naam, merkverhaal, visuele stijl en communicatiebasis.",
};

// Wat Setpiece bouwde voor MV Artemis.
const DELIVERABLES = [
  {
    n: "01",
    title: "Naam en merkverhaal",
    body: "Van FC MVA Noord naar MV Artemis. Artemis, de Griekse godin van de jacht, staat voor onafhankelijkheid, doelgerichtheid en kracht. De positionering: de enige zelfstandige vrouwenvoetbalclub in de regio, geen neventak van een mannenclub.",
  },
  {
    n: "02",
    title: "Visuele identiteit",
    body: "Een logo en visuele stijl die de ambitie professioneel en menselijk zichtbaar maken. Herkenbaar op het veld, op social en richting sponsors.",
  },
  {
    n: "03",
    title: "Kernwaarden en toon",
    body: "Ambitie zonder plafond, eerlijkheid boven comfort, samen boven individueel, eigenaarschap. Vertaald naar een directe, ambitieuze toon zonder clubhuisretoriek.",
  },
  {
    n: "04",
    title: "Communicatiebasis",
    body: "Een lijn voor bestuur, team en achterban. Wedstrijdverslagen, speelsterportretten en trainingsimpressies die resultaten laten zien als bewijs van de filosofie.",
  },
  {
    n: "05",
    title: "Sponsorverhaal",
    body: "Het commerciële verhaal richting sponsors: een zelfstandige club met BVO-ambitie, een eigen filosofie en bewezen resultaten om je aan te verbinden.",
  },
  {
    n: "06",
    title: "Clubapp voor ontwikkeling",
    body: "Een app rond individuele ontwikkeling: profiel, planning, testresultaten en reflecties. De identiteit doorgetrokken tot in de dagelijkse werking van de club.",
  },
];

// Waarde per doelgroep binnen en rond de club.
const AUDIENCES = [
  {
    title: "Voor het bestuur",
    items: ["Een verhaal om zelf uit te dragen", "Houvast bij sponsors en gemeente", "Een merk dat bij de ambitie past"],
  },
  {
    title: "Voor de technische staf",
    items: ["Identiteit die aansluit op prestatiegericht werken", "Een duidelijke toon in de communicatie", "Trots als wervingskracht"],
  },
  {
    title: "Voor de speelsters",
    items: ["Een club die vrouwenvoetbal vooropstelt", "Herkenbaar op en naast het veld", "Eigenaarschap over eigen ontwikkeling"],
  },
  {
    title: "Voor sponsors en achterban",
    items: ["Een professioneel, herkenbaar merk", "Een helder verhaal om je aan te verbinden", "Zichtbaarheid rond een club in opkomst"],
  },
];

export default function MVArtemisPage() {
  return (
    <div data-screen-label="Case — MV Artemis">
      <SiteNav mode="page" />

      {/* Hero */}
      <section className="sp-case-hero" id="top">
        <div className="sp-container">
          <p className="sp-eyebrow sp-eyebrow--on-dark" data-reveal>Clubidentiteit</p>
          <h1 data-reveal style={{ transitionDelay: "60ms" }}>
            MV Artemis: van ambitie naar een herkenbare clubidentiteit.
          </h1>
          <p className="lead" data-reveal style={{ transitionDelay: "120ms" }}>
            Een jonge vrouwenvoetbalclub met BVO-ambitie had een verhaal nodig dat net zo scherp is
            als de sportieve doelen. Setpiece bouwde de naam, het merkverhaal, de visuele stijl en de
            communicatiebasis.
          </p>
          <div className="nk-stats" data-reveal style={{ transitionDelay: "180ms" }}>
            <div>
              <div className="nk-stat__num">3</div>
              <div className="nk-stat__label">teams onder één herkenbare identiteit</div>
            </div>
            <div>
              <div className="nk-stat__num">1</div>
              <div className="nk-stat__label">merkverhaal voor bestuur, team en achterban</div>
            </div>
            <div>
              <div className="nk-stat__num">2025</div>
              <div className="nk-stat__label">het jaar waarin de club opnieuw op de kaart ging</div>
            </div>
          </div>
          <div className="nk-hero__ctas" data-reveal style={{ transitionDelay: "240ms" }}>
            <Button variant="primary" size="lg" href="/#contact">Plan een kennismaking</Button>
            <Button variant="on-dark" size="lg" href={SITE_URL}>Bekijk de website →</Button>
          </div>
        </div>
      </section>

      {/* De uitdaging */}
      <section className="sp-section">
        <div className="sp-container" style={{ maxWidth: 760 }}>
          <p className="sp-eyebrow" data-reveal>De uitdaging</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "60ms" }}>
            Grote ambitie, nog geen verhaal dat meteen blijft hangen.
          </h2>
          <p className="nk-intro" data-reveal style={{ transitionDelay: "120ms" }}>
            MV Artemis is de enige zelfstandige vrouwenvoetbalclub in Noord-Nederland die zich volledig
            richt op meiden en vrouwen op prestatieniveau. De ambitie is er, de resultaten ook. Maar de
            oude naam en uitstraling pasten niet bij een club die bewust de concurrentie aangaat met
            BVO-academies.
          </p>
          <p className="nk-intro" data-reveal style={{ transitionDelay: "160ms" }}>
            Wat ontbrak was een identiteit die de ambitie draagt. Een naam, een verhaal en een stijl
            die bestuur, staf, speelsters en sponsors allemaal in dezelfde woorden kunnen vertellen.
          </p>
          <div data-reveal style={{ transitionDelay: "220ms", marginTop: 48 }}>
            <BigQuote by="Positionering MV Artemis">
              Geen neventak van een mannenclub. Een eigen club, met een eigen verhaal.
            </BigQuote>
          </div>
        </div>
      </section>

      {/* Wat we bouwden */}
      <section className="sp-section" id="aanpak" style={{ background: "var(--surface-card-tint)" }}>
        <div className="sp-container">
          <p className="sp-eyebrow" data-reveal>Wat we bouwden</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "60ms" }}>
            Van naam tot dagelijkse werking.
          </h2>
          <p className="nk-intro" data-reveal style={{ transitionDelay: "100ms", marginBottom: 48 }}>
            De identiteit stopt niet bij een logo. Ze loopt door van het merkverhaal tot in de
            communicatie en de app waarmee de club dagelijks werkt.
          </p>
          <div className="nk-cluster-grid">
            {DELIVERABLES.map((c, i) => (
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

      {/* De clubwebsite */}
      <section className="sp-section">
        <div className="sp-container">
          <p className="sp-eyebrow" data-reveal>De clubwebsite</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "60ms" }}>
            De identiteit staat live op mv-artemis.nl.
          </h2>
          <p className="nk-intro" data-reveal style={{ transitionDelay: "100ms", maxWidth: 640, marginBottom: 44 }}>
            Een snelle, herkenbare clubsite met wedstrijden, teams, nieuws en sponsors. Dezelfde
            ambitieuze toon, van de eerste kop tot de laatste voetnoot.
          </p>

          <div className="nk-browser" data-reveal>
            <div className="nk-browser__bar">
              <span className="nk-browser__dots" aria-hidden="true">
                <span className="nk-browser__dot" />
                <span className="nk-browser__dot" />
                <span className="nk-browser__dot" />
              </span>
              <span className="nk-browser__url">mv-artemis.nl</span>
            </div>
            <Image
              className="nk-browser__shot"
              src="/cases/mv-artemis/hero.jpg"
              alt="Homepage van mv-artemis.nl met de kop Jouw ambitie, ons doel"
              width={1600}
              height={911}
              sizes="(max-width: 760px) 100vw, 960px"
              priority
            />
          </div>

          <div className="nk-site-grid">
            <div data-reveal>
              <Image
                className="nk-shot"
                src="/cases/mv-artemis/ambitie.jpg"
                alt="Sectie Niet als bijzaak, als hoofdzaak op de clubwebsite"
                width={1600}
                height={994}
                sizes="(max-width: 760px) 100vw, 480px"
              />
            </div>
            <div data-reveal style={{ transitionDelay: "80ms" }}>
              <Image
                className="nk-shot"
                src="/cases/mv-artemis/teams.jpg"
                alt="Teamsectie met MO17, MO20 en Vrouwen 1 op de clubwebsite"
                width={1600}
                height={724}
                sizes="(max-width: 760px) 100vw, 480px"
              />
            </div>
          </div>

          <div data-reveal style={{ marginTop: 36 }}>
            <Button variant="primary" size="lg" href={SITE_URL}>Bekijk mv-artemis.nl →</Button>
          </div>
        </div>
      </section>

      {/* Waarde per doelgroep */}
      <section className="sp-section" style={{ background: "var(--surface-card-tint)" }}>
        <div className="sp-container">
          <p className="sp-eyebrow" data-reveal>Waarde</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "60ms" }}>
            Eén identiteit, voor iedereen rond de club.
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

      {/* CTA */}
      <section className="sp-section">
        <div className="sp-container">
          <div className="nk-cta" data-reveal>
            <Badge variant="outline" style={{ color: "var(--text-secondary-on-dark)", borderColor: "var(--border-on-dark)", marginBottom: 20 }}>
              Identiteit door Setpiece
            </Badge>
            <h2>Bouw je aan een club of organisatie met ambitie?</h2>
            <p>
              We vertalen ambitie naar een verhaal dat blijft hangen en een stijl die klopt. Voor
              verenigingen die professioneler willen worden zonder hun eigen karakter te verliezen.
            </p>
            <div className="nk-cta__ctas">
              <Button variant="primary" size="lg" href="/#contact">Plan een kennismaking</Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter mode="page" />
    </div>
  );
}
