import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9239;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--hide-scrollbars","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-narrow-reflow","about:blank"
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
async function waitText(value){
  for(let i=0;i<100;i++){
    if(await evaluate("document.body?.textContent.includes("+JSON.stringify(value)+")")) return;
    await sleep(75);
  }
  throw new Error("missing text: "+value);
}
async function openMenu(){
  const result=await evaluate(`(async () => {
    const nav=document.querySelector('.global-nav');
    const menu=document.querySelector('.mobile-menu');
    if(!nav||!menu) return false;
    if(!nav.classList.contains('open')){
      menu.click();
      await new Promise(resolve=>setTimeout(resolve,140));
    }
    return nav.classList.contains('open');
  })()`);
  if(!result) throw new Error("mobile menu unavailable");
}
async function navigatePrimary(text){
  await openMenu();
  const result=await evaluate(`(async () => {
    const b=[...document.querySelectorAll('.global-nav button')].find(el=>el.textContent.trim()===${JSON.stringify(text)});
    if(!b||b.disabled||b.getBoundingClientRect().width===0) return false;
    b.click();
    await new Promise(resolve=>setTimeout(resolve,220));
    return true;
  })()`);
  if(!result) throw new Error("primary navigation failed: "+text);
}
async function navigateUtility(text){
  await openMenu();
  const result=await evaluate(`(async () => {
    const b=[...document.querySelectorAll('.global-nav .mobile-nav-utility')].find(el=>el.textContent.trim()===${JSON.stringify(text)});
    if(!b||b.disabled||b.getBoundingClientRect().width===0) return false;
    b.click();
    await new Promise(resolve=>setTimeout(resolve,220));
    return true;
  })()`);
  if(!result) throw new Error("utility navigation failed: "+text);
}
async function clickText(selector,text){
  const ok=await evaluate(`(() => {
    const b=[...document.querySelectorAll(${JSON.stringify(selector)})].find(el=>el.textContent.includes(${JSON.stringify(text)}) && getComputedStyle(el).display!=='none');
    if(!b||b.disabled) return false;
    b.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click: "+text);
  await sleep(120);
}
async function assertNoOverflow(label){
  const result=await evaluate(`(() => {
    const de=document.documentElement;
    const overflow=de.scrollWidth-de.clientWidth;
    const offenders=[...document.querySelectorAll('body *')].filter(el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.right>de.clientWidth+1;
    }).slice(0,10).map(el=>({tag:el.tagName,cls:el.className?.toString?.().slice(0,80)||'',right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)}));
    return {overflow,offenders};
  })()`);
  console.log("NARROW_REFLOW",label,result.overflow);
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
  await send("Emulation.setDeviceMetricsOverride",{width:320,height:900,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:origin});
  for(let i=0;i<80;i++){
    if(await evaluate("document.readyState==='complete'")) break;
    await sleep(75);
  }
  await waitText("Catalogue consultable — téléchargement non garanti");
  await assertNoOverflow("game-hub");

  await navigatePrimary("Jeux");
  await waitText("Trouvez votre prochain terrain de jeu");
  await assertNoOverflow("games-index");

  await navigatePrimary("Mods & contenus");
  await waitText("Catalogue global");
  await assertNoOverflow("catalog");

  await navigatePrimary("Collections");
  await waitText("Organiser n’est pas installer.");
  await assertNoOverflow("collections");

  await navigatePrimary("Créateurs");
  await waitText("Créateurs, équipes et studios.");
  await assertNoOverflow("creators");

  await navigatePrimary("Communauté");
  await waitText("Des échanges utiles autour des créations.");
  await assertNoOverflow("community");

  await navigatePrimary("Créer");
  await waitText("Creator Studio");
  await assertNoOverflow("creator-studio");

  await navigateUtility("Bibliothèque");
  await waitText("Retrouvez favoris, suivis, collections, profils et historique");
  await assertNoOverflow("library");

  await navigateUtility("Compte");
  await waitText("Compte & préférences");
  const accountGeometry=await evaluate(`(() => {
    const pick=(selector)=>{const el=document.querySelector(selector);if(!el)return null;const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {selector,width:r.width,right:r.right,left:r.left,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,minWidth:s.minWidth,maxWidth:s.maxWidth,widthStyle:s.width,gridTemplateColumns:s.gridTemplateColumns,overflowX:s.overflowX,display:s.display};};
    return {viewport:document.documentElement.clientWidth,documentScrollWidth:document.documentElement.scrollWidth,page:pick('.account-center'),shell:pick('.account-shell'),nav:pick('.account-nav'),panel:pick('.account-panel'),actions:pick('.account-actions')};
  })()`);
  console.log("ACCOUNT_NARROW_GEOMETRY",JSON.stringify(accountGeometry));
  await assertNoOverflow("account");

  await navigateUtility("MODARYX IA");
  await waitText("Une IA native du produit, pas un chatbot greffé.");
  await assertNoOverflow("modaryx-ai");

  await clickText("footer button","Droits jeux · démo admin");
  await waitText("Droits des jeux");
  await assertNoOverflow("rights-dashboard");

  await clickText(".support-triage-actions button","Accepter la baseline sûre");
  await clickText(".publisher-contact-actions button","Vérifier le canal de démonstration");
  await clickText(".publisher-contact-actions button","Préparer la demande structurée");
  await waitText("REQUEST_READY");
  await assertNoOverflow("rights-expanded");

  console.log("NARROW_REFLOW_SURFACE_COUNT",12);
  console.log("PASS_V2_NARROW_REFLOW_320");
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
