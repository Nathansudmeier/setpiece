/** Billing v1. JSON money is integer cents as decimal strings; no money arithmetic uses Number. */
export const TAX = {
  nl_21: { treatment: "nl_standard", rate: 21 },
  nl_9: { treatment: "nl_reduced", rate: 9 },
} as const;
export const MAX_CENTS = 10_000_000_000_000n;
export type TaxCode = keyof typeof TAX;
export type CalcLine = {
  quantity: string;
  unit_price_cents: string;
  vat_code: string;
  tax_treatment: string;
};
export type TaxGroup = {
  vat_code: string;
  tax_treatment: string;
  rate: number;
  net_cents: string;
  vat_cents: string;
};
export function roundRatio(n: bigint, d: bigint): bigint {
  if (d <= 0n) throw new Error("Ongeldige deler.");
  const a = n < 0n ? -n : n;
  const value = (a + d / 2n) / d;
  return n < 0n ? -value : value;
}
export function parseCents(value: string): bigint {
  if (!/^(0|[1-9]\d{0,13})$/.test(value) || BigInt(value) > MAX_CENTS)
    throw new Error("Prijs: maximaal € 100.000.000.000,00.");
  return BigInt(value);
}
export function parseQuantity(value: string): bigint {
  if (!/^(0|[1-9]\d{0,6})(\.\d{1,3})?$/.test(value))
    throw new Error("Aantal: maximaal drie decimalen.");
  const [whole, frac = ""] = value.split(".");
  const result = BigInt(whole) * 1000n + BigInt(frac.padEnd(3, "0"));
  if (result > 1_000_000_000n) throw new Error("Aantal: maximaal 1.000.000.");
  return result;
}
export function parseMoney(value: string): string {
  const clean = value.trim().replace(/\s/g, "");
  if (!/^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,2})?$/.test(clean))
    throw new Error("Gebruik een bedrag zoals 1.969,50.");
  const [whole, frac = ""] = clean.replaceAll(".", "").split(",");
  const cents = BigInt(whole) * 100n + BigInt(frac.padEnd(2, "0"));
  if (cents > MAX_CENTS) throw new Error("Bedrag te groot.");
  return cents.toString();
}
export function moneyInput(value: string): string {
  const n = BigInt(value);
  return `${n / 100n},${(n % 100n).toString().padStart(2, "0")}`;
}
export function calculate(lines: CalcLine[], sign: 1 | -1 = 1) {
  if (lines.length > 100) throw new Error("Maximaal 100 regels.");
  const groups = new Map<
    string,
    { net: bigint; rate: number; treatment: string }
  >();
  const calculated = lines.map((line) => {
    if (!(line.vat_code in TAX))
      throw new Error("Deze btw-behandeling is niet beschikbaar.");
    const tax = TAX[line.vat_code as TaxCode];
    if (tax.treatment !== line.tax_treatment)
      throw new Error("Ongeldige btw-combinatie.");
    const net =
      roundRatio(
        parseQuantity(line.quantity) * parseCents(line.unit_price_cents),
        1000n,
      ) * BigInt(sign);
    const group = groups.get(line.vat_code) ?? {
      net: 0n,
      rate: tax.rate,
      treatment: tax.treatment,
    };
    group.net += net;
    groups.set(line.vat_code, group);
    return {
      ...line,
      net_cents: net.toString(),
      line_vat_cents: roundRatio(net * BigInt(tax.rate), 100n).toString(),
    };
  });
  const tax_groups: TaxGroup[] = [...groups]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([vat_code, g]) => ({
      vat_code,
      tax_treatment: g.treatment,
      rate: g.rate,
      net_cents: g.net.toString(),
      vat_cents: roundRatio(g.net * BigInt(g.rate), 100n).toString(),
    }));
  const net = tax_groups.reduce((n, g) => n + BigInt(g.net_cents), 0n),
    vat = tax_groups.reduce((n, g) => n + BigInt(g.vat_cents), 0n);
  if (
    net > MAX_CENTS ||
    net < -MAX_CENTS ||
    net + vat > MAX_CENTS ||
    net + vat < -MAX_CENTS
  )
    throw new Error("Factuurtotaal te groot.");
  return {
    lines: calculated,
    tax_groups,
    net_cents: net.toString(),
    vat_cents: vat.toString(),
    total_cents: (net + vat).toString(),
  };
}
export function formatEuro(value: string): string {
  if (!/^-?(0|[1-9]\d*)$/.test(value)) throw new Error("Ongeldig centbedrag.");
  const n = BigInt(value),
    a = n < 0n ? -n : n;
  const parts = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).formatToParts(a / 100n);
  return (
    (n < 0n ? "-" : "") +
    parts
      .map((p) =>
        p.type === "fraction"
          ? (a % 100n).toString().padStart(2, "0")
          : p.value,
      )
      .join("")
  );
}
export function parseEmails(value: string | string[]): string[] {
  const raw = Array.isArray(value) ? value : value ? value.split(",") : [];
  if (raw.length > 10) throw new Error("Maximaal tien ontvangers.");
  return [
    ...new Set(
      raw.map((s) => {
        if (/[{}\r\n]/.test(s)) throw new Error("Ongeldig e-mailadres.");
        const email = s.trim().toLowerCase();
        if (
          email.length > 254 ||
          !/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(
            email,
          )
        )
          throw new Error(
            "Vul losse e-mailadressen in, gescheiden door komma’s.",
          );
        return email;
      }),
    ),
  ];
}
export function renderMail(
  template: string,
  values: Record<string, string>,
): string {
  if (!template.trim() || template.length > 10000 || /\{\{/.test(template))
    throw new Error("Vul het mailsjabloon volledig in.");
  const allowed = ["nummer", "klant", "totaal", "vervaldatum", "referentie"];
  const out = template.replace(/\{([^{}]+)\}/g, (_, key: string) => {
    if (!allowed.includes(key) || values[key] === undefined)
      throw new Error("Onbekend of oningevuld sjabloonveld.");
    return values[key];
  });
  if (/[{}]/.test(out)) throw new Error("Oningevuld sjabloonveld.");
  return out;
}
export function validDate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value + "T12:00:00Z").toISOString().slice(0, 10) === value
  );
}
export function invoiceBalance(
  invoice: {
    kind: string;
    status: string;
    total_cents: string;
    due_on: string | null;
  },
  credited = "0",
  received = "0",
  today = "",
) {
  const total = BigInt(invoice.total_cents),
    credit = BigInt(credited),
    paid = BigInt(received);
  const balance = invoice.kind === "credit" ? 0n : total - credit - paid;
  return {
    balance_cents: balance.toString(),
    credited_cents: credited,
    received_cents: received,
    overdue:
      invoice.kind === "invoice" &&
      !["concept", "vervallen"].includes(invoice.status) &&
      balance > 0n &&
      !!invoice.due_on &&
      invoice.due_on < today,
    payment_label:
      balance < 0n
        ? "Klanttegoed"
        : balance === 0n
          ? "Voldaan / verrekend"
          : paid > 0n
            ? "Deels betaald"
            : "Open",
    credit_label:
      credit > 0n
        ? credit === total
          ? "Gecrediteerd"
          : "Deels gecrediteerd"
        : "",
  };
}
export function issueWarning(
  serviceEnd: string | null,
  status: string,
  serviceKind: string,
  today: string,
): string | null {
  if (
    !serviceEnd ||
    status === "verstuurd" ||
    status === "vervallen" ||
    serviceKind !== "service"
  )
    return null;
  const date = new Date(serviceEnd + "T12:00:00Z");
  date.setUTCMonth(date.getUTCMonth() + 1, 15);
  const deadline = date.toISOString().slice(0, 10);
  return today >= deadline
    ? `Nog niet uitgereikt. Controleer de gebruikelijke uitreiktermijn van ${deadline}.`
    : null;
}
export const DOCUMENT_LABELS: Record<string, string> = {
  concept: "Concept",
  definitief: "Definitief · PDF ontbreekt",
  klaar_voor_verzending: "Wacht op verzending",
  verstuurd: "Verstuurd",
  vervallen: "Vervallen",
};
export type InvoiceFilter = { q?: string; year?: string; state?: string };
export function filterInvoices<
  T extends {
    kind: string;
    status: string;
    total_cents: string;
    due_on: string | null;
    invoice_on: string | null;
    number: string | null;
    pdf_hash: string | null;
    credited_cents: string;
    received_cents: string;
    customer_id: string | null;
    frozen?: { customer: { name: string } } | null;
  },
