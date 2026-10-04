import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN||"http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9247;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--hide-scrollbars","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-text-spacing-"+process.pid,"about:blank"
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
  for(let i=0;i<180;i++){
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
  for(let i=0;i<120;i++){
    if(await evaluate("document.body?.textContent.includes("+JSON.stringify(value)+")")) return;
    await sleep(75);
  }
  throw new Error("missing text: "+value);
}
async function openMenu(){
  const ok=await evaluate(`(async()=>{
    const nav=document.querySelector('.global-nav');
    const menu=document.querySelector('.mobile-menu');
    if(!nav) return false;
    const r=nav.getBoundingClientRect(),s=getComputedStyle(nav);
    if(s.display!=='none'&&r.width>0&&r.height>0) return true;
    if(!menu) return false;
    menu.click();
    await new Promise(resolve=>setTimeout(resolve,180));
    const nr=nav.getBoundingClientRect(),ns=getComputedStyle(nav);
    return ns.display!=='none'&&nr.width>0&&nr.height>0;
  })()`);
  if(!ok) throw new Error("navigation unavailable");
}
async function navigatePrimary(text){
  await openMenu();
  const ok=await evaluate(`(async()=>{
    const b=[...document.querySelectorAll('.global-nav button')].find(el=>el.textContent.trim()===${JSON.stringify(text)});
    if(!b||b.disabled||b.getBoundingClientRect().width===0) return false;
    b.click();
    await new Promise(resolve=>setTimeout(resolve,240));
    return true;
  })()`);
  if(!ok) throw new Error("primary navigation failed: "+text);
}
async function navigateUtility(text){
  const top=await evaluate(`(async()=>{
    const b=[...document.querySelectorAll('.top-actions button')].find(el=>el.getAttribute('aria-label')===${JSON.stringify(text)});
    if(!b||b.disabled||b.getBoundingClientRect().width===0) return false;
    b.click(); await new Promise(resolve=>setTimeout(resolve,220)); return true;
  })()`);
  if(top) return;
  await openMenu();
  const ok=await evaluate(`(async()=>{
    const b=[...document.querySelectorAll('.global-nav .mobile-nav-utility')].find(el=>el.textContent.trim()===${JSON.stringify(text)});
    if(!b||b.disabled||b.getBoundingClientRect().width===0) return false;
    b.click(); await new Promise(resolve=>setTimeout(resolve,220)); return true;
  })()`);
  if(!ok) throw new Error("utility navigation failed: "+text);
}
async function clickText(selector,text){
  const ok=await evaluate(`(()=>{
    const b=[...document.querySelectorAll(${JSON.stringify(selector)})].find(el=>el.textContent.includes(${JSON.stringify(text)})&&getComputedStyle(el).display!=='none');
    if(!b||b.disabled) return false;
    b.click(); return true;
  })()`);
  if(!ok) throw new Error("unable to click: "+text);
  await sleep(140);
}
async function assertSpacing(label){
  const result=await evaluate(`(()=>{
    const de=document.documentElement;
    const visible=[...document.querySelectorAll('body *')].filter(el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
    });
    const overflow=de.scrollWidth-de.clientWidth;
    const offenders=visible.filter(el=>{
      const r=el.getBoundingClientRect();
      return r.right>de.clientWidth+1||r.left<-1;
    }).slice(0,10).map(el=>({tag:el.tagName,cls:(el.className||'').toString().slice(0,90),left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)}));
    const clippedText=visible.filter(el=>{
      const s=getComputedStyle(el);
      const hasText=[...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
      if(!hasText) return false;
      if(s.overflowX==='auto'||s.overflowX==='scroll'||s.whiteSpace==='nowrap') return false;
      return el.scrollWidth>el.clientWidth+2;
    }).slice(0,10).map(el=>({tag:el.tagName,cls:(el.className||'').toString().slice(0,90),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,text:el.textContent.trim().slice(0,80)}));
    return {overflow,offenders,clippedText};
  })()`);
  console.log("TEXT_SPACING_REFLOW",label,result.overflow,"CLIPPED",result.clippedText.length);
  if(result.overflow>1) throw new Error(label+" horizontal overflow "+result.overflow+" "+JSON.stringify(result.offenders));
  if(result.clippedText.length) throw new Error(label+" clipped text "+JSON.stringify(result.clippedText));
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
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:origin});
  for(let i=0;i<100;i++){
    if(await evaluate("document.readyState==='complete'")) break;
    await sleep(75);
  }
  await waitText("Catalogue consultable — téléchargement non garanti");

  await evaluate(`(()=>{
    const style=document.createElement('style');
    style.id='qa-text-spacing';
    style.textContent='*:not(svg):not(path){line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p{margin-bottom:2em!important}';
    document.head.appendChild(style);
    return true;
  })()`);
  await sleep(200);

  await assertSpacing("game-hub");
  await navigatePrimary("Jeux"); await waitText("Trouvez votre prochain terrain de jeu"); await assertSpacing("games-index");
  await navigatePrimary("Mods & contenus"); await waitText("Catalogue global"); await assertSpacing("catalog");
  await navigatePrimary("Collections"); await waitText("Organiser n’est pas installer."); await assertSpacing("collections");
  await navigatePrimary("Créateurs"); await waitText("Créateurs, équipes et studios."); await assertSpacing("creators");
  await navigatePrimary("Communauté"); await waitText("Des échanges utiles autour des créations."); await assertSpacing("community");
  await navigatePrimary("Créer"); await waitText("Creator Studio"); await assertSpacing("creator-studio");
  await navigateUtility("Bibliothèque"); await waitText("Retrouvez favoris, suivis, collections, profils et historique"); await assertSpacing("library");
  await navigateUtility("Compte"); await waitText("Compte & préférences"); await assertSpacing("account");
  await navigateUtility("MODARYX IA"); await waitText("Une IA native du produit, pas un chatbot greffé."); await assertSpacing("modaryx-ai");
  await clickText("footer button","Droits jeux · démo admin"); await waitText("Droits des jeux"); await assertSpacing("rights-dashboard");
  await clickText("footer button","Confiance & légal"); await waitText("Confiance, informations légales et transparence."); await assertSpacing("public-trust");
  await clickText("footer button","Aide & documentation"); await waitText("Comprendre MODARYX sans deviner."); await assertSpacing("help-docs");
  await clickText("footer button","Modération · démo admin"); await waitText("Modération, signalements et appels."); await assertSpacing("moderation-center");
  await clickText("footer button","Droits jeux · démo admin"); await waitText("Droits des jeux");
  await clickText(".support-triage-actions button","Accepter la baseline sûre");
  await clickText(".publisher-contact-actions button","Vérifier le canal de démonstration");
  await clickText(".publisher-contact-actions button","Préparer la demande structurée");
  await waitText("REQUEST_READY");
  await assertSpacing("rights-expanded");

  console.log("TEXT_SPACING_SURFACE_COUNT",15);
  console.log("PASS_V2_TEXT_SPACING_REFLOW");
}finally{
  try{ws?.close()}catch{}
  proc.kill("SIGTERM");
}
