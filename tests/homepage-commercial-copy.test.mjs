import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage hero and CTAs use concrete commercial copy", () => {
  const home = read("components/workspoor/WorkspoorHome.tsx");
  const nav = read("components/workspoor/WorkspoorHeader.tsx");
  const contact = read("components/workspoor/KansenscanContactForm.tsx");

  assert.match(home, /Maak dagelijks werk/);
  assert.match(home, /AI Consultancy/);
  assert.match(home, /AI-oplossing/);
  assert.match(home, /€ 1\.250 excl\. btw/);
  assert.match(home, /5 werkdagen/);
  assert.match(home, /90-dagenroute/);
  assert.match(home, /1 werkende AI-oplossing/);
  assert.match(home + nav, /Bespreek de kansenscan/);
  assert.match(contact, /Verstuur aanvraag/);
  assert.match(contact, /Liever direct mailen/);
});

test("publieke propositie gebruikt de goedgekeurde dienstenladder", () => {
  const content = read("lib/workspoor-content.ts");

  assert.match(content, /Kansenscan/);
  assert.match(content, /Implementatiesprint/);
  assert.match(content, /Groeipartnerschap/);
  assert.match(content, /€ 1\.250/);
  assert.match(content, /€ 7\.500/);
  assert.match(content, /Vanaf € 2\.250 p\/m/);
  assert.match(content, /AI-workflows/);
});

test("praktijkvoorbeelden tonen beginsituatie, verandering, resultaat en context", () => {
  const page = read("app/praktijkvoorbeelden/page.tsx");
  const content = read("lib/workspoor-content.ts");

  assert.match(page, /Beginsituatie/);
  assert.match(page, /Wat veranderde/);
  assert.match(page, /Resultaat/);
  assert.match(page, /Werkspoor in de praktijk/);
  assert.doesNotMatch(page, /padStart/);
  assert.match(content, /Nankaro/);
  assert.match(content, /Cameranu/);
  assert.match(content, /A\.Vogel/);
  assert.match(content, /Set In/);
  assert.ok(content.indexOf('id: "set-in"') < content.indexOf('id: "nankaro"'));
  assert.match(content, /Tot 80 procent/);
  assert.match(content, /Circa 70 procent/);
});

test("publieke formulieren blijven achter servergrenzen", () => {
  const contact = read("components/workspoor/KansenscanContactForm.tsx");
  const contactRoute = read("app/api/contact/route.ts");
  const intakeRoute = read("app/api/intake/route.ts");

  assert.match(contact, /fetch\("\/api\/contact"/);
  assert.doesNotMatch(contact, /createBrowserClient|\.from\("contact_submissions"\)/);
  assert.match(contact, /Alle velden zijn verplicht/);
  assert.match(contact, /required/);
  assert.match(contactRoute, /consumeRateLimit/);
  assert.match(contactRoute, /verifyTurnstile/);
  assert.match(intakeRoute, /intake_daily_budget/);
  assert.match(intakeRoute, /AbortSignal\.timeout/);
});

test("technische SEO-basis is onderdeel van de App Router", () => {
  const layout = read("app/layout.tsx");
  const routeFocus = read("components/workspoor/RouteFocus.tsx");
  const robots = read("app/robots.ts");
  const sitemap = read("app/sitemap.ts");

  assert.match(layout, /metadataBase/);
  assert.match(layout, /ProfessionalService/);
  assert.match(layout, /RouteFocus/);
  assert.match(routeFocus, /main-content/);
  assert.match(robots, /\/beheer\//);
  assert.match(sitemap, /\/kansenscan/);
  assert.match(sitemap, /\/werkwijze/);
  assert.match(sitemap, /\/praktijkvoorbeelden/);
  assert.match(sitemap, /\/contact/);
  assert.match(layout, /AI Consultancy/);
  assert.match(layout, /AI-oplossingen/);
});

test("de nieuwe visuele wereld en richting zijn duurzaam vastgelegd", () => {
  const design = read("DESIGN.md");
  const product = read("PRODUCT.md");
  const home = read("components/workspoor/WorkspoorHome.tsx");

  assert.match(design, /Het Werkspoor/);
  assert.match(design, /Signal Rose/);
  assert.match(product, /Maak dagelijks werk eenvoudiger en beter/);
  assert.match(home, /THESIS:/);
  assert.match(home, /Richting B/);
  assert.match(home, /Richting C/);
  assert.match(home, /werkcontext-breed\.webp/);

  const scan = read("app/kansenscan/page.tsx");
  const method = read("app/werkwijze/page.tsx");
  assert.match(scan, /kansenscan-werksessie\.webp/);
  assert.match(method, /werkwijze-begrijpen\.webp/);
  assert.match(method, /werkwijze-testen\.webp/);
  assert.match(method, /werkwijze-overdracht\.webp/);
});
