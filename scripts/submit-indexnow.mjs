import { readFile, readdir } from "node:fs/promises";

// Run after production publication, with only the changed public paths.
const origin = "https://www.setpiece.nl";
const paths = process.argv.slice(2);
if (!paths.length || paths.some(path => !path.startsWith("/") || path.startsWith("//") || /[?#]/.test(path) || /^\/(beheer|api)(\/|$)/.test(path))) {
  throw new Error("Provide changed public paths, for example: node scripts/submit-indexnow.mjs /diensten /kennis");
}
const files = (await readdir(new URL("../public/", import.meta.url))).filter(name => /^[a-f0-9]{32}\.txt$/.test(name));
if (files.length !== 1) throw new Error("Expected exactly one IndexNow verification file");
const key = (await readFile(new URL(`../public/${files[0]}`, import.meta.url), "utf8")).trim();
const keyLocation = `${origin}/${files[0]}`;
const hosted = await fetch(keyLocation, { signal: AbortSignal.timeout(15000) });
if (!hosted.ok || (await hosted.text()).trim() !== key) throw new Error("Production ownership file is not available");
const urlList = [...new Set(paths.map(path => new URL(path, origin).toString()))];
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: "www.setpiece.nl", key, keyLocation, urlList }),
  signal: AbortSignal.timeout(30000),
});
console.log(JSON.stringify({ status: response.status, urls: urlList, meaning: response.status === 200 ? "Received; indexing is not guaranteed" : response.status === 202 ? "Received; ownership verification pending" : "Submission failed" }, null, 2));
if (![200, 202].includes(response.status)) process.exitCode = 1;
