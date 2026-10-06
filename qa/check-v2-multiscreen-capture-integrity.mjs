import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";

const DEFAULT_DIR="review-evidence/modaryx-v2-living-threshold-prototype-20261003/visual-proof/multiscreen";
const MIN_BYTES=20000;
const MIN_CAPTURE_COUNT=93;

function dimensions(buf){
  if(buf.length<24) throw new Error("PNG too small for IHDR");
  const sig=Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
  if(!buf.subarray(0,8).equals(sig)) throw new Error("not PNG");
  return {width:buf.readUInt32BE(16),height:buf.readUInt32BE(20)};
}

function inspect(dir,{minCount=MIN_CAPTURE_COUNT,minBytes=MIN_BYTES}={}){
  if(!fs.existsSync(dir)) throw new Error("capture directory missing: "+dir);
  const files=fs.readdirSync(dir).filter(x=>x.endsWith(".png")).sort();
  if(files.length<minCount) throw new Error(`capture count ${files.length} < ${minCount}`);

  const hashes=new Map();
  const problems=[];
  let smallest=null;
  for(const file of files){
    const full=path.join(dir,file);
    const buf=fs.readFileSync(full);
    let dim;
    try{dim=dimensions(buf);}catch(e){problems.push(`${file}: ${e.message}`);continue;}
    const expected=file.startsWith("desktop-")?{width:1440,height:1024}:file.startsWith("mobile-")?{width:390,height:844}:null;
    if(!expected) problems.push(`${file}: filename must start desktop- or mobile-`);
    else if(dim.width!==expected.width||dim.height!==expected.height) problems.push(`${file}: unexpected dimensions ${dim.width}x${dim.height}`);
    if(buf.length<minBytes) problems.push(`${file}: suspiciously small ${buf.length} bytes < ${minBytes}`);
    const hash=crypto.createHash("sha256").update(buf).digest("hex");
    const prior=hashes.get(hash);
    if(prior) problems.push(`${file}: duplicate pixels/hash with ${prior}`);
    else hashes.set(hash,file);
    if(!smallest||buf.length<smallest.bytes) smallest={file,bytes:buf.length};
  }
  if(problems.length) throw new Error("capture integrity failures:\n"+problems.join("\n"));
  console.log("MULTISCREEN_INTEGRITY_CAPTURE_COUNT",files.length);
  console.log("MULTISCREEN_INTEGRITY_SMALLEST",smallest.file,smallest.bytes);
  console.log("PASS_V2_MULTISCREEN_CAPTURE_INTEGRITY");
  return {count:files.length,smallest};
}

function fakePng(width,height,bytes,seed){
  const b=Buffer.alloc(bytes,seed);
  Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]).copy(b,0);
  b.writeUInt32BE(width,16); b.writeUInt32BE(height,20);
  return b;
}

function selfTest(){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"modaryx-capture-integrity-"));
  try{
    fs.writeFileSync(path.join(dir,"desktop-safe.png"),fakePng(1440,1024,22000,0x31));
    fs.writeFileSync(path.join(dir,"mobile-safe.png"),fakePng(390,844,23000,0x32));
    inspect(dir,{minCount:2,minBytes:20000});

    fs.writeFileSync(path.join(dir,"mobile-blanklike.png"),fakePng(390,844,2743,0x33));
    let rejected=false;
    try{inspect(dir,{minCount:2,minBytes:20000});}catch(e){rejected=/suspiciously small/.test(e.message);}
    if(!rejected) throw new Error("self-test failed to reject blank-like capture");

    fs.rmSync(path.join(dir,"mobile-blanklike.png"));
    fs.writeFileSync(path.join(dir,"mobile-wrong-dim.png"),fakePng(390,800,23000,0x34));
    rejected=false;
    try{inspect(dir,{minCount:2,minBytes:20000});}catch(e){rejected=/unexpected dimensions/.test(e.message);}
    if(!rejected) throw new Error("self-test failed to reject wrong dimensions");

    console.log("PASS_V2_MULTISCREEN_CAPTURE_INTEGRITY_SELF_TEST");
  } finally {
    fs.rmSync(dir,{recursive:true,force:true});
  }
}

if(process.argv.includes("--self-test")) selfTest();
else inspect(process.env.MODARYX_MULTISCREEN_DIR||DEFAULT_DIR);
