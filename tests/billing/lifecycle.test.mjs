import test from "node:test";
import assert from "node:assert/strict";
import pg from "pg";
const url = process.env.BILLING_TEST_DATABASE_URL;
if (!url || !url.includes("@127.0.0.1:55322/"))
  throw new Error("Isolated local DB required");
const db = new pg.Client({ connectionString: url });
await db.connect();
const owner = "675024a7-62f2-4eac-ba25-9718bb362e74";
const today = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Amsterdam",
}).format(new Date());
async function session(c = db) {
  await c.query(
    "select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role','authenticated',false)",
    [owner],
  );
}
async function cmd(op, p = {}, v = null, r = crypto.randomUUID(), c = db) {
  return (
    await c.query("select public.sp_command($1,$2,$3,$4) result", [r, op, p, v])
  ).rows[0].result;
}
const line = (price = "196950") => ({
  id: crypto.randomUUID(),
  description: "Synthetische testdienst",
  quantity: "1",
  unit: "dienst",
  unit_price_cents: price,
  vat_code: "nl_21",
  tax_treatment: "nl_standard",
});
const seller = {
  name: "Setpiece testbedrijf",
  street: "Teststraat 1",
  postal_code: "1234 AB",
  city: "Teststad",
  country: "NL",
  vat_id: "NL123456789B01",
  kvk: "12345678",
  iban: "NL91ABNA0417164300",
  account_holder: "Testbedrijf",
  payment_days: 14,
  prefix: "F",
  mail_subject: "Factuur {nummer}",
  mail_body:
    "Beste {klant},\nFactuur {nummer} voor {totaal}. Betaal vóór {vervaldatum}. Referentie {referentie}.",
};
const buyer = {
  name: "Synthetische klant",
  street: "Testlaan 2",
  postal_code: "2345 BC",
  city: "Testdorp",
  country: "NL",
  vat_id: "",
  kvk: "",
  recipients: ["billing-recipient@example.test"],
  cc: [],
  payment_days: 14,
  tax_confirmed: true,
};
let customer, invoice;
async function draft(price = "196950", c = db) {
  return cmd(
    "invoice.create",
    {
      customer_id: customer.id,
      invoice_on: today,
      service_from: today,
      service_until: today,
      lines: [line(price)],
    },
    null,
    crypto.randomUUID(),
    c,
  );
}
async function final(price = "196950", c = db) {
  const i = await draft(price, c);
  return cmd(
    "invoice.finalize",
    { id: i.id },
    i.version,
    crypto.randomUUID(),
    c,
  );
}
async function attach(i, c = db) {
  i = await cmd(
    "invoice.prepare_pdf",
    {
      id: i.id,
      hash: "a".repeat(64),
      bytes: 100,
      template_version: "setpiece-invoice-v1",
    },
    i.version,
    crypto.randomUUID(),
    c,
  );
  return cmd(
    "invoice.attach_pdf",
    {
      id: i.id,
      hash: "a".repeat(64),
      bytes: 100,
      path: `${owner}/${today.slice(0, 4)}/${i.number}-${i.id}.pdf`,
    },
    i.version,
    crypto.randomUUID(),
    c,
  );
}
async function dispatch(id, c = db) {
  return (
    await c.query(
      "select * from public.sp_invoice_dispatches where invoice_id=$1 and status<>$2",
      [id, "geannuleerd"],
    )
  ).rows[0];
}
async function sent(i, c = db) {
  const d = await dispatch(i.id, c);
  return cmd(
    "invoice.mark_sent",
    {
      id: d.id,
      recipients: buyer.recipients,
      cc: [],
      sent_via: "gmail",
      sent_at: new Date().toISOString(),
      gmail_message_id: crypto.randomUUID(),
      note: "",
    },
    d.version,
    crypto.randomUUID(),
    c,
  );
}
test.before(async () => {
  await db.query("begin");
  await session();
  let s = (
    await db.query(
      "select * from public.sp_billing_settings where owner_id=$1",
      [owner],
    )
  ).rows[0];
  await cmd("settings.update", { data: seller }, s?.version ?? 1);
  customer = await cmd("customer.create", { data: buyer });
});
test.after(async () => {
  await db.query("rollback");
  await db.end();
});
test("concept, idempotentie, beschermd veld en PT409", async () => {
  const request = crypto.randomUUID(),
    p = { customer_id: customer.id, lines: [line()] };
  invoice = await cmd("invoice.create", p, null, request);
  assert.deepEqual(await cmd("invoice.create", p, null, request), invoice);
  await fails(
    () => cmd("invoice.create", { ...p, notes: "changed" }, null, request),
    "23505",
  );
});
// Each expected SQL error is isolated in a savepoint; a failed statement must not abort later tests.
async function fails(fn, code) {
  await db.query("savepoint expected_error");
  try {
    await assert.rejects(fn, { code });
  } finally {
    await db.query("rollback to savepoint expected_error");
  }
}
test("incomplete concept saves; finalize blocks missing fields", async () => {
  const i = await cmd("invoice.create", { lines: [] });
  await fails(() => cmd("invoice.finalize", { id: i.id }, i.version), "P0001");
});
test("unknown fields, invalid scale, duplicate line IDs and stale version refused", async () => {
  await fails(
    () => cmd("invoice.create", { lines: [line()], total_cents: "1" }),
    "22023",
  );
  await fails(
    () => cmd("invoice.update", { id: invoice.id, lines: [line()] }, 0),
    "PT409",
  );
  await fails(
    () => cmd("invoice.create", { lines: [{ ...line(), quantity: "1.0001" }] }),
    "P0001",
  );
  const l = line();
  await fails(() => cmd("invoice.create", { lines: [l, l] }), "P0001");
});
test("finalize freezes line/party/mail and allocates rollback-safe number", async () => {
  const i = await final();
  assert.match(i.number, /^F\d{4}-\d{4,}$/);
  assert.equal(i.total_cents, "238310");
  assert.equal(i.frozen.customer.name, buyer.name);
  assert.match(i.dispatch_seed.subject, /F\d{4}-/);
  await fails(
    () => cmd("invoice.update", { id: i.id, lines: [line()] }, i.version),
    "P0001",
  );
  await db.query("select set_config('setpiece.billing_write','on',true)");
  await fails(
    () =>
      db.query(
        "insert into public.sp_invoice_lines select gen_random_uuid(),owner_id,invoice_id,99,true,description,quantity_milli,unit,unit_price_cents,vat_code,tax_treatment,vat_rate,service_from,service_until,net_cents,line_vat_cents,original_line_id,version,created_at,updated_at from public.sp_invoice_lines where invoice_id=$1",
        [i.id],
      ),
    "42501",
  );
  await fails(
    () =>
      db.query("delete from public.sp_invoice_lines where invoice_id=$1", [
        i.id,
      ]),
    "42501",
  );
  const row = (
    await db.query(
      "select last_value from private.sp_billing_counters where owner_id=$1 and year=$2",
      [owner, Number(today.slice(0, 4))],
    )
  ).rows[0];
  await db.query("savepoint numbering");
  const next = await final();
  await db.query("rollback to savepoint numbering");
  const again = await final();
  assert.equal(again.number, next.number);
  assert.ok(BigInt(again.sequence_value) > BigInt(row.last_value));
});
test("PDF prepare/attach retry creates one dispatch and task", async () => {
  let i = await final();
  i = await attach(i);
  const d = await dispatch(i.id);
  assert.ok(d.task_id);
  const r = await cmd(
    "invoice.attach_pdf",
    { id: i.id, hash: i.pdf_hash, bytes: i.pdf_bytes, path: i.pdf_path },
    0,
  );
  assert.equal(r.id, i.id);
  assert.equal(
    (
      await db.query(
        "select count(*) n from public.sp_invoice_dispatches where invoice_id=$1",
        [i.id],
      )
    ).rows[0].n,
    "1",
  );
});
test("payment before sent, overpayment, reverse and credit remain separate", async () => {
  let i = await final("100");
  i = await attach(i);
  let p = await cmd(
    "payment.record",
    { id: i.id, received_on: today, amount_cents: "121", method: "bank" },
    i.version,
  );
  i = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [i.id],
    )
  ).rows[0].result;
  const d = await sent(i);
  assert.equal(d.status, "verstuurd");
  i = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [i.id],
    )
  ).rows[0].result;
  const credit = await cmd(
    "invoice.credit",
    { id: i.id, confirmed: true },
    i.version,
  );
  assert.equal(credit.total_cents, "-121");
  const state = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [i.id],
    )
  ).rows[0].result;
  assert.equal(state.status, "verstuurd");
  assert.equal(state.received_cents, "121");
  assert.equal(state.credited_cents, "121");
  const reversed = await cmd(
    "payment.reverse",
    { id: p.id, reason: "Synthetische correctie" },
    p.version,
  );
  assert.equal(reversed.status, "reversed");
});
test("two partial credits consume exact cumulative VAT cent remainder", async () => {
  let i = await final("4");
  i = await attach(i);
  await sent(i);
  i = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [i.id],
    )
  ).rows[0].result;
  const l = (
    await db.query(
      "select id from public.sp_invoice_lines where invoice_id=$1",
      [i.id],
    )
  ).rows[0];
  const a = await cmd(
    "invoice.credit",
    {
      id: i.id,
      confirmed: true,
      lines: [{ original_line_id: l.id, net_cents: "2" }],
    },
    i.version,
  );
  i = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [i.id],
    )
  ).rows[0].result;
  const b = await cmd(
    "invoice.credit",
    {
      id: i.id,
      confirmed: true,
      lines: [{ original_line_id: l.id, net_cents: "2" }],
    },
    i.version,
  );
  i = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [i.id],
    )
  ).rows[0].result;
  assert.equal(BigInt(a.vat_cents) + BigInt(b.vat_cents), -1n);
  assert.equal(BigInt(a.total_cents) + BigInt(b.total_cents), -5n);
  await fails(
    () => cmd("invoice.credit", { id: i.id, confirmed: true }, i.version),
    "P0001",
  );
});
test("correct creates one final credit and one unnumbered replacement atomically", async () => {
  let i = await final("100");
  const c = await cmd(
    "invoice.correct",
    { id: i.id, confirmed: true },
    i.version,
  );
  assert.ok(c.replacement_id);
  const r = (
    await db.query("select * from public.sp_invoices where id=$1", [
      c.replacement_id,
    ])
  ).rows[0];
  assert.equal(r.number, null);
  assert.equal(r.status, "concept");
  assert.equal(r.total_cents, "121");
});
test("credit and reversal advance original version for stale UI protection", async () => {
  let i = await final("100");
  const p = await cmd(
    "payment.record",
    { id: i.id, received_on: today, amount_cents: "10", method: "bank" },
    i.version,
  );
  let current = (
    await db.query("select * from public.sp_invoices where id=$1", [i.id])
  ).rows[0];
  await cmd("payment.reverse", { id: p.id, reason: "Test" }, p.version);
  let reversed = (
    await db.query("select * from public.sp_invoices where id=$1", [i.id])
  ).rows[0];
  assert.equal(reversed.version, current.version + 1);
  await cmd("invoice.credit", { id: i.id, confirmed: true }, reversed.version);
  const after = (
    await db.query("select * from public.sp_invoices where id=$1", [i.id])
  ).rows[0];
  assert.equal(after.version, reversed.version + 1);
});
test("tax mapping and monetary JSON types reject null or numeric bypass", async () => {
  await fails(
    () =>
      db.query("select private.sp_bill_calculate($1)", [
        JSON.stringify([
          {
            quantity: "1",
            unit_price_cents: "100",
            vat_code: null,
            tax_treatment: null,
          },
        ]),
      ]),
    "P0001",
  );
  await fails(
    () =>
      db.query("select private.sp_bill_calculate($1)", [
        JSON.stringify([{ ...line(), quantity: 1 }]),
      ]),
    "P0001",
  );
});
test("large quantity invoice can be fully credited and corrected without price overflow", async () => {
  let i = await cmd("invoice.create", {
    customer_id: customer.id,
    invoice_on: today,
    service_from: today,
    service_until: today,
    lines: [{ ...line("100000000"), quantity: "100" }],
  });
  i = await cmd("invoice.finalize", { id: i.id }, i.version);
  const credit = await cmd(
    "invoice.correct",
    { id: i.id, confirmed: true },
    i.version,
  );
  assert.equal(credit.total_cents, "-12100000000");
  const replacement = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [credit.replacement_id],
    )
  ).rows[0].result;
  assert.equal(replacement.total_cents, "12100000000");
});
test("null PDF metadata cannot create a dispatch without a verified PDF preparation", async () => {
  const i = await final("100");
  await fails(
    () =>
      cmd(
        "invoice.prepare_pdf",
        {
          id: i.id,
          hash: null,
          bytes: null,
          template_version: "setpiece-invoice-v1",
        },
        i.version,
      ),
    "P0001",
  );
  await fails(
    () =>
      cmd(
        "invoice.attach_pdf",
        {
          id: i.id,
          hash: null,
          bytes: null,
          path: `${owner}/${today.slice(0, 4)}/${i.number}-${i.id}.pdf`,
        },
        i.version,
      ),
    "P0001",
  );
});
test("null recipients cannot pass normalization or finalization", async () => {
  await fails(
    () =>
      db.query("select private.sp_bill_emails($1)", [JSON.stringify([null])]),
    "P0001",
  );
});
test("late PDF attach archives a fully credited original without dispatch or Jarvis task", async () => {
  let i = await final("100");
  await cmd("invoice.credit", { id: i.id, confirmed: true }, i.version);
  i = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [i.id],
    )
  ).rows[0].result;
  const saved = await attach(i);
  assert.ok(saved.pdf_hash);
  assert.equal(
    (
      await db.query(
        "select count(*) n from public.sp_invoice_dispatches where invoice_id=$1 and status in ('wacht_op_concept','concept_klaar')",
        [i.id],
      )
    ).rows[0].n,
    "0",
  );
  assert.equal(
    (
      await db.query(
        "select count(*) n from public.sp_items where source_ref=$1",
        ["invoice:" + i.id],
      )
    ).rows[0].n,
    "0",
  );
});
test("settings and customers require actual integer JSON payment_days", async () => {
  for (const value of [null, "14", true, 14.5]) {
    const version = (
      await db.query(
        "select version from public.sp_billing_settings where owner_id=$1",
        [owner],
      )
    ).rows[0].version;
    await fails(
      () => cmd("settings.update", { data: { payment_days: value } }, version),
      "P0001",
    );
    await fails(
      () => cmd("customer.create", { data: { payment_days: value } }),
      "P0001",
    );
  }
});
test("replacement after partial credit recalculates independent ordinary invoice VAT", async () => {
  let i = await final("6");
  i = await attach(i);
  await sent(i);
  i = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [i.id],
    )
  ).rows[0].result;
  const l = (
    await db.query(
      "select id from public.sp_invoice_lines where invoice_id=$1",
      [i.id],
    )
  ).rows[0];
  await cmd(
    "invoice.credit",
    {
      id: i.id,
      confirmed: true,
      lines: [{ original_line_id: l.id, net_cents: "3" }],
    },
    i.version,
  );
  i = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [i.id],
    )
  ).rows[0].result;
  const c = await cmd(
    "invoice.correct",
    { id: i.id, confirmed: true },
    i.version,
  );
  let replacement = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [c.replacement_id],
    )
  ).rows[0].result;
  assert.equal(replacement.net_cents, "3");
  assert.equal(replacement.vat_cents, "1");
  const f = await cmd(
    "invoice.finalize",
    { id: replacement.id },
    replacement.version,
  );
  assert.equal(f.vat_cents, "1");
  assert.equal(f.total_cents, "4");
});
test("unfilled optional document fields and recipient placeholders block finalization", async () => {
  const i = await cmd("invoice.create", {
    customer_id: customer.id,
    invoice_on: today,
    service_from: today,
    service_until: today,
    intro: "{{INTRO}}",
    lines: [line("100")],
  });
  await fails(() => cmd("invoice.finalize", { id: i.id }, i.version), "P0001");
  await fails(
    () =>
      db.query("select private.sp_bill_emails($1)", [
        JSON.stringify(["{{EMAIL}}@example.test"]),
      ]),
    "P0001",
  );
});
