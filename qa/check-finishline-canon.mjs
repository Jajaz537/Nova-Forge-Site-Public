#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const path = "assets/modaryx-finishline-canon.png";
const expected = "141f90dd3ab403627a8279db8c66c2e9711ad88771b359c1ea4ce26c212ed81e";

if (!existsSync(path)) {
  console.error("FAIL: exact Finish Line master is absent: " + path);
  process.exit(1);
}
const actual = createHash("sha256").update(readFileSync(path)).digest("hex");
if (actual !== expected) {
  console.error("FAIL: Finish Line master hash mismatch.");
  console.error("expected=" + expected);
  console.error("actual=" + actual);
  process.exit(1);
}
console.log("PASS: exact MODARYX Finish Line master verified: " + actual);
