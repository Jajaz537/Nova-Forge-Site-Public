import fs from "node:fs";

const base="review-evidence/modaryx-v2-living-threshold-prototype-20261003";
const files={
  app:fs.readFileSync(base+"/src/App.jsx","utf8"),
  css:fs.readFileSync(base+"/src/styles.css","utf8"),
  index:fs.readFileSync(base+"/index.html","utf8"),
};
const joined=Object.values(files).join("\n");

const forbidden=[
  ["dangerouslySetInnerHTML",/dangerouslySetInnerHTML/g],
  ["innerHTML sink",/\binnerHTML\s*=/g],
  ["document.write",/document\.write\s*\(/g],
  ["eval",/\beval\s*\(/g],
  ["Function constructor",/new\s+Function\s*\(/g],
  ["javascript URL",/javascript\s*:/gi],
  ["data html URL",/data\s*:\s*text\/html/gi],
  ["remote http(s) dependency",/https?:\/\//gi],
  ["CSS remote import",/@import\s+[^;]*https?:/gi],
];
for(const [label,re] of forbidden){
  const matches=joined.match(re)||[];
  if(matches.length) throw new Error(label+" forbidden in isolated prototype: "+matches.length);
}

const inlineStyleCount=(files.app.match(/style=\{\{/g)||[]).length;
if(inlineStyleCount!==4){
  throw new Error("inline React style count changed; review CSP remediation expectation: "+inlineStyleCount);
}

const localAssetRefs=[...files.css.matchAll(/url\(([^)]+)\)/g)].map(m=>m[1].replace(/['"]/g,"").trim());
for(const asset of localAssetRefs){
  if(!asset.startsWith("/assets/") && !asset.startsWith("data:")){
    throw new Error("unexpected CSS asset origin: "+asset);
  }
}

if(!files.index.includes('<meta name="robots" content="noindex,nofollow,noarchive" />')){
  throw new Error("preview noindex missing");
}

console.log("PROTOTYPE_SECURITY_REMOTE_REFERENCE_COUNT",0);
console.log("PROTOTYPE_SECURITY_DANGEROUS_SINK_COUNT",0);
console.log("PROTOTYPE_SECURITY_INLINE_STYLE_COUNT",inlineStyleCount);
console.log("PROTOTYPE_SECURITY_INLINE_STYLE_STATUS","PREVIEW_REMEDIATION_REQUIRED_BEFORE_STRICT_STYLE_SRC");
console.log("PASS_V2_PROTOTYPE_SECURITY_SINKS");
