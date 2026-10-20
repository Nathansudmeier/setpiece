import Link from "next/link";
import ClosingCta from "@/components/workspoor/ClosingCta";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";

import { createPageMetadata } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";

const baseMetadata = createPageMetadata({
  title: "AI-oplossingen in dagelijks werk",
  description:
    "Vier praktijkvoorbeelden laten zien hoe AI-oplossingen minder handwerk, snellere informatie en een vaste werkwijze mogelijk maken.",
  path: "/praktijkvoorbeelden",
});
export async function generateMetadata() {
  return cmsMetadata("praktijkvoorbeelden", baseMetadata);
}
export async function CmsPraktijkvoorbeelden({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const { PRACTICE_CASES } = sharedContent(sharedCopy);

  return (
    <WorkspoorShell
      sharedCopy={sharedCopy}
      preview={preview}
      activePath="/praktijkvoorbeelden"
    >
      <section className="ws-page-hero ws-page-hero--statement">
        <div className="ws-frame">
          <p className="ws-context">
            {copy.v2_tekst_001 ?? "Praktijkvoorbeelden"}
          </p>
          <h1>
            {copy.v2_tekst_002 ?? "Wat veranderde er in het dagelijkse werk?"}
          </h1>
          <p className="ws-lead">
            {copy.v2_tekst_003 ??
              "Vier voorbeelden laten zien hoe AI-oplossingen minder handwerk, snellere informatie en een vaste werkwijze mogelijk maken."}
          </p>
        </div>
      </section>

      <section className="ws-case-index" aria-label="Praktijkvoorbeelden">
        <div className="ws-frame">
          {PRACTICE_CASES.map((item) => (
            <article key={item.id} id={item.id} className="ws-case">
              <header>
                <span className="ws-case__origin" aria-hidden="true" />
                <div>
                  <small>
                    {copy.v2_tekst_004 ?? "Werkspoor in de praktijk"}
                  </small>
                  <h2>{item.name}</h2>
                  <p>{item.summary}</p>
                </div>
              </header>
              <div className="ws-case__story">
                <div>
                  <h3>{copy.v2_tekst_005 ?? "Beginsituatie"}</h3>
                  <p>{item.before}</p>
                </div>
                <div>
                  <h3>{copy.v2_tekst_006 ?? "Wat veranderde"}</h3>
                  <p>{item.change}</p>
                </div>
                <div className="ws-case__result">
                  <h3>{copy.v2_tekst_007 ?? "Resultaat"}</h3>
                  <p>{item.result}</p>
                  <small>
                    <strong>{copy.v2_tekst_008 ?? "Meetcontext"}</strong>
                    {item.context}
                  </small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ws-evidence-note">
        <div className="ws-frame">
          <p>
            {copy.v2_tekst_009 ??
              "Ieder voorbeeld volgt hetzelfde format: beginsituatie, ingreep, resultaat en context. De genoemde cijfers horen bij de beschreven werkzaamheden en zijn geen voorspelling voor een andere organisatie."}
          </p>
          <p>
            {copy.v2_tekst_010 ?? "Lees hoe we "}
            <Link href={copy.v2_link_011 ?? "/kennis/ai-resultaat-meten"}>
              {copy.v2_tekst_012 ?? "kosten en resultaat beoordelen"}
            </Link>{" "}
            {copy.v2_tekst_013 ?? "en bekijk de "}
            <Link href={copy.v2_link_014 ?? "/ai-implementatie"}>
              {copy.v2_tekst_015 ?? "AI-implementatiesprint"}
            </Link>{" "}
            {copy.v2_tekst_016 ?? "of "}
            <Link href={copy.v2_link_017 ?? "/ai-groeipartner"}>
              {copy.v2_tekst_018 ?? "doorlopende begeleiding"}
            </Link>
            {copy.v2_tekst_019 ?? "."}
          </p>
        </div>
      </section>

      <ClosingCta
        sharedCopy={sharedCopy}
        title={
          copy.v2_tekst_020 ??
          "Welk terugkerend werk verdient als eerste aandacht?"
        }
      />
    </WorkspoorShell>
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("praktijkvoorbeelden"),
    readPublished("shared"),
  ]);
  return <CmsPraktijkvoorbeelden copy={copy} sharedCopy={sharedCopy} />;
}
