import Link from "next/link";
import { CMS_SCHEMA, CMS_SLUGS } from "@/lib/cms/schema";
import { readCmsAdmin } from "@/lib/cms/admin";
export const metadata = { title: "Website" };
export default async function Page() {
  const docs = await Promise.all(CMS_SLUGS.map(readCmsAdmin));
  return (
    <>
      <header className="bw-heading">
        <div>
          <p className="bw-eyebrow">Setpiece.nl</p>
          <h1>Je website, zorgvuldig bijgewerkt.</h1>
          <p>
            Bewerk vaste inhoud, controleer het opgeslagen concept en publiceer
            bewust. De vormgeving en routes blijven behouden.
          </p>
        </div>
      </header>
      <ul className="bw-list">
        {docs.map((d) => (
          <li key={d.slug}>
            <Link className="bw-work-row" href={`/beheer/website/${d.slug}`}>
              <div>
                <strong>{CMS_SCHEMA[d.slug].title}</strong>
                <p>
                  {d.slug === "shared"
                    ? "Diensten, bewijs, veelgestelde vragen, navigatie en contactgegevens"
                    : CMS_SCHEMA[d.slug].path}
                </p>
              </div>
              <div className="bw-row-meta">
                <span>Werkversie {d.version}</span>
                <span>
                  Openbaar sinds{" "}
                  {new Date(d.published_at).toLocaleDateString("nl-NL", {
                    timeZone: "Europe/Amsterdam",
                  })}
                </span>
                <span>
                  {JSON.stringify(d.draft) ===
                  JSON.stringify(
                    d.revisions.find((r) => r.id === d.published_id)?.content,
                  )
                    ? "Gelijk aan openbare versie"
                    : "Conceptwijzigingen"}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="bw-muted">
        Publiceren wijzigt commerciële inhoud op de openbare website. Deze
        eerste inrichting neemt de bestaande inhoud over.
      </p>
    </>
  );
}
