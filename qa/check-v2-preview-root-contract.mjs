import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-preview-root-contract.json","utf8"));
const fail=(m)=>{throw new Error(m)};
if(d.schemaVersion!==1) fail("unexpected schemaVersion");
if(d.status!=="ACTIVE_PREVIEW_ENGINEERING") fail("preview root not active");
if(d.root!=="v2-preview") fail("unexpected preview root");
if(d.stack?.candidate!=="react-vite-cloudflare-workers") fail("unexpected preview stack");
if(d.humanTreeTest?.state!=="RECLASSIFIED_FOR_PREVIEW_ONLY") fail("human tree gate must remain explicitly limited");
for(const inv of ["NO_MAIN_CHANGE","NO_CUTOVER","NO_PRODUCTION_VF_CLAIM","NO_V1_AUTO_IMPORT","NOINDEX_PREVIEW","BROWSER_PROOF_REQUIRED"]){
  if(!(d.invariants||[]).includes(inv)) fail("missing invariant "+inv);
}
for(const p of [
  "v2-preview/index.html",
  "v2-preview/package.json",
  "v2-preview/package-lock.json",
  "v2-preview/src/App.jsx",
  "v2-preview/src/main.jsx",
  "v2-preview/src/styles.css",
  "v2-preview/src/product-blue-violet.css",
  "v2-preview/worker/index.js"
]) if(!fs.existsSync(p)) fail("missing root file "+p);
const pkg=JSON.parse(fs.readFileSync("v2-preview/package.json","utf8"));
for(const [name,version] of Object.entries({
  react:"19.2.0","react-dom":"19.2.0",vite:"6.4.2","@vitejs/plugin-react":"5.0.4","@phosphor-icons/react":"2.1.10"
})) if(pkg.dependencies?.[name]!==version) fail("dependency not pinned "+name);
const html=fs.readFileSync("v2-preview/index.html","utf8");
if(!html.includes('name="robots" content="noindex,nofollow,noarchive"')) fail("preview must remain noindex");
const main=fs.readFileSync("v2-preview/src/main.jsx","utf8");
if(main.includes("canon-hero.css")) fail("rejected cinematic hero stylesheet returned");
const app=fs.readFileSync("v2-preview/src/App.jsx","utf8");
if(app.includes("function CanonNarrativeLayer")||app.includes("<CanonNarrativeLayer")) fail("rejected cinematic narrative returned");
console.log("PASS_V2_PREVIEW_ROOT_CONTRACT");
