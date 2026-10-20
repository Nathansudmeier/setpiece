import Link from "next/link";
import { getSnapshot } from "@/lib/beheer/data";
import WorkList from "./WorkList";
import {
  WORKSPACES,
  WORK_STATUSES,
  type Workspace,
  type WorkKind,
} from "@/lib/beheer/model";
export default async function WorkIndex({
  kind,
  title,
  params,
}: {
  kind: WorkKind;
  title: string;
  params: { q?: string; workspace?: string; status?: string };
}) {
  const workspace =
    params.workspace && params.workspace in WORKSPACES
      ? (params.workspace as Workspace)
      : undefined;
  const snapshot = await getSnapshot(workspace);
  const q = (params.q ?? "").toLocaleLowerCase("nl");
  const items = snapshot.items.filter(
    (x) =>
      x.kind === kind &&
      (!params.status
        ? x.status !== "gearchiveerd"
        : x.status === params.status) &&
      (!q ||
        `${x.title} ${x.description} ${x.assignee}`
          .toLocaleLowerCase("nl")
          .includes(q)),
  );
  return (
    <>
      <header className="bw-heading">
        <div>
          <p className="bw-eyebrow">Jouw werk</p>
          <h1>{title}</h1>
          <p>
            {kind === "decision"
              ? "Beoordeel voorstellen met de bron en context erbij."
              : "Van gewenst resultaat naar een concrete volgende stap."}
          </p>
        </div>
        <Link className="bw-primary" href={`/beheer/werk/nieuw?kind=${kind}`}>
          {kind === "project"
            ? "Nieuw project"
            : kind === "task"
              ? "Nieuwe actie"
              : "Nieuw voorstel"}
        </Link>
      </header>
      <form className="bw-filters">
        <label>
          Zoeken
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Titel of verantwoordelijke"
          />
        </label>
        <label>
          Werkgebied
          <select name="workspace" defaultValue={workspace ?? ""}>
            <option value="">Alle werkgebieden</option>
            {Object.entries(WORKSPACES).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="status" defaultValue={params.status ?? ""}>
            <option value="">Actueel werk</option>
            {Object.entries(WORK_STATUSES).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <button className="bw-secondary">Toepassen</button>
      </form>
      {snapshot.has_more && (
        <p role="status">
          De eerste 1000 onderdelen zijn geladen. Kies een werkgebied of
          exporteer voor een volledig overzicht.
        </p>
      )}
      <WorkList
        items={items}
        empty="Geen resultaten. Pas je filters aan of voeg nieuw werk toe."
      />
    </>
  );
}
