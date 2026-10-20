import Image from "next/image";
import ClosingCta from "@/components/workspoor/ClosingCta";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";

import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";
import { cmsMetadata } from "@/lib/cms/read";
export async function generateMetadata() {
  return cmsMetadata("werkwijze");
}
export function CmsWerkwijze({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const { SERVICE_ROUTE, WORKLINE_STEPS } = sharedContent(sharedCopy);
  const PRINCIPLES = [
    copy.tekst_001 ?? "AI volgt het bedrijfsdoel en het werkproces.",
    copy.tekst_002 ?? "Iedere opdracht heeft een proceseigenaar.",
    copy.tekst_003 ?? "Medewerkers worden betrokken bij ontwerp en test.",
    copy.tekst_004 ?? "Gevoelige beslissingen blijven onder menselijk oordeel.",
    copy.tekst_005 ?? "Resultaat krijgt een nulmeting en eerste effectmeting.",
    copy.tekst_006 ?? "De klant kan na overdracht zelfstandig verder.",
  ] as const;
  const METHOD_SCENES = [
    {
      label: copy.tekst_007 ?? "Begrijpen",
      title: copy.tekst_008 ?? "De medewerker legt het echte werk uit.",
      body:
        copy.tekst_009 ??
        "Processtappen, uitzonderingen en terugkerend verlies worden zichtbaar voordat er iets wordt gebouwd.",
      src: "/workspoor/werkwijze-begrijpen.webp",
      alt:
        copy.tekst_010 ??
        "Een medewerker legt een werkproces uit terwijl Setpiece luistert en aantekeningen maakt",
    },
    {
      label: copy.tekst_011 ?? "Testen",
      title: copy.tekst_012 ?? "De medewerker bestuurt de test.",
      body:
        copy.tekst_013 ??
        "De AI-oplossing wordt gebruikt in een echte taak. Setpiece observeert, meet en stelt gericht bij.",
      src: "/workspoor/werkwijze-testen.webp",
      alt:
        copy.tekst_014 ??
        "Een medewerker test een AI-oplossing op een laptop terwijl Setpiece meekijkt",
    },
    {
      label: copy.tekst_015 ?? "Overdragen",
      title: copy.tekst_016 ?? "De eigenaar kan zelfstandig verder.",
      body:
        copy.tekst_017 ??
        "Werkwijze, controlepunten en verantwoordelijkheden worden aan de organisatie overgedragen.",
      src: "/workspoor/werkwijze-overdracht.webp",
      alt:
        copy.tekst_018 ??
        "Een medewerker draagt een nieuwe werkwijze over aan een manager",
    },
  ] as const;
  const ROLES = [
    [
      copy.tekst_019 ?? "Beslisser",
      copy.tekst_020 ?? "Bevestigt bedrijfsdoel, budget en vervolgbesluit.",
    ],
    [
      copy.tekst_021 ?? "Proceseigenaar",
      copy.tekst_022 ?? "Bewaakt inhoud, uitzonderingen en ingebruikname.",
    ],
    [
      copy.tekst_023 ?? "Medewerker",
      copy.tekst_024 ?? "Test de werkwijze in een echte taak.",
    ],
    [
      copy.tekst_025 ?? "Setpiece",
      copy.tekst_026 ??
        "Draagt diagnose, ontwerp, regie, documentatie en kwaliteitscontrole.",
    ],
    [
      copy.tekst_027 ?? "Specialist",
      copy.tekst_028 ??
        "Wordt alleen betrokken bij aantoonbare technische, juridische of beveiligingsbehoefte.",
    ],
  ] as const;
  const RECORDS = [
    copy.tekst_029 ?? "De beginsituatie en het gewenste resultaat.",
    copy.tekst_030 ?? "De gebruikte meetmethode.",
    copy.tekst_031 ?? "Uitzonderingen en controlepunten.",
    copy.tekst_032 ?? "Wie beslist en wie uitvoert.",
    copy.tekst_033 ?? "Wat de klant na overdracht zelfstandig beheert.",
    copy.tekst_034 ??
      "Wanneer stoppen, verbeteren of uitbreiden wordt besloten.",
  ] as const;

  return (
    <WorkspoorShell
      preview={preview}
      sharedCopy={sharedCopy}
      activePath="/werkwijze"
    >
      <section className="ws-page-hero ws-page-hero--statement">
        <div className="ws-frame">
          <p className="ws-context">{copy.tekst_035 ?? "Werkwijze"}</p>
          <h1>{copy.kop_036 ?? "AI telt pas wanneer mensen ermee werken."}</h1>
          <p className="ws-lead">
            {copy.tekst_037 ??
              "Setpiece verbindt bedrijfsdoel, dagelijkse workflow, passende AI-oplossing, test en overdracht in één beheersbare route."}
          </p>
        </div>
      </section>

      <section className="ws-principles" aria-labelledby="principles-title">
        <div className="ws-frame">
          <div className="ws-section-heading">
            <p>{copy.tekst_038 ?? "Principes"}</p>
            <h2 id="principles-title">
              {copy.kop_039 ?? "Wat tijdens iedere opdracht overeind blijft."}
            </h2>
          </div>
          <ul>
            {PRINCIPLES.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="ws-workline-section ws-workline-section--dark"
        aria-labelledby="full-route-title"
      >
        <div className="ws-frame">
          <div className="ws-section-heading ws-section-heading--dark">
            <p>{copy.tekst_040 ?? "Het werkspoor"}</p>
            <h2 id="full-route-title">
              {copy.kop_041 ?? "Van frictie naar eigenaarschap."}
            </h2>
          </div>
          <ol className="ws-workline">
            {WORKLINE_STEPS.map((step, index) => (
              <li
                key={step.label}
                className={index === 2 ? "is-active" : undefined}
              >
                <div className="ws-workline__mark" aria-hidden="true">
                  <span />
                </div>
                <p className="ws-workline__label">{step.label}</p>
                <h3>{step.state}</h3>
                <p>{step.action}</p>
                <small>
                  {copy.tekst_042 ?? "Eigenaar: "}
                  {step.owner}
                </small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ws-method-film" aria-labelledby="method-film-title">
        <div className="ws-frame">
          <div className="ws-method-film__heading">
            <p className="ws-context">
              {copy.tekst_043 ?? "Van analyse naar dagelijks gebruik"}
            </p>
            <h2 id="method-film-title">
              {copy.kop_044 ?? "AI-oplossingen ontstaan midden in het werk."}
            </h2>
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
            <p>{copy.tekst_045 ?? "Drie diensten, één route"}</p>
            <h2 id="services-title">
              {copy.kop_046 ?? "Ieder onderdeel eindigt met een besluit."}
            </h2>
          </div>
          <div className="ws-service-route">
            {SERVICE_ROUTE.map((service, index) => (
              <article
                key={service.name}
                className={index === 0 ? "is-primary" : undefined}
              >
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
            <p className="ws-context">
              {copy.tekst_047 ?? "Rollen en eigenaarschap"}
            </p>
            <h2 id="roles-title">
              {copy.kop_048 ??
                "De klant weet altijd wie beslist en wie uitvoert."}
            </h2>
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
            <p className="ws-context">
              {copy.tekst_049 ?? "Meten en overdragen"}
            </p>
            <h2 id="transfer-title">
              {copy.kop_050 ?? "Resultaat blijft controleerbaar."}
            </h2>
            <p className="ws-lead">
              {copy.tekst_051 ??
                "Iedere verbetering legt vast wat werkte, wie verantwoordelijk is en wat de organisatie zelfstandig beheert."}
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
          <p>
            {copy.tekst_052 ??
              "De AI-oplossing wordt pas gekozen nadat het werk duidelijk is."}
          </p>
          <h2>
            {copy.kop_053 ??
              "AI zonder eigenaar en werkwijze is geen oplevering."}
          </h2>
        </div>
      </section>

      <ClosingCta
        sharedCopy={sharedCopy}
        title={
          copy.kop_054 ??
          "Begin met het werkprobleem. Niet met een losse AI-tool."
        }
      />
    </WorkspoorShell>
  );
}
export default async function WerkwijzePage() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("werkwijze"),
    readPublished("shared"),
  ]);
  return <CmsWerkwijze copy={copy} sharedCopy={sharedCopy} />;
}
