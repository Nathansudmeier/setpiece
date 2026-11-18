import { chromium } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  connect,
  session,
  cmd,
  line,
  today,
  owner,
} from "../../tests/billing/helpers.mjs";
const dir = "docs/acceptatie/facturatie",
  base = "http://127.0.0.1:3017",
  acceptance = JSON.parse(
    readFileSync(dir + "/browser-resultaat.json", "utf8"),
  );
const browser = await chromium.launch({ channel: "chrome", headless: true }),
  context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  }),
  page = await context.newPage(),
  db = await connect();
await session(db);
await page.goto(base + "/beheer/login");
await page.locator("#login-email").fill("billing-owner@example.test");
await page.locator("#login-password").fill("Local-Billing-Only-2026!");
await page.getByRole("button", { name: "Log in", exact: true }).click();
await page.waitForURL(/\/beheer$/);
const customer = (
  await db.query("select customer_id id from public.sp_invoices where id=$1", [
    acceptance.invoice_id,
  ])
).rows[0];
const payload = {
  customer_id: customer.id,
  invoice_on: today,
  service_from: today,
  service_until: today,
  lines: [line("100")],
  notes: "State test",
};
const initial = await cmd(db, "invoice.create", payload);
const checks = [];
await page.goto(base + "/beheer/facturen/klanten");
await page.getByLabel("Cc (optioneel)", { exact: true }).fill("ongeldig-adres");
await page.getByRole("button", { name: "Bewaar klant", exact: true }).click();
await page.locator('.bw-bill [role="alert"]').waitFor();
assert.equal(
  await page
    .getByLabel("Cc (optioneel)", { exact: true })
    .getAttribute("aria-invalid"),
  "true",
);
assert.equal(
  await page
    .getByLabel("Factuurontvangers", { exact: true })
    .getAttribute("aria-invalid"),
  null,
);
for (const width of [390, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  await page
    .getByLabel("Cc (optioneel)", { exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `${dir}/klant-cc-fout-${width}.png`,
    fullPage: false,
  });
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page
  .getByLabel("Cc (optioneel)", { exact: true })
  .fill("test@example.test");
assert.equal(
  await page
    .getByLabel("Cc (optioneel)", { exact: true })
    .getAttribute("aria-invalid"),
  null,
);
await page
  .getByLabel("Factuurontvangers", { exact: true })
  .fill(
    Array.from({ length: 11 }, (_, n) => `test${n}@example.test`).join(","),
  );
assert.equal(
  await page
    .getByLabel("Factuurontvangers", { exact: true })
    .getAttribute("aria-invalid"),
  "true",
);
await page
  .getByLabel("Factuurontvangers", { exact: true })
  .fill("test@example.test");
assert.equal(
  await page
    .getByLabel("Factuurontvangers", { exact: true })
    .getAttribute("aria-invalid"),
  null,
);
assert.equal(await page.locator('.bw-bill [role="alert"]').count(), 0);
checks.push(
  "To and Cc errors belong to the correct field and clear as input becomes valid",
);
await page.goto(base + "/beheer/facturen/nieuw");
await page.getByLabel("Prijs excl. btw (€)", { exact: true }).fill("1e3");
await page
  .getByRole("button", { name: "Opslaan als concept", exact: true })
  .click();
await page.locator('.bw-bill [role="alert"]').waitFor();
assert.equal(
  await page
    .locator('.bw-bill [role="alert"]')
    .evaluate((e) => e === document.activeElement),
  true,
);
assert.equal(
  await page
    .getByLabel("Prijs excl. btw (€)", { exact: true })
    .getAttribute("aria-invalid"),
  "true",
);
await page.getByLabel("Prijs excl. btw (€)", { exact: true }).fill("100,00");
assert.equal(
  await page
    .getByLabel("Prijs excl. btw (€)", { exact: true })
    .getAttribute("aria-invalid"),
  null,
);
checks.push("field error, error summary focus and recovery");
await page.goto(base + "/beheer/facturen/" + initial.id);
await page
  .getByLabel("Interne notitie", { exact: true })
  .fill("Invoer blijft behouden bij conflict");
await cmd(
  db,
  "invoice.update",
  { ...payload, id: initial.id, notes: "Andere actuele versie" },
  initial.version,
);
await page
  .getByRole("button", { name: "Opslaan als concept", exact: true })
  .click();
await page
  .getByRole("alert")
  .filter({ hasText: "intussen gewijzigd" })
  .waitFor();
assert.equal(
  await page.getByLabel("Interne notitie", { exact: true }).inputValue(),
  "Invoer blijft behouden bij conflict",
);
assert.equal(
  await page
    .locator('.bw-bill [role="alert"]')
    .evaluate((e) => e === document.activeElement),
  true,
);
checks.push("PT409 keeps local input and focuses recovery");
await page.screenshot({ path: dir + "/versieconflict.png", fullPage: false });
await page.goto(base + "/beheer/facturen/nieuw");
await page
  .getByLabel("Interne notitie", { exact: true })
  .fill("Rapid double submit");
let posts = 0;
const count = (r) => {
  if (
    r.method() === "POST" &&
    new URL(r.url()).pathname === "/beheer/facturen/nieuw"
  )
    posts++;
};
page.on("request", count);
await page
  .getByRole("button", { name: "Opslaan als concept", exact: true })
  .evaluate((b) => {
    b.click();
    b.click();
  });
await page.waitForURL(/facturen\/[0-9a-f-]+$/);
page.off("request", count);
assert.equal(posts, 1);
checks.push("rapid double submit produces one POST");
const uncertainId = new URL(page.url()).pathname.split("/").at(-1),
  current = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [uncertainId],
    )
  ).rows[0].result;
