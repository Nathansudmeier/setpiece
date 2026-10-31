"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, Feedback, useBillingIntent } from "./Shared";
import Preview from "./Preview";
import {
  calculate,
  formatEuro,
  moneyInput,
  parseMoney,
  TAX,
} from "@/lib/billing/model";
import {
  DEFAULT_CUSTOMER,
  DEFAULT_SETTINGS,
  type BillingData,
} from "@/lib/billing/schema";
import { amsterdamDate } from "@/lib/beheer/model";
type EditorLine = {
  id: string;
  description: string;
  quantity: string;
  unit: string;
  price: string;
  vat_code: "nl_21" | "nl_9";
};
const freshLine = (id = crypto.randomUUID()): EditorLine => ({
  id,
  description: "",
  quantity: "1",
  unit: "dienst",
  price: "0,00",
  vat_code: "nl_21",
});
export default function InvoiceEditor({
  data,
  initialLineId,
}: {
  data: BillingData;
  initialLineId?: string;
}) {
  const invoice = data.invoices[0],
    settings = data.settings?.data ?? DEFAULT_SETTINGS;
  const [id, setId] = useState(invoice?.id),
    [version, setVersion] = useState<number | null>(invoice?.version ?? null),
    [customer, setCustomer] = useState(invoice?.customer_id ?? ""),
    [project, setProject] = useState(invoice?.project_id ?? ""),
    [invoiceOn, setInvoiceOn] = useState(
      invoice?.invoice_on ?? amsterdamDate(),
    ),
    [from, setFrom] = useState(invoice?.service_from ?? ""),
    [until, setUntil] = useState(invoice?.service_until ?? ""),
    [kind, setKind] = useState(invoice?.service_kind ?? "service"),
    [days, setDays] = useState(
      String(invoice?.payment_days ?? settings.payment_days),
    ),
    [reference, setReference] = useState(invoice?.reference ?? ""),
    [intro, setIntro] = useState(invoice?.intro ?? ""),
    [footer, setFooter] = useState(invoice?.footer ?? ""),
    [notes, setNotes] = useState(invoice?.notes ?? "");
  const [lines, setLines] = useState<EditorLine[]>(() =>
    invoice
      ? data.lines
          .filter((l) => l.active)
          .map((l) => ({
            id: l.id,
            description: l.description,
            quantity: l.quantity,
            unit: l.unit,
            price: moneyInput(l.unit_price_cents),
            vat_code: l.vat_code === "nl_9" ? "nl_9" : "nl_21",
          }))
      : [freshLine(initialLineId)],
  );
  const [confirm, setConfirm] = useState(false),
    [voidConfirm, setVoidConfirm] = useState(false),
    [preview, setPreview] = useState(false),
    intent = useBillingIntent(),
    router = useRouter();
  const current = JSON.stringify({
    customer,
    project,
    invoiceOn,
    from,
    until,
    kind,
    days,
    reference,
    intro,
    footer,
    notes,
    lines,
  });
  const [saved, setSaved] = useState(invoice ? current : "");
  const dirty = current !== saved;
  const calc = useMemo(() => {
    try {
      return calculate(
        lines.map((l) => ({
          quantity: l.quantity.replace(",", "."),
          unit_price_cents: parseMoney(l.price),
          vat_code: l.vat_code,
          tax_treatment: TAX[l.vat_code].treatment,
        })),
      );
    } catch {
      return null;
    }
  }, [lines]);
  const buyer =
    data.customers.find((c) => c.id === customer)?.data ?? DEFAULT_CUSTOMER;
  function patch(index: number, patch: Partial<EditorLine>) {
    setLines(lines.map((l, n) => (n === index ? { ...l, ...patch } : l)));
    setConfirm(false);
  }
  function move(index: number, direction: number) {
    const copy = [...lines],
      next = index + direction;
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setLines(copy);
  }
  async function save() {
    try {
      if (!calc)
        throw new Error(
          "Controleer aantallen (maximaal drie decimalen) en prijzen (bijvoorbeeld 1.969,50).",
        );
      const payload = {
        ...(id ? { id } : {}),
        customer_id: customer || null,
        project_id: project || null,
        invoice_on: invoiceOn || null,
        service_from: from || null,
        service_until: until || null,
        service_kind: kind,
        payment_days: Number(days),
        reference,
        intro,
        footer,
        notes,
        lines: lines.map((l) => ({
          id: l.id,
          description: l.description,
          quantity: l.quantity.replace(",", "."),
          unit: l.unit,
          unit_price_cents: parseMoney(l.price),
          vat_code: l.vat_code,
          tax_treatment: TAX[l.vat_code].treatment,
        })),
      };
      const result = await intent.run(
        id ? "invoice.update" : "invoice.create",
        payload,
        version,
      );
      if (result.ok && result.id) {
        setId(result.id);
        setVersion(result.version ?? null);
        setSaved(current);
        setConfirm(false);
        router.push("/beheer/facturen/" + result.id);
        router.refresh();
      }
    } catch (e) {
      intent.setError(e instanceof Error ? e.message : "Controleer de invoer.");
    }
  }
  return (
    <>
      <div className="bw-heading">
        <div>
          <h1>{id ? "Conceptfactuur" : "Nieuwe factuur"}</h1>
          <p>
            Controleer inhoud, datums en ontvangers. Een incompleet concept kun
            je altijd bewaren.
          </p>
        </div>
        <button className="bw-primary" disabled={intent.pending} onClick={save}>
          {intent.pending ? "Opslaan…" : "Opslaan als concept"}
        </button>
      </div>
      <Feedback
        error={intent.error}
        success={intent.success}
        target="invoice-customer"
      />
      <div className="bw-bill-editor">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <section className="bw-bill-section">
            <h2>Klant en uitvoering</h2>
            <div className="bw-bill-fields">
              <label htmlFor="invoice-customer">
                Factuurklant
                <select
                  aria-label="Factuurklant"
                  id="invoice-customer"
                  value={customer}
                  onChange={(e) => {
                    setCustomer(e.target.value);
                    const c = data.customers.find(
                      (c) => c.id === e.target.value,
                    );
                    if (c) {
                      setDays(String(c.data.payment_days));
                      setProject(c.project_id ?? "");
                    }
                  }}
                >
                  <option value="">Kies later</option>
                  {data.customers
                    .filter((c) => c.active || c.id === customer)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.data.name || "Naam nog niet ingevuld"}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                Project (optioneel)
                <select
                  aria-label="Project (optioneel)"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                >
                  <option value="">Geen project</option>
                  {data.projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                name="invoice-on"
                label="Geplande factuurdatum"
                type="date"
                value={invoiceOn}
                onChange={setInvoiceOn}
              />
              <Field
                name="invoice-days"
                label="Betaaltermijn in dagen"
                type="number"
                value={days}
                onChange={setDays}
              />
              <label>
                Prestatie
                <select
                  aria-label="Prestatie"
                  value={kind}
                  onChange={(e) =>
                    setKind(
                      e.target.value === "advance" ? "advance" : "service",
                    )
                  }
                >
                  <option value="service">Dienst</option>
                  <option value="advance">Vooruitbetaling</option>
                </select>
              </label>
              <Field
                name="service-from"
                label={
                  kind === "advance"
                    ? "Vooruitbetalingsdatum / periode vanaf"
                    : "Dienst vanaf"
                }
                type="date"
                value={from}
                onChange={setFrom}
              />
              <Field
                name="service-until"
                label="Tot en met"
                type="date"
                value={until}
                onChange={setUntil}
              />
              <Field
                name="invoice-reference"
                label="Referentie / offerte"
                value={reference}
                onChange={setReference}
                maxLength={240}
              />
            </div>
            <p>
              <Link href="/beheer/facturen/klanten" target="_blank">
                Klant toevoegen of gegevens controleren
              </Link>
            </p>
          </section>
          <section className="bw-bill-section">
            <h2>Factuurregels</h2>
            {lines.map((l, index) => (
              <fieldset className="bw-bill-line" key={l.id}>
                <legend>Regel {index + 1}</legend>
                <label htmlFor={"line-" + l.id}>
                  Omschrijving
                  <textarea
                    id={"line-" + l.id}
                    rows={2}
                    maxLength={2000}
                    value={l.description}
                    onChange={(e) =>
                      patch(index, { description: e.target.value })
                    }
                  />
                </label>
                <div className="bw-bill-fields">
                  <Field
                    name={"quantity-" + l.id}
                    label="Aantal"
                    value={l.quantity}
                    onChange={(v) => patch(index, { quantity: v })}
                  />
                  <Field
                    name={"unit-" + l.id}
                    label="Eenheid / omvang"
                    value={l.unit}
                    onChange={(v) => patch(index, { unit: v })}
                    maxLength={60}
                  />
                  <Field
                    name={"price-" + l.id}
                    label="Prijs excl. btw (€)"
                    value={l.price}
                    onChange={(v) => patch(index, { price: v })}
                  />
                  <label>
                    Btw-behandeling
                    <select
                      aria-label={`Btw-behandeling regel ${index + 1}`}
                      value={l.vat_code}
                      onChange={(e) =>
                        patch(index, {
                          vat_code:
                            e.target.value === "nl_9" ? "nl_9" : "nl_21",
                        })
                      }
                    >
                      <option value="nl_21">Nederland · 21%</option>
                      <option value="nl_9">Nederland · 9%</option>
                    </select>
                  </label>
                </div>
                <div className="bw-bill-line-actions">
                  <p>
                    Netto{" "}
                    <strong>
                      {calc ? formatEuro(calc.lines[index].net_cents) : "—"}
                    </strong>
                  </p>
                  <button
                    type="button"
                    className="bw-secondary"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    aria-label={`Regel ${index + 1} omhoog`}
                  >
                    Omhoog
                  </button>
                  <button
                    type="button"
                    className="bw-secondary"
                    disabled={index === lines.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label={`Regel ${index + 1} omlaag`}
                  >
                    Omlaag
                  </button>
                  <button
                    type="button"
                    className="bw-secondary"
                    onClick={() => setLines(lines.filter((x) => x.id !== l.id))}
                    aria-label={`Regel ${index + 1} verwijderen`}
                  >
                    Verwijderen
                  </button>
                </div>
              </fieldset>
            ))}
            <button
              type="button"
              className="bw-secondary"
              disabled={lines.length >= 100}
              onClick={() => setLines([...lines, freshLine()])}
            >
              Regel toevoegen
            </button>
          </section>
          <section className="bw-bill-section">
            <h2>Toelichting</h2>
            {(
              [
                ["intro", "Intro", intro, setIntro],
                ["footer", "Tekst onder de factuur", footer, setFooter],
                ["notes", "Interne notitie", notes, setNotes],
              ] as const
            ).map(([key, label, value, set]) => (
              <label key={key} htmlFor={key}>
                {label}
                <textarea
                  id={key}
                  value={value}
                  rows={3}
                  maxLength={key === "notes" ? 10000 : 5000}
                  onChange={(e) => set(e.target.value)}
                />
              </label>
            ))}
          </section>
        </form>
        <aside className="bw-bill-preview-pane">
          <button
            className="bw-secondary bw-bill-preview-toggle"
            aria-expanded={preview}
            onClick={() => setPreview(!preview)}
          >
            {preview ? "Sluit voorbeeld" : "Bekijk factuurvoorbeeld"}
          </button>
          <div className={preview ? "" : "bw-bill-preview-hidden"}>
            {calc ? (
              <Preview
                seller={settings}
                customer={buyer}
                invoiceOn={invoiceOn}
                reference={reference}
                lines={calc.lines.map((l, n) => ({
                  ...l,
                  description: lines[n].description,
                  unit: lines[n].unit,
                  id: lines[n].id,
                  vat_rate: TAX[lines[n].vat_code].rate,
                }))}
                net={calc.net_cents}
                vat={calc.vat_cents}
                total={calc.total_cents}
                groups={calc.tax_groups}
              />
            ) : (
              <p>
                Het voorbeeld verschijnt zodra aantallen en prijzen geldig zijn.
              </p>
            )}
          </div>
        </aside>
      </div>
      <section className="bw-bill-section">
        <h2>Jouw controle</h2>
        <p>
          {dirty
            ? "Er zijn wijzigingen die nog niet zijn opgeslagen. Sla het concept eerst op."
            : "De opgeslagen versie is herlezen. Je kunt de definitieve inhoud nu bevestigen."}
        </p>
        {invoiceOn !== amsterdamDate() && (
          <p>
            De geplande datum is {invoiceOn}. Je kunt op die dag zelf definitief
            maken, of bewust de datum naar vandaag wijzigen en opslaan.
          </p>
        )}
        {id && !dirty && (
          <p>
            <Link href={"/beheer/facturen/" + id + "/pdf?concept=1"}>
              Download concept-PDF
            </Link>
          </p>
        )}
        <button
          className="bw-secondary"
          disabled={intent.pending || dirty || !id}
          onClick={() => setConfirm(!confirm)}
        >
          Maak definitief
        </button>
        {confirm && (
          <div className="bw-bill-confirm">
            <h3>Dit wordt de definitieve factuur</h3>
            <p>
              Datum: {invoiceOn}. Nummer: eerstvolgend nummer uit{" "}
              {settings.prefix}
              {invoiceOn.slice(0, 4)}-reeks (voorspelling, bij bevestiging
              toegekend). Totaal: {calc ? formatEuro(calc.total_cents) : "—"}.
            </p>
            <p>
              Aan: {buyer.recipients.join(", ") || "Nog niet ingevuld"}. Cc:{" "}
              {buyer.cc.join(", ") || "Geen"}.
            </p>
            <p>
              Inhoud, adressen, bankgegevens en voorgenomen mail worden
              onveranderbaar. Je maakt daarna de PDF; verzending volgt
              afzonderlijk.
            </p>
            <button
              className="bw-secondary"
              disabled={intent.pending || dirty}
              onClick={async () => {
                if (!id) return;
                const r = await intent.run("invoice.finalize", { id }, version);
                if (r.ok) {
                  router.refresh();
                }
              }}
            >
              Bevestig definitief maken
            </button>
          </div>
        )}
        {id && (
          <div className="bw-bill-void">
            <button
              className="bw-secondary"
              disabled={intent.pending}
              onClick={() => setVoidConfirm(!voidConfirm)}
            >
              Laat concept vervallen
            </button>
            {voidConfirm && (
              <p>
                Dit concept krijgt geen nummer.{" "}
                <button
                  className="bw-secondary"
                  disabled={intent.pending}
                  onClick={async () => {
                    const r = await intent.run("invoice.void", { id }, version);
                    if (r.ok) router.refresh();
                  }}
                >
                  Bevestig vervallen
                </button>
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
