import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
const pdfModule = await import("../../lib/billing/pdf.ts"),
  schemaModule = await import("../../lib/billing/schema.ts");
const { renderInvoicePdf } = pdfModule.default ?? pdfModule,
  { frozenSchema } = schemaModule.default ?? schemaModule;
import { execFileSync } from "node:child_process";
import { calculate } from "../../lib/billing/model.ts";
import { connect, setup, final, cmd } from "./helpers.mjs";
const db = await connect();
let invoice;
test.before(async () => {
  await db.query("begin");
  const customer = await setup(db);
  invoice = await final(db, customer);
});
test.after(async () => {
  await db.query("rollback");
  await db.end();
});
test("PDF uses pinned metadata/assets and renders frozen input twice identically in this runtime", async () => {
  const f = frozenSchema.parse(invoice.frozen),
    a = await renderInvoicePdf(f, invoice.finalized_at),
    b = await renderInvoicePdf(f, invoice.finalized_at);
  assert.equal(a.subarray(0, 5).toString(), "%PDF-");
  assert.equal(
    createHash("sha256").update(a).digest("hex"),
    createHash("sha256").update(b).digest("hex"),
  );
  mkdirSync("docs/acceptatie/facturatie", { recursive: true });
  writeFileSync("docs/acceptatie/facturatie/standaard.pdf", a);
});
test("long names, accented characters, 100 lines and credit PDF render", async () => {
  const f = structuredClone(invoice.frozen);
  f.customer.name =
    "Synthetische organisatie met een lange juridische naam Één & Zoë – test";
  f.lines = Array.from({ length: 100 }, (_, n) => ({
    ...f.lines[0],
    id: crypto.randomUUID(),
    position: n + 1,
    description:
      `Dienst ${n + 1}: résumé, € en geïsoleerde verificatie. ` +
      "Een lange omschrijving voor meerdere pagina’s. ".repeat(9) +
      `Einde_${String(n + 1).padStart(3, "0")}`,
  }));
  const calc = calculate(
    f.lines.map((l) => ({
      quantity: l.quantity,
      unit_price_cents: l.unit_price_cents,
      vat_code: l.vat_code,
      tax_treatment: l.tax_treatment,
    })),
  );
  Object.assign(f.invoice, {
    net_cents: calc.net_cents,
    vat_cents: calc.vat_cents,
    total_cents: calc.total_cents,
    tax_groups: calc.tax_groups,
  });
  const bytes = await renderInvoicePdf(
    frozenSchema.parse(f),
    invoice.finalized_at,
  );
  assert.ok(bytes.length > 10000 && bytes.length < 5242880);
  writeFileSync("docs/acceptatie/facturatie/meerdere-paginas.pdf", bytes);
  const credit = await cmd(
    db,
    "invoice.credit",
    { id: invoice.id, confirmed: true },
    invoice.version,
  );
  const c = await renderInvoicePdf(
    frozenSchema.parse(credit.frozen),
    credit.finalized_at,
  );
  writeFileSync("docs/acceptatie/facturatie/credit.pdf", c);
  assert.ok(c.length > 1000);
});

test("PDF pages are A4 with repeated headers and actual page numbering", () => {
  const info = execFileSync(
    "pdfinfo",
    ["-f", "1", "-l", "3", "docs/acceptatie/facturatie/meerdere-paginas.pdf"],
    { encoding: "utf8" },
  );
  assert.equal((info.match(/595.28 x 841.89 pts/g) ?? []).length, 3);
  const normal = execFileSync(
    "pdftotext",
    ["-layout", "docs/acceptatie/facturatie/standaard.pdf", "-"],
    { encoding: "utf8" },
  );
  assert.match(normal, /1 \/ 1/);
  assert.ok(
    normal.includes(invoice.frozen.lines[0].description),
    "single-line description must be visible, not clipped by its row",
  );
  assert.match(normal, /1 dienst/);
  assert.match(normal, /21%/);
  const second = execFileSync(
    "pdftotext",
    [
      "-f",
      "2",
      "-l",
      "2",
      "-layout",
      "docs/acceptatie/facturatie/meerdere-paginas.pdf",
      "-",
    ],
    { encoding: "utf8" },
  );
  assert.match(second, /Omschrijving/);
  assert.match(second, /2 \/ \d+/);
  const all = execFileSync(
    "pdftotext",
    ["docs/acceptatie/facturatie/meerdere-paginas.pdf", "-"],
    { encoding: "utf8" },
  );
  for (let n = 1; n <= 100; n++)
    assert.ok(
      all.includes(`Einde_${String(n).padStart(3, "0")}`),
      `line ${n} must include its final text`,
    );
});
