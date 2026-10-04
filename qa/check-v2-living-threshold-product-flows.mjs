import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN || "http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9225;
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--hide-scrollbars",
  "--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-cdp-product-flows",
  "about:blank"
],{stdio:"ignore"});

let ws; let nextId=1;
const pending=new Map();
function send(method,params={}) {
  const id=nextId++;
  ws.send(JSON.stringify({id,method,params}));
  return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
}
async function waitJson(path){
  let last;
  for(let i=0;i<80;i++){
    try{const r=await fetch(`http://127.0.0.1:${port}${path}`);if(r.ok)return await r.json();last=new Error("HTTP "+r.status);}
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
async function setViewport(width,height){
  await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<760});
}
async function load(width=1440,height=1024){
  await setViewport(width,height);
  await send("Page.navigate",{url:origin});
  for(let i=0;i<60;i++){
    if(await evaluate("document.readyState === 'complete'")) break;
    await sleep(100);
  }
  await sleep(250);
}
async function waitText(text){
  const needle=text.toLocaleLowerCase("fr");
  for(let i=0;i<40;i++){
    const ok=await evaluate(`document.body.innerText.toLocaleLowerCase("fr").includes(${JSON.stringify(needle)})`);
    if(ok) return;
    await sleep(100);
  }
  const body=await evaluate("document.body.innerText.slice(0,1600)");
  throw new Error("text not found: "+text+"\n"+body);
}
async function clickText(selector,text){
  const ok=await evaluate(`(() => {
    const target=[...document.querySelectorAll(${JSON.stringify(selector)})].find(el=>{
      if(el.textContent.trim()!==${JSON.stringify(text)}) return false;
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0&&!el.disabled;
    });
    if(!target) return false; target.click(); return true;
  })()`);
  if(!ok) throw new Error("visible clickable text not found: "+text);
  await sleep(150);
}
async function clickAria(label){
  const ok=await evaluate(`(() => {
    const target=[...document.querySelectorAll('[aria-label]')].find(el=>{
      if(el.getAttribute('aria-label')!==${JSON.stringify(label)}) return false;
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0&&!el.disabled;
    });
    if(!target) return false; target.click(); return true;
  })()`);
  if(!ok) throw new Error("visible aria target not found: "+label);
  await sleep(150);
}
async function fill(selector,value){
  const ok=await evaluate(`(() => {
    const target=[...document.querySelectorAll(${JSON.stringify(selector)})].find(el=>{
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
    });
    if(!target) return false;
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
    setter.call(target,${JSON.stringify(value)});
    target.dispatchEvent(new Event('input',{bubbles:true}));
    return true;
  })()`);
  if(!ok) throw new Error("visible input not found: "+selector);
  await sleep(180);
}
async function selectValue(selector,value){
  const ok=await evaluate(`(() => {
    const target=[...document.querySelectorAll(${JSON.stringify(selector)})].find(el=>{
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
    });
    if(!target) return false;
    const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set;
    setter.call(target,${JSON.stringify(value)});
    target.dispatchEvent(new Event('change',{bubbles:true}));
    return true;
  })()`);
  if(!ok) throw new Error("visible select not found: "+selector);
  await sleep(180);
}
async function count(selector){ return await evaluate(`document.querySelectorAll(${JSON.stringify(selector)}).length`); }
function assertEqual(actual,expected,label){
  if(actual!==expected) throw new Error(`${label}: expected ${expected}, got ${actual}`);
  console.log("FLOW_ASSERT",label,actual);
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
    const p=pending.get(msg.id);pending.delete(msg.id);
    msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg);
  });
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");

  await load();
  await waitText("Mes profils pour ce jeu");
  await send("Network.emulateNetworkConditions",{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
  await sleep(250);
  await waitText("Les données locales restent consultables");
  const offlineVisible=await evaluate(`!!document.querySelector('.connectivity-banner')`);
  if(!offlineVisible) throw new Error("offline connectivity banner not visible");
  await send("Network.emulateNetworkConditions",{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await sleep(250);
  const offlineCleared=await evaluate(`!document.querySelector('.connectivity-banner')`);
  if(!offlineCleared) throw new Error("offline connectivity banner did not clear");
  console.log("FLOW_ASSERT offline state real browser transition");

  await clickText(".global-nav button","Jeux");
  await waitText("Trouvez votre prochain terrain de jeu");
  await fill(".games-index .catalog-search input","Aetherlands");
  assertEqual(await count(".game-card"),1,"games search result count");
  await clickText(".game-card button","Ouvrir le Game Hub");
  await waitText("Mes profils pour ce jeu");
  await waitText("Catalogue consultable — téléchargement non garanti");
  await clickText(".local-nav button","Collections");
  await waitText("Sélections organisées");
  await waitText("installation non disponible");
  await clickText(".local-nav button","Créateurs");
  await waitText("Écosystème créateur");
  await waitText("Atelier Boréal");
  await clickText(".local-nav button","Guides");
  await waitText("Guides de démonstration indisponibles");
  await clickText(".local-nav button","Activité");
  await waitText("Activité de démonstration");
  await clickText(".local-nav button","Mods & contenus");
  await waitText("Catalogue du jeu");
  assertEqual(await count(".hub-content .content-card"),6,"game hub content tab count");

  await clickAria("Recherche globale");
  await waitText("Rechercher dans MODARYX");
  await fill(".global-search-field input","aube");
  await waitText("Sentiers de l’aube");
  assertEqual(await count(".search-result-row:not([disabled])"),1,"global search actionable result count");
  await clickText(".search-result-row","Sentiers de l’aubeExploration · Atelier Boréal");
  await waitText("Avant d’ajouter");
  await clickText(".detail-tabs button","Compatibilité et prérequis");
  await waitText("Aether Core");
  await clickText(".detail-tabs button","Fichiers");
  await waitText("Fichiers de cette version");
  await waitText("Aucun scan réel associé");
  await clickText(".detail-tabs button","Support");
  await waitText("Support indisponible dans cette démo");
  await clickText(".detail-tabs button","Signalement");
  await waitText("Signaler ce contenu");
  await clickText(".report-section .primary","Préparer le signalement local");
  await waitText("Choisissez une raison avant de préparer le signalement.");
  await selectValue(".report-field select","Droits / licence");
  await clickText(".report-section .primary","Préparer le signalement local");
  await waitText("Brouillon de signalement — non envoyé");
  console.log("FLOW_ASSERT report validation error retry recovered");
  await clickText(".detail-tabs button","Permissions");
  await waitText("Aucune licence de distribution réelle");

  await clickAria("Notifications");
  await waitText("Centre de notifications");
  await waitText("Aucune notification réelle");
  await clickText(".account-nav button","Confidentialité");
  await waitText("Privé par défaut");

  await clickAria("Compte");
  await waitText("Vous explorez MODARYX en mode invité.");
  await clickText(".account-panel .primary","Découvrir l’onboarding joueur");
  await waitText("Onboarding joueur · 1/4");
  await clickText(".onboarding-actions .primary","Suivant");
  await waitText("Types de contenus");
  await clickText(".onboarding-actions .quiet","Passer l’onboarding");

  await clickAria("Bibliothèque");
  await waitText("Retrouvez favoris, suivis, collections, profils et historique sans les confondre.");
  await clickText(".library-tabs button","Historique");
  await waitText("Aucun historique réel disponible");
  await waitText("Privé par défaut");
  await clickText(".library-tabs button","Collections");
  await waitText("Sélections organisées");
  await clickText(".library-tabs button","Profils de jeu");
  await waitText("Connexion MODARYX Forge");
  await clickText(".profile-library article:first-child .quiet","Ouvrir");
  await waitText("Configuration personnelle de démonstration pour Aetherlands 1.4.2");
  await waitText("Choisi par vous");
  await waitText("Épinglé");
  await clickText(".profile-decision .quiet","Prévisualiser une mise à jour");
  await waitText("Copie avant promotion");
  await waitText("1.4.2 → 1.5.0-démo");
  await clickText(".back","← Retour à la Bibliothèque");
  await waitText("Retrouvez favoris, suivis, collections, profils et historique sans les confondre.");

  await clickText(".global-nav button","Créer");
  await waitText("Creator Studio");
  await clickText(".studio-nav button","Analytics");
  await waitText("Données indisponibles");
  await clickText(".studio-nav button","Dashboard");
  await clickText(".studio-workflow .primary","Créer un projet local");
  await waitText("Brouillon local créé");
  await clickText(".studio-nav button","Projects");
  await waitText("Projet sans titre");
  await waitText("Crédits structurés");
  await clickText(".project-maturity .filter-chips button","WiP");
  await waitText("Maturité");
  await clickText(".studio-nav button","Releases");
  await waitText("Maturité projet : WiP");
  await waitText("Crédits & droits");

  await clickText(".global-nav button","Collections");
  await waitText("Organiser n’est pas installer.");
  await fill(".collections-page .catalog-search input","graphismes");
  assertEqual(await count(".collection-card"),1,"collections query count");
  await clickText(".filter-chips button","Toutes");
  await fill(".collections-page .catalog-search input","");
  assertEqual(await count(".collection-card"),3,"collections reset count");
  await clickText(".collection-mode-tabs button","Modpacks");
  await waitText("Aetherlands — Essentiel");
  await waitText("Requis transitivement");
  await waitText("Épinglé");
  await clickText(".delta-trigger","Prévisualiser le delta");
  await waitText("Avant toute mutation");
  await clickText(".apply-mode button","Remplacer");
  await waitText("Remplacerait la composition cible");
  await waitText("PREUVE MANQUANTE — aucun manifeste réel");
  const modpackDisabled=await evaluate(`(() => {const b=document.querySelector('.modpack-surface .primary');return !!b&&b.disabled;})()`);
  if(!modpackDisabled) throw new Error("modpack install action must stay disabled without runtime");

  await clickText(".global-nav button","Créateurs");
  await waitText("Créateurs, équipes et studios.");
  await fill(".creators-search input","boréal");
  assertEqual(await count(".creator-index-card"),1,"creators query count");
  await fill(".creators-search input","");
  assertEqual(await count(".creator-index-card"),3,"creators reset count");

  await clickText(".global-nav button","Communauté");
  await waitText("Des échanges utiles autour des créations.");
  await clickText(".community-tabs button","Questions");
  await clickText(".community-board .primary","Créer un brouillon local");
  await waitText("Brouillon local — non envoyé");
  await clickText(".community-tabs button","Studios / équipes");
  await waitText("Équipes de création");

  await clickText(".global-nav button","Mods & contenus");
  await waitText("Catalogue global");
  await fill(".catalog-search input","sommets");
  assertEqual(await count(".content-card"),1,"catalog query count");
  const filterOpened=await evaluate(`(() => {const target=document.querySelector('.catalog-tools>button'); if(!target||target.disabled)return false; target.click(); return true;})()`);
  if(!filterOpened) throw new Error("catalog filter control unavailable");
  await sleep(150);
  await clickText(".filter-chips button","Graphismes");
  assertEqual(await count(".content-card"),1,"catalog kind filter count");
  await selectValue(".filter-panel select","Nom");
  await waitText("Tout réinitialiser");
  await clickText(".catalog-summary button","Tout réinitialiser");
  assertEqual(await count(".content-card"),6,"catalog reset count");
  await fill(".catalog-search input","zzzz");
  await waitText("Aucun contenu trouvé");
  await clickText(".empty button","Réinitialiser les filtres");
  assertEqual(await count(".content-card"),6,"catalog no-results recovery count");

  await load(390,844);
  await waitText("Catalogue consultable — téléchargement non garanti");
  await clickText(".local-nav button","Collections");
  await waitText("Sélections organisées");
  await clickText(".local-nav button","Guides");
  await waitText("Guides de démonstration indisponibles");
  await clickText(".local-nav button","Aperçu");
  await waitText("Pour votre version");
  const mobileSearchSize=await evaluate(`(() => {const el=document.querySelector('.mobile-search');const r=el.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height),getComputedStyle(el).display];})()`);
  if(mobileSearchSize[0]<44||mobileSearchSize[1]<44||mobileSearchSize[2]==='none') throw new Error("mobile global search target invalid: "+JSON.stringify(mobileSearchSize));
  await clickAria("Recherche globale");
  await waitText("Rechercher dans MODARYX");
  await fill(".global-search-field input","aube");
  await waitText("Sentiers de l’aube");

  await load(390,844);
  await clickAria("Ouvrir le menu");
  await clickText(".global-nav .mobile-nav-utility","Notifications");
  await waitText("Centre de notifications");
  await clickAria("Ouvrir le menu");
  await clickText(".global-nav .mobile-nav-utility","Compte");
  await waitText("Vous explorez MODARYX en mode invité.");

  await clickAria("Ouvrir le menu");
  await clickText(".global-nav .mobile-nav-utility","Bibliothèque");
  await waitText("Retrouvez favoris, suivis, collections, profils et historique sans les confondre.");
  await clickText(".library-tabs button","Historique");
  await waitText("Aucun historique réel disponible");
  await clickText(".library-tabs button","Profils de jeu");
  await waitText("Connexion MODARYX Forge");
  await clickText(".profile-library article:first-child .quiet","Ouvrir");
  await waitText("Manager non connecté");
  await waitText("Épinglé");
  await clickText(".back","← Retour à la Bibliothèque");

  await clickAria("Ouvrir le menu");
  await clickText(".global-nav button","Créer");
  await waitText("Creator Studio");
  await clickText(".studio-nav button","Releases");
  await waitText("Préparer une release");

  await clickAria("Ouvrir le menu");
  await clickText(".global-nav button","Collections");
  await waitText("Organiser n’est pas installer.");
  await clickText(".collection-mode-tabs button","Modpacks");
  await waitText("Aetherlands — Essentiel");
  await clickAria("Ouvrir le menu");
  await clickText(".global-nav button","Créateurs");
  await waitText("Créateurs, équipes et studios.");
  await clickAria("Ouvrir le menu");
  await clickText(".global-nav button","Communauté");
  await waitText("Des échanges utiles autour des créations.");
  await clickText(".community-tabs button","Questions");
  await waitText("Préparer une question");

  console.log("PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS");
} finally {
  try{ws?.close();}catch{}
  proc.kill("SIGTERM");
}
