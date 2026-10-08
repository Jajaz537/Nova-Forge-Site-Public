import assert from "node:assert/strict";
import fs from "node:fs";

const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-rights-official-contact-sources.json","utf8"));
assert.equal(d.status,"OFFICIAL_SOURCE_ARTIFACTS_RECORDED_DEMO_TARGETS_ONLY");
assert.equal(d.productionBlocker,"official-contact-discovery");
assert.equal(d.blockerState,"OPEN");
assert.equal(d.scope,"DEMONSTRATION_CATALOG_ONLY");
assert.equal(d.catalogTargets.length,3);
const expected=new Set(["skyrim-se","cyberpunk-2077","minecraft"]);
assert.deepEqual(new Set(d.catalogTargets.map(x=>x.gameId)),expected);
for(const target of d.catalogTargets){
  assert.ok(Array.isArray(target.officialSources)&&target.officialSources.length>=1,target.gameId+" sources missing");
  for(const source of target.officialSources){
    const url=new URL(source.url);
    assert.equal(url.protocol,"https:");
    assert.ok(["bethesda.net","cdprojektred.com","minecraft.net"].some(domain=>url.hostname===domain||url.hostname.endsWith("."+domain)),target.gameId+" non-official source");
    assert.equal(source.productionOutboundEligible,false,target.gameId+" must not auto-authorize outbound");
  }
  assert.ok(Array.isArray(target.unresolved)&&target.unresolved.length>0,target.gameId+" unresolved constraints missing");
}
const inv=new Set(d.invariants||[]);
for(const x of [
  "OFFICIAL_DOMAINS_ONLY","NO_SCRAPING_AROUND_RESTRICTIONS","NO_OUTBOUND_PERFORMED",
  "DEMO_CATALOG_NEVER_AUTO_PROMOTES_TO_PRODUCTION_RIGHTS_REGISTRY",
  "OFFICIAL_CONTACT_DISCOVERY_BLOCKER_REMAINS_OPEN",
  "PUBLISHER_OUTBOUND_BLOCKER_REMAINS_OPEN","LICENSE_VALIDATION_BLOCKER_REMAINS_OPEN",
  "LEGAL_REVIEW_BLOCKER_REMAINS_OPEN"
]) assert.ok(inv.has(x),"missing invariant "+x);
console.log("RIGHTS_SOURCE_TARGET_COUNT",d.catalogTargets.length);
console.log("PASS_V2_RIGHTS_OFFICIAL_SOURCE_ARTIFACTS");
