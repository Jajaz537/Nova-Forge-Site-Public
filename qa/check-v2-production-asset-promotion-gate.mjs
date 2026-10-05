import fs from "node:fs";
import { execFileSync } from "node:child_process";

const manifestPath="qa/modaryx-v2-asset-rights-manifest.json";
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));

if(manifest.schemaVersion!==1) throw new Error("unexpected asset manifest schemaVersion");
if(manifest.rules?.productionUseRequiresSeparateApproval!==true) {
  throw new Error("productionUseRequiresSeparateApproval must remain true");
}

const assets=manifest.assets||[];
if(!assets.length) throw new Error("asset manifest unexpectedly empty");

const prototypeOnly=new Set();
for(const asset of assets){
  if(asset.status!=="ALLOWED_PROTOTYPE_ONLY") {
    throw new Error("unexpected prototype asset status: "+asset.path+" -> "+asset.status);
  }
  if(!asset.path.startsWith("review-evidence/modaryx-v2-living-threshold-prototype-20261003/public/assets/")) {
    throw new Error("prototype-only asset escaped prototype root: "+asset.path);
  }
  prototypeOnly.add(asset.path.split("/").pop());
}

const tracked=execFileSync("git",["ls-files"],{encoding:"utf8"}).trim().split(/\r?\n/).filter(Boolean);
const textExt=/\.(?:js|mjs|cjs|jsx|ts|tsx|css|scss|html|md|json|yml|yaml|txt)$/i;
const allowedReferenceRoots=[
  "review-evidence/modaryx-v2-living-threshold-prototype-20261003/",
  "qa/",
  "docs/",
  ".github/",
];
const allowedReferenceFiles=new Set([
  "CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-04.md",
  "CHECKPOINT-CANONIQUE-MODARYX-V2-2026-10-05.md"
]);

const unsafeRefs=[];
for(const file of tracked){
  if(!textExt.test(file)) continue;
  if(allowedReferenceRoots.some(prefix=>file.startsWith(prefix))||allowedReferenceFiles.has(file)) continue;
  let text;
  try{text=fs.readFileSync(file,"utf8");}catch{continue;}
  for(const basename of prototypeOnly){
    if(text.includes(basename)) unsafeRefs.push({file,basename});
  }
}
if(unsafeRefs.length) {
  throw new Error("prototype-only visual referenced outside controlled evidence/policy roots: "+JSON.stringify(unsafeRefs));
}

const blobToPaths=new Map();
for(const file of tracked){
  let blob;
  try{blob=execFileSync("git",["hash-object",file],{encoding:"utf8"}).trim();}catch{continue;}
  const list=blobToPaths.get(blob)||[];
  list.push(file);
  blobToPaths.set(blob,list);
}
const allowedLegacyDuplicates=new Set([
  "assets/living-world/wolf-baby.png",
  "assets/living-world/dragon-baby.png"
]);

const copied=[];
for(const asset of assets){
  const paths=blobToPaths.get(asset.gitBlobSha)||[];
  for(const file of paths){
    if(file===asset.path) continue;
    if(allowedLegacyDuplicates.has(file)) continue;
    copied.push({prototypeAsset:asset.path,duplicate:file});
  }
}
if(copied.length) {
  throw new Error("prototype-only asset copied outside approved provenance roots: "+JSON.stringify(copied));
}

console.log("PRODUCTION_ASSET_GATE_PROTOTYPE_ONLY_COUNT",prototypeOnly.size);
console.log("PRODUCTION_ASSET_GATE_UNSAFE_REFERENCE_COUNT",unsafeRefs.length);
console.log("PRODUCTION_ASSET_GATE_UNAPPROVED_COPY_COUNT",copied.length);
console.log("PASS_V2_PRODUCTION_ASSET_PROMOTION_GATE");
