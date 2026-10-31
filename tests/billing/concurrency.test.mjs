import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  connect,
  session,
  cmd,
  setup,
  draft,
  final,
  attached,
  dispatch,
  buyer,
  owner,
} from "./helpers.mjs";
const db = await connect();
let customer;
test.before(async () => {
  customer = await setup(db);
});
test.after(() => db.end());
async function parallel(fn) {
  const clients = await Promise.all([connect(), connect()]);
  try {
    await Promise.all(clients.map((c) => session(c)));
    return await Promise.allSettled(clients.map(fn));
  } finally {
    await Promise.all(clients.map((c) => c.end()));
  }
}
test("parallel finalizations initialize and lock one counter, unique consecutive numbers", async () => {
  const items = await Promise.all([draft(db, customer), draft(db, customer)]);
  const results = await parallel((c, n) =>
    cmd(c, "invoice.finalize", { id: items[n].id }, items[n].version),
  );
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 2);
  const values = results
    .map((r) => BigInt(r.value.sequence_value))
    .sort((a, b) => (a < b ? -1 : 1));
  assert.equal(values[1] - values[0], 1n);
});
test("same immutable finalize intent from parallel connections has one business result", async () => {
  const i = await draft(db, customer),
    r = crypto.randomUUID();
  const results = await parallel((c) =>
    cmd(c, "invoice.finalize", { id: i.id }, i.version, r),
  );
  assert.equal(results[0].status, "fulfilled");
  assert.equal(results[1].status, "fulfilled");
  assert.equal(results[0].value.number, results[1].value.number);
  assert.equal(
    (
      await db.query(
        "select count(*) n from public.sp_billing_audit where invoice_id=$1 and action='invoice.finalize'",
        [i.id],
      )
    ).rows[0].n,
    "1",
  );
});
test("parallel credit on same remaining scope cannot overcredit", async () => {
  const i = await final(db, customer, "100"),
    result = await parallel((c) =>
      cmd(c, "invoice.credit", { id: i.id, confirmed: true }, i.version),
    );
  assert.equal(result.filter((r) => r.status === "fulfilled").length, 1);
  assert.ok(
    ["PT409", "P0001"].includes(
      result.find((r) => r.status === "rejected").reason.code,
    ),
  );
  assert.equal(
    (
      await db.query(
        "select sum(total_cents) n from public.sp_invoices where original_id=$1",
        [i.id],
      )
    ).rows[0].n,
    "-121",
  );
});
test("parallel payments using one request book once; different stale intent conflicts", async () => {
  const i = await final(db, customer, "100"),
    request = crypto.randomUUID(),
    p = {
      id: i.id,
      received_on: i.invoice_on,
      amount_cents: "121",
      method: "bank",
    };
  const r = await parallel((c) =>
    cmd(c, "payment.record", p, i.version, request),
  );
  assert.equal(r.filter((x) => x.status === "fulfilled").length, 2);
  assert.equal(r[0].value.id, r[1].value.id);
  await assert.rejects(cmd(db, "payment.record", p, i.version), {
    code: "PT409",
  });
});
test("parallel attach produces one active dispatch and task", async () => {
  let i = await final(db, customer, "100");
  i = await cmd(
    db,
    "invoice.prepare_pdf",
    {
      id: i.id,
      hash: "a".repeat(64),
      bytes: 100,
      template_version: "setpiece-invoice-v1",
    },
    i.version,
  );
  const p = {
    id: i.id,
    path: `${owner}/${i.sequence_year}/${i.number}-${i.id}.pdf`,
    hash: "a".repeat(64),
    bytes: 100,
  };
  const r = await parallel((c) => cmd(c, "invoice.attach_pdf", p, i.version));
  assert.equal(r.filter((x) => x.status === "fulfilled").length, 2);
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
test("three-download limit remains atomic across six concurrent requests", async () => {
  const i = await attached(db, await final(db, customer, "100")),
    d = await dispatch(db, i.id),
    r = (await db.query("select public.sp_invoice_pdf_link($1) result", [d.id]))
      .rows[0].result,
    hash = createHash("sha256").update(r.authorization.slice(7)).digest("hex");
  const clients = await Promise.all(Array.from({ length: 6 }, () => connect()));
  try {
    await Promise.all(clients.map((c) => session(c, "", "service_role")));
    const results = await Promise.all(
      clients.map((c) =>
        c.query("select public.sp_invoice_pdf_consume($1) result", [hash]),
      ),
    );
    assert.equal(results.filter((r) => r.rows[0].result).length, 3);
  } finally {
    await Promise.all(clients.map((c) => c.end()));
  }
});
test("parallel mark_sent exact evidence finishes task only once", async () => {
  const i = await attached(db, await final(db, customer, "100")),
    d = await dispatch(db, i.id),
    p = {
      id: d.id,
      recipients: buyer.recipients,
      cc: buyer.cc,
      sent_via: "gmail",
      sent_at: new Date().toISOString(),
      gmail_message_id: crypto.randomUUID(),
      note: "",
    };
  const r = await parallel((c) => cmd(c, "invoice.mark_sent", p, d.version));
  assert.equal(r.filter((x) => x.status === "fulfilled").length, 2);
  assert.equal(
    (
      await db.query(
        "select count(*) n from public.sp_billing_audit where dispatch_id=$1 and action='invoice.mark_sent'",
        [d.id],
      )
    ).rows[0].n,
    "1",
  );
  await assert.rejects(
    cmd(
      db,
      "invoice.mark_sent",
      { ...p, gmail_message_id: "different" },
      d.version,
    ),
    { code: "23505" },
  );
});
