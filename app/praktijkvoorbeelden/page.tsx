import ClosingCta from "@/components/workspoor/ClosingCta";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { PRACTICE_CASES } from "@/lib/workspoor-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "AI-oplossingen in dagelijks werk",
  description:
    "Vier praktijkvoorbeelden laten zien hoe AI-oplossingen minder handwerk, snellere informatie en een vaste werkwijze mogelijk maken.",
  path: "/praktijkvoorbeelden",
});

export default function PraktijkvoorbeeldenPage() {
  return (
    <WorkspoorShell activePath="/praktijkvoorbeelden">
      <section className="ws-page-hero ws-page-hero--statement">
        <div className="ws-frame">
          <p className="ws-context">Praktijkvoorbeelden</p>
          <h1>Wat veranderde er in het dagelijkse werk?</h1>
          <p className="ws-lead">
            Vier voorbeelden laten zien hoe AI-oplossingen minder handwerk, snellere
            informatie en een vaste werkwijze mogelijk maken.
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
                  <small>Werkspoor in de praktijk</small>
                  <h2>{item.name}</h2>
                  <p>{item.summary}</p>
                </div>
              </header>
              <div className="ws-case__story">
                <div>
                  <h3>Beginsituatie</h3>
                  <p>{item.before}</p>
                </div>
                <div>
                  <h3>Wat veranderde</h3>
                  <p>{item.change}</p>
                </div>
                <div className="ws-case__result">
                  <h3>Resultaat</h3>
                  <p>{item.result}</p>
                  <small>
                    <strong>Meetcontext</strong>
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
            Ieder voorbeeld volgt hetzelfde format: beginsituatie, ingreep, resultaat en
            context. Cijfers worden alleen gepubliceerd wanneer de meetmethode en
            gebruikscontext zijn vastgelegd.
          </p>
        </div>
      </section>

      <ClosingCta title="Welk terugkerend werk verdient als eerste aandacht?" />
    </WorkspoorShell>
  );
}
