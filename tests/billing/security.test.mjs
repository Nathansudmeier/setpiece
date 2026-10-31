import test from "node:test";
import assert from "node:assert/strict";
import {
  connect,
  session,
  cmd,
  setup,
  final,
  attached,
  dispatch,
  fails,
  owner,
  buyer,
  line,
} from "./helpers.mjs";
const db = await connect();
let customer, invoice, request;
test.before(async () => {
  await db.query("begin");
  customer = await setup(db);
  invoice = await final(db, customer);
  request = crypto.randomUUID();
  invoice = await cmd(
    db,
    "invoice.prepare_pdf",
    {
      id: invoice.id,
      hash: "a".repeat(64),
      bytes: 100,
      template_version: "setpiece-invoice-v1",
    },
    invoice.version,
    request,
  );
});
test.after(async () => {
  await db.query("rollback");
  await db.end();
});
test("anon cannot read, command, outbox or token RPC", async () => {
  await db.query("set local role anon");
  await session(db, "", "anon");
  for (const sql of [
    "select * from public.sp_invoices",
    "select public.sp_invoice_outbox(null,100)",
    "select public.sp_command('anon-request','invoice.create','{}',null)",
    "select public.sp_invoice_pdf_consume(repeat('a',64))",
  ])
    await fails(db, () => db.query(sql), "42501");
  await db.query("reset role");
  await session(db);
});
test("authenticated has read only, owner/admin required, no consume grant", async () => {
  await db.query("set local role authenticated");
  await session(db);
  assert.ok((await db.query("select * from public.sp_invoices")).rows.length);
  await fails(
    db,
    () => db.query("update public.sp_invoices set notes='x'"),
    "42501",
  );
  await fails(
    db,
    () => db.query("select public.sp_invoice_pdf_consume(repeat('a',64))"),
    "42501",
  );
  await session(db, "11111111-1111-4111-8111-111111111111");
  assert.equal(
    (await db.query("select * from public.sp_invoices")).rows.length,
    0,
  );
  await fails(db, () => cmd(db, "invoice.create", { lines: [] }), "42501");
  await db.query("reset role");
  await session(db);
});
test("revoked admin cannot replay cached human result", async () => {
  await db.query("savepoint revoke_admin");
  await db.query("delete from public.admin_users where user_id=$1", [owner]);
  await fails(
    db,
    () =>
      cmd(
        db,
        "invoice.prepare_pdf",
        {
          id: invoice.id,
          hash: "a".repeat(64),
          bytes: 100,
          template_version: "setpiece-invoice-v1",
        },
        invoice.version,
        request,
      ),
    "42501",
  );
  await db.query("rollback to savepoint revoke_admin");
});
test("connector may create drafts, human commands require session before cache", async () => {
  await db.query("set local role service_role");
  await session(db, "", "service_role");
  const draft = await cmd(db, "invoice.create", { lines: [] });
  assert.equal(draft.status, "concept");
  for (const operation of [
    "settings.update",
    "invoice.finalize",
    "invoice.attach_pdf",
    "invoice.credit",
    "invoice.correct",
    "dispatch.cancel",
    "dispatch.requeue",
    "payment.record",
    "payment.reverse",
  ])
    await fails(db, () => cmd(db, operation, { id: invoice.id }), "42501");
  await fails(
    db,
    () =>
      cmd(
        db,
        "invoice.prepare_pdf",
        {
          id: invoice.id,
          hash: "a".repeat(64),
          bytes: 100,
          template_version: "setpiece-invoice-v1",
        },
        invoice.version,
        request,
      ),
    "42501",
  );
  await db.query("reset role");
  await session(db);
});
test("cross-owner customer, wrong workspace project and inaccessible person rejected", async () => {
  const other = "22222222-2222-4222-8222-222222222222";
  await db.query("insert into auth.users(id) values($1)", [other]);
  await db.query("insert into public.admin_users(user_id) values($1)", [other]);
  await db.query("insert into public.sp_owners(owner_id) values($1)", [other]);
  await session(db, other);
  await fails(
    db,
    () =>
      cmd(db, "invoice.create", { customer_id: customer.id, lines: [line()] }),
    "42501",
  );
  const data = (
    await db.query("select public.sp_billing_read($1,null,100) data", [
      invoice.id,
    ])
  ).rows[0].data;
  assert.equal(data.invoices.length, 0);
  await session(db);
  const project = await cmd(db, "project.create", {
    workspace: "nankaro",
    title: "Synthetisch ander werkgebied",
  });
  await fails(
    db,
    () => cmd(db, "invoice.create", { project_id: project.id, lines: [] }),
    "P0001",
  );
  await fails(
    db,
    () => cmd(db, "customer.create", { data: buyer, person_id: other }),
    "42501",
  );
});
