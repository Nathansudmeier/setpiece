import ClosingCta from "@/components/workspoor/ClosingCta";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";

import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";
import { cmsMetadata } from "@/lib/cms/read";
export async function generateMetadata() {
  return cmsMetadata("praktijkvoorbeelden");
}
export function CmsPraktijkvoorbeelden({
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
      preview={preview}
      sharedCopy={sharedCopy}
      activePath="/praktijkvoorbeelden"
    >
      <section className="ws-page-hero ws-page-hero--statement">
        <div className="ws-frame">
          <p className="ws-context">
            {copy.tekst_001 ?? "Praktijkvoorbeelden"}
          </p>
          <h1>{copy.kop_002 ?? "Wat veranderde er in het dagelijkse werk?"}</h1>
          <p className="ws-lead">
            {copy.tekst_003 ??
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
                  <small>{copy.tekst_004 ?? "Werkspoor in de praktijk"}</small>
                  <h2>{item.name}</h2>
                  <p>{item.summary}</p>
                </div>
              </header>
              <div className="ws-case__story">
                <div>
                  <h3>{copy.kop_005 ?? "Beginsituatie"}</h3>
                  <p>{item.before}</p>
                </div>
                <div>
                  <h3>{copy.kop_006 ?? "Wat veranderde"}</h3>
                  <p>{item.change}</p>
                </div>
                <div className="ws-case__result">
                  <h3>{copy.kop_007 ?? "Resultaat"}</h3>
                  <p>{item.result}</p>
                  <small>
                    <strong>{copy.tekst_008 ?? "Meetcontext"}</strong>
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
            {copy.tekst_009 ??
              "Ieder voorbeeld volgt hetzelfde format: beginsituatie, ingreep, resultaat en context. Cijfers worden alleen gepubliceerd wanneer de meetmethode en gebruikscontext zijn vastgelegd."}
          </p>
        </div>
      </section>

      <ClosingCta
        sharedCopy={sharedCopy}
        title={
          copy.kop_010 ?? "Welk terugkerend werk verdient als eerste aandacht?"
        }
      />
    </WorkspoorShell>
  );
}
export default async function PraktijkvoorbeeldenPage() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("praktijkvoorbeelden"),
    readPublished("shared"),
  ]);
  return <CmsPraktijkvoorbeelden copy={copy} sharedCopy={sharedCopy} />;
}
