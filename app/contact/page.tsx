import KansenscanContactForm, { type Service } from "@/components/workspoor/KansenscanContactForm";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact over AI-advies, implementatie en training",
  description:
    "Bespreek je werkvraag met Nathan Sudmeier. Setpiece helpt met AI-advies, implementatie en begeleiding vanuit Almere. Kennismaking van maximaal 30 minuten.",
  path: "/contact",
});

const EXPECTATION = [
  "Setpiece beoordeelt of de vraag en de organisatie bij de gekozen dienst passen.",
  "Nathan reageert binnen twee werkdagen.",
  "Bij een mogelijke match volgt een gesprek van maximaal 30 minuten.",
  "Daarna bepalen we of een voorstel past en voor welke afgebakende stap.",
] as const;

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ dienst?: string | string[] }> }) {
  const { dienst } = await searchParams;
  const options: Record<string, { service: Service; heading: string }> = {
    "ai-implementatie": { service: "ai-implementatie", heading: "Bespreek je AI-implementatie." },
    "ai-groeipartner": { service: "ai-groeipartner", heading: "Bespreek doorlopende AI-begeleiding." },
    "ai-maatwerk": { service: "ai-maatwerk", heading: "Bespreek je maatwerkvraag." },
  };
  const selected = typeof dienst === "string" && Object.hasOwn(options, dienst) ? options[dienst] : { service: "kansenscan" as const, heading: "Bespreek of de kansenscan past." };
  return (
    <WorkspoorShell activePath="/contact">
      <section className="ws-contact-hero">
        <div className="ws-frame ws-contact-hero__grid">
          <div>
            <p className="ws-context">Contact</p>
            <h1>{selected.heading}</h1>
            <p className="ws-lead">
              In maximaal 30 minuten verkennen we het werkprobleem, eigenaarschap en de
              mogelijke AI-kans. De volledige diagnose is betaald.
            </p>
            <p>Vanuit Almere, met focus op Flevoland, Friesland, Groningen en Drenthe. Lees meer over <a href="/diensten">de diensten</a> en <a href="/over">Nathan en Setpiece</a>.</p>

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
            <KansenscanContactForm service={selected.service} />
          </div>
        </div>
      </section>
    </WorkspoorShell>
  );
}
