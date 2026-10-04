import fs from "node:fs";
import path from "node:path";

const dir=".github/workflows";
const files=fs.readdirSync(dir)
  .filter(name=>/^modaryx-v2-.*\.ya?ml$/.test(name))
  .sort();

if(!files.length) throw new Error("no MODARYX V2 workflows found");

const findings=[];
let checkoutCount=0;
for(const name of files){
  const full=path.join(dir,name);
  const source=fs.readFileSync(full,"utf8");

  if(/\bpull_request_target\s*:/.test(source)) findings.push({file:full,reason:"pull_request_target is forbidden for MODARYX V2 preproduction workflows"});
  if(/\bworkflow_run\s*:/.test(source)) findings.push({file:full,reason:"workflow_run privileged chaining is forbidden without explicit review"});
  if(/^\s*permissions:\s*write-all\s*$/mi.test(source)) findings.push({file:full,reason:"permissions write-all forbidden"});
  if(/^\s*(contents|actions|checks|deployments|issues|packages|pull-requests|security-events|statuses):\s*write\s*$/mi.test(source)) {
    findings.push({file:full,reason:"write permission present; preproduction proof workflows must be read-only"});
  }
  if(/\bsecrets\.[A-Za-z0-9_]+/.test(source)) findings.push({file:full,reason:"repository/environment secret reference found in proof workflow"});
  if(/persist-credentials:\s*true/i.test(source)) findings.push({file:full,reason:"checkout persist-credentials:true forbidden"});

  const uses=[...source.matchAll(/^\s*-?\s*uses:\s*([^\s#]+)/gmi)].map(m=>m[1].replace(/^["']|["']$/g,""));
  for(const spec of uses){
    if(spec.startsWith("actions/checkout@")){
      checkoutCount++;
      const blockIndex=source.indexOf("uses: "+spec);
      const tail=source.slice(blockIndex,blockIndex+700);
      if(!/persist-credentials:\s*false/i.test(tail)) findings.push({file:full,reason:"checkout must set persist-credentials:false"});
    }
  }

  const permissionsMatch=source.match(/^permissions:\s*\n((?:[ \t]+[^\n]+\n?)*)/m);
  if(!permissionsMatch) findings.push({file:full,reason:"explicit top-level permissions block missing"});
  else {
    const block=permissionsMatch[1];
    if(!/^\s*contents:\s*read\s*$/mi.test(block)) findings.push({file:full,reason:"permissions must include contents: read"});
  }
}

if(findings.length){
  console.error(JSON.stringify(findings,null,2));
  throw new Error("workflow security baseline findings: "+findings.length);
}

console.log("MODARYX_V2_WORKFLOW_SECURITY_COUNT",files.length);
console.log("MODARYX_V2_CHECKOUT_BLOCK_COUNT",checkoutCount);
console.log("PASS_V2_WORKFLOW_SECURITY_BASELINE");
