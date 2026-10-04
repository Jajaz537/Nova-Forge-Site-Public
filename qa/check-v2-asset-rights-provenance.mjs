import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const manifestPath="qa/modaryx-v2-asset-rights-manifest.json";
const data=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
if(data.schemaVersion!==1) throw new Error("unexpected schemaVersion");

const root=data.root;
if(!root||!fs.existsSync(root)) throw new Error("asset root missing: "+root);

const mediaExt=new Set([".png",".jpg",".jpeg",".webp",".gif",".svg",".avif",".mp3",".ogg",".wav",".mp4",".webm",".woff",".woff2",".ttf",".otf"]);
const found=[];
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full);
    else if(mediaExt.has(path.extname(entry.name).toLowerCase())) found.push(full.split(path.sep).join("/"));
  }
}
walk(root);

const assets=new Map((data.assets||[]).map(item=>[item.path,item]));
if(assets.size!==(data.assets||[]).length) throw new Error("duplicate manifest asset path");

for(const file of found){
  const item=assets.get(file);
  if(!item) throw new Error("unlisted asset blocked: "+file);
  if(["UNKNOWN","FORBIDDEN"].includes(item.status)) throw new Error("blocked asset status: "+file+" -> "+item.status);
  if(item.status!=="ALLOWED_PROTOTYPE_ONLY") throw new Error("prototype manifest requires ALLOWED_PROTOTYPE_ONLY: "+file);
  if(item.classification!=="ORIGINAL_MODARYX_DEMO") throw new Error("unexpected prototype asset classification: "+file);
  if(!item.evidence||!fs.existsSync(item.evidence)) throw new Error("evidence document missing: "+file);
  const blob=execFileSync("git",["hash-object",file],{encoding:"utf8"}).trim();
  if(blob!==item.gitBlobSha) throw new Error("asset blob changed without manifest update: "+file+" expected "+item.gitBlobSha+" got "+blob);
}

for(const [file,item] of assets){
  if(!found.includes(file)) throw new Error("manifest references missing asset: "+file);
  if(!item.sourceNote?.includes("Production provenance/licensing archive remains required")) {
    throw new Error("prototype-only production caveat missing: "+file);
  }
}

const sourceFiles=[
  "review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/App.jsx",
  "review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/styles.css"
];
for(const file of sourceFiles){
  const text=fs.readFileSync(file,"utf8");
  if(/url\(\s*['"]?https?:\/\//i.test(text)) throw new Error("remote CSS asset blocked: "+file);
  if(/(?:src|href)\s*=\s*["']https?:\/\//i.test(text)) throw new Error("remote visual/media reference blocked: "+file);
}

if(found.length!==assets.size) throw new Error("asset inventory mismatch");

console.log("ASSET_RIGHTS_PROVENANCE_COUNT",found.length);
console.log("ASSET_RIGHTS_REMOTE_REFERENCE_COUNT",0);
console.log("PASS_V2_ASSET_RIGHTS_PROVENANCE");
