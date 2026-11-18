import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  StyleSheet,
  renderToBuffer,
  type TextProps,
} from "@react-pdf/renderer";
import path from "node:path";
import { formatEuro } from "./model";
import type { Frozen } from "./schema";
const root = path.join(process.cwd(), "lib/billing/assets");
Font.register({
  family: "Space Grotesk",
  fonts: [
    { src: path.join(root, "SpaceGrotesk-Regular.ttf"), fontWeight: 400 },
    { src: path.join(root, "SpaceGrotesk-Bold.ttf"), fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);
const h = React.createElement,
  WIDTH = 493,
  LINE = 13.5,
  BODY = 610;
const s = StyleSheet.create({
  page: {
    minHeight: 841.89,
    maxHeight: 841.89,
    paddingTop: 145,
    paddingBottom: 64,
    paddingHorizontal: 51,
    fontFamily: "Space Grotesk",
    fontSize: 9,
    color: "#17141F",
    lineHeight: 1.5,
  },
  header: { position: "absolute", top: 45, left: 51, right: 51, height: 74 },
  heading: { flexDirection: "row", justifyContent: "space-between" },
  logo: { width: 138, height: 34, objectFit: "contain" },
  title: {
    fontSize: 20,
    lineHeight: 1.3,
    color: "#0F2A52",
    fontWeight: 700,
    marginBottom: 5,
  },
  right: { textAlign: "right" },
  addresses: { flexDirection: "row", gap: 30, marginBottom: 20 },
  party: { width: 231 },
  label: { fontWeight: 700, color: "#0F2A52", marginBottom: 5 },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8A020",
    paddingBottom: 5,
    fontWeight: 700,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F5F2EC",
  },
  description: { width: "43%", paddingRight: 12 },
  qty: { width: "17%", paddingRight: 8 },
  price: { width: "16%", textAlign: "right", fontSize: 8, lineHeight: 1.5 },
  rate: { width: "8%", textAlign: "right" },
  amount: { width: "16%", textAlign: "right", fontSize: 8, lineHeight: 1.5 },
  totals: {
    marginTop: 22,
    marginLeft: "48%",
    padding: 12,
    backgroundColor: "#F5F2EC",
  },
  sumrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  total: { fontWeight: 700, fontSize: 13, lineHeight: 1.5, color: "#0F2A52" },
  note: { marginTop: 18 },
  footer: {
    position: "absolute",
    top: 786,
    left: 51,
    right: 51,
    height: 16,
    fontSize: 8,
    lineHeight: 1.5,
    color: "#4A4556",
  },
});
function text(value: string, style?: TextProps["style"]) {
  return h(Text, { style }, value);
}
function date(value: string | null) {
  return value ? value.split("-").reverse().join("-") : "—";
}
function tableHead() {
  return h(
    View,
    { style: s.tableHead },
    text("Omschrijving", s.description),
    text("Aantal / eenheid", s.qty),
    text("Prijs excl.", s.price),
    text("Btw", s.rate),
    text("Netto", s.amount),
  );
}
export async function renderInvoicePdf(
  frozen: Frozen,
  finalizedAt: string | null,
  concept = false,
): Promise<Buffer> {
  const { seller, customer, invoice: i } = frozen;
  if (frozen.template_version !== "setpiece-invoice-v1")
    throw new Error("Deze documentversie is niet beschikbaar.");
  await Font.load({ fontFamily: "Space Grotesk", fontWeight: 400 });
  const font = Font.getFont({
    fontFamily: "Space Grotesk",
    fontWeight: 400,
  }).data;
  if (!font) throw new Error("Het documentfont is niet beschikbaar.");
  const measure = (v: string) =>
    (font
      .layout(v)
      .positions.reduce(
        (n: number, p: { xAdvance: number }) => n + p.xAdvance,
        0,
      ) *
      9) /
    font.unitsPerEm;
  function wrap(value: string, width: number): string[] {
    const lines: string[] = [];
    for (const paragraph of value.split("\n")) {
      let line = "";
      for (const word of paragraph.split(/\s+/)) {
        if (!word) continue;
        if (measure(word) > width) {
          if (line) {
            lines.push(line);
            line = "";
          }
          for (const character of word) {
            if (measure(line + character) > width) {
              lines.push(line);
              line = "";
            }
            line += character;
          }
        } else if (line && measure(line + " " + word) > width) {
          lines.push(line);
          line = word;
        } else line = line ? line + " " + word : word;
      }
      lines.push(line);
    }
    return lines;
  }
  type Sheet = { nodes: React.ReactNode[]; used: number; table: boolean };
  const sheets: Sheet[] = [{ nodes: [], used: 0, table: false }];
  let sheet = sheets[0];
  function add(node: React.ReactNode, height: number, row = false) {
    const heading = row && !sheet.table ? 24 : 0;
    if (sheet.used + height + heading > BODY) {
      sheet = { nodes: [], used: 0, table: false };
      sheets.push(sheet);
    }
    if (row && !sheet.table) {
      sheet.nodes.push(tableHead());
      sheet.used += 24;
      sheet.table = true;
    }
    sheet.nodes.push(node);
    sheet.used += height;
  }
  function paragraph(value: string, spacing = 0) {
    const lines = wrap(value, WIDTH);
    for (let n = 0; n < lines.length; n += 20) {
      const part = lines.slice(n, n + 20);
      add(
        h(
          Text,
          { style: { paddingTop: n === 0 ? spacing : 0 } },
          part.join("\n"),
        ),
        part.length * LINE + (n === 0 ? spacing : 0),
      );
    }
  }
  const parties = [
    { data: seller, label: "Van" },
    { data: customer, label: "Aan" },
  ].map((p) => ({
    ...p,
    lines: [
      p.data.name,
      p.data.street,
      `${p.data.postal_code} ${p.data.city}`,
      p.data.country,
      `Btw-id ${p.data.vat_id || "—"}`,
      `KVK ${p.data.kvk || "—"}`,
    ].flatMap((v) => wrap(v, 231)),
  }));
  const addressHeight =
    (Math.max(...parties.map((p) => p.lines.length)) + 1) * LINE + 30;
  // Address fields are bounded by finalization. Exceptionally long draft addresses split into ordinary text.
  if (addressHeight <= BODY)
    add(
      h(
        View,
        { style: s.addresses },
        ...parties.map((p) =>
          h(
            View,
            { key: p.label, style: s.party },
            text(p.label, s.label),
            text(p.lines.join("\n")),
          ),
        ),
      ),
      addressHeight,
    );
  else
    for (const p of parties) paragraph(p.label + "\n" + p.lines.join("\n"), 12);
  paragraph(
    `${i.service_kind === "advance" ? "Vooruitbetaling" : "Dienstperiode"}: ${date(i.service_from)} – ${date(i.service_until)}`,
  );
  if (i.reference) paragraph(`Referentie: ${i.reference}`);
  if (frozen.original)
    paragraph(
      `Credit op ${frozen.original.number} van ${date(frozen.original.invoice_on)}`,
    );
  if (i.intro) paragraph(i.intro, 18);
  add(h(View, { style: { height: 12 } }), 12);
  for (const l of frozen.lines) {
    const description = wrap(
        l.description +
          (l.service_from
            ? `\n${date(l.service_from)} – ${date(l.service_until)}`
            : ""),
        WIDTH * 0.43 - 12,
      ),
      quantity = wrap(
        `${l.quantity.replace(".", ",")} ${l.unit}`,
        WIDTH * 0.17 - 8,
      );
    for (let n = 0; n < description.length; n += 8) {
      const first = n === 0,
        part = description.slice(n, n + 8),
        // Keep a small baseline allowance: Yoga's rounded inner height otherwise
        // clips a complete 9pt text line inside a fixed-height padded row.
        height = Math.max(part.length, first ? quantity.length : 0) * LINE + 20;
      add(
        h(
          View,
          { key: l.id + "-" + n, style: [s.row, { height }], wrap: false },
          text(part.join("\n"), s.description),
          text(first ? quantity.join("\n") : "", s.qty),
          text(first ? formatEuro(l.unit_price_cents) : "", s.price),
          text(first ? `${l.vat_rate}%` : "", s.rate),
          text(first ? formatEuro(l.net_cents) : "", s.amount),
        ),
        height,
        true,
      );
    }
  }
  const totalHeight = 46 + (i.tax_groups.length + 1) * 20;
  add(
    h(
      View,
      { style: s.totals },
      h(
        View,
        { style: s.sumrow },
        text("Subtotaal excl. btw"),
        text(formatEuro(i.net_cents)),
      ),
      ...i.tax_groups.map((g) =>
        h(
          View,
          { key: g.vat_code, style: s.sumrow },
          text(`${g.rate}% over ${formatEuro(g.net_cents)}`),
          text(formatEuro(g.vat_cents)),
        ),
      ),
      h(
        View,
        { style: [s.sumrow, s.total] },
        text("Totaal"),
        text(formatEuro(i.total_cents)),
      ),
    ),
    totalHeight,
  );
  paragraph(
    concept
      ? "CONCEPT · controleer de gegevens vóór definitief maken."
      : i.kind === "credit"
        ? "Te verrekenen/terug te ontvangen. Maak dit bedrag niet over."
        : `Betaal binnen ${i.payment_days} dagen op ${seller.iban} ten name van ${seller.account_holder}, onder vermelding van ${i.number}.`,
    18,
  );
  if (i.footer) paragraph(i.footer, 18);
  const label = concept
    ? "CONCEPT"
    : i.kind === "credit"
      ? "Creditfactuur"
      : "Factuur";
  const pages = sheets.map((page, index) =>
    h(
      Page,
      { key: index, size: "A4", style: s.page, wrap: false },
      h(
        View,
        { style: s.header },
        h(
          View,
          { style: s.heading },
          h(Image, { src: path.join(root, "logo.png"), style: s.logo }),
          h(
            View,
            { style: s.right },
            text(label, s.title),
            text(i.number ?? "Nog geen nummer"),
            text(`Factuurdatum ${date(i.invoice_on)}`),
            i.due_on ? text(`Vervaldatum ${date(i.due_on)}`) : null,
          ),
        ),
      ),
      ...page.nodes,
      h(View, { style: { height: Math.max(0, BODY - page.used) + 16 } }),
      h(
        Text,
        { style: { fontSize: 8, lineHeight: 1.5, color: "#4A4556" } },
        `${seller.name.slice(0, 80)} · ${i.number ?? "Concept"} · ${index + 1} / ${sheets.length}`,
      ),
    ),
  );
  const stamp = new Date(finalizedAt ?? "2000-01-01T00:00:00Z");
  return renderToBuffer(
    h(
      Document,
      {
        title: `Setpiece ${label} ${i.number ?? ""}`,
        author: seller.name || "Setpiece",
        subject: i.reference,
        language: "nl-NL",
        creator: "Setpiece invoice v1 / react-pdf 4.9.0",
        producer: "Setpiece",
        creationDate: stamp,
        modificationDate: stamp,
      },
      ...pages,
    ),
  );
}
