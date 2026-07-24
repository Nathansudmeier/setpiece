import Image from "next/image";
import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import ClosingCta from "@/components/workspoor/ClosingCta";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "AI-consultant voor strategie en uitvoering",
  description:
    "Nathan Sudmeier verbindt AI Consultancy met strategie, procesverbetering, productontwikkeling en dagelijkse uitvoering.",
  path: "/over",
});

const EXPERIENCE = [
  ["Nankaro", "Productontwikkeling en procesverbetering binnen voetbalclubs."],
  ["Cameranu", "Analyses, communicatie, financiële rapportages en dagelijkse besluitvorming."],
  ["A.Vogel", "E-mailmarketing en hergebruik van website-inhoud."],
  ["Set In", "Werksessie, workflow, marketingplan en tijdelijke implementatieregie."],
] as const;

export default function OverPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Nathan Sudmeier",
          url: new URL("/over", SITE_URL).toString(),
          jobTitle: "AI-consultant en implementatiepartner",
          worksFor: { "@id": `${SITE_URL}#organization` },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Almere",
            addressCountry: "NL",
          },
        }}
      />
      <WorkspoorShell activePath="/over">
        <section className="ws-page-hero">
          <div className="ws-frame ws-over-hero">
            <div>
              <p className="ws-context">Over Setpiece</p>
              <h1>Praktische ervaring aan de directietafel en op de werkvloer.</h1>
              <p className="ws-lead">
                Nathan Sudmeier verbindt AI Consultancy met strategie,
                procesverbetering, productontwikkeling en dagelijkse uitvoering.
              </p>
            </div>
            <figure>
              <Image
                src="/people/nathan-sudmeier.jpg"
                alt="Nathan Sudmeier, oprichter van Setpiece"
                fill
                sizes="(max-width: 900px) 100vw, 34vw"
                priority
              />
            </figure>
          </div>
        </section>

        <section className="ws-origin-section" aria-labelledby="origin-title">
          <div className="ws-frame ws-origin-grid">
            <div>
              <p className="ws-context">Waarom Setpiece bestaat</p>
              <h2 id="origin-title">Geen losse presentatie. Een werkwijze die blijft.</h2>
            </div>
            <div>
              <p>
                Veel organisaties zien kansen met AI, maar hebben weinig aan een losse
                presentatie, tool of verzameling prompts. Zij hebben iemand nodig die het
                werk begrijpt, een proces afbakent en een bruikbare AI-oplossing bouwt die
                medewerkers zelfstandig kunnen gebruiken.
              </p>
              <p>
                Setpiece is opgericht om die rol te vervullen. Het is een AI Consultancy
                die bedrijfsdoel, uitvoering en borging bij elkaar brengt, zonder één
                techniek tot vertrekpunt te maken.
              </p>
            </div>
          </div>
        </section>

        <section className="ws-experience-section" aria-labelledby="experience-title">
          <div className="ws-frame">
            <div className="ws-section-heading ws-section-heading--dark">
              <p>Ervaring als bewijs</p>
              <h2 id="experience-title">Werk dat lijkt op het werk van de klant.</h2>
            </div>
            <div className="ws-experience-grid">
              {EXPERIENCE.map(([name, body]) => (
                <article key={name}>
                  <h3>{name}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <Link className="ws-text-link ws-text-link--paper" href="/praktijkvoorbeelden">
              Bekijk de praktijkvoorbeelden
            </Link>
          </div>
        </section>

        <section className="ws-responsibility-note" aria-labelledby="responsibility-title">
          <div className="ws-frame ws-responsibility-note__grid">
            <h2 id="responsibility-title">Verantwoordelijkheid blijft bij één persoon.</h2>
            <p>
              Nathan houdt strategie, diagnose, klantrelatie, implementatieregie en
              kwaliteitscontrole bij zichzelf. Specialistisch werk wordt alleen toegevoegd
              wanneer veiligheid, kwaliteit of capaciteit dat noodzakelijk maakt. De klant
              weet altijd wie beslist en wie verantwoordelijk is.
            </p>
          </div>
        </section>

        <section className="ws-region-section" aria-labelledby="region-title">
          <div className="ws-frame ws-region-grid">
            <div>
              <p className="ws-context">Werkgebied</p>
              <h2 id="region-title">Regionaal dichtbij. Landelijk wanneer het past.</h2>
            </div>
            <p>
              Friesland, Groningen, Drenthe en Flevoland vormen de regionale basis.
              Opdrachten daarbuiten passen wanneer het bedrijfsprobleem, de introductie of
              de herhaalbaarheid sterk aansluit.
            </p>
          </div>
        </section>

        <ClosingCta title="Een concreet werkprobleem om te bespreken?" />
      </WorkspoorShell>
    </>
  );
}