>(
  rows: T[],
  customers: { id: string; data: { name: string } }[],
  filter: InvoiceFilter,
  today: string,
): T[] {
  return rows.filter((i) => {
    const name =
      i.frozen?.customer.name ??
      customers.find((c) => c.id === i.customer_id)?.data.name ??
      "";
    if (
      filter.q &&
      !`${i.number ?? "Concept"} ${name}`
        .toLowerCase()
        .includes(filter.q.toLowerCase())
    )
      return false;
    if (filter.year && i.invoice_on?.slice(0, 4) !== filter.year) return false;
    const b = invoiceBalance(i, i.credited_cents, i.received_cents, today);
    switch (filter.state) {
      case "concept":
        return i.status === "concept";
      case "pdf":
        return !["concept", "vervallen"].includes(i.status) && !i.pdf_hash;
      case "jarvis":
        return (
          i.status === "klaar_voor_verzending" &&
          (i.kind === "credit" ||
            BigInt(i.credited_cents) < BigInt(i.total_cents))
        );
      case "open":
        return (
          i.kind === "invoice" &&
          !["concept", "vervallen"].includes(i.status) &&
          BigInt(b.balance_cents) > 0n
        );
      case "late":
        return b.overdue;
      case "paid":
        return (
          i.kind === "invoice" &&
          !["concept", "vervallen"].includes(i.status) &&
          BigInt(b.balance_cents) <= 0n
        );
      case "credited":
        return i.kind === "credit" || BigInt(i.credited_cents) > 0n;
      case "void":
        return i.status === "vervallen";
      default:
        return true;
    }
  });
}
export function amsterdamTimestamp(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value))
    throw new Error("Kies een geldig verzendmoment in Amsterdamse tijd.");
  const full = value.length === 16 ? value + ":00" : value,
    guess = Date.parse(full + "Z");
  const zone = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Amsterdam",
    timeZoneName: "longOffset",
  })
    .formatToParts(guess)
    .find((p) => p.type === "timeZoneName")?.value;
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(zone ?? "");
  if (!match) throw new Error("Tijdzone niet beschikbaar.");
  const offset =
      (Number(match[2]) * 60 + Number(match[3])) *
      60000 *
      (match[1] === "+" ? 1 : -1),
    date = new Date(guess - offset);
  if (amsterdamDateTime(date) !== full)
    throw new Error(
      "Dit Amsterdamse tijdstip bestaat niet door de zomertijdwisseling.",
    );
  return date.toISOString();
}
export function amsterdamDateTime(date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
    .format(date)
    .replace(" ", "T");
}

export function assertSavedVersion(
  receiptVersion: unknown,
  currentVersion: unknown,
): void {
  if (
    typeof receiptVersion !== "number" ||
    !Number.isInteger(receiptVersion) ||
    receiptVersion !== currentVersion
  )
    throw new Error(
      "Dit concept is intussen gewijzigd. Je invoer blijft staan. Open de actuele versie en vergelijk voordat je opnieuw opslaat of definitief maakt.",
    );
}

export function documentLabel(invoice: {
  status: string;
  kind: string;
  pdf_hash: string | null;
  credited_cents: string;
  total_cents: string;
}): string {
  if (invoice.status === "definitief")
    return invoice.pdf_hash ? "Definitief" : "Definitief · PDF ontbreekt";
  if (
    invoice.status === "klaar_voor_verzending" &&
    invoice.kind === "invoice" &&
    BigInt(invoice.credited_cents) >= BigInt(invoice.total_cents)
  )
    return "Verzending gestopt";
  return DOCUMENT_LABELS[invoice.status] ?? invoice.status;
}
