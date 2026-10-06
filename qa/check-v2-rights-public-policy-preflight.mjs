import assert from "node:assert/strict";
import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-rights-public-policy-preflight.json","utf8"));
assert.equal(d.status,"PUBLIC_POLICY_PREFLIGHT_NON_AUTHORIZING");
assert.equal(d.scope,"DEMONSTRATION_CATALOG_ONLY");
assert.equal(d.games.length,3);
for(const game of d.games){
  assert.equal(game.authorizes,false,game.gameId+" must not authorize");
  assert.ok(Array.isArray(game.sources)&&game.sources.length>=2,game.gameId+" source evidence missing");
  assert.ok(Array.isArray(game.observedPublicRules)&&game.observedPublicRules.length>=3,game.gameId+" policy observations missing");
  for(const raw of game.sources){
    const url=new URL(raw);
    assert.equal(url.protocol,"https:");
    const host=url.hostname;
    const ok=["bethesda.net","cdprojektred.com","minecraft.net"].some(domain=>host===domain||host.endsWith("."+domain));
    assert.ok(ok,game.gameId+" non-official domain "+host);
  }
  assert.match(game.preflight,/(REQUIRED|NOT_PROVEN|REVIEW|PARTNERSHIP)/);
}
const inv=new Set(d.invariants||[]);
for(const x of [
  "PUBLIC_GUIDELINES_ARE_NOT_PUBLISHER_SPECIFIC_PERMISSION_TO_MODARYX",
  "NO_GAME_POLICY_ENTRY_AUTHORIZES","NO_SILENCE_EQUALS_PERMISSION",
  "LEGAL_INTERPRETATION_REMAINS_EXTERNAL","LICENSE_VALIDATION_BLOCKER_REMAINS_OPEN",
  "LEGAL_REVIEW_BLOCKER_REMAINS_OPEN","NO_OUTBOUND_PERFORMED"
]) assert.ok(inv.has(x),"missing invariant "+x);
console.log("RIGHTS_POLICY_GAME_COUNT",d.games.length);
console.log("PASS_V2_RIGHTS_PUBLIC_POLICY_PREFLIGHT");
