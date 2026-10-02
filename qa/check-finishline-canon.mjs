#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";

const assetPath = "assets/modaryx-finishline-canon.png";
const fragmentPath = "docs/fragments/true-finishline-home-hero.html";
const cssPath = "assets/modaryx-home-finishline.css";

const expectedHash = "141f90dd3ab403627a8279db8c66c2e9711ad88771b359c1ea4ce26c212ed81e";
const expectedSize = 4231234;

const fail = (message) => {
  console.error("FAIL: " + message);
  process.exit(1);
};

if (!existsSync(assetPath)) {
  fail("exact Finish Line master is absent: " + assetPath);
}

const size = statSync(assetPath).size;
if (size !== expectedSize) {
  fail(`Finish Line master size mismatch. expected=${expectedSize} actual=${size}`);
}

const actualHash = createHash("sha256").update(readFileSync(assetPath)).digest("hex");
if (actualHash !== expectedHash) {
  fail(`Finish Line master hash mismatch. expected=${expectedHash} actual=${actualHash}`);
}

if (!existsSync(fragmentPath)) {
  fail("canonical homepage fragment is absent: " + fragmentPath);
}
const fragment = readFileSync(fragmentPath, "utf8");
if (!fragment.includes("./assets/modaryx-finishline-canon.png")) {
  fail("homepage fragment does not reference the exact canonical asset.");
}
for (const forbidden of [
  "modaryx-wolf-dragon-hero",
  "modaryx-realm-canon-hero--PR154.png",
  "nouveaux design 3.png",
]) {
  if (fragment.includes(forbidden)) {
    fail("legacy or non-canonical visual reference found in homepage fragment: " + forbidden);
  }
}

if (!existsSync(cssPath)) {
  fail("Finish Line stylesheet is absent: " + cssPath);
}
const css = readFileSync(cssPath, "utf8");
for (const selector of [".mx-finishline-hero", ".mx-finishline-hero__art", ".mx-finishline-portals"]) {
  if (!css.includes(selector)) {
    fail("Finish Line stylesheet is missing selector: " + selector);
  }
}

console.log("PASS: exact MODARYX Finish Line master and dormant homepage scaffold verified.");
console.log("sha256=" + actualHash + " size=" + size);
