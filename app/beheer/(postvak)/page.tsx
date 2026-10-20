import Link from "next/link";
import { getSnapshot } from "@/lib/beheer/data";
import {
  todayGroups,
  amsterdamDate,
  WORKSPACES,
  type Workspace,
} from "@/lib/beheer/model";
import WorkList from "@/components/beheer/WorkList";
export const metadata = { title: "Vandaag" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ workspace?: string }>;
}) {
  const p = await searchParams;
  const workspace =
    p.workspace && p.workspace in WORKSPACES
      ? (p.workspace as Workspace)
      : undefined;
  const s = await getSnapshot(workspace);
  const tasks = s.items.filter((x) => x.kind === "task");
  const g = todayGroups(tasks);
  const decisions = s.items.filter(
    (x) =>
      x.kind === "decision" && !["afgerond", "gearchiveerd"].includes(x.status),
  );
  const completed = tasks
    .filter((x) => x.status === "afgerond" && x.assignee !== "Nathan")
    .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""))
    .slice(0, 5);
  return (
    <>
      <header className="bw-heading">
        <div>
          <p className="bw-eyebrow">
            {new Intl.DateTimeFormat("nl-NL", {
              weekday: "long",
              day: "numeric",
              month: "long",
              timeZone: "Europe/Amsterdam",
            }).format(new Date())}
          </p>
          <h1>Ruimte voor wat telt.</h1>
          <p>
            Dit vraagt nu je aandacht. Kies een stap en maak het werk lichter.
          </p>
        </div>
        <Link className="bw-primary" href="/beheer/werk/nieuw?kind=task">
          Nieuwe actie
        </Link>
      </header>
      <form className="bw-filters">
        <label>
          Werkgebied
          <select name="workspace" defaultValue={workspace ?? ""}>
            <option value="">Al je werk</option>
            {Object.entries(WORKSPACES).map(([v, l]) => (
              <option value={v} key={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <button className="bw-secondary">Bekijken</button>
      </form>
      <div className="bw-today">
        <section>
          <h2>Afspraak verlopen</h2>
          <WorkList items={g.overdue} empty="Geen verlopen deadlines." />
          <h2>Opvolging aan de beurt</h2>
          <WorkList
            items={g.followup}
            empty="Je hoeft nu niets op te volgen."
          />
          <h2>De komende zeven dagen</h2>
          <WorkList items={g.upcoming} empty="Geen naderende deadlines." />
          <h2>Volgende acties</h2>
          <WorkList
            items={g.open.slice(0, 8)}
            empty="Nog geen open acties. Leg je eerstvolgende stap vast."
          />
        </section>
        <aside>
          <section className="bw-panel">
            <h2>Jouw oordeel</h2>
            <WorkList
              items={[...decisions, ...g.decisions]}
              empty="Er wacht geen beslissing op je."
            />
            <Link href="/beheer/beslissingen">Alle voorstellen bekijken</Link>
          </section>
          <section className="bw-panel">
            <h2>Recent afgerond werk</h2>
            <p>
              Afgerond met vastgelegd resultaat. De activiteit toont het
              gebruikte toegangspad.
            </p>
            {completed.length ? (
              completed.map((x) => (
                <article className="bw-completed" key={x.id}>
                  <Link href={`/beheer/werk/${x.id}`}>{x.title}</Link>
                  <p>{x.result}</p>
                  <small>
                    Toegewezen aan {x.assignee} ·{" "}
                    {x.completed_at &&
                      new Date(x.completed_at).toLocaleString("nl-NL", {
                        timeZone: "Europe/Amsterdam",
                      })}
                  </small>
                </article>
              ))
            ) : (
              <p className="bw-muted">
                Nog geen herleidbaar afgerond toegewezen werk.
              </p>
            )}
          </section>
          <p className="bw-muted">
            Bron: Setpiece-database. Opgehaald{" "}
            {amsterdamDate(new Date(s.checked_at))}. Externe inboxen en agenda’s
            worden hier niet automatisch ingelezen; Jarvis legt de
            bronverwijzing vast.
          </p>
        </aside>
      </div>
    </>
  );
}
