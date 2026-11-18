/** Explicit local bootstrap only. Does not use linked-project credentials or production data. */
import pg from "pg";
import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { bootstrapBillingDb } from "./local-bootstrap.mjs";
const db = new pg.Client({
  connectionString: "postgresql://postgres:postgres@127.0.0.1:55322/postgres",
});
await db.connect();
try {
  await bootstrapBillingDb(db);
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
    `NEXT_PUBLIC_SUPABASE_URL=${status.API_URL}\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${status.ANON_KEY}\nSUPABASE_SECRET_KEY=${status.SERVICE_ROLE_KEY}\nBILLING_BASE_URL=http://127.0.0.1:3017\n`,
    { mode: 0o600 },
  );
  console.log(
    "Local synthetic owner and isolated storage ready. Credentials stay in ignored .env.local.",
  );
} finally {
  await db.end();
}
