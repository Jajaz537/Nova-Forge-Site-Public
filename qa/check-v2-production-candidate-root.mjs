import fs from "node:fs";
const d=JSON.parse(fs.readFileSync("qa/modaryx-v2-production-candidate-root.json","utf8"));
if(d.schemaVersion!==1||d.status!=="PRODUCTION_CANDIDATE_NO_CUTOVER"||d.root!=="v2") throw new Error("root contract drift");
const pkg=JSON.parse(fs.readFileSync("v2/package.json","utf8"));
for(const [name,version] of Object.entries({"react":"19.2.0","react-dom":"19.2.0","vite":"6.4.2","@vitejs/plugin-react":"5.0.4","@phosphor-icons/react":"2.1.10"})){
  if(pkg.dependencies?.[name]!==version) throw new Error("dependency pin drift "+name);
}
if(pkg.name!=="modaryx-v2-production-candidate") throw new Error("package name drift");
const html=fs.readFileSync("v2/index.html","utf8");
if(!html.includes('name="robots" content="noindex,nofollow,noarchive"')) throw new Error("candidate must stay noindex");
if(!html.includes('rel="manifest" href="/manifest.webmanifest"')) throw new Error("V2 manifest link missing");
const manifest=JSON.parse(fs.readFileSync("v2/public/manifest.webmanifest","utf8"));
if(manifest.name!=="MODARYX"||manifest.short_name!=="MODARYX"||manifest.start_url!=="/"||manifest.scope!=="/") throw new Error("manifest identity drift");
if(Array.isArray(manifest.shortcuts)&&manifest.shortcuts.length) throw new Error("unproven PWA shortcuts forbidden");
const main=fs.readFileSync("v2/src/main.jsx","utf8");
if(main.includes("serviceWorker.register")) throw new Error("automatic SW registration before gate forbidden");
if(!main.includes("migrateLegacyBrowserState")) throw new Error("storage migration hook missing");
const app=fs.readFileSync("v2/src/App.jsx","utf8");
if(app.includes("CanonNarrativeLayer")||app.includes("living-threshold-dragon-baby")||app.includes("living-threshold-wolf-baby")) throw new Error("rejected narrative companion returned");
for(const p of ["v2/public/assets/living-threshold-dragon-baby.png","v2/public/assets/living-threshold-wolf-baby.png"]) if(fs.existsSync(p)) throw new Error("unused narrative companion asset leaked into production root");
const sw=fs.readFileSync("v2/public/sw-v2.js","utf8");
if(/self\.clients\.claim\s*\(/.test(sw)) throw new Error("clients.claim forbidden before cutover");
if(!sw.includes("modaryx-v2-candidate-shell-v1")) throw new Error("controlled V2 cache missing");
if(!sw.includes('new Set(["modaryx-site-v120-scalable"])')) throw new Error("explicit legacy cache allowlist missing");
const migration=fs.readFileSync("v2/src/storage-migration.js","utf8");
if(!migration.includes("modaryx:v2:")||migration.includes("removeItem(LEGACY_KEYS")) throw new Error("non-destructive namespace migration drift");
console.log("V2_ROOT",d.root);
console.log("PASS_V2_PRODUCTION_CANDIDATE_ROOT");
