import Link from "next/link";
import { getSnapshot } from "@/lib/beheer/data";
export const metadata = { title: "Activiteit" };
export default async function Page() {
  const s = await getSnapshot();
  return (
    <>
      <header className="bw-heading">
        <div>
          <p className="bw-eyebrow">Herleidbaar werk</p>
          <h1>Activiteit</h1>
          <p>
            De laatste 100 wijzigingen. De actor volgt uit de geverifieerde
            gebruiker of databaseverbinding.
          </p>
        </div>
        <Link href="/beheer/export" className="bw-primary">
          Exporteer je werk
        </Link>
      </header>
      <p className="bw-notice">
        Een gedeelde beheerconnector kan meerdere bots vertegenwoordigen. Een
        ingevulde verantwoordelijke bewijst niet welke bot de wijziging
        uitvoerde.
      </p>
      {s.activity.length ? (
        <ol className="bw-list">
          {s.activity.map((a) => (
            <li key={a.id} className="bw-activity">
              <div>
                {a.item_id ? (
                  <Link href={`/beheer/werk/${a.item_id}`}>{a.summary}</Link>
                ) : (
                  <strong>{a.summary}</strong>
                )}
                <p>{a.action}</p>
                <small>{a.actor}</small>
              </div>
              <time>
                {new Date(a.created_at).toLocaleString("nl-NL", {
                  timeZone: "Europe/Amsterdam",
                })}
              </time>
            </li>
          ))}
        </ol>
      ) : (
        <div className="bw-empty">Nog geen wijzigingen vastgelegd.</div>
      )}
    </>
  );
}
