import Link from "next/link";
import { notFound } from "next/navigation";
import { getSnapshot, getPeople, getWork } from "@/lib/beheer/data";
import {
  WORKSPACES,
  WORK_STATUSES,
  type Person,
  type WorkKind,
} from "@/lib/beheer/model";
import WorkForm from "@/components/beheer/WorkForm";
import WorkList from "@/components/beheer/WorkList";
import QuickActions from "@/components/beheer/QuickActions";
export const metadata = { title: "Werk bijwerken" };
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kind?: string; person?: string }>;
}) {
  const { id } = await params;
  const q = await searchParams;
  const s = await getSnapshot();
  const item = id === "nieuw" ? undefined : ((await getWork(id)) ?? undefined);
  if (id !== "nieuw" && !item) notFound();
  const kind =
    item?.kind ??
    (["project", "task", "decision"].includes(q.kind ?? "")
      ? (q.kind as WorkKind)
      : "task");
  const ids = [
    ...new Set(
      [
        ...(item?.people ?? []),
        item?.assignee_person_id,
        item?.waiting_person_id,
        q.person,
      ].filter((x): x is string => !!x),
    ),
  ];
  const found = await Promise.all(ids.map((x) => getPeople("", x)));
  const people = found.flatMap((x) => x.people) as Person[];
  return (
    <>
      <header className="bw-heading">
        <div>
          <Link href="/beheer">Vandaag</Link>
          <h1>
            {item
              ? item.title
              : kind === "project"
                ? "Nieuw project"
                : kind === "decision"
                  ? "Nieuw voorstel"
                  : "Nieuwe actie"}
          </h1>
          {item && (
            <p>
              {WORKSPACES[item.workspace]} · {WORK_STATUSES[item.status]} ·
              versie {item.version}
            </p>
          )}
        </div>
      </header>
      <div className="bw-detail-grid">
        <WorkForm
          key={`${id}-${item?.version ?? 0}`}
          kind={kind}
          item={item}
          projects={s.items.filter((x) => x.kind === "project")}
          people={people}
          initialPerson={people.find((x) => x.id === q.person)}
        />
        <aside>
          {item && (
            <>
              <QuickActions item={item} />
              <section className="bw-panel">
                <h2>Context</h2>
                <p>
                  Aangemaakt{" "}
                  {new Date(item.created_at).toLocaleString("nl-NL", {
                    timeZone: "Europe/Amsterdam",
                  })}
                </p>
                <p>
                  Bijgewerkt{" "}
                  {new Date(item.updated_at).toLocaleString("nl-NL", {
                    timeZone: "Europe/Amsterdam",
                  })}
                </p>
                {item.source_url && (
                  <p>
                    <a href={item.source_url} rel="noreferrer" target="_blank">
                      Bron openen
                    </a>
                  </p>
                )}
                <p>{item.source_ref || "Geen bronverwijzing vastgelegd."}</p>
                {people.length > 0 && (
                  <ul>
                    {people.map((p) => (
                      <li key={p.id}>
                        <Link href={`/beheer/personen/${p.id}`}>{p.naam}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section className="bw-panel">
                <h2>Activiteit</h2>
                {s.activity
                  .filter((x) => x.item_id === item.id)
                  .map((a) => (
                    <article key={a.id}>
                      <p>{a.summary}</p>
                      <small>
                        {a.actor} ·{" "}
                        {new Date(a.created_at).toLocaleString("nl-NL", {
                          timeZone: "Europe/Amsterdam",
                        })}
                      </small>
                    </article>
                  ))}
              </section>
            </>
          )}
        </aside>
      </div>
      {item?.kind === "project" && (
        <section>
          <h2>Acties binnen dit project</h2>
          <WorkList items={s.items.filter((x) => x.project_id === item.id)} />
          <p>
            Voortgang volgt uit de status van deze acties; er wordt geen
            percentage geschat.
          </p>
        </section>
      )}
    </>
  );
}
