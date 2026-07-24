import KansenscanContactForm from "@/components/workspoor/KansenscanContactForm";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Bespreek de AI-kansenscan",
  description:
    "Verken in maximaal 30 minuten het werkprobleem, de mogelijke AI-kans en de voorwaarden van de kansenscan.",
  path: "/contact",
});

const EXPECTATION = [
  "Setpiece beoordeelt of het probleem en de organisatie bij de scan passen.",
  "Nathan reageert binnen twee werkdagen.",
  "Bij een mogelijke match volgt een gesprek van maximaal 30 minuten.",
  "Daarna ontvang je wel of geen voorstel voor de kansenscan.",
] as const;

export default function ContactPage() {
  return (
    <WorkspoorShell activePath="/contact">
      <section className="ws-contact-hero">
        <div className="ws-frame ws-contact-hero__grid">
          <div>
            <p className="ws-context">Contact</p>
            <h1>Bespreek of de kansenscan past.</h1>
            <p className="ws-lead">
              In maximaal 30 minuten verkennen we het werkprobleem, eigenaarschap en de
              mogelijke AI-kans. De volledige diagnose is betaald.
            </p>

            <div className="ws-expectation">
              <h2>Wat gebeurt er na je aanvraag?</h2>
              <ol>
                {EXPECTATION.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <p>
                Liever direct mailen?{" "}
                <a href="mailto:hallo@setpiece.nl">hallo@setpiece.nl</a>
              </p>
            </div>
          </div>

          <div className="ws-contact-panel">
            <KansenscanContactForm />
          </div>
        </div>
      </section>
    </WorkspoorShell>
  );
}
