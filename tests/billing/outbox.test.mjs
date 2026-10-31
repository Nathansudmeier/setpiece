import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  connect,
  session,
  cmd,
  setup,
  final,
  attached,
  dispatch,
  fails,
  buyer,
} from "./helpers.mjs";
const db = await connect();
let customer, invoice, d;
test.before(async () => {
  await db.query("begin");
  customer = await setup(db);
  invoice = await attached(db, await final(db, customer));
  d = await dispatch(db, invoice.id);
});
test.after(async () => {
  await db.query("rollback");
  await db.end();
});
test("draft_ready exact replay no extra audit; different draft conflicts", async () => {
  const p = {
    id: d.id,
    gmail_draft_id: "synthetic-draft",
    gmail_thread_id: "synthetic-thread",
  };
  d = await cmd(db, "dispatch.draft_ready", p, d.version);
  const count = (
    await db.query(
      "select count(*) n from public.sp_billing_audit where dispatch_id=$1",
      [d.id],
    )
  ).rows[0].n;
  assert.equal((await cmd(db, "dispatch.draft_ready", p, 0)).id, d.id);
  assert.equal(
    (
      await db.query(
        "select count(*) n from public.sp_billing_audit where dispatch_id=$1",
        [d.id],
      )
    ).rows[0].n,
    count,
  );
  await fails(
    db,
    () =>
      cmd(
        db,
        "dispatch.draft_ready",
        { ...p, gmail_draft_id: "different" },
        d.version,
      ),
    "23505",
  );
});
test("mail sent requires normalized to AND cc, timestamp and unique message evidence", async () => {
  const p = {
    id: d.id,
    recipients: buyer.recipients,
    cc: [],
    sent_at: new Date().toISOString(),
    sent_via: "gmail",
    gmail_message_id: "synthetic-message",
    note: "",
  };
  await fails(db, () => cmd(db, "invoice.mark_sent", p, d.version), "P0001");
  await fails(
    db,
    () =>
      cmd(
        db,
        "invoice.mark_sent",
        { ...p, cc: buyer.cc, sent_at: "2000-01-01T00:00:00Z" },
        d.version,
      ),
    "P0001",
  );
});
test("token not cached; three consumptions, fourth denied; cancellation revokes", async () => {
  const r = (
    await db.query("select public.sp_invoice_pdf_link($1) result", [d.id])
  ).rows[0].result;
  assert.ok(r.authorization.startsWith("Bearer "));
  assert.equal(new URL(r.url).pathname, "/api/factuur-pdf");
  assert.equal(r.url.includes(r.authorization.slice(7)), false);
  const hash = createHash("sha256")
    .update(r.authorization.slice(7))
    .digest("hex");
  assert.equal(
    (
      await db.query(
        "select count(*) n from private.sp_commands where result::text like $1",
        ["%" + r.authorization.slice(7) + "%"],
      )
    ).rows[0].n,
    "0",
  );
  await session(db, "", "service_role");
  for (let n = 0; n < 3; n++)
    assert.ok(
      (
        await db.query("select public.sp_invoice_pdf_consume($1) result", [
          hash,
        ])
      ).rows[0].result,
    );
  assert.equal(
    (await db.query("select public.sp_invoice_pdf_consume($1) result", [hash]))
      .rows[0].result,
    null,
  );
  await session(db);
  const second = (
    await db.query("select public.sp_invoice_pdf_link($1) result", [d.id])
  ).rows[0].result;
  const h = createHash("sha256")
    .update(second.authorization.slice(7))
    .digest("hex");
  d = await cmd(
    db,
    "dispatch.cancel",
    { id: d.id, reason: "Synthetische annulering" },
    d.version,
  );
  await session(db, "", "service_role");
  assert.equal(
    (await db.query("select public.sp_invoice_pdf_consume($1) result", [h]))
      .rows[0].result,
    null,
  );
  await session(db);
  await fails(
    db,
    () =>
      cmd(
        db,
        "dispatch.draft_ready",
        { id: d.id, gmail_draft_id: "late" },
        d.version,
      ),
    "23505",
  );
});
test("cancelled known draft remains discoverable until ack; requeue one active task", async () => {
  let out = (await db.query("select public.sp_invoice_outbox(null,100) result"))
    .rows[0].result;
  assert.ok(
    out.dispatches.some((x) => x.id === d.id && x.status === "geannuleerd"),
  );
  d = await cmd(
    db,
    "dispatch.cancel_ack",
    { id: d.id, note: "Bestaand concept handmatig afgehandeld" },
    d.version,
  );
  out = (await db.query("select public.sp_invoice_outbox(null,100) result"))
    .rows[0].result;
  assert.equal(
    out.dispatches.some((x) => x.id === d.id),
    false,
  );
  const next = await cmd(
    db,
    "dispatch.requeue",
    { id: d.id, confirmed: true },
    d.version,
  );
  assert.notEqual(next.id, d.id);
  assert.equal(
    (
      await db.query(
        "select count(*) n from public.sp_invoice_dispatches where invoice_id=$1 and status<>'geannuleerd'",
        [invoice.id],
      )
    ).rows[0].n,
    "1",
  );
});
test("keyset pagination makes all 105 additional outbox entries reachable", async () => {
  const baseline = Number(
    (
      await db.query(
        "select count(*) n from public.sp_invoice_dispatches where status in ('wacht_op_concept','concept_klaar') or (status='geannuleerd' and gmail_draft_id is not null and cancel_ack_at is null)",
      )
    ).rows[0].n,
  );
  for (let n = 0; n < 105; n++)
    await attached(db, await final(db, customer, "100"));
  const seen = new Set();
  let cursor = null,
    more = true,
    pages = 0;
  while (more) {
    const out = (
      await db.query("select public.sp_invoice_outbox($1,100) result", [cursor])
    ).rows[0].result;
    for (const x of out.dispatches) {
      assert.equal(seen.has(x.id), false);
      seen.add(x.id);
    }
    cursor = out.cursor;
    more = out.has_more;
    pages++;
  }
  assert.equal(seen.size, baseline + 105);
  assert.equal(pages, Math.ceil((baseline + 105) / 100));
});
