import Link from "next/link";
import { getPeople } from "@/lib/beheer/data";
export const metadata = { title: "Personen" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q ?? "";
  const { people } = await getPeople(q);
  return (
    <>
      <header className="bw-heading">
        <div>
          <p className="bw-eyebrow">Je bestaande netwerk</p>
          <h1>Personen</h1>
          <p>
            Context en relaties uit het bestaande personenbestand. Eén persoon
            kan meerdere rollen hebben.
          </p>
        </div>
      </header>
      <form className="bw-filters">
        <label>
          Zoek op naam of organisatie
          <input name="q" defaultValue={q} maxLength={120} />
        </label>
        <button className="bw-primary">Zoeken</button>
      </form>
      <p className="bw-muted">
        Maximaal 50 personen per zoekopdracht. Gelijke namen blijven
        afzonderlijk; controleer rollen en organisatie.
      </p>
      {people.length ? (
        <ul className="bw-list">
          {people.map((p) => (
            <li key={p.id}>
              <Link className="bw-work-row" href={`/beheer/personen/${p.id}`}>
                <div>
                  <strong>{p.naam}</strong>
                  <p>
                    {[p.functie, p.organisatie].filter(Boolean).join(" · ")}
                  </p>
                  <span>
                    {p.rollen.join(" · ") || "Nog geen rol vastgelegd"}
                  </span>
                </div>
                <small>{p.id.slice(0, 8)}</small>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="bw-empty">
          Geen personen gevonden. Probeer een andere naam of organisatie.
        </div>
      )}
    </>
  );
}
