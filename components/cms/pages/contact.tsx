import KansenscanContactForm, {
  type Service,
} from "@/components/workspoor/KansenscanContactForm";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { createPageMetadata } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";

const baseMetadata = createPageMetadata({
  title: "Contact over AI-advies, implementatie en training",
  description:
    "Bespreek je werkvraag met Nathan Sudmeier. Setpiece helpt met AI-advies, implementatie en begeleiding vanuit Almere. Kennismaking van maximaal 30 minuten.",
  path: "/contact",
});
export async function generateMetadata() {
  return cmsMetadata("contact", baseMetadata);
}
export async function CmsContact({
  copy,
  sharedCopy,
  preview = false,
  searchParams = Promise.resolve({}),
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
  searchParams?: Promise<{ dienst?: string | string[] }>;
}) {
  const EXPECTATION = [
    copy.v2_tekst_001 ??
      "Setpiece beoordeelt of de vraag en de organisatie bij de gekozen dienst passen.",
    copy.v2_tekst_002 ?? "Nathan reageert binnen twee werkdagen.",
    copy.v2_tekst_003 ??
      "Bij een mogelijke match volgt een gesprek van maximaal 30 minuten.",
    copy.v2_tekst_004 ??
      "Daarna bepalen we of een voorstel past en voor welke afgebakende stap.",
  ] as const;

  const { dienst } = await searchParams;
  const options: Record<string, { service: Service; heading: string }> = {
    "ai-implementatie": {
      service: "ai-implementatie",
      heading: copy.v2_tekst_005 ?? "Bespreek je AI-implementatie.",
    },
    "ai-groeipartner": {
      service: "ai-groeipartner",
      heading: copy.v2_tekst_006 ?? "Bespreek doorlopende AI-begeleiding.",
    },
    "ai-maatwerk": {
      service: "ai-maatwerk",
      heading: copy.v2_tekst_007 ?? "Bespreek je maatwerkvraag.",
    },
  };
  const selected =
    typeof dienst === "string" && Object.hasOwn(options, dienst)
      ? options[dienst]
      : {
          service: "kansenscan" as const,
          heading: copy.v2_tekst_008 ?? "Bespreek of de kansenscan past.",
        };
  return (
    <WorkspoorShell
      sharedCopy={sharedCopy}
      preview={preview}
      activePath="/contact"
    >
      <section className="ws-contact-hero">
        <div className="ws-frame ws-contact-hero__grid">
          <div>
            <p className="ws-context">{copy.v2_tekst_009 ?? "Contact"}</p>
            <h1>{selected.heading}</h1>
            <p className="ws-lead">
              {copy.v2_tekst_010 ??
                "In maximaal 30 minuten verkennen we het werkprobleem, eigenaarschap en de mogelijke AI-kans. De volledige diagnose is betaald."}
            </p>
            <p>
              {copy.v2_tekst_011 ??
                "Vanuit Almere, met focus op Flevoland, Friesland, Groningen en Drenthe. Lees meer over "}
              <a href={copy.v2_link_012 ?? "/diensten"}>
                {copy.v2_tekst_013 ?? "de diensten"}
              </a>{" "}
              {copy.v2_tekst_014 ?? "en "}
              <a href={copy.v2_link_015 ?? "/over"}>
                {copy.v2_tekst_016 ?? "Nathan en Setpiece"}
              </a>
              {copy.v2_tekst_017 ?? "."}
            </p>

            <div className="ws-expectation">
              <h2>{copy.v2_tekst_018 ?? "Wat gebeurt er na je aanvraag?"}</h2>
              <ol>
                {EXPECTATION.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <p>
                {copy.v2_tekst_019 ?? "Liever direct mailen?"}{" "}
                <a href={copy.v2_link_020 ?? "mailto:hallo@setpiece.nl"}>
                  {copy.v2_tekst_021 ?? "hallo@setpiece.nl"}
                </a>
              </p>
            </div>
          </div>

          <div className="ws-contact-panel">
            <KansenscanContactForm
              preview={preview}
              service={selected.service}
            />
          </div>
        </div>
      </section>
    </WorkspoorShell>
  );
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ dienst?: string | string[] }>;
}) {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("contact"),
    readPublished("shared"),
  ]);
  return (
    <CmsContact
      copy={copy}
      sharedCopy={sharedCopy}
      searchParams={searchParams}
    />
  );
}
