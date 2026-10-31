import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { unzipSync, strFromU8 } from "fflate";
import { connect, seller, buyer, today } from "../../tests/billing/helpers.mjs";
const base = "http://127.0.0.1:3017",
  dir = "docs/acceptatie/facturatie";
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true }),
  context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  }),
  page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const db = await connect(),
  name = "Browseracceptatie " + crypto.randomUUID().slice(0, 8);
async function post(click) {
  await Promise.all([
    page.waitForResponse(
      (r) => r.request().method() === "POST" && r.status() === 200,
    ),
    click(),
  ]);
  await page
    .getByRole("status")
    .filter({ hasText: "Opgeslagen." })
    .waitFor()
    .catch(() => {});
}
async function shot(label) {
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.screenshot({
      path: `${dir}/${label}-${width}.png`,
      fullPage: true,
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `${label} ${width}: page overflow`,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
}
await page.goto(base + "/beheer/login");
await page
  .getByLabel("E-mail", { exact: true })
  .fill("billing-owner@example.test");
await page
  .getByLabel("Wachtwoord", { exact: true })
  .fill("Local-Billing-Only-2026!");
await page.getByRole("button", { name: "Log in", exact: true }).click();
await page.waitForURL(/\/beheer$/);
await page.goto(base + "/beheer/facturen/instellingen");
const settingsForms = page.locator("form.bw-bill-section");
for (const [index, keys] of [
  ["name", "street", "postal_code", "city", "country", "vat_id", "kvk"],
  ["iban", "account_holder", "payment_days"],
  ["prefix"],
  ["mail_subject", "mail_body"],
].entries()) {
  const form = settingsForms.nth(index);
  for (const key of keys)
    await form.locator("#" + key).fill(String(seller[key]));
  await post(() => form.getByRole("button", { name: /Bewaar/ }).click());
}
await page.goto(base + "/beheer/facturen/klanten");
for (const [key, value] of Object.entries({ ...buyer, name })) {
  const locator = page.locator("#customer-" + key);
  if (await locator.count()) await locator.fill(String(value));
}
await page.locator("#customer-to").fill(buyer.recipients.join(", "));
await page.locator("#customer-cc").fill(buyer.cc.join(", "));
await page.locator("#customer-days").fill("14");
await page.getByRole("checkbox", { name: /Ik heb de juridische/ }).check();
await page.getByRole("button", { name: "Bewaar klant", exact: true }).click();
await page.waitForURL(/klanten\?id=/);
await page
  .getByRole("heading", { name: "Klant bewerken", exact: true })
  .waitFor();
await page.goto(base + "/beheer/facturen/nieuw");
await page
  .getByLabel("Factuurklant", { exact: true })
  .selectOption({ label: name });
await page.getByLabel("Dienst vanaf", { exact: true }).fill(today);
await page.getByLabel("Tot en met", { exact: true }).fill(today);
await page
  .getByLabel("Omschrijving", { exact: true })
  .fill("Synthetische wervingscampagne: controle van volledige facturatieflow");
await page.getByLabel("Prijs excl. btw (€)", { exact: true }).fill("1.969,50");
await page
  .getByLabel("Referentie / offerte", { exact: true })
  .fill("SYNTHETIC-ACCEPTANCE");
await shot("editor");
await page
  .getByRole("button", { name: "Opslaan als concept", exact: true })
  .click();
await page.waitForURL(/facturen\/[0-9a-f-]+$/);
await page
  .getByRole("heading", { name: "Conceptfactuur", exact: true })
  .waitFor();
const invoicePath = new URL(page.url()).pathname,
  invoiceId = invoicePath.split("/").at(-1);
await page
  .getByLabel("Interne notitie", { exact: true })
  .fill("Synthetische browsertest; geen echte klant of Gmail-actie.");
assert.equal(
  await page
    .getByRole("button", { name: "Maak definitief", exact: true })
    .isDisabled(),
  true,
);
await post(() =>
  page
    .getByRole("button", { name: "Opslaan als concept", exact: true })
    .click(),
);
const concept = await context.request.get(
  base + invoicePath + "/pdf?concept=1",
);
assert.equal(concept.status(), 200);
writeFileSync(dir + "/concept.pdf", await concept.body());
assert.equal(
  (
    await db.query("select pdf_path from public.sp_invoices where id=$1", [
      invoiceId,
    ])
  ).rows[0].pdf_path,
  null,
);
await page
  .getByRole("button", { name: "Maak definitief", exact: true })
  .click();
await page
  .getByRole("button", { name: "Bevestig definitief maken", exact: true })
  .click();
await page.getByRole("button", { name: "PDF maken", exact: true }).waitFor();
await page.getByRole("button", { name: "PDF maken", exact: true }).click();
await page
  .getByRole("link", { name: "Download en controleer PDF", exact: true })
  .waitFor({ timeout: 30000 });
const pdf = await context.request.get(base + invoicePath + "/pdf");
assert.equal(pdf.status(), 200);
const pdfBytes = await pdf.body();
const row = (
  await db.query("select pdf_hash,number from public.sp_invoices where id=$1", [
    invoiceId,
  ])
).rows[0];
assert.equal(createHash("sha256").update(pdfBytes).digest("hex"), row.pdf_hash);
writeFileSync(dir + "/browser-factuur.pdf", pdfBytes);
await shot("detail");
await page.getByLabel("Ontvangen bedrag (€)", { exact: true }).fill("1.000,00");
await page
  .getByRole("button", { name: "Bewaar ontvangst", exact: true })
  .click();
await page.getByText("Deels betaald", { exact: true }).first().waitFor();
await page.getByText("Markeer als verstuurd", { exact: true }).click();
await page
  .getByLabel("Notitie over de daadwerkelijke verzending", { exact: true })
  .fill("SYNTHETIC: simulated manual send evidence, no external message.");
const future = new Date(Date.now() + 3000);
const local = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Amsterdam",
  dateStyle: "short",
  timeStyle: "medium",
})
  .format(future)
  .replace(" ", "T");
