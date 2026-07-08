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
  assert.match(hero, /Vertrouwd door organisaties in sport, onderwijs, retail en zakelijke dienstverlening/);
  assert.match(nav, /Plan een kennismaking/);
  assert.doesNotMatch(hero + nav + contact, /Trap af →/);
  assert.match(contact, /Vertel kort waar je staat, waar het schuurt en wat je wilt bereiken/);
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

  assert.match(cases, /Setin: van losse content naar commerciële motor/);
  assert.match(cases, /MV Artemis: van ambitie naar herkenbare clubidentiteit/);
  assert.match(cases, /Nankaro: van idee naar digitaal clubplatform/);
  assert.match(cases, /Probleem/);
  assert.match(cases, /Aanpak/);
  assert.match(cases, /Output/);
  assert.match(cases, /Lees case/);
});

test("homepage testimonial has credible role context", () => {
  const testimonial = read("components/site/SiteTestimonial.tsx");

  assert.match(testimonial, /Bestuurslid, sportorganisatie/);
  assert.match(testimonial, /het hele bestuur zelf kon uitleggen/);
});
