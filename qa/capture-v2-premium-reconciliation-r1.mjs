import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4194";
const candidateSha=process.env.MODARYX_CANDIDATE_SHA;
if(!chrome) throw new Error("CHROME_BIN missing");
if(!candidateSha) throw new Error("MODARYX_CANDIDATE_SHA missing");

const routes=[
  ["discover","/discover","Redécouvrez vos jeux"],
  ["games","/games","Trouvez votre prochain terrain de jeu"],
  ["game-hub","/games/aetherlands","Mes profils pour ce jeu"],
  ["mods","/mods","Catalogue global"],
  ["collections","/collections","Organiser n’est pas installer"],
  ["creators","/creators","Créateurs, équipes et studios"],
  ["community","/community","Des échanges utiles autour des créations"],
  ["notifications","/notifications","Centre de notifications"],
];
const viewports=[
  ["desktop",1440,1024,false],
  ["mobile",390,844,true],
];

const port=9237;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--hide-scrollbars",
  "--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-premium-r1-cdp","about:blank"
],{stdio:"ignore"});

let ws;
let nextId=1;
const pending=new Map();

function send(method,params={}){
  const id=nextId++;
  ws.send(JSON.stringify({id,method,params}));
  return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
}
async function waitJson(path){
  let last;
  for(let i=0;i<100;i++){
    try{
      const r=await fetch(`http://127.0.0.1:${port}${path}`);
      if(r.ok) return await r.json();
      last=new Error("HTTP "+r.status);
    }catch(e){last=e;}
    await sleep(100);
  }
  throw last||new Error("CDP unavailable");
}
async function evaluate(expression){
  const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.text||"Runtime.evaluate failed");
  return r.result?.result?.value;
}
async function setViewport(width,height,mobile){
  await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile});
}
async function openRoute(path,width,height,mobile,expected){
  await setViewport(width,height,mobile);
  await send("Page.navigate",{url:origin+path});
  for(let i=0;i<80;i++){
    if(await evaluate("document.readyState === 'complete'")) break;
    await sleep(100);
  }
  let ok=false;
  for(let i=0;i<50;i++){
    ok=Boolean(await evaluate(`document.body.innerText.includes(${JSON.stringify(expected)})`));
    if(ok) break;
    await sleep(100);
  }
  if(!ok){
    const text=await evaluate("document.body.innerText.slice(0,1000)");
    throw new Error("Expected text missing for "+path+": "+expected+"\n"+text);
  }
  await evaluate("window.scrollTo({top:0,left:0,behavior:'auto'}); true");
  await sleep(350);
}
async function capture(name,width,height){
  const overflow=await evaluate(`Math.max(0,document.documentElement.scrollWidth-${width})`);
  if(Number(overflow)>1) throw new Error(`${name} horizontal overflow ${overflow}`);
  const shot=await send("Page.captureScreenshot",{
    format:"png",fromSurface:true,captureBeyondViewport:false,
    clip:{x:0,y:0,width,height,scale:1}
  });
  const data=Buffer.from(shot.result.data,"base64");
  if(data.length<15000) throw new Error(`${name} suspiciously small screenshot ${data.length}`);
  const dir="proof-output/modaryx-v2-premium-visual-r1";
  mkdirSync(dir,{recursive:true});
  const file=`${dir}/${name}.png`;
  writeFileSync(file,data);
  return {
    file:name+".png",
    width,height,
    bytes:data.length,
    overflow:Number(overflow),
    sha256:createHash("sha256").update(data).digest("hex")
  };
}

try{
  await waitJson("/json/version");
  const targets=await waitJson("/json/list");
  const target=targets.find(x=>x.type==="page");
  if(!target?.webSocketDebuggerUrl) throw new Error("page target missing");
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{
    ws.addEventListener("open",resolve,{once:true});
    ws.addEventListener("error",reject,{once:true});
  });
  ws.addEventListener("message",event=>{
    const msg=JSON.parse(event.data);
    if(!msg.id||!pending.has(msg.id)) return;
    const p=pending.get(msg.id); pending.delete(msg.id);
    if(msg.error) p.reject(new Error(msg.error.message)); else p.resolve(msg);
  });
  await send("Page.enable");
  await send("Runtime.enable");

  const captures=[];
  for(const [vp,width,height,mobile] of viewports){
    for(const [id,path,expected] of routes){
      await openRoute(path,width,height,mobile,expected);
      captures.push(await capture(`${vp}-${id}`,width,height));
    }
  }
  const manifest={
    schemaVersion:1,
    candidateSha,
    proofSha:process.env.GITHUB_SHA,
    status:"EN COURS",
    humanVisualApproval:"PENDING",
    promotionAllowed:false,
    captureCount:captures.length,
    captures
  };
  const dir="proof-output/modaryx-v2-premium-visual-r1";
  writeFileSync(dir+"/manifest.json",JSON.stringify(manifest,null,2)+"\n");
  console.log("PREMIUM_VISUAL_CAPTURE_COUNT",captures.length);
  console.log("PASS_MODARYX_V2_PREMIUM_VISUAL_R1_CAPTURE");
}finally{
  try{ws?.close();}catch{}
  proc.kill("SIGTERM");
}
