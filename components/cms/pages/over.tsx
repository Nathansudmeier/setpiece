import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import ClosingCta from "@/components/workspoor/ClosingCta";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { SITE_URL } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished } from "@/lib/cms/read";
import { cmsMetadata } from "@/lib/cms/read";
export async function generateMetadata() {
  return cmsMetadata("over");
}
export function CmsOver({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const EXPERIENCE = [
    [
      copy.tekst_001 ?? "Nankaro",
      copy.tekst_002 ??
        "Productontwikkeling en procesverbetering binnen voetbalclubs.",
    ],
    [
      copy.tekst_003 ?? "Cameranu",
      copy.tekst_004 ??
        "Analyses, communicatie, financiële rapportages en dagelijkse besluitvorming.",
    ],
    [
      copy.tekst_005 ?? "A.Vogel",
      copy.tekst_006 ?? "E-mailmarketing en hergebruik van website-inhoud.",
    ],
    [
      copy.tekst_007 ?? "Set In",
      copy.tekst_008 ??
        "Werksessie, workflow, marketingplan en tijdelijke implementatieregie.",
    ],
  ] as const;

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
      <WorkspoorShell
        preview={preview}
        sharedCopy={sharedCopy}
        activePath="/over"
      >
        <section className="ws-page-hero">
          <div className="ws-frame ws-over-hero">
            <div>
              <p className="ws-context">{copy.tekst_009 ?? "Over Setpiece"}</p>
              <h1>
                {copy.kop_010 ??
                  "Praktische ervaring aan de directietafel en op de werkvloer."}
              </h1>
              <p className="ws-lead">
                {copy.tekst_011 ??
                  "Nathan Sudmeier verbindt AI Consultancy met strategie, procesverbetering, productontwikkeling en dagelijkse uitvoering."}
              </p>
            </div>
            <figure>
              <Image
                src="/people/nathan-sudmeier.jpg"
                alt={
                  copy.tekst_012 ?? "Nathan Sudmeier, oprichter van Setpiece"
                }
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
              <p className="ws-context">
                {copy.tekst_013 ?? "Waarom Setpiece bestaat"}
              </p>
              <h2 id="origin-title">
                {copy.kop_014 ??
                  "Geen losse presentatie. Een werkwijze die blijft."}
              </h2>
            </div>
            <div>
              <p>
                {copy.tekst_015 ??
                  "Veel organisaties zien kansen met AI, maar hebben weinig aan een losse presentatie, tool of verzameling prompts. Zij hebben iemand nodig die het werk begrijpt, een proces afbakent en een bruikbare AI-oplossing bouwt die medewerkers zelfstandig kunnen gebruiken."}
              </p>
              <p>
                {copy.tekst_016 ??
                  "Setpiece is opgericht om die rol te vervullen. Het is een AI Consultancy die bedrijfsdoel, uitvoering en borging bij elkaar brengt, zonder één techniek tot vertrekpunt te maken."}
              </p>
            </div>
          </div>
        </section>

        <section
          className="ws-experience-section"
          aria-labelledby="experience-title"
        >
          <div className="ws-frame">
            <div className="ws-section-heading ws-section-heading--dark">
              <p>{copy.tekst_017 ?? "Ervaring als bewijs"}</p>
              <h2 id="experience-title">
                {copy.kop_018 ?? "Werk dat lijkt op het werk van de klant."}
              </h2>
            </div>
            <div className="ws-experience-grid">
              {EXPERIENCE.map(([name, body]) => (
                <article key={name}>
                  <h3>{name}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <Link
              className="ws-text-link ws-text-link--paper"
              href={copy.link_019 ?? "/praktijkvoorbeelden"}
            >
              {copy.tekst_020 ?? "Bekijk de praktijkvoorbeelden"}
            </Link>
          </div>
        </section>

        <section
          className="ws-responsibility-note"
          aria-labelledby="responsibility-title"
        >
          <div className="ws-frame ws-responsibility-note__grid">
            <h2 id="responsibility-title">
              {copy.kop_021 ?? "Verantwoordelijkheid blijft bij één persoon."}
            </h2>
            <p>
              {copy.tekst_022 ??
                "Nathan houdt strategie, diagnose, klantrelatie, implementatieregie en kwaliteitscontrole bij zichzelf. Specialistisch werk wordt alleen toegevoegd wanneer veiligheid, kwaliteit of capaciteit dat noodzakelijk maakt. De klant weet altijd wie beslist en wie verantwoordelijk is."}
            </p>
          </div>
        </section>

        <section className="ws-region-section" aria-labelledby="region-title">
          <div className="ws-frame ws-region-grid">
            <div>
              <p className="ws-context">{copy.tekst_023 ?? "Werkgebied"}</p>
              <h2 id="region-title">
                {copy.kop_024 ??
                  "Regionaal dichtbij. Landelijk wanneer het past."}
              </h2>
            </div>
            <p>
              {copy.tekst_025 ??
                "Friesland, Groningen, Drenthe en Flevoland vormen de regionale basis. Opdrachten daarbuiten passen wanneer het bedrijfsprobleem, de introductie of de herhaalbaarheid sterk aansluit."}
            </p>
          </div>
        </section>

        <ClosingCta
          sharedCopy={sharedCopy}
          title={copy.kop_026 ?? "Een concreet werkprobleem om te bespreken?"}
        />
      </WorkspoorShell>
    </>
  );
}
export default async function OverPage() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("over"),
    readPublished("shared"),
  ]);
  return <CmsOver copy={copy} sharedCopy={sharedCopy} />;
}
