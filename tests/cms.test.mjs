import test from "node:test";
import assert from "node:assert/strict";
import {
  validateCms,
  defaultsFor,
  CMS_SCHEMA,
  CMS_SLUGS,
} from "../lib/cms/schema.ts";
test("alle bestaande paginaonderdelen en bronlinks hebben geldige startinhoud", () => {
  for (const slug of CMS_SLUGS)
    assert.doesNotThrow(() => validateCms(slug, defaultsFor(slug)), slug);
  const source = Object.entries(CMS_SCHEMA.shared.fields).find(([, f]) =>
    f.value.includes("digital-strategy.ec.europa.eu/en/faqs"),
  );
  assert.ok(source);
  assert.equal(source[1].type, "link");
  assert.throws(() =>
    validateCms("shared", {
      ...defaultsFor("shared"),
      [source[0]]: "javascript:alert(1)",
    }),
  );
});
test("CMS accepteert uitsluitend bekende getypeerde velden", () => {
  const x = defaultsFor("home");
  assert.doesNotThrow(() => validateCms("home", x));
  assert.throws(() => validateCms("home", { ...x, injected: "nieuw" }));
  const key = Object.keys(x)[0];
  assert.throws(() => validateCms("home", { ...x, [key]: 123 }));
});
test("CMS weigert uitvoerbare en externe lokale paden", () => {
  const x = defaultsFor("shared");
  const key = Object.keys(x).find((k) => k.startsWith("link_"));
  assert.ok(key);
  assert.throws(() =>
    validateCms("shared", { ...x, [key]: "javascript:alert(1)" }),
  );
  assert.throws(() =>
    validateCms("shared", { ...x, [key]: "//evil.test/path" }),
  );
});
test("CMS verandert bestaande bedragen en claims bij initialisatie niet", () => {
  const all = Object.values(defaultsFor("shared")).join(" ");
  assert.match(all, /€ 1.250/);
  assert.match(all, /€ 7.500/);
  assert.match(all, /€ 2.250/);
  assert.match(all, /80/);
  assert.match(all, /70/);
});
