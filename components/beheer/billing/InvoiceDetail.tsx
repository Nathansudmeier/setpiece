"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { makeInvoicePdf } from "@/app/beheer/billing-actions";
import { Feedback, Field, useBillingIntent } from "./Shared";
import Preview from "./Preview";
import {
  formatEuro,
  invoiceBalance,
  DOCUMENT_LABELS,
  parseMoney,
  parseEmails,
  amsterdamDateTime,
  amsterdamTimestamp,
  issueWarning,
} from "@/lib/billing/model";
import { amsterdamDate, dateLabel } from "@/lib/beheer/model";
import { formatDateTime } from "@/lib/beheer/format";
import type { BillingData } from "@/lib/billing/schema";
export default function InvoiceDetail({ data }: { data: BillingData }) {
  const i = data.invoices[0],
    f = i.frozen,
    intent = useBillingIntent(),
    router = useRouter(),
    [pdfBusy, setPdfBusy] = useState(false),
    pdfRunning = useRef(false),
    [pdfError, setPdfError] = useState(""),
    [creditConfirm, setCreditConfirm] = useState(false),
    [correctConfirm, setCorrectConfirm] = useState(false),
    [partial, setPartial] = useState<Record<string, string>>({}),
    [payment, setPayment] = useState(""),
    [sentAt, setSentAt] = useState(amsterdamDateTime());
  const b = invoiceBalance(
      i,
      i.credited_cents,
      i.received_cents,
      amsterdamDate(),
    ),
    dispatch = data.dispatches.find((d) => d.status !== "geannuleerd"),
    cancelled = data.dispatches.filter((d) => d.status === "geannuleerd"),
    warning = issueWarning(
      i.service_until,
      i.status,
      i.service_kind,
      amsterdamDate(),
    );
  async function pdf() {
    if (pdfRunning.current) return;
    pdfRunning.current = true;
    setPdfBusy(true);
    setPdfError("");
    try {
      const r = await makeInvoicePdf(i.id);
      if (!r.ok) setPdfError(r.error ?? "PDF is nog niet gemaakt.");
      else router.refresh();
    } catch {
      setPdfError(
        "Geen bevestiging ontvangen. Kies PDF maken om dezelfde factuur te hervatten.",
      );
    } finally {
      pdfRunning.current = false;
      setPdfBusy(false);
    }
  }
  async function credit(correct = false) {
    try {
      const selected = Object.entries(partial)
        .filter(([, v]) => v.trim())
        .map(([original_line_id, v]) => ({
          original_line_id,
          net_cents: parseMoney(v),
        }));
      const r = await intent.run(
        correct ? "invoice.correct" : "invoice.credit",
        {
          id: i.id,
          confirmed: true,
          ...(!correct && selected.length ? { lines: selected } : {}),
        },
        i.version,
      );
      if (r.ok && r.id) {
        router.push("/beheer/facturen/" + r.id);
        router.refresh();
      }
    } catch (e) {
      intent.setError(
        e instanceof Error ? e.message : "Controleer de creditbedragen.",
      );
    }
  }
  if (!f)
    return (
      <>
        <h1>{DOCUMENT_LABELS[i.status]}</h1>
        <p>Dit concept is vervallen en heeft geen factuurnummer gekregen.</p>
        <Link href="/beheer/facturen">Terug naar facturen</Link>
      </>
    );
  return (
    <>
      <div className="bw-heading">
        <div>
          <h1>
            {i.kind === "credit" ? "Creditfactuur" : "Factuur"} {i.number}
          </h1>
          <p>
            {f.customer.name} · {DOCUMENT_LABELS[i.status]}
          </p>
          <p>
            {i.kind === "invoice"
              ? [b.payment_label, b.credit_label, b.overdue ? "Te laat" : ""]
                  .filter(Boolean)
                  .join(" · ")
              : "Te verrekenen / terug te ontvangen"}
          </p>
        </div>
        {!i.pdf_hash ? (
          <button className="bw-primary" disabled={pdfBusy} onClick={pdf}>
            {pdfBusy ? "PDF maken…" : "PDF maken"}
          </button>
        ) : i.kind === "invoice" && BigInt(b.balance_cents) > 0n ? (
          <a className="bw-primary" href="#payment">
            Betaling vastleggen
          </a>
        ) : (
          <Link
            className="bw-primary"
            href={"/beheer/facturen/" + i.id + "/pdf"}
          >
            Download PDF
          </Link>
        )}
      </div>
      <Feedback
        error={intent.error || pdfError}
        success={intent.success}
        target="payment-amount"
      />
      {warning && (
        <p className="bw-bill-notice">
          {warning} Definitief maken en een Gmail-concept zijn geen bewijs van
          uitreiken.
        </p>
      )}
      <div className="bw-bill-detail-summary">
        <p>
          Totaal <strong>{formatEuro(i.total_cents)}</strong>
        </p>
        {i.kind === "invoice" && (
          <>
            <p>
              {BigInt(b.balance_cents) < 0n ? "Klanttegoed" : "Openstaand"}{" "}
              <strong>{formatEuro(b.balance_cents)}</strong>
            </p>
            <p>
              Ontvangen <strong>{formatEuro(i.received_cents)}</strong>
            </p>
            <p>
              Gecrediteerd <strong>{formatEuro(i.credited_cents)}</strong>
            </p>
          </>
        )}
      </div>
      <div className="bw-bill-detail-grid">
        <div>
          <section className="bw-bill-section">
            <h2>Archief en verzending</h2>
            {i.pdf_hash ? (
              <>
                <p>
                  Archief-PDF opgeslagen. Hash vastgelegd; integriteit wordt bij
                  iedere download opnieuw gecontroleerd.
                </p>
                <p>
                  <Link
                    className="bw-secondary"
                    href={"/beheer/facturen/" + i.id + "/pdf"}
                  >
                    Download en controleer PDF
                  </Link>
                </p>
                <p className="bw-bill-hash">SHA-256: {i.pdf_hash}</p>
              </>
            ) : (
              <p>
                De PDF is nog niet gemaakt. Het nummer en de definitieve inhoud
                blijven bewaard. Kies PDF maken om te hervatten.
              </p>
            )}
            {dispatch && (
              <>
                <p>
                  {dispatch.status === "concept_klaar"
                    ? "Concept staat in Gmail. Nathan moet nog zelf versturen."
                    : dispatch.status === "verstuurd"
                      ? `Verzending geregistreerd op ${formatDateTime(dispatch.sent_at!)} via ${dispatch.sent_via}.`
                      : "Wacht op Jarvis: de verzendopdracht staat klaar. Een taak activeert Jarvis niet vanzelf."}
                </p>
                <p>
                  Dispatchreferentie:{" "}
                  <span className="bw-bill-hash">
                    setpiece-dispatch:{dispatch.id}
                  </span>
                </p>
              </>
            )}
            {i.dispatch_seed && (
              <details>
                <summary>Controleer de bevroren factuurmail</summary>
                <dl className="bw-bill-mail">
                  <dt>Van</dt>
                  <dd>{i.dispatch_seed.sender}</dd>
                  <dt>Aan</dt>
                  <dd>{i.dispatch_seed.recipients.join(", ")}</dd>
                  <dt>Cc</dt>
                  <dd>{i.dispatch_seed.cc.join(", ") || "Geen"}</dd>
                  <dt>Onderwerp</dt>
                  <dd>{i.dispatch_seed.subject}</dd>
                  <dt>Bericht</dt>
                  <dd className="bw-bill-body">
                    {dispatch?.body ?? i.dispatch_seed.body}
                  </dd>
                  <dt>Bijlage</dt>
                  <dd>{i.dispatch_seed.attachment_name}</dd>
                </dl>
              </details>
            )}
            {dispatch &&
              ["wacht_op_concept", "concept_klaar"].includes(
                dispatch.status,
              ) && (
                <details>
                  <summary>Verzendopdracht annuleren</summary>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const f = new FormData(e.currentTarget);
                      const r = await intent.run(
                        "dispatch.cancel",
                        { id: dispatch.id, reason: String(f.get("reason")) },
                        dispatch.version,
                      );
                      if (r.ok) router.refresh();
                    }}
                  >
                    <label>
                      Reden
                      <textarea name="reason" required maxLength={2000} />
                    </label>
                    <p>
                      Een bestaand Gmail-concept wordt niet automatisch
                      verwijderd. Jarvis krijgt de annulering te zien.
                    </p>
                    <button className="bw-secondary" disabled={intent.pending}>
                      Bevestig annuleren
                    </button>
                  </form>
                </details>
              )}
            {cancelled.map((d) => (
              <details key={d.id}>
                <summary>
                  Geannuleerde opdracht · {formatDateTime(d.cancelled_at!)}
                </summary>
                <p>
                  {d.cancel_reason}.{" "}
                  {d.gmail_draft_id && !d.cancel_ack_at
                    ? "Afhandeling van Gmail-concept nog niet bevestigd."
                    : ""}
                </p>
                {!dispatch &&
                  i.status !== "verstuurd" &&
                  !(
                    i.kind === "invoice" &&
                    BigInt(i.credited_cents) >= BigInt(i.total_cents)
                  ) && (
                    <>
                      <p>
                        Opnieuw klaarzetten gebruikt dezelfde bevroren
                        ontvangers en mailinhoud hierboven. Controleer die
                        gegevens. Alleen de technische dispatchreferentie wordt
                        vernieuwd.
                      </p>
                      <button
                        className="bw-secondary"
                        disabled={intent.pending}
                        onClick={async () => {
                          const r = await intent.run(
                            "dispatch.requeue",
                            { id: d.id, confirmed: true },
                            d.version,
                          );
                          if (r.ok) router.refresh();
                        }}
                      >
                        Bevestig opnieuw klaarzetten
                      </button>
                    </>
                  )}
              </details>
            ))}
          </section>
          {dispatch &&
            ["wacht_op_concept", "concept_klaar"].includes(dispatch.status) && (
              <details className="bw-bill-section">
                <summary>Markeer als verstuurd</summary>
                <p>
                  Gebruik dit alleen voor een daadwerkelijk verstuurde factuur.
                  De Jarvis-taak wordt met resultaat afgerond.
                </p>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = new FormData(e.currentTarget);
                    try {
                      const r = await intent.run(
                        "invoice.mark_sent",
                        {
                          id: dispatch.id,
                          sent_via: "manual",
                          sent_at: amsterdamTimestamp(sentAt),
                          recipients: parseEmails(String(form.get("to"))),
                          cc: parseEmails(String(form.get("cc"))),
                          note: String(form.get("note")),
                        },
                        dispatch.version,
                      );
                      if (r.ok) router.refresh();
                    } catch (e) {
                      intent.setError(
                        e instanceof Error
                          ? e.message
                          : "Controleer het verzendbewijs.",
                      );
                    }
                  }}
                >
                  <Field
                    name="sent-at"
                    label="Werkelijk verzendmoment (Europe/Amsterdam)"
                    type="datetime-local"
                    value={sentAt}
                    onChange={setSentAt}
                  />
                  <label>
                    Aan
                    <input
                      name="to"
                      defaultValue={dispatch.recipients.join(", ")}
                      required
                    />
                  </label>
                  <label>
                    Cc
                    <input name="cc" defaultValue={dispatch.cc.join(", ")} />
                  </label>
                  <label>
                    Notitie over de daadwerkelijke verzending
                    <textarea name="note" required maxLength={2000} />
                  </label>
                  <button className="bw-secondary" disabled={intent.pending}>
                    Bevestig echte verzending
                  </button>
                </form>
              </details>
            )}
          {i.kind === "invoice" && (
            <section className="bw-bill-section" id="payment">
              <h2>Ontvangsten</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  try {
                    const r = await intent.run(
                      "payment.record",
                      {
                        id: i.id,
                        received_on: String(form.get("received_on")),
                        amount_cents: parseMoney(payment),
                        method: String(form.get("method")),
                        note: String(form.get("note")),
                        confirm_overpayment: form.get("overpayment") === "on",
                      },
                      i.version,
                    );
                    if (r.ok) {
                      setPayment("");
                      router.refresh();
                    }
                  } catch (e) {
                    intent.setError(
                      e instanceof Error
                        ? e.message
                        : "Controleer de betaling.",
                    );
                  }
                }}
              >
                <div className="bw-bill-fields">
                  <Field
                    name="payment-amount"
                    label="Ontvangen bedrag (€)"
                    value={payment}
                    onChange={setPayment}
                    required
                  />
                  <label>
                    Ontvangstdatum
                    <input
                      type="date"
                      name="received_on"
                      defaultValue={amsterdamDate()}
                      required
                    />
                  </label>
                  <label>
                    Methode
                    <select aria-label="Methode" name="method">
                      <option value="bank">Bank</option>
                      <option value="cash">Contant</option>
                      <option value="other">Anders</option>
                    </select>
                  </label>
                  <label>
                    Notitie
                    <input name="note" maxLength={2000} />
                  </label>
                </div>
                <label className="bw-bill-check">
                  <input type="checkbox" name="overpayment" />
                  Ik bevestig eventuele overbetaling en het klanttegoed.
                </label>
                <button className="bw-secondary" disabled={intent.pending}>
                  Bewaar ontvangst
                </button>
              </form>
              {data.payments.length === 0 ? (
                <p>Nog geen ontvangsten geboekt.</p>
              ) : (
                <ul className="bw-bill-customers">
                  {data.payments.map((p) => (
                    <li key={p.id}>
                      {formatEuro(p.amount_cents)} · {dateLabel(p.received_on)}{" "}
                      · {p.status === "valid" ? "Geldig" : "Teruggedraaid"}
                      {p.note && <p>{p.note}</p>}
                      {p.status === "valid" ? (
                        <details>
                          <summary>Ontvangst terugdraaien</summary>
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const form = new FormData(e.currentTarget);
                              const r = await intent.run(
                                "payment.reverse",
                                {
                                  id: p.id,
                                  reason: String(form.get("reason")),
                                },
                                p.version,
                              );
                              if (r.ok) router.refresh();
                            }}
                          >
                            <label>
                              Reden
                              <textarea
                                name="reason"
                                required
                                maxLength={2000}
                              />
                            </label>
                            <button
                              className="bw-secondary"
                              disabled={intent.pending}
                            >
                              Bevestig terugdraaien
                            </button>
                          </form>
                        </details>
                      ) : (
                        <p>{p.reversed_reason}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {BigInt(b.balance_cents) < 0n && (
                <p>
                  Klanttegoed:{" "}
                  {formatEuro((-BigInt(b.balance_cents)).toString())}.
                  Terugbetalingen of verrekening met andere facturen worden in
                  deze fase nog niet geboekt.
                </p>
              )}
            </section>
          )}
          {i.kind === "invoice" &&
            BigInt(i.credited_cents) < BigInt(i.total_cents) && (
              <section className="bw-bill-section">
                <h2>Credit of correctie</h2>
                <p>
                  Een credit krijgt een eigen nummer en bewaart de gegevens en
                  btw-behandeling van het origineel.
                </p>
                <button
                  className="bw-secondary"
                  onClick={() => setCreditConfirm(!creditConfirm)}
                >
                  Maak creditfactuur
                </button>{" "}
                <button
                  className="bw-secondary"
                  onClick={() => setCorrectConfirm(!correctConfirm)}
                >
                  Corrigeer
                </button>
                {creditConfirm && (
                  <div className="bw-bill-confirm">
                    <h3>Controleer de credit</h3>
                    <p>
                      Laat alle bedragen leeg voor de volledige resterende
                      credit. De credit wordt direct definitief.
                    </p>
                    {i.status === "verstuurd" ? (
                      data.lines
                        .filter((l) => l.active)
                        .map((l) => (
                          <Field
                            key={l.id}
                            name={"credit-" + l.id}
                            label={`Deelcredit excl. btw (€): ${l.description}`}
                            value={partial[l.id] ?? ""}
                            onChange={(v) =>
                              setPartial({ ...partial, [l.id]: v })
                            }
                          />
                        ))
                    ) : (
                      <p>
                        Een deelcredit is pas beschikbaar na verzending. Je kunt
                        nu volledig crediteren of corrigeren.
                      </p>
                    )}
                    <button
                      className="bw-secondary"
                      disabled={intent.pending}
                      onClick={() => credit()}
                    >
                      Bevestig credit definitief
                    </button>
                  </div>
                )}
                {correctConfirm && (
                  <div className="bw-bill-confirm">
                    <h3>Resterende factuur corrigeren</h3>
                    <p>
                      De resterende bedragen worden definitief gecrediteerd.
                      Tegelijk ontstaat een nieuw concept voor precies die
                      scope. Het nieuwe concept krijgt nog geen nummer.
                    </p>
                    <button
                      className="bw-secondary"
                      disabled={intent.pending}
                      onClick={() => credit(true)}
                    >
                      Bevestig credit en nieuw concept
                    </button>
                  </div>
                )}
              </section>
            )}
          <section className="bw-bill-section">
            <h2>Documentrelaties</h2>
            {data.related.length ? (
              <ul>
                {data.related.map((r) => (
                  <li key={r.id}>
                    <Link href={"/beheer/facturen/" + r.id}>
                      {r.number ?? "Gekoppeld concept"}
                    </Link>{" "}
                    · {r.kind === "credit" ? "Credit" : "Factuur"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Geen credits of correcties gekoppeld.</p>
            )}
            <p>
              Bewaarmarkering: {dateLabel(i.retain_until)}. Geen automatische
              verwijdering; de fiscale bewaartermijn kan later beginnen of
              langer zijn.
            </p>
          </section>
          <section className="bw-bill-section">
            <h2>Tijdlijn</h2>
            <ol className="bw-bill-timeline">
              {data.audit.map((a) => (
                <li key={a.id}>
                  <strong>{a.summary}</strong>
                  <span>
                    {formatDateTime(a.created_at)} · {a.actor}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <aside>
          <Preview
            seller={f.seller}
            customer={f.customer}
            number={i.number}
            invoiceOn={i.invoice_on}
            reference={i.reference}
            lines={f.lines}
            net={i.net_cents}
            vat={i.vat_cents}
            total={i.total_cents}
            groups={i.tax_groups}
            concept={false}
            credit={i.kind === "credit"}
          />
          <p className="bw-bill-note">
            Dit voorbeeld gebruikt de bevroren gegevens. Het opgeslagen
            PDF-bestand is het archiefexemplaar.
          </p>
        </aside>
      </div>
    </>
  );
}
