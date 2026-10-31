/** Explicit local bootstrap only. Does not use linked-project credentials or production data. */
import pg from "pg";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const url = "postgresql://postgres:postgres@127.0.0.1:55322/postgres";
const db = new pg.Client({ connectionString: url });
await db.connect();
const exists = (
  await db.query("select to_regclass('public.sp_invoices') existing")
).rows[0].existing;
if (exists)
  throw new Error(
    "Billing schema already exists. No reset or destructive cleanup is performed.",
  );
const baseExists = (
  await db.query("select to_regclass('public.sp_items') existing")
).rows[0].existing;
if (!baseExists)
  await db.query(`create schema if not exists private; create or replace function public.rls_auto_enable() returns event_trigger language plpgsql as $$begin end$$;
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change_token_new,email_change)
values('675024a7-62f2-4eac-ba25-9718bb362e74','00000000-0000-0000-0000-000000000000','authenticated','authenticated','billing-owner@example.test',extensions.crypt('Local-Billing-Only-2026!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
insert into auth.identities(id,user_id,provider_id,identity_data,provider,created_at,updated_at) values(gen_random_uuid(),'675024a7-62f2-4eac-ba25-9718bb362e74','675024a7-62f2-4eac-ba25-9718bb362e74','{"sub":"675024a7-62f2-4eac-ba25-9718bb362e74","email":"billing-owner@example.test"}','email',now(),now());`);
for (const file of readdirSync("supabase/migrations")
  .filter(
    (f) =>
      f.endsWith(".sql") && (!baseExists || f.includes("setpiece_billing")),
  )
  .sort()) {
  await db.query(readFileSync("supabase/migrations/" + file, "utf8"));
  process.stdout.write("Applied locally: " + file + "\n");
}
await db.query(
  "grant select on public.admin_users,public.contact_submissions to authenticated; insert into public.admin_users(user_id) values('675024a7-62f2-4eac-ba25-9718bb362e74'); insert into private.sp_billing_deployment values(true,'http://localhost:3017')",
);
const status = JSON.parse(
  execFileSync("supabase", ["status", "-o", "json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }),
);
if (status.API_URL !== "http://127.0.0.1:55321")
  throw new Error("Unexpected local endpoint");
writeFileSync(
  ".env.local",
  `NEXT_PUBLIC_SUPABASE_URL=${status.API_URL}\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${status.ANON_KEY}\nSUPABASE_SECRET_KEY=${status.SERVICE_ROLE_KEY}\nBILLING_BASE_URL=http://localhost:3017\n`,
  { mode: 0o600 },
);
console.log(
  "Local synthetic owner and isolated storage ready. Credentials stay in ignored .env.local.",
);
await db.end();
