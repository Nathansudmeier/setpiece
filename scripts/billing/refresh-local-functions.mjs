// Developer convenience for the isolated database only. Does not record production migration history.
import pg from "pg";
import { readFileSync } from "node:fs";
const db = new pg.Client({
  connectionString: "postgresql://postgres:postgres@127.0.0.1:55322/postgres",
});
await db.connect();
const source = readFileSync(
  "supabase/migrations/20261031134510_setpiece_billing.sql",
  "utf8",
);
const functions = [
  ...source.matchAll(/^create (?:or replace )?function [\s\S]*?\$\$;/gm),
].map((m) =>
  m[0].replace(
    /^create (?:or replace )?function/,
    "create or replace function",
  ),
);
await db.query("begin");
for (const fn of functions) await db.query(fn);
await db.query("commit");
await db.end();
console.log("Refreshed " + functions.length + " local function definitions.");
