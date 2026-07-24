/*
THESIS: Eén zichtbaar werkspoor verandert terugkerende frictie in een geborgde werkwijze; geen generieke advieshero of dienstenkaartjes.
OWN-WORLD: Paper en Ink bezitten grote velden. Signal Rose markeert de ene ingreep. Scherpe lijnen, vlak bewijs en het zeshoekige merk dragen de vorm.
STORY: Herken verlies, zie onderbouwd bewijs, begrijp de kansenscan, volg de route en bespreek de passende eerste stap.
FIRST VIEWPORT: Een brede belofte beslaat het raster; de scanfeiten vormen één beslisregel eronder. De primaire actie staat direct naast de termijn en prijs.
FORM: Richting B, verticale overdracht, was de structurele winnaar. Richting C levert de Ink/Paper-kruisingen. Door gebruiker goedgekeurd; er is geen seed key voor deze aangeleverde handoff.
*/

import Image from "next/image";
import Link from "next/link";

import ClosingCta from "@/components/workspoor/ClosingCta";
import FaqList from "@/components/workspoor/FaqList";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import {
  FAQ_ITEMS,
  HOME_PROOF,
  SERVICE_ROUTE,
  WORKLINE_STEPS,
} from "@/lib/workspoor-content";

const PROBLEMS = [
  "Medewerkers verzamelen dezelfde informatie uit meerdere systemen.",
  "Offertes, rapportages of communicatie blijven te lang liggen.",
  "Kwaliteit hangt sterk af van één ervaren collega.",
  "Losse AI-experimenten worden geen vaste werkwijze.",
  "De directie ziet mogelijkheden, maar mist een verantwoorde eerste keuze.",
] as const;

const FITS = [
  "Er is een herkenbaar terugkerend werkprobleem.",
  "Een beslisser en proceseigenaar zijn betrokken.",
  "Medewerkers krijgen tijd voor de werksessie en test.",
  "Veilige voorbeelden of testgegevens zijn beschikbaar.",
  "Er is budget voor een mogelijke vervolgstap.",
] as const;

const DOES_NOT_FIT = [
  "De organisatie zoekt alleen vrijblijvende ideeën.",
  "Er wordt geen eigenaar aangewezen.",
  "Er is geen tijd voor testen en invoering.",
] as const;

