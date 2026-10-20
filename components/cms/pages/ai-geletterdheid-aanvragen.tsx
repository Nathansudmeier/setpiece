import Link from "next/link";
import KansenscanContactForm from "@/components/workspoor/KansenscanContactForm";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { LITERACY_REQUEST_PATH } from "@/lib/ai-geletterdheid";
import { createPageMetadata } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";

const baseMetadata = {
  ...createPageMetadata({
    title: "Bespreek een AI-training of lezing",
    description:
      "Vertel wat jouw team nodig heeft. Nathan reageert binnen twee werkdagen met een passende volgende stap voor AI-geletterdheid.",
    path: LITERACY_REQUEST_PATH,
  }),
  robots: { index: false, follow: true },
};
export async function generateMetadata() {
  return cmsMetadata("ai-geletterdheid-aanvragen", baseMetadata);
}
export async function CmsAiGeletterdheidAanvragen({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const { LITERACY_PATH } = sharedContent(sharedCopy);

  return (
    <WorkspoorShell
      sharedCopy={sharedCopy}
      preview={preview}
      activePath={LITERACY_PATH}
    >
      <section className="ws-contact-hero">
        <div className="ws-frame ws-contact-hero__grid">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_001 ?? "AI-geletterdheid bespreken"}
            </p>
            <h1>{copy.v2_tekst_002 ?? "Wat wil je jouw team meegeven?"}</h1>
            <p className="ws-lead">
              {copy.v2_tekst_003 ??
                "Vertel kort wat er speelt. Samen bepalen we of een teamtraining met opvolging of een lezing past."}
            </p>
            <div className="ws-expectation">
              <h2>{copy.v2_tekst_004 ?? "Wat gebeurt er na je aanvraag?"}</h2>
              <ol>
                <li>
                  {copy.v2_tekst_005 ??
                    "Nathan reageert binnen twee werkdagen."}
                </li>
                <li>
                  {copy.v2_tekst_006 ??
                    "In maximaal dertig minuten bespreken we doel, deelnemers en werkvorm."}
                </li>
                <li>
                  {copy.v2_tekst_007 ??
                    "Je ontvangt bij een passende vraag een vaste offerte met scope en planning."}
                </li>
                <li>
                  {copy.v2_tekst_008 ??
                    "Je zit na het gesprek nergens aan vast."}
                </li>
              </ol>
              <p>
                {copy.v2_tekst_009 ?? "Liever direct mailen? "}
                <a
                  href={
                    copy.v2_link_010 ??
                    "mailto:hallo@setpiece.nl?subject=AI-geletterdheid%20bespreken"
                  }
                >
                  {copy.v2_tekst_011 ?? "hallo@setpiece.nl"}
                </a>
              </p>
              <Link className="ws-text-link" href={LITERACY_PATH}>
                {copy.v2_tekst_012 ?? "Terug naar de training en lezing"}
              </Link>
            </div>
          </div>
          <div className="ws-contact-panel">
            <KansenscanContactForm
              preview={preview}
              service="ai-geletterdheid"
            />
          </div>
        </div>
      </section>
    </WorkspoorShell>
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("ai-geletterdheid-aanvragen"),
    readPublished("shared"),
  ]);
  return <CmsAiGeletterdheidAanvragen copy={copy} sharedCopy={sharedCopy} />;
}
