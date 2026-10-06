#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
copyFileSync(worker, path.join(dist, "server", "index.js"));
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

const builtSw=path.join(dist,"client","sw-v2.js");
const assetsDir=path.join(dist,"client","assets");
if(existsSync(builtSw)&&existsSync(assetsDir)){
  const assets=readdirSync(assetsDir,{withFileTypes:true})
    .filter(entry=>entry.isFile())
    .map(entry=>"/assets/"+entry.name)
    .sort();
  const shell=["/","/index.html",...assets];
  const source=readFileSync(builtSw,"utf8");
  if(!source.includes('const SHELL = ["/", "/index.html"];')) throw new Error("Unexpected V2 service-worker shell declaration");
  writeFileSync(builtSw,source.replace('const SHELL = ["/", "/index.html"];',"const SHELL = "+JSON.stringify(shell)+";"));
  console.log("Prepared V2 offline shell assets:",assets.length);
}

const buildCommitSha=String(
  process.env.CF_PAGES_COMMIT_SHA||
  process.env.GITHUB_SHA||
  process.env.MODARYX_BUILD_SHA||
  "unknown"
).trim().toLowerCase();
const buildBranch=String(
  process.env.CF_PAGES_BRANCH||
  process.env.GITHUB_REF_NAME||
  process.env.MODARYX_BUILD_BRANCH||
  "unknown"
).trim();
const rawDeploymentUrl=String(process.env.CF_PAGES_URL||"").trim();
let deploymentUrl=null;
if(rawDeploymentUrl){
  try{
    const parsed=new URL(rawDeploymentUrl);
    if(parsed.protocol==="https:"&&!parsed.username&&!parsed.password&&!parsed.hash&&!parsed.search){
      deploymentUrl=parsed.origin;
    }
  }catch{}
}
const buildInfo={
  schemaVersion:1,
  product:"modaryx-v2",
  commitSha:/^[a-f0-9]{40}$/.test(buildCommitSha)?buildCommitSha:"unknown",
  branch:buildBranch||"unknown",
  deploymentUrl
};
writeFileSync(path.join(dist,"client","build-info.json"),JSON.stringify(buildInfo,null,2)+"\n");
console.log("Prepared V2 build fingerprint:",buildInfo.commitSha,buildInfo.branch);

console.log("Prepared Sites build: dist/server/index.js and dist/.openai/hosting.json");
