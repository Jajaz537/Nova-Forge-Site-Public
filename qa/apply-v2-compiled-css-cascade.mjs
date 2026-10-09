// MODARYX V2: apply measured, conservative CSS cascade consolidation AFTER
// Vite's minifier, BEFORE the existing site-distribution build step.
// Rename the compiled CSS by its NEW content digest to avoid stale-cache reuse.
// Refuse if any unknown generated file references its old URL.
import {createHash} from "node:crypto";
import {existsSync,readFileSync,readdirSync,writeFileSync,unlinkSync} from "node:fs";
import {resolve,join,relative,dirname,basename} from "node:path";
import {gzipSync} from "node:zlib";
import {pruneCompiledCss} from "../v2/css-cascade-prune.mjs";

const root=existsSync("dist/client/index.html")?resolve("dist/client"):resolve("v2/dist/client");
const htmlFile=join(root,"index.html");
const html=readFileSync(htmlFile,"utf8");
const href=html.match(/<link[^>]+href="([^"]+\.css)"/)?.[1];
if(!href||!/^\/assets\/index-[a-zA-Z0-9_-]+\.css$/.test(href))
  throw new Error("Unexpected CSS entry URL; cannot safely rename: "+String(href));
const oldFile=join(root,href.slice(1));
const oldBase=basename(oldFile);
const previous=readFileSync(oldFile,"utf8");
const result=pruneCompiledCss(previous);
// CI only: retain the unpruned baseline outside all generated site assets.
if(process.env.MODARYX_CSS_PARITY_BASELINE){
  const target=process.env.MODARYX_CSS_PARITY_BASELINE;
  if(!target.startsWith("/tmp/"))throw new Error("CSS parity baseline must remain outside site assets");
  writeFileSync(target,previous);
}
const digest=createHash("sha256").update(result.css,"utf8").digest("hex").slice(0,12);
const newBase="index-"+digest+".css";
const newFile=join(dirname(oldFile),newBase);
if(newFile===oldFile)throw new Error("CSS optimizer output filename did not change");
if(existsSync(newFile))throw new Error("CSS output collision: "+newFile);

// Asset names can appear in JS chunk preloads, service-worker manifests or
// generated site entries. Never silently leave a broken cached reference.
function scan(dir){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    const file=join(dir,entry.name);
    if(entry.isDirectory()){scan(file);continue}
    if(!entry.isFile()||file===htmlFile||file===oldFile)continue;
    if(!/\.(?:html|js|json|css|mjs|webmanifest|txt|xml|map)$/i.test(entry.name))continue;
    if(readFileSync(file,"utf8").includes(oldBase))
      throw new Error("CSS asset rename blocked by unhandled reference: "+relative(root,file));
  }
}
scan(root);
if(!html.includes(oldBase))throw new Error("CSS entry asset not referenced by index.html");

writeFileSync(newFile,result.css);
writeFileSync(htmlFile,html.replaceAll(oldBase,newBase));
unlinkSync(oldFile);
const gzip=content=>gzipSync(Buffer.from(content),{level:9}).length;
console.log("CSS_CASCADE_BUILD",JSON.stringify({
  beforeGzip:gzip(previous),afterGzip:gzip(result.css),
  removedDeclarations:result.removed,
  oldAsset:oldBase,newAsset:newBase,
  note:"Only built candidate assets changed; browser and visual gates remain mandatory"
}));
