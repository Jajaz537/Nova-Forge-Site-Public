// Read-only experiment: identify conservatively superseded declarations in the
// EXACT CSS asset emitted by Vite. DOES NOT rewrite the deployed build.
// Use from repository root after `cd v2 && npm ci && npm run build`.
// Do not treat CSS equality as visual proof or field performance proof.
import {readFileSync,writeFileSync} from "node:fs";
import {createRequire} from "node:module";
import {gzipSync} from "node:zlib";
import {resolve} from "node:path";

const require=createRequire(new URL("../v2/package.json",import.meta.url));
const postcss=require("postcss");
const html=readFileSync("v2/dist/client/index.html","utf8");
const href=html.match(/<link[^>]+href="([^"]+\\.css)"/)?.[1];
if(!href)throw new Error("Built CSS link not found in index.html");
const cssFile=resolve("v2/dist/client",href.replace(/^\\//,""));
const input=readFileSync(cssFile,"utf8");
const size=text=>gzipSync(Buffer.from(text),{level:9}).length;
const root=postcss.parse(input,{from:cssFile});
const candidates=[];
const contexts=new Map();

function context(decl){
  if(decl.parent?.type!=="rule")return null;
  const rule=decl.parent;
  const selectors=rule.selector?.trim().replace(/\\s+/g," ");
  if(!selectors||selectors.startsWith("@"))return null;
  const ancestors=[];
  for(let node=rule.parent;node&&node.type!=="root";node=node.parent){
    if(node.type!=="atrule")return null;
    // Keep semantics conservative: only IDENTICAL media condition chains.
    if(node.name!=="media")return null;
    ancestors.push("@media "+node.params.trim().replace(/\\s+/g," "));
  }
  return ancestors.reverse().join("||")+"||"+selectors;
}
const ordinaryProperty=/^(?:color|background-color|display|position|visibility|opacity|width|height|min-width|max-width|min-height|max-height|margin(?:-(?:top|right|bottom|left|inline|block))?|padding(?:-(?:top|right|bottom|left|inline|block))?|gap|row-gap|column-gap|align-items|justify-content|flex(?:-direction|-wrap|-grow|-shrink|-basis)?|grid-template-(?:columns|rows)|overflow(?:-x|-y)?|border(?:-(?:width|style|color|radius|top|right|bottom|left)(?:-(?:width|style|color))?)?|box-shadow|text-shadow|font-size|font-weight|line-height|letter-spacing|top|right|bottom|left|z-index|transform|filter|text-align)$/;
function safeValue(value){
  return value.length<160 && !/(?:var|env|attr|url|color-mix|calc|clamp|min|max|revert|inherit|initial|unset|currentColor)\\s*\\(/i.test(value)
    && !/(?:^|[\\s(])(?:revert|inherit|initial|unset|revert-layer)(?:[\\s)]|$)/i.test(value)
    && !/[{}]/.test(value);
}
root.walkDecls(decl=>{
  const k=context(decl);
  if(!k||!ordinaryProperty.test(decl.prop)||!safeValue(decl.value))return;
  const key=k+"||"+decl.prop.toLowerCase();
  const arr=contexts.get(key)||[];
  arr.push(decl);
  contexts.set(key,arr);
});
let sameValue=0,stableOverride=0;
for(const [key,arr] of contexts){
  for(let i=0;i<arr.length-1;i++){
    const earlier=arr[i];
    let winner=null;
    for(let j=i+1;j<arr.length;j++){
      const next=arr[j];
      if(earlier.important&&!next.important)continue;
      if(!safeValue(next.value))continue;
      winner=next;
    }
    if(!winner)continue;
    const identical=earlier.value.trim()===winner.value.trim()&&earlier.important===winner.important;
    const type=identical?"same-value":"stable-override";
    if(identical)sameValue++;else stableOverride++;
    candidates.push({earlier,kind:type,property:earlier.prop,selector:earlier.parent.selector,context:key});
  }
}
const baselineCss=root.toString();
const baselineSerializedGzip=size(baselineCss);
for(const item of candidates)item.earlier.remove();
const optimizedCss=root.toString();
const experimentalFile="/tmp/modaryx-v2-experimental-cascade.css";
writeFileSync(experimentalFile,optimizedCss);
const report={
  kind:"EXPERIMENT_NOT_PRODUCTION_CSS",
  sourceFile:href,
  originalGzipBytes:size(input),
  serializedGzipBytes:baselineSerializedGzip,
  experimentalGzipBytes:size(optimizedCss),
  experimentalSavingsBytes:baselineSerializedGzip-size(optimizedCss),
  candidateDeclarations:candidates.length,
  sameValue,
  stableOverride,
  originalCssBytes:Buffer.byteLength(input),
  experimentCssBytes:Buffer.byteLength(optimizedCss),
  note:"No visual safety / browser comparison: MUST NOT ship or claim PASS; media and shorthand interactions still need scrutiny"
};
console.log("CSS_COMPILED_EXPERIMENT",JSON.stringify(report));
if(report.candidateDeclarations<1)throw new Error("No candidates found — inspect compiled CSS or selectors");
