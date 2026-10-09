// MODARYX V2: preserve the APPROVED visual/canon world selectors in a
// dedicated, ordered stylesheet. Exact concatenation must equal the original
// styles.css Git blob, or a conscious visual redesign must update this proof.
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import assert from "node:assert/strict";

const base=readFileSync("v2/src/styles.css","utf8");
const world=readFileSync("v2/src/canon-living-world.css","utf8");
const main=readFileSync("v2/src/main.jsx","utf8");
const whole=Buffer.from(base+world,"utf8");
const gitBlob=createHash("sha1").update("blob "+whole.length+"\0").update(whole).digest("hex");
assert.equal(gitBlob,"1383cef718b0151346843769e95d70a1b6eb46d4",
  "Original style rules were modified during world/style separation");
assert.ok(!base.includes("/* Canon-reconciliation candidate:"));
assert.ok(world.startsWith("/* Canon-reconciliation candidate:"));
assert.ok(main.includes('import "./styles.css";\nimport "./canon-living-world.css";\nimport "./product-blue-violet.css";'),
  "Living world import must retain its precise cascade position");
for(const expected of [
  ".canon-reconciled-hero", ".canon-narrative-layer", ".canon-traveler",
  ".canon-companion", ".canon-wolf", ".canon-dragon",
  "[data-season=\"winter\"]", "[data-weather=\"rain\"]",
  "@media (forced-colors:active)"
]){
  assert.ok(world.includes(expected),"Missing protected approved design rule: "+expected);
}
console.log("PASS_V2_LIVING_WORLD_STYLES_EXACT_BLOB",JSON.stringify({
  originalGitBlob:gitBlob,totalOriginalCharacters:base.length+world.length,
  preservedLivingWorldCharacters:world.length
}));
