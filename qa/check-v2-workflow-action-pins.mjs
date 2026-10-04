import fs from "node:fs";
import path from "node:path";

const dir=".github/workflows";
const files=fs.readdirSync(dir)
  .filter(name=>/^modaryx-v2-.*\.ya?ml$/.test(name))
  .sort();

if(!files.length) throw new Error("no MODARYX V2 workflows found");

const findings=[];
let usesCount=0;
for(const name of files){
  const full=path.join(dir,name);
  const lines=fs.readFileSync(full,"utf8").split(/\r?\n/);
  lines.forEach((line,index)=>{
    const m=line.match(/^\s*-?\s*uses:\s*([^\s#]+)/);
    if(!m) return;
    usesCount++;
    const spec=m[1].replace(/^["']|["']$/g,"");
    const at=spec.lastIndexOf("@");
    const ref=at>=0?spec.slice(at+1):"";
    if(!/^[0-9a-f]{40}$/i.test(ref)){
      findings.push({file:full,line:index+1,spec,reason:"action reference is not pinned to a full 40-char commit SHA"});
    }
  });
}

if(findings.length){
  console.error(JSON.stringify(findings,null,2));
  throw new Error("unpinned GitHub Action references: "+findings.length);
}

console.log("MODARYX_V2_WORKFLOW_COUNT",files.length);
console.log("MODARYX_V2_ACTION_USES_COUNT",usesCount);
console.log("PASS_V2_WORKFLOW_ACTION_SHA_PINS");
