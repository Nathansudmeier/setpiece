import { formatEuro } from "@/lib/billing/model";
import type { TaxGroup } from "@/lib/billing/model";
export type PreviewData = {
  name: string;
  street: string;
  postal_code: string;
  city: string;
  country: string;
};
export default function Preview({
  seller,
  customer,
  number,
  invoiceOn,
  reference,
  lines,
  net,
  vat,
  total,
  groups,
  concept = true,
  credit = false,
}: {
  seller: PreviewData;
  customer: PreviewData;
  number?: string | null;
  invoiceOn: string | null;
  reference: string;
  lines: {
    id?: string;
    description: string;
    quantity: string;
    unit: string;
    unit_price_cents: string;
    net_cents: string;
    vat_rate?: number;
  }[];
  net: string;
  vat: string;
  total: string;
  groups: TaxGroup[];
  concept?: boolean;
  credit?: boolean;
}) {
  return (
    <article className="bw-bill-preview" aria-label="Factuurvoorbeeld">
      <header>
        <p>Setpiece</p>
        <div>
          <h2>{concept ? "Concept" : credit ? "Creditfactuur" : "Factuur"}</h2>
          <p>{number ?? "Nog geen nummer"}</p>
          <p>{invoiceOn ?? "Datum nog niet gekozen"}</p>
        </div>
      </header>
      <div className="bw-bill-parties">
        {[seller, customer].map((p, n) => (
          <section key={n}>
            <h3>{n === 0 ? "Van" : "Aan"}</h3>
            <p>
              {p.name || "Naam nog niet ingevuld"}
              <br />
              {p.street || "Adres nog niet ingevuld"}
              <br />
              {[p.postal_code, p.city].filter(Boolean).join(" ") ||
                "Postcode en plaats nog niet ingevuld"}
              <br />
              {p.country}
            </p>
          </section>
        ))}
      </div>
      {reference && <p>Referentie: {reference}</p>}
      <div
        className="bw-bill-table-wrap"
        role="region"
        aria-label="Regels in het factuurvoorbeeld"
        tabIndex={0}
      >
        <table className="bw-bill-table">
          <thead>
            <tr>
              <th scope="col">Omschrijving</th>
              <th scope="col">Aantal</th>
              <th scope="col" className="bw-bill-money">
                Netto
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, n) => (
              <tr key={l.id ?? n}>
                <td>
                  {l.description || "Omschrijving nog niet ingevuld"}
                  <small>
                    {formatEuro(l.unit_price_cents)} per {l.unit || "eenheid"} ·{" "}
                    {l.vat_rate ?? 21}%
                  </small>
                </td>
                <td>
                  {l.quantity.replace(".", ",")} {l.unit}
                </td>
                <td className="bw-bill-money">{formatEuro(l.net_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="bw-bill-totals">
        <div>
          <dt>Exclusief btw</dt>
          <dd>{formatEuro(net)}</dd>
        </div>
        {groups.map((g) => (
          <div key={g.vat_code}>
            <dt>
              {g.rate}% btw over {formatEuro(g.net_cents)}
            </dt>
            <dd>{formatEuro(g.vat_cents)}</dd>
          </div>
        ))}
        {!groups.length && (
          <div>
            <dt>Btw</dt>
            <dd>{formatEuro(vat)}</dd>
          </div>
        )}
        <div>
          <dt>Totaal</dt>
          <dd>{formatEuro(total)}</dd>
        </div>
      </dl>
      {concept && (
        <p className="bw-bill-note">
          Conceptvoorbeeld · geen definitieve factuur en geen archief-PDF.
        </p>
      )}
      {credit && (
        <p>Te verrekenen/terug te ontvangen. Maak dit bedrag niet over.</p>
      )}
    </article>
  );
}
