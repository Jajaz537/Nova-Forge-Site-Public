import {spawn} from "node:child_process";
import {setTimeout as sleep} from "node:timers/promises";
import assert from "node:assert/strict";
const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4183";
if(!chrome) throw new Error("CHROME_BIN missing");
const routes=[
  ["/","Mes profils pour ce jeu"],
  ["/discover","Redécouvrez vos jeux"],
  ["/games","Jeux disponibles"],
  ["/games/aetherlands","Mes profils pour ce jeu"],
  ["/mods","Mods & contenus"],
  ["/search","Recherche"],
  ["/collections","Collections"],
  ["/creators","Créateurs"],
  ["/community","Des échanges utiles"],
  ["/studio","Studio"],
  ["/library","Bibliothèque"],
  ["/account","Vous explorez MODARYX en mode invité."],
  ["/notifications","Centre de notifications"],
  ["/rights","Droits jeux"],
  ["/ai","MODARYX IA"],
  ["/trust","Confiance"],
  ["/help","Aide"],
  ["/moderation","Modération"],
  ["/content/sentiers-de-laube","Sentiers de l’aube"],
];
const port=21800+(process.pid%500);
const proc=spawn(chrome,["--headless=new","--no-sandbox","--disable-gpu","--remote-debugging-port="+port,"--user-data-dir=/tmp/modaryx-route-"+process.pid,"about:blank"],{stdio:"ignore"});
let ws,nextId=1;const pending=new Map();
const wait=async path=>{let last;for(let i=0;i<200;i++){try{const r=await fetch("http://127.0.0.1:"+port+path);if(r.ok)return await r.json();last=new Error("HTTP "+r.status)}catch(e){last=e}await sleep(100)}throw last||new Error("CDP unavailable")};
const send=(method,params={})=>{const id=nextId++;ws.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}))};
const evalv=async expression=>{const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval failed");return r.result?.result?.value};
try{
  await wait("/json/version");const targets=await wait("/json/list");const target=targets.find(x=>x.type==="page");
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true})});
  ws.addEventListener("message",event=>{const m=JSON.parse(event.data);if(!m.id||!pending.has(m.id))return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m)});
  await send("Page.enable");await send("Runtime.enable");
  for(const [path,text] of routes){
    await send("Page.navigate",{url:origin+path});
    for(let i=0;i<80;i++){if(await evalv("document.readyState==='complete'"))break;await sleep(100)}
    let ok=false;for(let i=0;i<40;i++){ok=await evalv(`document.body.innerText.includes(${JSON.stringify(text)})`);if(ok)break;await sleep(100)}
    assert.equal(ok,true,"deep link failed "+path+" expected "+text);
    assert.equal(await evalv("location.pathname"),path);
    console.log("ROUTE_ASSERT",path,text);
  }
  await send("Page.navigate",{url:origin});
  for(let i=0;i<80;i++){if(await evalv("document.readyState==='complete'"))break;await sleep(100)}
  const transition=await evalv(`(()=>new Promise(resolve=>{const b=[...document.querySelectorAll(".global-nav button")].find(x=>x.textContent.trim()==="Découvrir");b.click();requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(location.pathname))) }))()`);
  assert.equal(transition,"/discover");
  await send("Page.goBack");
  await sleep(400);
  assert.equal(await evalv("location.pathname"),"/");
  assert.equal(await evalv("document.body.innerText.includes('Mes profils pour ce jeu')"),true);
  console.log("ROUTE_ASSERT history back restores root Game Hub");
  console.log("PASS_V2_ROUTE_BROWSER_DEEPLINKS");
} finally {try{ws?.close()}catch{}proc.kill("SIGTERM")}
