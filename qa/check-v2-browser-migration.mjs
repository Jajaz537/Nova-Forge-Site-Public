import {spawn} from "node:child_process";
import {readFileSync, writeFileSync} from "node:fs";
import {setTimeout as sleep} from "node:timers/promises";
import assert from "node:assert/strict";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4176";
if(!chrome) throw new Error("CHROME_BIN missing");
const port=19000+(process.pid%1000);
const proc=spawn(chrome,["--headless=new","--no-sandbox","--disable-gpu","--remote-debugging-port="+port,"--user-data-dir=/tmp/modaryx-v2-migration-cdp-"+process.pid,"about:blank"],{stdio:"ignore"});
let ws,nextId=1;const pending=new Map();
const wait=async path=>{let last;for(let i=0;i<200;i++){try{const r=await fetch("http://127.0.0.1:"+port+path);if(r.ok)return await r.json();last=new Error("HTTP "+r.status);}catch(e){last=e}await sleep(100)}throw last||new Error("CDP unavailable")};
const send=(method,params={})=>{const id=nextId++;ws.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}))};
const evaluate=async expression=>{const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval failed");return r.result?.result?.value};
const navigate=async()=>{await send("Page.navigate",{url:origin});for(let i=0;i<80;i++){if(await evaluate("document.readyState==='complete'"))break;await sleep(100)}await sleep(400)};
const previewPidFile="/tmp/modaryx-v2-migration.pid";
let restartedPreview=null;
async function waitOrigin(up){
  let last;
  for(let i=0;i<80;i++){
    try{
      const r=await fetch(origin,{cache:"no-store"});
      if(up && r.ok) return;
      if(!up) last=new Error("origin-still-up");
    }catch(e){
      if(!up) return;
      last=e;
    }
    await sleep(100);
  }
  throw last||new Error(up?"origin-did-not-start":"origin-did-not-stop");
}
async function stopPreview(){
  const pid=Number(readFileSync(previewPidFile,"utf8").trim());
  if(!Number.isInteger(pid)||pid<=0) throw new Error("preview-pid-invalid");
  process.kill(pid,"SIGTERM");
  await waitOrigin(false);
}
async function restartPreview(){
  restartedPreview=spawn(process.execPath,["./node_modules/vite/bin/vite.js","preview","--host","127.0.0.1","--port","4176"],{cwd:"v2-preview",stdio:"ignore"});
  writeFileSync(previewPidFile,String(restartedPreview.pid));
  await waitOrigin(true);
}

try{
  await wait("/json/version");
  const targets=await wait("/json/list");
  const target=targets.find(x=>x.type==="page"); if(!target?.webSocketDebuggerUrl) throw new Error("page target missing");
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true})});
  ws.addEventListener("message",event=>{const msg=JSON.parse(event.data);if(!msg.id||!pending.has(msg.id))return;const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg)});
  await send("Page.enable");await send("Runtime.enable");await send("Network.enable");
  await navigate();
  assert.equal(await evaluate("document.body.innerText.includes('Mes profils pour ce jeu')"),true);

  const seed=await evaluate(`(() => {
    localStorage.clear();
    localStorage.setItem("nova-forge:catalog:favorites:v1", JSON.stringify(["mod.alpha","mod.beta"]));
    localStorage.setItem("nova-forge:catalog:saved-views:v1", JSON.stringify([{id:"view-1",name:"Pack legacy",filters:{q:"dragon",kind:"pack",game:"aetherlands",favoritesOnly:true}}]));
    localStorage.setItem("nova-forge:community:collection:v1", JSON.stringify({schemaVersion:1,id:"collection-1",name:"Collection",itemIds:["mod.alpha"],syncState:"local-only",visibility:"private-local",ownerProfileId:null}));
    localStorage.setItem("nova-forge:community:submission:v1", JSON.stringify({schemaVersion:1,id:"discussion-1",kind:"discussion",targetId:"mod.alpha",title:"Titre",body:"Texte",authorProfileId:null,syncState:"local-only",publicationState:"local-draft",moderationState:"not-submitted"}));
    localStorage.setItem("nova_site_shell_preferences_v1", JSON.stringify({motion:"reduced"}));
    return true;
  })()`);
  assert.equal(seed,true);
  await navigate();

  const state=await evaluate(`(() => ({
    favorites:JSON.parse(localStorage.getItem("modaryx:v2:favorites")||"null"),
    searches:JSON.parse(localStorage.getItem("modaryx:v2:saved-searches")||"null"),
    collection:JSON.parse(localStorage.getItem("modaryx:v2:collection-drafts")||"null"),
    community:JSON.parse(localStorage.getItem("modaryx:v2:community-draft")||"null"),
    prefs:JSON.parse(localStorage.getItem("modaryx:v2:preferences")||"null"),
    marker:JSON.parse(localStorage.getItem("modaryx:v2:migration:v1")||"null"),
    legacyFavorites:localStorage.getItem("nova-forge:catalog:favorites:v1")
  }))()`);
  assert.deepEqual(state.favorites.items,["mod.alpha","mod.beta"]);
  assert.equal(state.searches.partial,true);
  assert.equal(state.collection.drafts[0].items[0].contentId,"mod.alpha");
  assert.equal(state.community.publicationState,"local-draft");
  assert.equal(state.prefs.reducedMotion,true);
  assert.equal(state.marker.nonDestructive,true);
  assert.notEqual(state.legacyFavorites,null);
  console.log("MIGRATION_ASSERT localStorage first pass non-destructive");

  await evaluate(`(async()=>{const a=await caches.open("modaryx-site-v120-scalable");await a.put("/legacy.css",new Response("legacy"));const u=await caches.open("third-party-unknown-v1");await u.put("/keep",new Response("keep"));return true})()`);
  const registered=await evaluate(`(async()=>{const r=await navigator.serviceWorker.register("/sw-v2-preview.js",{scope:"/",updateViaCache:"none"});await new Promise((resolve,reject)=>{if(r.active)return resolve();const timer=setTimeout(()=>reject(new Error("sw-timeout")),8000);r.addEventListener("updatefound",()=>{const w=r.installing;w?.addEventListener("statechange",()=>{if(w.state==="activated"){clearTimeout(timer);resolve()}})})});return true})()`);
  assert.equal(registered,true);
  await sleep(500);
  const cacheState=await evaluate(`(async()=>{const k=await caches.keys();return {keys:k,legacy:k.includes("modaryx-site-v120-scalable"),unknown:k.includes("third-party-unknown-v1"),v2:k.includes("modaryx-v2-preview-shell-v1")}})()`);
  assert.equal(cacheState.legacy,false);
  assert.equal(cacheState.unknown,true);
  assert.equal(cacheState.v2,true);
  console.log("MIGRATION_ASSERT explicit legacy cache removed unknown cache preserved");

  await navigate();
  assert.equal(await evaluate("Boolean(navigator.serviceWorker.controller)"),true);
  await sleep(300);
  await stopPreview();
  await send("Page.navigate",{url:origin});
  for(let i=0;i<80;i++){if(await evaluate("document.readyState==='complete'"))break;await sleep(100)}
  await sleep(500);
  const offlineBody=await evaluate("document.body.innerText.slice(0,1400)");
  assert.equal(offlineBody.includes("Mes profils pour ce jeu"),true,"offline navigation did not restore the Game Hub shell: "+offlineBody);
  console.log("MIGRATION_ASSERT offline controlled navigation works with origin stopped");

  await restartPreview();
  const rolled=await evaluate(`(async()=>{const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()));await caches.delete("modaryx-v2-preview-shell-v1");const keys=await caches.keys();return {unknown:keys.includes("third-party-unknown-v1"),legacy:keys.includes("modaryx-site-v120-scalable")}})()`);
  assert.equal(rolled.unknown,true);
  assert.equal(rolled.legacy,false);
  await navigate();
  assert.equal(await evaluate("document.body.innerText.includes('Mes profils pour ce jeu')"),true);
  console.log("MIGRATION_ASSERT rollback leaves app usable and unknown cache intact");
  console.log("PASS_V2_BROWSER_MIGRATION_MICROPROOF");
} finally {
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
  try{restartedPreview?.kill("SIGTERM")}catch{}
}