await page
  .getByLabel("Interne notitie", { exact: true })
  .fill("A: local input after lost response");
let intercepted = false;
await page.route("**/beheer/facturen/" + uncertainId, async (route) => {
  if (route.request().method() !== "POST" || intercepted)
    return route.continue();
  intercepted = true;
  await route.fetch();
  const saved = (
    await db.query(
      "select private.sp_bill_invoice_json(i) result from public.sp_invoices i where id=$1",
      [uncertainId],
    )
  ).rows[0].result;
  const savedLines = (
    await db.query(
      "select private.sp_bill_line_json(l) result from public.sp_invoice_lines l where invoice_id=$1 and active",
      [uncertainId],
    )
  ).rows.map((r) => r.result);
  await cmd(
    db,
    "invoice.update",
    {
      id: uncertainId,
      customer_id: saved.customer_id,
      project_id: saved.project_id,
      invoice_on: saved.invoice_on,
      service_from: saved.service_from,
      service_until: saved.service_until,
      service_kind: saved.service_kind,
      payment_days: saved.payment_days,
      reference: saved.reference,
      intro: saved.intro,
      footer: saved.footer,
      notes: "B: later independent edit",
      lines: savedLines.map((l) => ({
        id: l.id,
        description: l.description,
        quantity: l.quantity,
        unit: l.unit,
        unit_price_cents: l.unit_price_cents,
        vat_code: l.vat_code,
        tax_treatment: l.tax_treatment,
      })),
    },
    saved.version,
  );
  await route.abort("failed");
});
await page
  .getByRole("button", { name: "Opslaan als concept", exact: true })
  .click();
await page
  .getByRole("alert")
  .filter({ hasText: "intussen gewijzigd" })
  .waitFor({ timeout: 30000 });
assert.equal(
  await page.getByLabel("Interne notitie", { exact: true }).inputValue(),
  "A: local input after lost response",
);
assert.equal(
  (
    await db.query("select notes from public.sp_invoices where id=$1", [
      uncertainId,
    ])
  ).rows[0].notes,
  "B: later independent edit",
);
await page.unroute("**/beheer/facturen/" + uncertainId);
checks.push(
  "lost response plus later edit cannot adopt new version or overwrite",
);
assert.ok(current.version > 0);
await page.goto(
  base + "/beheer/facturen?q=empty-filter-" + crypto.randomUUID(),
);
await page
  .getByRole("heading", { name: "Geen facturen in deze selectie", exact: true })
  .waitFor();
