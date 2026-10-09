// MODARYX Web V2: prevent confusing frozen preview evidence with the current
// R3 candidate. Source/proof scopes are independent; no automatic migration.
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const kind=process.argv.find(x=>x.startsWith("--root="))?.slice(7);
assert.ok(["preview","candidate"].includes(kind),"Use --root=preview or --root=candidate");
const sourcePath=kind==="preview"?"v2-preview/src/App.jsx":"v2/src/App.jsx";
const packagePath=kind==="preview"?"v2-preview/package.json":"v2/package.json";
const app=readFileSync(sourcePath,"utf8");
const pkg=JSON.parse(readFileSync(packagePath,"utf8"));
const previewContract=JSON.parse(readFileSync("qa/modaryx-v2-preview-root-contract.json","utf8"));
assert.equal(previewContract.root,"v2-preview");
assert.equal(previewContract.status,"ACTIVE_PREVIEW_ENGINEERING");
assert.equal(previewContract.sourceCommit,"15d7a4746dda80d135188fd9921b761888e9de1e");
assert.ok(pkg.private,"Root must not be publishable as an npm package");
const referenceDiscover='<button className="primary">Découvrir maintenant <ArrowRight/></button>';
const candidateDiscover='<button type="button" className="primary" onClick={()=>onNavigate("Mods & contenus")}>Découvrir maintenant <ArrowRight/></button>';
const candidateDetails='aria-label={\`Consulter les détails de \${item.title}\`} onClick={()=>onOpen(item)';
if(kind==="preview"){
  assert.ok(app.includes(referenceDiscover),"Frozen preview control has unexpectedly migrated; review contract");
  assert.ok(!app.includes(candidateDiscover),"Preview must not masquerade as current R3 candidate");
  assert.ok(app.includes("function Discover({ onOpen })"),"Frozen Discover component changed");
}else{
  assert.ok(app.includes(candidateDiscover),"Current candidate CTA regression");
  assert.ok(app.includes("function Discover({ onOpen, onNavigate })"),"Candidate Discover action disconnected");
  assert.ok(app.includes('screen=<Discover onOpen={openContent} onNavigate={navigate}/>'),"Candidate Discover wiring disconnected");
  assert.ok(app.includes('<Library onOpenGameHub={openGameHub}/>'),"Candidate Library wiring disconnected");
  assert.ok(app.includes(candidateDetails),"Candidate content details action disconnected");
}
console.log("PASS_V2_ROOT_PROVENANCE",JSON.stringify({
  root:kind,source:sourcePath,
  scope:kind==="preview"?"FROZEN_2026_10_06_REFERENCE":"CURRENT_R3_CANDIDATE",
  disclaimer:"Preview-only browser PASS does not prove candidate CTA behavior. Candidate-only tests must target v2."
}));
