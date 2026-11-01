import test from "node:test";
import assert from "node:assert/strict";
import { connect, owner } from "./helpers.mjs";
const db = await connect();
test.after(() => db.end());
const allocate = async (c, year, prefix = "F") =>
  (
    await c.query("select private.sp_bill_next_number($1,$2,$3) result", [
      owner,
      year,
      prefix,
    ])
  ).rows[0].result;
async function unusedYear() {
  return (
    await db.query(
      "select yr from generate_series(2050,2198) yr where not exists(select 1 from private.sp_billing_counters where owner_id=$1 and year=yr) order by yr limit 1",
      [owner],
    )
  ).rows[0].yr;
}
test("year boundary, prefix changes and 10000 do not reset or truncate numbering", async () => {
  await db.query("begin");
  try {
    const yr = await unusedYear();
    assert.equal((await allocate(db, yr)).number, `F${yr}-0001`);
    assert.equal((await allocate(db, yr, "SP")).number, `SP${yr}-0002`);
    assert.equal((await allocate(db, yr + 1)).number, `F${yr + 1}-0001`);
    await db.query(
      "update private.sp_billing_counters set last_value=9999 where owner_id=$1 and year=$2",
      [owner, yr],
    );
    assert.equal((await allocate(db, yr)).number, `F${yr}-10000`);
  } finally {
    await db.query("rollback");
  }
});
test("first counter row initializes safely across two concurrent sessions", async () => {
  const yr = await unusedYear(),
    a = await connect(),
    b = await connect();
  try {
    const rows = await Promise.all([allocate(a, yr), allocate(b, yr)]);
    assert.deepEqual(rows.map((x) => x.value).sort(), ["1", "2"]);
  } finally {
    await a.end();
    await b.end();
  }
});
