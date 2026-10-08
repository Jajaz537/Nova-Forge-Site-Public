// Targeted, read-only source CSS inventory for MODARYX V2 candidate.
// Run: node qa/audit-v2-css-cascade-sources.mjs
// This is an inventory, not a proof that removing any declaration is safe.
import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const entry=fs.readFileSync(path.join(root,"v2/src/main.jsx"),"utf8");
const css=[...entry.matchAll(/^import "\.\/([^"]+\.css)";/gm)].map(m=>m[1]);
if(!css.length) throw new Error("No V2 CSS entry imports found");
const rows=css.map((name,index)=>{
  const file=path.join(root,"v2/src",name);
  const source=fs.readFileSync(file,"utf8");
  return {order:index+1,file:name,sourceBytes:Buffer.byteLength(source),importantDeclarations:(source.match(/!important\b/g)||[]).length,mediaBlocks:(source.match(/@media\b/g)||[]).length};
});
rows.sort((a,b)=>b.sourceBytes-a.sourceBytes);
// Exact selector reuse across source files is a candidate for cascade inspection,
// NOT proof of redundant styles (media/specificity/order may be intentional).
const bySelector=new Map();
for(const [index,name] of css.entries()){
  const source=fs.readFileSync(path.join(root,"v2/src",name),"utf8");
  for(const match of source.matchAll(/(?:^|})\s*([^@{}][^{}]*?)\s*\{/gm)){
    const selector=match[1].trim();
    if(!selector || selector.startsWith("/*") || selector.length>160)continue;
    const occurrences=bySelector.get(selector)||[];
    occurrences.push({file:name,order:index+1});
    bySelector.set(selector,occurrences);
  }
}
const repeatedSelectors=[...bySelector].filter(([,hits])=>hits.length>1)
 .map(([selector,hits])=>({selector,count:hits.length,files:[...new Set(hits.map(h=>h.file))]}))
 .sort((a,b)=>b.count-a.count).slice(0,40);
const report={kind:"source-inventory-not-bundle-proof",totalCssImports:css.length,totalSourceBytes:rows.reduce((n,r)=>n+r.sourceBytes,0),totalImportantDeclarations:rows.reduce((n,r)=>n+r.importantDeclarations,0),repeatedSelectorsAreCandidatesOnly:true,repeatedSelectors,rows};
console.log(JSON.stringify(report,null,2));
