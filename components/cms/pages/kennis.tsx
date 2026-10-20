import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";

import { createPageMetadata, SITE_URL } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";

const baseMetadata = createPageMetadata({
  title: "Kennis over AI, werkprocessen en AI-geletterdheid",
  description:
    "Praktische uitleg van Setpiece over AI invoeren, bedrijfsprocessen automatiseren, kosten, resultaat meten en werkafspraken voor medewerkers.",
  path: "/kennis",
});
export async function generateMetadata() {
  return cmsMetadata("kennis", baseMetadata);
}
export async function CmsKennis({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const { KNOWLEDGE_ARTICLES } = sharedContent(sharedCopy);

  return (
    <WorkspoorShell
      sharedCopy={sharedCopy}
      preview={preview}
      activePath="/kennis"
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Kennis over AI en werkprocessen",
          url: new URL("/kennis", SITE_URL).toString(),
          publisher: { "@id": `${SITE_URL}#organization` },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: KNOWLEDGE_ARTICLES.map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: article.title,
              url: new URL(`/kennis/${article.slug}`, SITE_URL).toString(),
            })),
          },
        }}
      />
      <section className="ws-page-hero">
        <div className="ws-frame">
          <p className="ws-context">
            {copy.v2_tekst_001 ?? "Kennis voor dagelijks werk"}
          </p>
          <h1>
            {copy.v2_tekst_002 ??
              "Begrijp wat AI voor jouw werk kan betekenen."}
          </h1>
          <p className="ws-lead">
            {copy.v2_tekst_003 ??
              "Waar begin je, wat kost het en hoe weet je of het helpt? Deze gidsen geven je houvast bij proceskeuze, resultaat en afspraken met medewerkers."}
          </p>
        </div>
      </section>
      <section className="ws-literacy-section">
        <div className="ws-frame ws-knowledge-grid">
          {KNOWLEDGE_ARTICLES.map((article) => (
            <article key={article.slug}>
              <p className="ws-context">{article.label}</p>
              <h2>
                <Link href={`/kennis/${article.slug}`}>{article.title}</Link>
              </h2>
              <p>{article.description}</p>
              <Link className="ws-text-link" href={`/kennis/${article.slug}`}>
                {copy.v2_tekst_004 ?? "Lees de uitleg"}
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="ws-literacy-section ws-literacy-section--mist">
        <div className="ws-frame">
          <h2>{copy.v2_tekst_005 ?? "Van uitleg naar je eigen situatie."}</h2>
          <p>
            {copy.v2_tekst_006 ?? "Vergelijk "}
            <Link href={copy.v2_link_007 ?? "/diensten"}>
              {copy.v2_tekst_008 ?? "de diensten van Setpiece"}
            </Link>
            {copy.v2_tekst_009 ?? ", bekijk "}
            <Link href={copy.v2_link_010 ?? "/praktijkvoorbeelden"}>
              {copy.v2_tekst_011 ?? "de praktijkvoorbeelden"}
            </Link>{" "}
            {copy.v2_tekst_012 ?? "of lees "}
            <Link href={copy.v2_link_013 ?? "/werkwijze"}>
              {copy.v2_tekst_014 ??
                "hoe we een verbetering testen en overdragen"}
            </Link>
            {copy.v2_tekst_015 ?? "."}
          </p>
        </div>
      </section>
    </WorkspoorShell>
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("kennis"),
    readPublished("shared"),
  ]);
  return <CmsKennis copy={copy} sharedCopy={sharedCopy} />;
}