checks.push("empty filter has recovery");
await page.screenshot({ path: dir + "/leeg-filter.png", fullPage: false });
await page.goto(base + "/beheer/facturen");
await page.keyboard.press("Tab");
const skip = page.locator(".bw-skip");
await skip.focus();
await page.keyboard.press("Enter");
assert.equal(await page.evaluate(() => location.hash), "#main-content");
checks.push("keyboard skiplink works");
const axe = [];
for (const width of [390, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const route of [
    "/beheer/facturen",
    "/beheer/facturen/" + initial.id,
    "/beheer/facturen/" + acceptance.invoice_id,
    "/beheer/facturen/klanten",
    "/beheer/facturen/instellingen",
  ]) {
    await page.goto(base + route);
    if (route === "/beheer/facturen")
      await page
        .getByRole("link", { name: "Nieuwe factuur", exact: true })
        .waitFor();
    else if (route.endsWith("/klanten"))
      await page
        .getByRole("button", { name: "Bewaar klant", exact: true })
        .waitFor();
    else if (route.endsWith("/instellingen"))
      await page
        .getByRole("heading", { name: "Factuurinstellingen", exact: true })
        .waitFor();
    else if (route.endsWith(initial.id))
      await page
        .getByRole("button", { name: "Opslaan als concept", exact: true })
        .waitFor();
    else
      await page
        .getByRole("heading", {
          name: "Factuur " + acceptance.invoice_number,
          exact: true,
        })
        .waitFor();
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    axe.push({
      route,
      width,
      violations: result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        targets: v.nodes.map((n) => n.target),
      })),
      incomplete: result.incomplete.map((v) => v.id),
    });
  }
}
await page.setViewportSize({ width: 720, height: 500 });
await page.goto(base + "/beheer/facturen");
await page.getByRole("link", { name: "Nieuwe factuur", exact: true }).waitFor();
assert.equal(
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  false,
);
checks.push(
  "720 CSS pixel layout (1440 physical pixels at 200 percent) has no page overflow",
);
// Real HTTP connector transport against a stored synthetic PDF; no Gmail operation.
const dispatch = (
  await db.query(
    "select d.id,i.pdf_hash,i.pdf_path from public.sp_invoice_dispatches d join public.sp_invoices i on i.id=d.invoice_id where i.original_id=$1 and d.status in ('wacht_op_concept','concept_klaar') order by d.created_at limit 1",
    [acceptance.invoice_id],
  )
).rows[0];
assert.ok(dispatch);
const token = (
  await db.query("select public.sp_invoice_pdf_link($1) result", [dispatch.id])
).rows[0].result;
assert.equal(
  (
    await context.request.head(token.url, {
      headers: { Authorization: token.authorization },
    })
  ).status(),
  404,
);
const downloads = await Promise.all(
  Array.from({ length: 6 }, () =>
    context.request.get(token.url, {
      headers: { Authorization: token.authorization },
    }),
  ),
);
assert.equal(downloads.filter((r) => r.status() === 200).length, 3);
assert.equal(downloads.filter((r) => r.status() === 404).length, 3);
for (const r of downloads.filter((r) => r.status() === 200)) {
  assert.equal(
    createHash("sha256")
      .update(await r.body())
      .digest("hex"),
    dispatch.pdf_hash,
  );
  assert.equal(r.headers()["cache-control"], "private, no-store");
  assert.equal(r.headers()["referrer-policy"], "no-referrer");
}
assert.notEqual(
  (
    await context.request.get(
      "http://127.0.0.1:55321/storage/v1/object/public/facturen/" +
        dispatch.pdf_path,
    )
  ).status(),
  200,
);
checks.push(
  "HTTP token HEAD, six concurrent GETs, hash, private headers and private bucket",
);
// A separate synthetic owner proves the true first-use empty state without
// deleting or hiding existing invoices. The helper refuses any non-local DB.
const emptyOwner = crypto.randomUUID(),
  emptyEmail = `empty-${emptyOwner}@example.test`;
