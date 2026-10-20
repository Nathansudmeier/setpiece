import Link from "next/link";
import { notFound } from "next/navigation";
import { CMS_SCHEMA, isCmsSlug } from "@/lib/cms/schema";
import { readCmsAdmin } from "@/lib/cms/admin";
import Editor, { CmsAction } from "@/components/cms/Editor";
export const metadata = { title: "Website bewerken" };
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isCmsSlug(slug)) notFound();
  const doc = await readCmsAdmin(slug);
  return (
    <>
      <header className="bw-heading">
        <div>
          <Link href="/beheer/website">Website</Link>
          <h1>{CMS_SCHEMA[slug].title}</h1>
          <p>
            Werkversie {doc.version}. Openbare revisie{" "}
            {doc.published_id.slice(0, 8)} van{" "}
            {new Date(doc.published_at).toLocaleString("nl-NL", {
              timeZone: "Europe/Amsterdam",
            })}
            .
          </p>
        </div>
        <Link
          href={`/beheer/website/${slug}/preview`}
          className="bw-primary"
          prefetch={false}
        >
          Concept bekijken
        </Link>
      </header>
      <div className="bw-detail-grid">
        <Editor key={doc.version} doc={doc} />
        <aside>
          <section className="bw-panel">
            <h2>Publiceren</h2>
            <p>
              Sla eerst je concept op en controleer de voorvertoning. Publiceren
              maakt precies dat opgeslagen concept openbaar.
            </p>
            <CmsAction key={`pub-${doc.version}`} doc={doc} intent="publish">
              Opgeslagen concept publiceren
            </CmsAction>
          </section>
          <section className="bw-panel">
            <h2>Vorige versies</h2>
            <p>
              Terugzetten maakt een nieuw concept. Publiceer dit daarna om de
              openbare versie te vervangen.
            </p>
            {doc.revisions.map((r) => (
              <article key={r.id}>
                <p>
                  <strong>{r.action}</strong>
                  {r.id === doc.published_id ? " · Staat openbaar" : ""}
                </p>
                <p>
                  {new Date(r.created_at).toLocaleString("nl-NL", {
                    timeZone: "Europe/Amsterdam",
                  })}
                </p>
                <small>
                  {r.actor} · {r.id.slice(0, 8)}
                </small>
                <CmsAction
                  key={`${r.id}-${doc.version}`}
                  doc={doc}
                  intent="restore"
                  revisionId={r.id}
                >
                  Als concept terugzetten
                </CmsAction>
              </article>
            ))}
          </section>
        </aside>
      </div>
    </>
  );
}
