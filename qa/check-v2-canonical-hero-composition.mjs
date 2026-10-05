import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN || "http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9229;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--hide-scrollbars",
  "--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-canon-hero-composition",
  "about:blank"
],{stdio:"ignore"});

let ws; let nextId=1;
const pending=new Map();
function send(method,params={}) {
  const id=nextId++; ws.send(JSON.stringify({id,method,params}));
  return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
}
async function waitJson(path){
  let last;
  for(let i=0;i<200;i++){
    try{const r=await fetch(`http://127.0.0.1:${port}${path}`); if(r.ok)return await r.json(); last=new Error("HTTP "+r.status);}
    catch(e){last=e;}
    await sleep(100);
  }
  throw last||new Error("CDP unavailable");
}
async function evaluate(expression){
  const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails) throw new Error(r.exceptionDetails.text||"Runtime.evaluate failed");
  return r.result?.result?.value;
}
async function navigate(width,height,mobile){
  await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile});
  await send("Page.navigate",{url:origin});
  for(let i=0;i<80;i++){
    if(await evaluate("document.readyState === 'complete'")) break;
    await sleep(100);
  }
  await sleep(350);
}
function assert(condition,message){ if(!condition) throw new Error(message); }

async function inspect(label,width,height,mobile){
  await navigate(width,height,mobile);
  const data=await evaluate(`(() => {
    const hero=document.querySelector('.canon-reconciled-hero');
    const copy=document.querySelector('.editorial-hero-copy');
    const traveler=document.querySelector('.canon-traveler');
    const wolf=document.querySelector('.canon-wolf');
    const dragon=document.querySelector('.canon-dragon');
    if(!hero||!copy||!traveler||!wolf||!dragon) return {missing:true,presence:{hero:!!hero,copy:!!copy,traveler:!!traveler,wolf:!!wolf,dragon:!!dragon},bodyText:document.body.innerText.slice(0,180)};
    const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
    const hr=rect(hero), cr=rect(copy);
    const items={traveler:rect(traveler),wolf:rect(wolf),dragon:rect(dragon)};
    const visibleRatio=(r)=>{
      const left=Math.max(r.left,hr.left),right=Math.min(r.right,hr.right),top=Math.max(r.top,hr.top),bottom=Math.min(r.bottom,hr.bottom);
      const area=Math.max(0,right-left)*Math.max(0,bottom-top);
      return r.width*r.height?area/(r.width*r.height):0;
    };
    const overlapRatio=(a,b)=>{
      const left=Math.max(a.left,b.left),right=Math.min(a.right,b.right),top=Math.max(a.top,b.top),bottom=Math.min(a.bottom,b.bottom);
      const area=Math.max(0,right-left)*Math.max(0,bottom-top);
      return a.width*a.height?area/(a.width*a.height):0;
    };
    return {
      missing:false,
      hero:hr,
      copy:cr,
      pointerEvents:getComputedStyle(document.querySelector('.canon-narrative-layer')).pointerEvents,
      ariaHidden:document.querySelector('.canon-narrative-layer').getAttribute('aria-hidden'),
      items:Object.fromEntries(Object.entries(items).map(([k,r])=>[k,{...r,visibleRatio:visibleRatio(r),copyOverlapRatio:overlapRatio(r,cr)}]))
    };
  })()`);
  assert(!data?.missing,label+": canonical hero nodes missing "+JSON.stringify(data));
  assert(data.pointerEvents==="none",label+": narrative layer must not intercept input");
  assert(data.ariaHidden==="true",label+": narrative layer must remain decorative");
  const minVisible=mobile?0.66:0.72;
  const maxCopyOverlap=mobile?0.08:0.12;
  for(const [name,item] of Object.entries(data.items)){
    assert(item.visibleRatio>=minVisible,`${label}: ${name} visible ratio ${item.visibleRatio.toFixed(3)} < ${minVisible}`);
    assert(item.copyOverlapRatio<=maxCopyOverlap,`${label}: ${name} overlaps hero copy ${item.copyOverlapRatio.toFixed(3)} > ${maxCopyOverlap}`);
    const centerY=(item.top+item.bottom)/2;
    const heroStart=data.hero.top+data.hero.height*0.48;
    assert(centerY>=heroStart,`${label}: ${name} escaped lower narrative zone`);
  }
  console.log("CANON_HERO_COMPOSITION",label,JSON.stringify(data.items));
  return data;
}

try{
  await waitJson("/json/version");
  const targets=await waitJson("/json/list");
  const page=targets.find(x=>x.type==="page");
  if(!page?.webSocketDebuggerUrl) throw new Error("page target missing");
  ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});
  ws.addEventListener("message",event=>{
    const msg=JSON.parse(event.data);
    if(!msg.id||!pending.has(msg.id)) return;
    const p=pending.get(msg.id); pending.delete(msg.id);
    msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg);
  });
  await send("Page.enable"); await send("Runtime.enable");
  await inspect("desktop",1440,1024,false);
  await inspect("mobile",390,844,true);
  console.log("PASS_V2_CANON_HERO_COMPOSITION");
} finally {
  try{ws?.close();}catch{}
  proc.kill("SIGTERM");
}