export default function WorkspoorHome() {
  return (
    <WorkspoorShell>
      <section className="ws-home-hero" aria-labelledby="home-title">
        <div className="ws-frame">
          <div className="ws-hero__signal" aria-hidden="true">
            <span />
          </div>
          <p className="ws-context">
            AI Consultancy voor B2B-dienstverleners met 15 tot 75 medewerkers
          </p>
          <h1 id="home-title">
            Maak dagelijks werk
            <span>eenvoudiger en beter met AI.</span>
          </h1>
          <div className="ws-hero__intro">
            <p>
              Setpiece onderzoekt waar terugkerend werk vastloopt, bouwt een passende
              AI-oplossing of workflow en maakt die samen met medewerkers werkend en
              overdraagbaar.
            </p>
            <Link className="ws-text-link" href="/werkwijze">
              Zie hoe het werkspoor loopt
            </Link>
          </div>

          <div className="ws-decision-rail" aria-label="Kern van de kansenscan">
            <div>
              <span>Investering</span>
              <strong>€ 1.250 excl. btw</strong>
            </div>
            <div>
              <span>Na de werksessie</span>
              <strong>5 werkdagen</strong>
            </div>
            <div>
              <span>Richting</span>
              <strong>90-dagenroute</strong>
            </div>
            <div>
              <span>Eerste bewijs</span>
              <strong>1 werkende AI-oplossing</strong>
            </div>
            <Link className="ws-button" href="/contact">
              Bespreek de kansenscan
            </Link>
          </div>
        </div>
      </section>

      <section className="ws-proof-field" aria-labelledby="proof-title">
        <div className="ws-frame">
          <div className="ws-section-heading ws-section-heading--dark">
            <p>Resultaten uit dagelijks werk</p>
            <h2 id="proof-title">Bewijs vóór belofte.</h2>
            <Link className="ws-text-link ws-text-link--paper" href="/praktijkvoorbeelden">
              Bekijk de volledige context
            </Link>
          </div>
          <div className="ws-proof-grid">
            {HOME_PROOF.map((item) => (
              <article key={item.result + item.title} className="ws-proof">
                <p className="ws-proof__result">{item.result}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <small>{item.context}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ws-problem-section" aria-labelledby="problem-title">
        <div className="ws-frame ws-problem-grid">
          <div className="ws-sticky-heading">
            <p className="ws-context">Waar werk dagelijks lekt</p>
            <h2 id="problem-title">Geen groot systeemprobleem. Wel iedere week verlies.</h2>
          </div>
          <ol className="ws-friction-list">
            {PROBLEMS.map((problem) => (
              <li key={problem}>
                <span className="ws-stop-mark" aria-hidden="true" />
                <p>{problem}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="ai-consultancy" className="ws-photo-crossing" aria-label="Setpiece aan het werk">
        <div className="ws-frame ws-photo-crossing__grid">
          <div className="ws-photo-crossing__statement">
            <p>AI Consultancy in het echte werk.</p>
            <h2>AI begint bij het proces.</h2>
            <span>
              Eerst begrijpen wat mensen doen en waar het stokt. Dan de juiste AI-oplossing
              bouwen, testen en overdragen aan de mensen die ermee werken.
            </span>
          </div>
          <div className="ws-photo-crossing__media">
            <figure className="ws-photo-crossing__wide">
              <Image
                src="/workspoor/werkcontext-breed.webp"
                alt="Vier professionals bespreken een werkproces terwijl Setpiece luistert"
                fill
                sizes="(max-width: 800px) 100vw, 58vw"
              />
            </figure>
            <figure className="ws-photo-crossing__detail">
              <Image
                src="/workspoor/proces-detail.webp"
                alt="Twee professionals vergelijken processtappen op papier"
                fill
                sizes="(max-width: 800px) 52vw, 24vw"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="ws-scan-section" aria-labelledby="scan-title">
        <div className="ws-frame ws-scan-grid">
          <div>
            <p className="ws-context">De beheerste eerste stap</p>
            <h2 id="scan-title">Begin met één onderbouwde keuze.</h2>
            <p className="ws-lead">
              De kansenscan onderzoekt maximaal drie kernprocessen. Binnen vijf werkdagen
              na de werksessie ontvang je een prioriteit, een route voor 90 dagen en één
              kleine werkende AI-oplossing.
            </p>
            <div className="ws-inline-actions">
              <Link className="ws-button" href="/contact">
                Bespreek de kansenscan
              </Link>
              <Link className="ws-text-link ws-text-link--paper" href="/kansenscan">
                Bekijk scope en voorwaarden
              </Link>
            </div>
          </div>
          <dl className="ws-scan-facts">
            <div>
              <dt>Werkgebied</dt>
              <dd>Maximaal drie kernprocessen</dd>
            </div>
            <div>
              <dt>Werksessie</dt>
              <dd>Maximaal 90 minuten</dd>
            </div>
            <div>
              <dt>Vervolg</dt>
              <dd>Stoppen, zelf uitvoeren of gericht verder</dd>
            </div>
            <div>
              <dt>Verrekening</dt>
              <dd>€ 750 bij een sprintstart binnen 30 dagen</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="ws-workline-section" aria-labelledby="workline-title">
        <div className="ws-frame">
          <div className="ws-section-heading">
            <p>Van kans naar dagelijks gebruik</p>
            <h2 id="workline-title">Iedere halte eindigt met eigenaarschap.</h2>
          </div>
          <ol className="ws-workline">
            {WORKLINE_STEPS.map((step, index) => (
              <li key={step.label} className={index === 1 ? "is-active" : undefined}>
                <div className="ws-workline__mark" aria-hidden="true">
                  <span />
                </div>
                <p className="ws-workline__label">{step.label}</p>
                <h3>{step.state}</h3>
                <p>{step.action}</p>
                <small>Eigenaar: {step.owner}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ws-route-section" aria-labelledby="route-title">
        <div className="ws-frame">
          <div className="ws-section-heading">
            <p>Drie diensten, één lijn</p>
            <h2 id="route-title">Je koopt alleen de volgende logische stap.</h2>
          </div>
          <div className="ws-service-route">
            {SERVICE_ROUTE.map((service, index) => (
              <article key={service.name} className={index === 0 ? "is-primary" : undefined}>
                <div>
                  <span>{service.note}</span>
                  <h3>{service.name}</h3>
                </div>
                <p>{service.when}</p>
                <p>{service.result}</p>
                <strong>{service.price}</strong>
              </article>
            ))}
          </div>
          <p className="ws-route-note">
            Alle bedragen zijn exclusief btw. De kansenscan is zelfstandig en verplicht
            niet tot vervolg.
          </p>
        </div>
      </section>

      <section className="ws-founder-section" aria-labelledby="founder-title">
        <div className="ws-frame ws-founder-grid">
          <div>
            <p className="ws-context">Verantwoordelijkheid blijft zichtbaar</p>
            <h2 id="founder-title">Eén aanspreekpunt van diagnose tot overdracht.</h2>
          </div>
          <div>
            <p>
              Setpiece is opgericht door Nathan Sudmeier. Vanuit ervaring met marketing,
              communicatie, strategie en productontwikkeling weet hij waar plannen in de
              dagelijkse praktijk vastlopen.
            </p>
            <p>
              Nathan blijft verantwoordelijk voor diagnose, klantrelatie,
              implementatieregie en kwaliteit. Specialisten worden alleen betrokken
              wanneer de opdracht dat aantoonbaar vraagt.
            </p>
            <Link className="ws-text-link" href="/over">
              Lees waarom Setpiece bestaat
            </Link>
          </div>
        </div>
      </section>

      <section className="ws-fit-section" aria-labelledby="fit-title">
        <div className="ws-frame">
          <div className="ws-section-heading ws-section-heading--dark">
            <p>Goede afbakening voorkomt een verkeerd project</p>
            <h2 id="fit-title">Past de kansenscan bij jouw organisatie?</h2>
          </div>
          <div className="ws-fit-grid">
            <div>
              <h3>De scan past wanneer</h3>
              <ul>
                {FITS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>De scan past niet wanneer</h3>
              <ul>
                {DOES_NOT_FIT.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="ws-faq-section" aria-labelledby="faq-title">
        <div className="ws-frame ws-faq-grid">
          <div>
            <p className="ws-context">Veelgestelde vragen</p>
            <h2 id="faq-title">Duidelijk vóór de werksessie.</h2>
          </div>
          <FaqList items={FAQ_ITEMS} />
        </div>
      </section>

      <ClosingCta />
    </WorkspoorShell>
  );
}
