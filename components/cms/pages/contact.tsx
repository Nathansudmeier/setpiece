import KansenscanContactForm from "@/components/workspoor/KansenscanContactForm";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";

import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished } from "@/lib/cms/read";
import { cmsMetadata } from "@/lib/cms/read";
export async function generateMetadata() {
  return cmsMetadata("contact");
}
export function CmsContact({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const EXPECTATION = [
    copy.tekst_001 ??
      "Setpiece beoordeelt of het probleem en de organisatie bij de scan passen.",
    copy.tekst_002 ?? "Nathan reageert binnen twee werkdagen.",
    copy.tekst_003 ??
      "Bij een mogelijke match volgt een gesprek van maximaal 30 minuten.",
    copy.tekst_004 ??
      "Daarna ontvang je wel of geen voorstel voor de kansenscan.",
  ] as const;

  return (
    <WorkspoorShell
      preview={preview}
      sharedCopy={sharedCopy}
      activePath="/contact"
    >
      <section className="ws-contact-hero">
        <div className="ws-frame ws-contact-hero__grid">
          <div>
            <p className="ws-context">{copy.tekst_005 ?? "Contact"}</p>
            <h1>{copy.kop_006 ?? "Bespreek of de kansenscan past."}</h1>
            <p className="ws-lead">
              {copy.tekst_007 ??
                "In maximaal 30 minuten verkennen we het werkprobleem, eigenaarschap en de mogelijke AI-kans. De volledige diagnose is betaald."}
            </p>

            <div className="ws-expectation">
              <h2>{copy.kop_008 ?? "Wat gebeurt er na je aanvraag?"}</h2>
              <ol>
                {EXPECTATION.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <p>
                {copy.tekst_009 ?? "Liever direct mailen?"}{" "}
                <a href={copy.link_010 ?? "mailto:hallo@setpiece.nl"}>
                  {copy.tekst_011 ?? "hallo@setpiece.nl"}
                </a>
              </p>
            </div>
          </div>

          <div className="ws-contact-panel">
            <KansenscanContactForm preview={preview} />
          </div>
        </div>
      </section>
    </WorkspoorShell>
  );
}
export default async function ContactPage() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("contact"),
    readPublished("shared"),
  ]);
  return <CmsContact copy={copy} sharedCopy={sharedCopy} />;
}
