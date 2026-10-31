import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import pg from "pg";
import assert from "node:assert/strict";
import { bootstrapBillingDb } from "./local-bootstrap.mjs";
const folder = mkdtempSync(join(tmpdir(), "setpiece-billing-clean-")),
  project = "setpiece-billing-clean-" + crypto.randomUUID().slice(0, 8);
mkdirSync(join(folder, "supabase"));
let config = readFileSync("supabase/config.toml", "utf8").replace(
  "setpiece-billing-local",
  project,
);
for (const [a, b] of [
  ["55321", "56321"],
  ["55322", "56322"],
  ["55320", "56320"],
  ["55323", "56323"],
  ["55324", "56324"],
  ["55329", "56329"],
])
  config = config.replaceAll(a, b);
writeFileSync(join(folder, "supabase/config.toml"), config);
let started = false;
const db = new pg.Client({
  connectionString: "postgresql://postgres:postgres@127.0.0.1:56322/postgres",
});
try {
  try {
    execFileSync(
      "supabase",
      [
        "start",
        "--workdir",
        folder,
        "-x",
        "studio,realtime,edge-runtime,imgproxy,logflare,vector,mailpit,postgres-meta,supavisor",
      ],
      { stdio: "ignore", timeout: 180000 },
    );
    started = true;
  } catch {
    throw new Error(
      "Clean isolated Supabase start failed. No CLI credentials are printed.",
    );
  }
  await db.connect();
  assert.equal(
    (await db.query("select to_regclass('public.sp_invoices') existing"))
      .rows[0].existing,
    null,
  );
  await bootstrapBillingDb(db);
  const checks = (
    await db.query(
      "select (select count(*) from storage.buckets where id='facturen' and not public and file_size_limit=5242880) bucket, has_table_privilege('authenticated','public.sp_invoices','insert') authenticated_insert, (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where p.proname like 'sp_bill%' or p.proname like 'sp_invoice_%') functions",
    )
  ).rows[0];
  assert.equal(checks.bucket, "1");
  assert.equal(checks.authenticated_insert, false);
  const anonymous = (
    await db.query(
      "select count(*) n from pg_proc p join pg_namespace n on n.oid=p.pronamespace where (p.proname like 'sp_bill%' or p.proname like 'sp_invoice_%') and has_function_privilege('anon',p.oid,'execute')",
    )
  ).rows[0].n;
  assert.equal(anonymous, "0");
  await db.query(
    "select set_config('request.jwt.claim.sub','675024a7-62f2-4eac-ba25-9718bb362e74',false),set_config('request.jwt.claim.role','authenticated',false)",
  );
  await db.query("set role authenticated");
  const read = (
    await db.query("select public.sp_billing_read(null,null,100) result")
  ).rows[0].result;
  assert.equal(read.invoices.length, 0);
  await db.query("reset role");
  const report = {
    project,
    api: "http://127.0.0.1:56321",
    database: "127.0.0.1:56322",
    new_empty_instance: true,
    all_migrations_applied: true,
    anonymous_execute: 0,
    authenticated_insert: false,
    private_bucket: true,
    authenticated_read: true,
    functions: Number(checks.functions),
  };
  writeFileSync(
    "docs/acceptatie/facturatie/schone-installatie.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
} finally {
  await db.end().catch(() => {});
  if (started)
    execFileSync("supabase", ["stop", "--workdir", folder], {
      stdio: "ignore",
      timeout: 60000,
    });
}
