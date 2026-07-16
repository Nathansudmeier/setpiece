import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage hero and CTAs use concrete commercial copy", () => {
  const hero = read("components/site/SiteHero.tsx");
  const nav = read("components/site/SiteNav.tsx");
  const contact = read("components/site/SiteContact.tsx");

  assert.match(hero, /Setpiece brengt merk, marketing en uitvoering samen in een helder spelplan/);
  assert.match(hero, /Plan een kennismaking/);
  assert.match(hero, /Bekijk het werk/);
  assert.match(hero, /Recent werk/);
  assert.match(nav, /Plan een kennismaking/);
  assert.doesNotMatch(hero + nav + contact, /Trap af →/);
  assert.match(contact, /Vertel waar het schuurt en wat je wilt bereiken/);
  assert.match(contact, /Verstuur bericht/);
  assert.match(contact, /Liever direct mailen\?/);
});

test("homepage services include buyable propositions and audience qualification", () => {
  const services = read("components/site/SiteServices.tsx");

  assert.match(services, /Waar Setpiece bij helpt/);
  assert.match(services, /Positioneringssprint/);
  assert.match(services, /Campagnekompas/);
  assert.match(services, /AI-transitieplan/);
  assert.match(services, /Voor organisaties die scherper willen spelen/);
  assert.match(services, /Je verhaal is goed, maar nog niet scherp genoeg/);
  assert.match(services, /Niet ideaal als je alleen/);
});

test("homepage cases read as concrete mini stories", () => {
  const cases = read("components/site/SiteCases.tsx");

  assert.match(cases, /Set In: een AI-werkomgeving die hun taal spreekt/);
  assert.match(cases, /MV Artemis: van ambitie naar herkenbare clubidentiteit/);
  assert.match(cases, /Nankaro: van idee naar digitaal clubplatform/);
  assert.match(cases, /Probleem/);
  assert.match(cases, /Aanpak/);
  assert.match(cases, /Output/);
  assert.match(cases, /Lees case/);
});

test("publieke formulieren blijven achter servergrenzen", () => {
  const contact = read("components/site/SiteContact.tsx");
  const contactRoute = read("app/api/contact/route.ts");
  const intakeRoute = read("app/api/intake/route.ts");

  assert.match(contact, /fetch\("\/api\/contact"/);
  assert.doesNotMatch(contact, /createBrowserClient|\.from\("contact_submissions"\)/);
  assert.match(contactRoute, /consumeRateLimit/);
  assert.match(contactRoute, /verifyTurnstile/);
  assert.match(intakeRoute, /intake_daily_budget/);
  assert.match(intakeRoute, /AbortSignal\.timeout/);
});

test("technische SEO-basis is onderdeel van de App Router", () => {
  const layout = read("app/layout.tsx");
  const robots = read("app/robots.ts");
  const sitemap = read("app/sitemap.ts");

  assert.match(layout, /metadataBase/);
  assert.match(layout, /ProfessionalService/);
  assert.match(robots, /\/beheer\//);
  assert.match(sitemap, /\/cases\/mv-artemis/);
});

test("homepage testimonial has credible role context", () => {
  const testimonial = read("components/site/SiteTestimonial.tsx");

  assert.match(testimonial, /Bestuurslid, sportorganisatie/);
  assert.match(testimonial, /het hele bestuur zelf kon uitleggen/);
});
