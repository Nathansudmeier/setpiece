import Image from "next/image";

import ClosingCta from "@/components/workspoor/ClosingCta";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { SERVICE_ROUTE, WORKLINE_STEPS } from "@/lib/workspoor-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "AI Consultancy: van werkprobleem naar workflow",
  description:
    "Setpiece verbindt bedrijfsdoel, dagelijkse workflow, passende AI-oplossing, test, meting en overdracht.",
  path: "/werkwijze",
});

const PRINCIPLES = [
  "AI volgt het bedrijfsdoel en het werkproces.",
  "Iedere opdracht heeft een proceseigenaar.",
  "Medewerkers worden betrokken bij ontwerp en test.",
  "Gevoelige beslissingen blijven onder menselijk oordeel.",
  "Resultaat krijgt een nulmeting en eerste effectmeting.",
  "De klant kan na overdracht zelfstandig verder.",
] as const;

const METHOD_SCENES = [
  {
    label: "Begrijpen",
    title: "De medewerker legt het echte werk uit.",
    body: "Processtappen, uitzonderingen en terugkerend verlies worden zichtbaar voordat er iets wordt gebouwd.",
    src: "/workspoor/werkwijze-begrijpen.webp",
    alt: "Een medewerker legt een werkproces uit terwijl Setpiece luistert en aantekeningen maakt",
  },
  {
    label: "Testen",
    title: "De medewerker bestuurt de test.",
    body: "De AI-oplossing wordt gebruikt in een echte taak. Setpiece observeert, meet en stelt gericht bij.",
    src: "/workspoor/werkwijze-testen.webp",
    alt: "Een medewerker test een AI-oplossing op een laptop terwijl Setpiece meekijkt",
  },
  {
    label: "Overdragen",
    title: "De eigenaar kan zelfstandig verder.",
    body: "Werkwijze, controlepunten en verantwoordelijkheden worden aan de organisatie overgedragen.",
    src: "/workspoor/werkwijze-overdracht.webp",
    alt: "Een medewerker draagt een nieuwe werkwijze over aan een manager",
  },
] as const;

const ROLES = [
  ["Beslisser", "Bevestigt bedrijfsdoel, budget en vervolgbesluit."],
  ["Proceseigenaar", "Bewaakt inhoud, uitzonderingen en ingebruikname."],
  ["Medewerker", "Test de werkwijze in een echte taak."],
  ["Setpiece", "Draagt diagnose, ontwerp, regie, documentatie en kwaliteitscontrole."],
  ["Specialist", "Wordt alleen betrokken bij aantoonbare technische, juridische of beveiligingsbehoefte."],
] as const;

const RECORDS = [
  "De beginsituatie en het gewenste resultaat.",
  "De gebruikte meetmethode.",
  "Uitzonderingen en controlepunten.",
  "Wie beslist en wie uitvoert.",
  "Wat de klant na overdracht zelfstandig beheert.",
  "Wanneer stoppen, verbeteren of uitbreiden wordt besloten.",
] as const;

export default function WerkwijzePage() {
  return (
    <WorkspoorShell activePath="/werkwijze">
      <section className="ws-page-hero ws-page-hero--statement">
        <div className="ws-frame">
          <p className="ws-context">Werkwijze</p>
          <h1>AI telt pas wanneer mensen ermee werken.</h1>
          <p className="ws-lead">
            Setpiece verbindt bedrijfsdoel, dagelijkse workflow, passende AI-oplossing,
            test en overdracht in één beheersbare route.
          </p>
        </div>
      </section>

      <section className="ws-principles" aria-labelledby="principles-title">
        <div className="ws-frame">
          <div className="ws-section-heading">
            <p>Principes</p>
            <h2 id="principles-title">Wat tijdens iedere opdracht overeind blijft.</h2>
          </div>
          <ul>
            {PRINCIPLES.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ws-workline-section ws-workline-section--dark" aria-labelledby="full-route-title">
        <div className="ws-frame">
          <div className="ws-section-heading ws-section-heading--dark">
            <p>Het werkspoor</p>
            <h2 id="full-route-title">Van frictie naar eigenaarschap.</h2>
          </div>
          <ol className="ws-workline">
            {WORKLINE_STEPS.map((step, index) => (
              <li key={step.label} className={index === 2 ? "is-active" : undefined}>
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

      <section className="ws-method-film" aria-labelledby="method-film-title">
        <div className="ws-frame">
          <div className="ws-method-film__heading">
            <p className="ws-context">Van analyse naar dagelijks gebruik</p>
            <h2 id="method-film-title">AI-oplossingen ontstaan midden in het werk.</h2>
          </div>
          <div className="ws-method-film__grid">
            {METHOD_SCENES.map((scene, index) => (
              <figure
                key={scene.label}
                className={`ws-method-film__item ws-method-film__item--${index + 1}`}
              >
                <div className="ws-method-film__image">
                  <Image
                    src={scene.src}
                    alt={scene.alt}
                    fill
                    sizes="(max-width: 800px) 100vw, 52vw"
                  />
                </div>
                <figcaption>
                  <span>{scene.label}</span>
                  <h3>{scene.title}</h3>
                  <p>{scene.body}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="ws-route-section" aria-labelledby="services-title">
        <div className="ws-frame">
          <div className="ws-section-heading">
            <p>Drie diensten, één route</p>
            <h2 id="services-title">Ieder onderdeel eindigt met een besluit.</h2>
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
        </div>
      </section>

      <section className="ws-responsibility" aria-labelledby="roles-title">
        <div className="ws-frame ws-responsibility__grid">
          <div>
            <p className="ws-context">Rollen en eigenaarschap</p>
            <h2 id="roles-title">De klant weet altijd wie beslist en wie uitvoert.</h2>
          </div>
          <dl>
            {ROLES.map(([role, description]) => (
              <div key={role}>
                <dt>{role}</dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="ws-transfer-section" aria-labelledby="transfer-title">
        <div className="ws-frame ws-transfer-grid">
          <div>
            <p className="ws-context">Meten en overdragen</p>
            <h2 id="transfer-title">Resultaat blijft controleerbaar.</h2>
            <p className="ws-lead">
              Iedere verbetering legt vast wat werkte, wie verantwoordelijk is en wat de
              organisatie zelfstandig beheert.
            </p>
          </div>
          <ul>
            {RECORDS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ws-tool-statement">
        <div className="ws-frame">
          <p>De AI-oplossing wordt pas gekozen nadat het werk duidelijk is.</p>
          <h2>AI zonder eigenaar en werkwijze is geen oplevering.</h2>
        </div>
      </section>

      <ClosingCta title="Begin met het werkprobleem. Niet met een losse AI-tool." />
    </WorkspoorShell>
  );
}
