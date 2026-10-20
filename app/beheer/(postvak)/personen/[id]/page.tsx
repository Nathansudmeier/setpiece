import Link from "next/link";
import { notFound } from "next/navigation";
import { getPeople, getSnapshot } from "@/lib/beheer/data";
import WorkList from "@/components/beheer/WorkList";
import { dateLabel } from "@/lib/beheer/model";
export const metadata = { title: "Persoonscontext" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[\da-f-]{36}$/i.test(id)) notFound();
  const [{ people, moments }, s] = await Promise.all([
    getPeople("", id),
    getSnapshot(),
  ]);
  const p = people[0];
  if (!p) notFound();
  const related = s.items.filter(
    (x) =>
      x.people.includes(id) ||
      x.assignee_person_id === id ||
      x.waiting_person_id === id,
  );
  return (
    <>
      <header className="bw-heading">
        <div>
          <Link href="/beheer/personen">Personen</Link>
          <h1>{p.naam}</h1>
          <p>
            {[p.functie, p.organisatie, ...p.rollen]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <Link
          className="bw-primary"
          href={`/beheer/werk/nieuw?kind=task&person=${id}`}
        >
          Actie toevoegen
        </Link>
      </header>
      <div className="bw-today">
        <section>
          <h2>Projecten en open acties</h2>
          <WorkList
            items={related.filter(
              (x) => !["afgerond", "gearchiveerd"].includes(x.status),
            )}
          />
          <h2>Contactmomenten en afspraken</h2>
          {moments.length ? (
            <ul className="bw-list">
              {moments.map((m) => (
                <li className="bw-contact-moment" key={m.id}>
                  <time>{dateLabel(m.datum)}</time>
                  <strong>{m.kanaal}</strong>
                  <p>{m.omschrijving}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Geen contactmomenten vastgelegd.</p>
          )}
          <h2>Afgerond werk</h2>
          <WorkList items={related.filter((x) => x.status === "afgerond")} />
        </section>
        <aside className="bw-panel">
          <h2>Context</h2>
          <p className="bw-preserve">
            {p.notitie || "Nog geen context vastgelegd."}
          </p>
          <dl>
            <dt>E-mail</dt>
            <dd>{p.email || "Niet bekend"}</dd>
            <dt>Telefoon</dt>
            <dd>{p.telefoon || "Niet bekend"}</dd>
            <dt>Laatste contact</dt>
            <dd>{dateLabel(p.laatste_contact)}</dd>
            <dt>Bron</dt>
            <dd>{p.bron || "Niet vastgelegd"}</dd>
            <dt>Identificatie</dt>
            <dd className="bw-id">{p.id}</dd>
          </dl>
          <p className="bw-muted">
            De bestaande bron wordt hier gelezen. Er worden geen personen
            automatisch samengevoegd of gekopieerd.
          </p>
        </aside>
      </div>
    </>
  );
}
