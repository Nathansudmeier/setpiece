import test from "node:test";
import assert from "node:assert/strict";
import pg from "pg";
import { readFileSync } from "node:fs";
const url = process.env.BILLING_TEST_DATABASE_URL;
if (
  !url ||
  !/^postgres(?:ql)?:\/\/[^@]+@(?:127\.0\.0\.1|localhost):55322\//.test(url)
)
  throw new Error(
    "Only isolated loopback billing DB on port 55322 is permitted.",
  );
const db = new pg.Client({ connectionString: url });
await db.connect();
test.after(() => db.end());
const owner = "675024a7-62f2-4eac-ba25-9718bb362e74";
async function session(client = db) {
  await client.query(
    "select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role','authenticated',false)",
    [owner],
  );
}
async function command(
  op,
  payload = {},
  version = null,
  request = crypto.randomUUID(),
  client = db,
) {
  return (
    await client.query("select public.sp_command($1,$2,$3,$4) result", [
      request,
      op,
      payload,
      version,
    ])
  ).rows[0].result;
}
const vectors = JSON.parse(
  readFileSync(new URL("./vectors.json", import.meta.url)),
);
for (const v of vectors)
  test("SQL = TS: " + v.name, async () => {
    const r = (
      await db.query("select private.sp_bill_calculate($1) result", [
        JSON.stringify(v.lines),
      ])
    ).rows[0].result;
    for (const k of ["net_cents", "vat_cents", "total_cents"])
      assert.equal(r[k], v[k]);
  });
test("billing schema and outbox are installed", async () => {
  await session();
  const r = await db.query("select public.sp_invoice_outbox(null,100) result");
  assert.ok(Array.isArray(r.rows[0].result.dispatches));
});
export { db, session, command, owner };
