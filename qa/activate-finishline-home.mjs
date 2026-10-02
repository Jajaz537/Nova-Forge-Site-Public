#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const assetPath = "assets/modaryx-finishline-canon.png";
const fragmentPath = "docs/fragments/true-finishline-home-hero.html";
const indexPath = "index.html";
const expectedHash = "141f90dd3ab403627a8279db8c66c2e9711ad88771b359c1ea4ce26c212ed81e";

const fail = (message) => {
  console.error("FAIL: " + message);
  process.exit(1);
};

if (!existsSync(assetPath)) fail("canonical asset is missing");
const actualHash = createHash("sha256").update(readFileSync(assetPath)).digest("hex");
if (actualHash !== expectedHash) fail("canonical asset hash mismatch; homepage activation refused");

const fragmentRaw = readFileSync(fragmentPath, "utf8");
const fragment = fragmentRaw
  .replace(/^<!--[\s\S]*?-->\s*/m, "")
  .trim();

if (!fragment.includes("modaryx-finishline-canon.png")) {
  fail("canonical fragment reference is missing");
}
if (!fragment.includes('class="mx-finishline-hero"')) {
  fail("canonical fragment root class is missing");
}

let html = readFileSync(indexPath, "utf8");

const legacyStart = '<section class="hero modaryx-realm-hero" id="top" aria-labelledby="hero-title">';
const nextSection = '    <div class="trust-rail" aria-label="Garanties publiques">';
const start = html.indexOf(legacyStart);
const end = html.indexOf(nextSection);

if (html.includes('class="mx-finishline-hero"')) {
  console.log("PASS: canonical Finish Line homepage hero is already active.");
  process.exit(0);
}
if (start < 0 || end < 0 || end <= start) {
  fail("legacy homepage hero envelope could not be identified safely");
}

html = html.slice(0, start) + fragment + "\n\n" + html.slice(end);

html = html.replace(
  /\s*<link rel="preload" as="image" href="\.\/assets\/modaryx-wolf-dragon-hero\.webp" fetchpriority="high">\n/,
  '\n  <link rel="preload" as="image" href="./assets/modaryx-finishline-canon.png" fetchpriority="high">\n'
);

const heroSlice = html.slice(
  html.indexOf('class="mx-finishline-hero"'),
  html.indexOf(nextSection)
);
for (const forbidden of [
  "modaryx-wolf-dragon-hero",
  "modaryx-realm-canon-hero--PR154.png",
]) {
  if (heroSlice.includes(forbidden)) {
    fail("legacy visual survived inside activated hero: " + forbidden);
  }
}

writeFileSync(indexPath, html, "utf8");
console.log("PASS: canonical MODARYX Finish Line homepage hero activated.");