await page
  .getByLabel("Werkelijk verzendmoment (Europe/Amsterdam)", { exact: true })
  .fill(local);
await page
  .getByRole("button", { name: "Bevestig echte verzending", exact: true })
  .click();
await page.getByText(/Verzending geregistreerd op/).waitFor();
await page.getByText("Ontvangst terugdraaien", { exact: true }).click();
const reverse = page.locator("form").filter({
  has: page.getByRole("button", {
    name: "Bevestig terugdraaien",
    exact: true,
  }),
});
await reverse
  .getByLabel("Reden", { exact: true })
  .fill("Synthetische correctie van de boeking");
await reverse
  .getByRole("button", { name: "Bevestig terugdraaien", exact: true })
  .click();
await page
  .getByText("Synthetische correctie van de boeking", { exact: true })
  .waitFor();
await page.getByLabel("Ontvangen bedrag (€)", { exact: true }).fill("2.500,00");
await page
  .getByRole("checkbox", { name: /Ik bevestig eventuele overbetaling/ })
  .check();
await page
  .getByRole("button", { name: "Bewaar ontvangst", exact: true })
  .click();
await page.getByText("Klanttegoed", { exact: true }).first().waitFor();
await page
  .getByRole("button", { name: "Maak creditfactuur", exact: true })
  .click();
await page.getByLabel(/^Deelcredit excl. btw/).fill("500,00");
await page
  .getByRole("button", { name: "Bevestig credit definitief", exact: true })
  .click();
await page.waitForURL((url) => url.pathname !== invoicePath);
await page.getByRole("button", { name: "PDF maken", exact: true }).click();
await page
  .getByRole("link", { name: "Download en controleer PDF", exact: true })
  .waitFor();
await page.goto(base + invoicePath);
await page.getByRole("button", { name: "Corrigeer", exact: true }).click();
await page
  .getByRole("button", {
    name: "Bevestig credit en nieuw concept",
    exact: true,
  })
  .click();
await page.waitForURL((url) => url.pathname !== invoicePath);
await page.getByRole("button", { name: "PDF maken", exact: true }).click();
await page
  .getByRole("link", { name: "Download en controleer PDF", exact: true })
  .waitFor();
await page
  .getByRole("link", { name: "Gekoppeld concept", exact: true })
  .click();
await page
  .getByRole("heading", { name: "Conceptfactuur", exact: true })
  .waitFor();
await page.goto(base + "/beheer/facturen?q=" + encodeURIComponent(name));
await shot("lijst");
const exportResponse = await context.request.get(
  base + "/beheer/facturen/export?q=" + encodeURIComponent(name),
);
assert.equal(exportResponse.status(), 200);
const archive = await exportResponse.body();
writeFileSync(dir + "/synthetisch-archief.zip", archive);
const files = unzipSync(archive),
  manifest = JSON.parse(strFromU8(files["manifest.json"]));
assert.equal(manifest.length, 4);
for (const entry of manifest.filter((m) => m.path))
  assert.equal(
    createHash("sha256").update(files[entry.path]).digest("hex"),
    entry.sha256,
  );
for (const route of [
  "/beheer/projecten",
  "/beheer/acties",
  "/beheer/website",
  "/",
]) {
  await page.goto(base + route);
  assert.ok((await page.locator("h1").count()) >= 1);
}
const anon = await browser.newContext();
const response = await anon.request.get(base + invoicePath + "/pdf", {
  maxRedirects: 0,
});
assert.ok([303, 307].includes(response.status()));
assert.equal(
  (await anon.request.head(base + "/api/factuur-pdf")).status(),
  404,
);
await anon.close();
const report = {
  invoice_id: invoiceId,
  invoice_number: row.number,
  screenshots: ["editor", "detail", "lijst"].flatMap((s) =>
    [390, 768, 1024, 1440].map((w) => `${s}-${w}.png`),
  ),
  manifest_documents: manifest.length,
  pdf_hash_verified: true,
  manual_send: "SIMULATED synthetic evidence; no Gmail action",
  page_errors: errors,
};
writeFileSync(dir + "/browser-resultaat.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
await db.end();
await browser.close();
