import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9237;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--hide-scrollbars","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-tablet-reflow","about:blank"
],{stdio:"ignore"});

let ws;
let nextId=1;
const pending=new Map();
function send(method,params={}){
  const id=nextId++;
  ws.send(JSON.stringify({id,method,params}));
  return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
}
async function evaluate(expression){
  const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails) throw new Error(r.exceptionDetails.text||"Runtime.evaluate failed");
  return r.result?.result?.value;
}
async function waitJson(path){
  let last;
  for(let i=0;i<120;i++){
    try{
      const r=await fetch("http://127.0.0.1:"+port+path);
      if(r.ok) return await r.json();
      last=new Error("HTTP "+r.status);
    }catch(e){last=e}
    await sleep(100);
  }
  throw last||new Error("CDP unavailable");
}
async function waitBodyText(value){
  for(let i=0;i<100;i++){
    if(await evaluate("document.body?.textContent.includes("+JSON.stringify(value)+")")) return;
    await sleep(75);
  }
  throw new Error("missing text: "+value);
}
async function clickText(selector,text){
  const ok=await evaluate(`(() => {
    const b=[...document.querySelectorAll(${JSON.stringify(selector)})].find(el=>el.textContent.trim()===${JSON.stringify(text)} && getComputedStyle(el).display!=='none');
    if(!b||b.disabled) return false;
    b.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click "+text);
  await sleep(100);
}
async function navigatePrimary(text){
  const result=await evaluate(`(async () => {
    const nav=document.querySelector('.global-nav');
    const menu=document.querySelector('.mobile-menu');
    if(!nav||!menu) return {ok:false,reason:'shell-missing'};
    if(!nav.classList.contains('open')){
      menu.click();
      await new Promise(resolve=>setTimeout(resolve,180));
    }
    const button=[...document.querySelectorAll('.global-nav button')].find(el=>el.textContent.trim()===${JSON.stringify(text)});
    if(!button||button.disabled||button.getBoundingClientRect().width===0) return {ok:false,reason:'target-unavailable',open:nav.classList.contains('open')};
    button.click();
    await new Promise(resolve=>setTimeout(resolve,260));
    const active=[...document.querySelectorAll('.global-nav button')].find(el=>el.classList.contains('active'))?.textContent.trim()||'';
    return {ok:true,active};
  })()`);
  if(!result?.ok||result.active!==text) throw new Error("tablet primary navigation failed "+text+" "+JSON.stringify(result));
}
async function navigateUtility(text){
  const result=await evaluate(`(async () => {
    const nav=document.querySelector('.global-nav');
    const menu=document.querySelector('.mobile-menu');
    if(!nav||!menu) return {ok:false,reason:'shell-missing'};
    if(!nav.classList.contains('open')){
      menu.click();
      await new Promise(resolve=>setTimeout(resolve,180));
    }
    const button=[...document.querySelectorAll('.global-nav .mobile-nav-utility')].find(el=>el.textContent.trim()===${JSON.stringify(text)});
    if(!button||button.disabled||button.getBoundingClientRect().width===0) return {ok:false,reason:'target-unavailable',open:nav.classList.contains('open')};
    button.click();
    await new Promise(resolve=>setTimeout(resolve,260));
    return {ok:true};
  })()`);
  if(!result?.ok) throw new Error("tablet utility navigation failed "+text+" "+JSON.stringify(result));
}
async function assertNoOverflow(label){
  const result=await evaluate(`(() => {
    const de=document.documentElement;
    const overflow=de.scrollWidth-de.clientWidth;
    const offenders=[...document.querySelectorAll('body *')].filter(el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.right>de.clientWidth+1;
    }).slice(0,8).map(el=>({tag:el.tagName,cls:el.className?.toString?.().slice(0,80)||'',right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)}));
    return {overflow,offenders};
  })()`);
  console.log("TABLET_REFLOW",label,result.overflow);
  if(result.overflow>1) throw new Error(label+" horizontal overflow "+result.overflow+" "+JSON.stringify(result.offenders));
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
    msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg);
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:834,height:1112,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:origin});
  for(let i=0;i<80;i++){
    if(await evaluate("document.readyState==='complete'")) break;
    await sleep(75);
  }
  await waitBodyText("Catalogue consultable — téléchargement non garanti");
  await assertNoOverflow("game-hub");

  await navigatePrimary("Jeux");
  await waitBodyText("Trouvez votre prochain terrain de jeu");
  await assertNoOverflow("games-index");

  await navigatePrimary("Mods & contenus");
  await waitBodyText("Catalogue global");
  await assertNoOverflow("catalog");

  await navigatePrimary("Collections");
  await waitBodyText("Organiser n’est pas installer.");
  await assertNoOverflow("collections");

  await navigatePrimary("Créateurs");
  await waitBodyText("Créateurs, équipes et studios.");
  await assertNoOverflow("creators");

  await navigatePrimary("Communauté");
  await waitBodyText("Des échanges utiles autour des créations.");
  await assertNoOverflow("community");

  await navigatePrimary("Créer");
  await waitBodyText("Creator Studio");
  await assertNoOverflow("creator-studio");

  await navigateUtility("Bibliothèque");
  await waitBodyText("Retrouvez favoris, suivis, collections, profils et historique");
  await assertNoOverflow("library");

  await navigateUtility("Compte");
  await waitBodyText("Compte & préférences");
  await assertNoOverflow("account");

  await navigateUtility("MODARYX IA");
  await waitBodyText("Une IA native du produit, pas un chatbot greffé.");
  await assertNoOverflow("modaryx-ai");

  await clickText("footer button","Droits jeux · démo admin");
  await waitBodyText("Droits des jeux");
  await assertNoOverflow("rights-dashboard");

  await clickText(".support-triage-actions button","Accepter la baseline sûre");
  await waitBodyText("ACCEPTED_SAFE_BASELINE");
  await clickText(".publisher-contact-actions button","Vérifier le canal de démonstration");
  await clickText(".publisher-contact-actions button","Préparer la demande structurée");
  await waitBodyText("REQUEST_READY");
  await assertNoOverflow("rights-expanded");

  console.log("TABLET_REFLOW_SURFACE_COUNT",12);
  console.log("PASS_V2_TABLET_REFLOW");
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
