import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const model = await import("../lib/billing/model.ts").catch(() => ({}));
const vectors = JSON.parse(
  readFileSync(new URL("./billing/vectors.json", import.meta.url)),
);
test("rekencontract bestaat", () =>
  assert.equal(typeof model.calculate, "function"));
for (const vector of vectors)
  test(vector.name, () => {
    const actual = model.calculate(vector.lines);
    for (const key of ["net_cents", "vat_cents", "total_cents"])
      assert.equal(actual[key], vector[key]);
  });
test("half van nul af is symmetrisch", () => {
  assert.equal(model.roundRatio(82719n, 2n), 41360n);
  assert.equal(model.roundRatio(-82719n, 2n), -41360n);
  assert.equal(model.roundRatio(-18517500n, 1000n), -18518n);
});
test("schaal, exponenten, overflow en categorieën worden geweigerd", () => {
  for (const value of ["1e3", "1.2345", "1000000.001", "-1", "NaN"])
    assert.throws(() => model.parseQuantity(value));
  for (const value of ["1e3", "1.2", "10000000000001", "-1"])
    assert.throws(() => model.parseCents(value));
  assert.throws(() =>
    model.calculate([
      {
        quantity: "1",
        unit_price_cents: "10",
        vat_code: "nl_21",
        tax_treatment: "eu_b2b",
      },
    ]),
  );
  assert.throws(() => model.calculate(Array(101).fill(vectors[0].lines[0])));
});
test("geldformat en parse zonder verlies of gewone spatie", () => {
  assert.equal(model.formatEuro("0"), "€\u00a00,00");
  assert.equal(model.formatEuro("-238310"), "-€\u00a02.383,10");
  assert.equal(model.parseMoney("1.969,50"), "196950");
  assert.throws(() => model.parseMoney("1,999"));
  assert.throws(() => model.formatEuro("9007199254740992"));
});
test("mail alleen bekende velden en geen open placeholders", () => {
  assert.equal(
    model.renderMail("Factuur {nummer}", { nummer: "F2026-0001" }),
    "Factuur F2026-0001",
  );
  for (const s of ["{unknown}", "{{nummer}}", "Beste {{NAAM}}"])
    assert.throws(() => model.renderMail(s, { nummer: "F2026-0001" }));
});
test("ontvangers zijn genormaliseerde losse adressen, zonder headerinjectie", () => {
  assert.deepEqual(model.parseEmails("Test@Example.org, second@example.org"), [
    "test@example.org",
    "second@example.org",
  ]);
  for (const s of [
    "a@example.org\r\nBcc:x@example.org",
    "Naam <a@example.org>",
    "bad",
  ])
    assert.throws(() => model.parseEmails(s));
});
test("saldo bewaart klanttegoed en betaling is geen verzendbewijs", () => {
  const s = model.invoiceBalance(
    {
      kind: "invoice",
      total_cents: "121",
      status: "definitief",
      due_on: "2026-01-01",
    },
    "121",
    "121",
    "2026-10-31",
  );
  assert.equal(s.balance_cents, "-121");
  assert.equal(s.overdue, false);
  assert.equal(s.credit_label, "Gecrediteerd");
  assert.equal(s.payment_label, "Klanttegoed");
});
test("Amsterdamse timestamps en uitreikwaarschuwing gebruiken kalender en verzending", () => {
  assert.equal(
    model.amsterdamTimestamp("2026-10-31T12:00:00"),
    "2026-10-31T11:00:00.000Z",
  );
  assert.equal(
    model.amsterdamTimestamp("2026-07-01T12:00:00"),
    "2026-07-01T10:00:00.000Z",
  );
  assert.throws(() => model.amsterdamTimestamp("2026-03-29T02:30:00"));
  assert.ok(
    model.issueWarning(
      "2026-10-31",
      "klaar_voor_verzending",
      "service",
      "2026-11-15",
    ),
  );
  assert.equal(
    model.issueWarning("2026-10-31", "verstuurd", "service", "2026-11-15"),
    null,
  );
  assert.equal(
    model.issueWarning("2026-10-31", "definitief", "advance", "2026-11-15"),
    null,
  );
});
test("wacht op Jarvis-filter omvat ook creditdocumenten", () => {
  const rows = [
    {
      kind: "credit",
      status: "klaar_voor_verzending",
      total_cents: "-121",
      due_on: null,
      invoice_on: "2026-10-31",
      number: "F2026-0002",
      pdf_hash: "a",
      credited_cents: "0",
      received_cents: "0",
      customer_id: null,
    },
  ];
  assert.equal(
    model.filterInvoices(rows, [], { state: "jarvis" }, "2026-10-31").length,
    1,
  );
});
