import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import ClosingCta from "@/components/workspoor/ClosingCta";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import {
  createBreadcrumbSchema,
  createPageMetadata,
  ORGANIZATION_ID,
  PERSON_ID,
  SITE_URL,
  WEBSITE_ID,
} from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";

const baseMetadata = createPageMetadata({
  title: "AI-consultant voor strategie en uitvoering",
  description:
    "Nathan Sudmeier verbindt AI Consultancy met strategie, procesverbetering, productontwikkeling en dagelijkse uitvoering.",
  path: "/over",
});
export async function generateMetadata() {
  return cmsMetadata("over", baseMetadata);
}
export async function CmsOver({
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
      copy.v2_tekst_001 ?? "Nankaro",
      copy.v2_tekst_002 ??
        "Productontwikkeling en procesverbetering binnen voetbalclubs.",
    ],
    [
      copy.v2_tekst_003 ?? "Cameranu",
      copy.v2_tekst_004 ??
        "Analyses, communicatie, financiële rapportages en dagelijkse besluitvorming.",
    ],
    [
      copy.v2_tekst_005 ?? "A.Vogel",
      copy.v2_tekst_006 ?? "E-mailmarketing en hergebruik van website-inhoud.",
    ],
    [
      copy.v2_tekst_007 ?? "Set In",
      copy.v2_tekst_008 ??
        "Werksessie, workflow, marketingplan en tijdelijke implementatieregie.",
    ],
  ] as const;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": PERSON_ID,
              name: "Nathan Sudmeier",
              url: new URL("/over", SITE_URL).toString(),
              jobTitle: "AI-consultant en implementatiepartner",
              worksFor: { "@id": ORGANIZATION_ID },
              image: new URL(
                "/people/nathan-sudmeier.jpg",
                SITE_URL,
              ).toString(),
              address: {
                "@type": "PostalAddress",
                addressLocality: "Almere",
                addressCountry: "NL",
              },
            },
            {
              "@type": "AboutPage",
              "@id": new URL("/over#webpage", SITE_URL).toString(),
              url: new URL("/over", SITE_URL).toString(),
              name: "Over Nathan Sudmeier en Setpiece",
              inLanguage: "nl-NL",
              isPartOf: { "@id": WEBSITE_ID },
              mainEntity: { "@id": PERSON_ID },
              about: { "@id": ORGANIZATION_ID },
            },
            createBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Over Setpiece", path: "/over" },
            ]),
          ],
        }}
      />
      <WorkspoorShell
        sharedCopy={sharedCopy}
        preview={preview}
        activePath="/over"
      >
        <section className="ws-page-hero">
          <div className="ws-frame ws-over-hero">
            <div>
              <nav className="ws-breadcrumb" aria-label="Broodkruimel">
                <Link href="/">{copy.v2_tekst_009 ?? "Home"}</Link>
                <span aria-hidden="true">{copy.v2_tekst_010 ?? "/"}</span>
                <span>{copy.v2_tekst_011 ?? "Over Setpiece"}</span>
              </nav>
              <p className="ws-context">
                {copy.v2_tekst_012 ?? "Over Setpiece"}
              </p>
              <h1>
                {copy.v2_tekst_013 ??
                  "Praktische ervaring aan de directietafel en op de werkvloer."}
              </h1>
              <p className="ws-lead">
                {copy.v2_tekst_014 ??
                  "Nathan Sudmeier verbindt AI Consultancy met strategie, procesverbetering, productontwikkeling en dagelijkse uitvoering."}
              </p>
            </div>
            <figure>
              <Image
                src="/people/nathan-sudmeier.jpg"
                alt={
                  copy.v2_tekst_015 ?? "Nathan Sudmeier, oprichter van Setpiece"
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
                {copy.v2_tekst_016 ?? "Waarom Setpiece bestaat"}
              </p>
              <h2 id="origin-title">
                {copy.v2_tekst_017 ??
                  "Inzicht dat verder helpt in het dagelijks werk."}
              </h2>
            </div>
            <div>
              <p>
                {copy.v2_tekst_018 ??
                  "Veel organisaties zien kansen met AI en zoeken een passende eerste stap. Een lezing kan helpen om mogelijkheden en vragen te verkennen. Een teamtraining voegt oefenen en werkafspraken toe. Wie een volledig proces wil verbeteren, heeft ook afbakening, een werkende oplossing en overdracht nodig."}
              </p>
              <p>
                {copy.v2_tekst_019 ?? "Bekijk de "}
                <Link href={copy.v2_link_020 ?? "/ai-geletterdheid"}>
                  {copy.v2_tekst_021 ??
                    "teamtraining en lezingen over AI-geletterdheid"}
                </Link>{" "}
                {copy.v2_tekst_022 ?? "of begin met een "}
                <Link href={copy.v2_link_023 ?? "/kansenscan"}>
                  {copy.v2_tekst_024 ?? "AI-kansenscan"}
                </Link>{" "}
                {copy.v2_tekst_025 ?? "voor een concreet werkproces."}
              </p>
              <p>
                {copy.v2_tekst_026 ??
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
              <p>{copy.v2_tekst_027 ?? "Ervaring als bewijs"}</p>
              <h2 id="experience-title">
                {copy.v2_tekst_028 ??
                  "Werk dat lijkt op het werk van de klant."}
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
              href={copy.v2_link_029 ?? "/praktijkvoorbeelden"}
            >
              {copy.v2_tekst_030 ?? "Bekijk de praktijkvoorbeelden"}
            </Link>
          </div>
        </section>

        <section
          className="ws-responsibility-note"
          aria-labelledby="responsibility-title"
        >
          <div className="ws-frame ws-responsibility-note__grid">
            <h2 id="responsibility-title">
              {copy.v2_tekst_031 ??
                "Verantwoordelijkheid blijft bij één persoon."}
            </h2>
            <p>
              {copy.v2_tekst_032 ??
                "Nathan houdt strategie, diagnose, klantrelatie, implementatieregie en kwaliteitscontrole bij zichzelf. Specialistisch werk wordt alleen toegevoegd wanneer veiligheid, kwaliteit of capaciteit dat noodzakelijk maakt. De klant weet altijd wie beslist en wie verantwoordelijk is."}
            </p>
          </div>
        </section>

        <section className="ws-region-section" aria-labelledby="region-title">
          <div className="ws-frame ws-region-grid">
            <div>
              <p className="ws-context">{copy.v2_tekst_033 ?? "Werkgebied"}</p>
              <h2 id="region-title">
                {copy.v2_tekst_034 ??
                  "Regionaal dichtbij. Landelijk wanneer het past."}
              </h2>
            </div>
            <p>
              {copy.v2_tekst_035 ??
                "Friesland, Groningen, Drenthe en Flevoland vormen de regionale basis. Opdrachten daarbuiten passen wanneer het bedrijfsprobleem, de introductie of de herhaalbaarheid sterk aansluit."}
            </p>
          </div>
        </section>

        <ClosingCta
          sharedCopy={sharedCopy}
          title={
            copy.v2_tekst_036 ?? "Een concreet werkprobleem om te bespreken?"
          }
        />
      </WorkspoorShell>
    </>
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("over"),
    readPublished("shared"),
  ]);
  return <CmsOver copy={copy} sharedCopy={sharedCopy} />;
}