await db.query(
  `insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change_token_new,email_change)
select $1,instance_id,aud,role,$2,encrypted_password,now(),raw_app_meta_data,'{}',now(),now(),'','','','' from auth.users where id=$3`,
  [emptyOwner, emptyEmail, owner],
);
await db.query(
  `insert into auth.identities(id,user_id,provider_id,identity_data,provider,created_at,updated_at) values(gen_random_uuid(),$1::uuid,$1::text,jsonb_build_object('sub',$1::text,'email',$2::text),'email',now(),now())`,
  [emptyOwner, emptyEmail],
);
await db.query("insert into public.admin_users(user_id) values($1)", [
  emptyOwner,
]);
await db.query("insert into public.sp_owners(owner_id) values($1)", [
  emptyOwner,
]);
const emptyContext = await browser.newContext(),
  emptyPage = await emptyContext.newPage();
await emptyPage.goto(base + "/beheer/login");
await emptyPage.locator("#login-email").fill(emptyEmail);
await emptyPage.locator("#login-password").fill("Local-Billing-Only-2026!");
await emptyPage.getByRole("button", { name: "Log in", exact: true }).click();
await emptyPage.waitForURL(/\/beheer$/);
await emptyPage.goto(base + "/beheer/facturen");
await emptyPage
  .getByRole("heading", {
    name: "Je eerste factuur begint als concept",
    exact: true,
  })
  .waitFor();
for (const width of [390, 768, 1024, 1440]) {
  await emptyPage.setViewportSize({ width, height: 1000 });
  await emptyPage.evaluate(() => document.fonts.ready);
  await emptyPage.screenshot({
    path: `${dir}/empty-${width}.png`,
    fullPage: false,
  });
  assert.equal(
    await emptyPage.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
}
await emptyContext.close();
checks.push(
  "true first-use empty state with a separate synthetic owner at all four widths",
);
// Read-only DOM artifact for Taste's inspector, which has no authenticated-session option.
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(
  base +
    "/beheer/facturen?q=" +
    encodeURIComponent(
      (
        await db.query(
          "select data->>'name' name from public.sp_customers where id=$1",
          [customer.id],
        )
      ).rows[0].name,
    ),
);
await page.getByRole("link", { name: "Nieuwe factuur", exact: true }).waitFor();
await page.evaluate(() => document.fonts.ready);
// Make the visual-only snapshot self-contained. A different inspection origin
// cannot load Next's font files without CORS, and must not show a fallback font.
const cssLinks = await page
  .locator('link[rel="stylesheet"]')
  .evaluateAll((els) => els.map((e) => e.href));
let snapshotCss = "";
for (const href of cssLinks) {
  let css = await (await context.request.get(href)).text();
  for (const match of [...css.matchAll(/url\(([^)]+)\)/g)]) {
    const src = match[1].trim().replace(/^["']|["']$/g, "");
    if (src.startsWith("data:")) continue;
    const asset = await context.request.get(new URL(src, href).href);
    assert.equal(asset.status(), 200);
    const mime = asset.headers()["content-type"] ?? "application/octet-stream";
    css = css.replace(
      match[0],
      `url("data:${mime};base64,${(await asset.body()).toString("base64")}")`,
    );
  }
  snapshotCss += css;
}
const html = await page.evaluate(() => {
  const copy = document.documentElement.cloneNode(true);
  copy.querySelectorAll("script,nextjs-portal").forEach((e) => e.remove());
  for (const el of copy.querySelectorAll("[src],[href]"))
    for (const key of ["src", "href"]) {
      const value = el.getAttribute(key);
      if (value?.startsWith("/")) el.setAttribute(key, location.origin + value);
    }
  return "<!doctype html>" + copy.outerHTML;
});
writeFileSync(
  "/tmp/setpiece-billing-authenticated-dom.html",
  html
    .replace(/<link[^>]+rel="stylesheet"[^>]*>/g, "")
    .replace("</head>", `<style>${snapshotCss}</style></head>`),
  {
    mode: 0o600,
  },
);
const violations = axe.reduce((n, r) => n + r.violations.length, 0),
  report = {
    checks,
    axe_scans: axe.length,
    axe_violations: violations,
    axe,
    manual_limit:
      "No screen-reader session or native browser zoom automation; 720 CSS pixel reflow checked. Axe incomplete checks still require judgment.",
  };
writeFileSync(
  dir + "/states-en-toegankelijkheid.json",
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify({
    checks: checks.length,
    axe_scans: axe.length,
    axe_violations: violations,
  }),
);
await db.end();
await browser.close();
if (violations) process.exitCode = 1;
