import Link from "next/link";

import KansenscanContactForm from "@/components/workspoor/KansenscanContactForm";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { LITERACY_PATH, LITERACY_REQUEST_PATH } from "@/lib/ai-geletterdheid";
import { createPageMetadata } from "@/lib/seo";

export const metadata = {
  ...createPageMetadata({ title: "Bespreek een AI-training of lezing", description: "Vertel wat jouw team nodig heeft. Nathan reageert binnen twee werkdagen met een passende volgende stap voor AI-geletterdheid.", path: LITERACY_REQUEST_PATH }),
  robots: { index: false, follow: true },
};

export default function LiteracyRequestPage() {
  return (
    <WorkspoorShell activePath={LITERACY_PATH}>
      <section className="ws-contact-hero">
        <div className="ws-frame ws-contact-hero__grid">
          <div>
            <p className="ws-context">AI-geletterdheid bespreken</p>
            <h1>Wat wil je jouw team meegeven?</h1>
            <p className="ws-lead">Vertel kort wat er speelt. Samen bepalen we of een teamtraining met opvolging of een lezing past.</p>
            <div className="ws-expectation">
              <h2>Wat gebeurt er na je aanvraag?</h2>
              <ol><li>Nathan reageert binnen twee werkdagen.</li><li>In maximaal dertig minuten bespreken we doel, deelnemers en werkvorm.</li><li>Je ontvangt bij een passende vraag een vaste offerte met scope en planning.</li><li>Je zit na het gesprek nergens aan vast.</li></ol>
              <p>Liever direct mailen? <a href="mailto:hallo@setpiece.nl?subject=AI-geletterdheid%20bespreken">hallo@setpiece.nl</a></p>
              <Link className="ws-text-link" href={LITERACY_PATH}>Terug naar de training en lezing</Link>
            </div>
          </div>
          <div className="ws-contact-panel"><KansenscanContactForm service="ai-geletterdheid" /></div>
        </div>
      </section>
    </WorkspoorShell>
  );
}
