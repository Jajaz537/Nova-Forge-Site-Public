import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
const origin=process.env.MODARYX_REVIEW_ORIGIN || "http://127.0.0.1:4174";
if(!chrome) throw new Error("CHROME_BIN missing");

const port=12000+(process.pid%20000);
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--hide-scrollbars","--no-first-run","--no-default-browser-check",
  "--remote-debugging-address=127.0.0.1","--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-cdp-product-flows-"+process.pid,
  "about:blank"
],{stdio:["ignore","ignore","pipe"]});

let chromeStderr="";
let chromeExit=null;
proc.stderr?.on("data",chunk=>{chromeStderr=(chromeStderr+String(chunk)).slice(-6000);});
proc.once("exit",(code,signal)=>{chromeExit={code,signal};});

let ws; let nextId=1;
const pending=new Map();
function send(method,params={}) {
  const id=nextId++;
  ws.send(JSON.stringify({id,method,params}));
  return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
}
async function waitJson(path){
  let last;
  for(let i=0;i<240;i++){
    if(chromeExit){
      throw new Error("Chrome exited before CDP: "+JSON.stringify(chromeExit)+"\n"+chromeStderr);
    }
    try{const r=await fetch(`http://127.0.0.1:${port}${path}`);if(r.ok)return await r.json();last=new Error("HTTP "+r.status);}
    catch(e){last=e;}
    await sleep(100);
  }
  throw new Error("CDP unavailable on "+port+": "+String(last||"unknown")+"\n"+chromeStderr);
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
  let ok=false;
  for(let i=0;i<80;i++){
    ok=await evaluate(`(() => {
      const target=[...document.querySelectorAll(${JSON.stringify(selector)})].find(el=>{
        if(el.textContent.trim()!==${JSON.stringify(text)}) return false;
        const r=el.getBoundingClientRect(),s=getComputedStyle(el);
        return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0&&!el.disabled;
      });
      if(!target) return false; target.click(); return true;
    })()`);
    if(ok) break;
    await sleep(100);
  }
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
  await clickText(".game-support-request>.quiet","Demander le support d’un jeu");
  // Preview and V2 candidate currently use different truthful, fail-closed copy.
  // Require either exact safety statement, never a generic “demonstration” match.
  let publisherSafetyCopyFound=false;
  for(let attempt=0;attempt<40;attempt++){
    publisherSafetyCopyFound=await evaluate(`(() => {
      const copy=document.body.innerText.toLocaleLowerCase("fr");
      return copy.includes("aucune demande n’est envoyée automatiquement à un éditeur.") ||
        copy.includes("aucune demande éditeur n’est envoyée depuis ce prototype.");
    })()`);
    if(publisherSafetyCopyFound) break;
    await sleep(100);
  }
  if(!publisherSafetyCopyFound) throw new Error("publisher no-outbound safety statement missing");
  await clickText(".game-request-form .primary","Préparer la demande locale");
  await waitText("Saisissez un nom de jeu avant de préparer la demande.");
  await fill(".game-request-form input","Project Meridian");
  await clickText(".game-request-form .primary","Préparer la demande locale");
  await waitText("Brouillon de demande — non envoyé");
  await waitText("Project Meridian · PC");
  // Both preview and candidate guarantee that the local draft creates no real Rights Case.
  let noRealRightsCase=false;
  for(let attempt=0;attempt<40;attempt++){
    noRealRightsCase=await evaluate(`(() => {
      const copy=document.body.innerText.toLocaleLowerCase("fr");
      return copy.includes("aucun rights case réel n’est créé par ce brouillon local.") ||
        copy.includes("aucun rights case réel n’est créé dans ce prototype.");
    })()`);
    if(noRealRightsCase) break;
    await sleep(100);
  }
  if(!noRealRightsCase) throw new Error("local draft must explicitly create no real Rights Case");
  console.log("FLOW_ASSERT game support request local-only triage");

  await fill(".games-index .catalog-search input","Aetherlands");
  assertEqual(await count(".game-card"),1,"games search result count");
  await clickText(".game-card button","Ouvrir le Game Hub");
  await waitText("Mes profils pour ce jeu");
  console.log("TREE_PROXY_ASSERT 1 game-specific content path reachable");
  await waitText("Catalogue consultable — téléchargement non garanti");
  await waitText("Ambiance originale MODARYX");
  await waitText("aucun asset éditeur utilisé");
  await clickText(".atmosphere-preview button","Rivenfall");
  const atmosphereRivenfall=await evaluate(`document.querySelector('.game-hero')?.dataset.atmosphere === 'rivenfall'`);
  if(!atmosphereRivenfall) throw new Error("Rivenfall atmosphere layer did not activate");
  await clickText(".atmosphere-preview button","Aetherlands");
  const atmosphereAetherlands=await evaluate(`document.querySelector('.game-hero')?.dataset.atmosphere === 'aetherlands'`);
  if(!atmosphereAetherlands) throw new Error("Aetherlands atmosphere layer did not restore");
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
  const gameHubSectionTitle=await evaluate(`document.querySelector('.game-hub-page .section-heading h2')?.textContent?.trim()`);
  assertEqual(gameHubSectionTitle,"Pour votre version","game hub content tab heading");
  assertEqual(await count(".hub-content .hub-content-row"),6,"game hub content tab count");

  await clickAria("Recherche globale");
  await waitText("Rechercher dans MODARYX");
  await fill(".global-search-field input","aube");
  await waitText("Sentiers de l’aube");
  assertEqual(await count(".search-result-row:not([disabled])"),1,"global search actionable result count");
  await clickText(".search-result-row","Sentiers de l’aubeExploration · Atelier Boréal");
  await waitText("Avant d’ajouter");
  await clickText(".detail-tabs button","Compatibilité et prérequis");
  await waitText("Fraîcheur preuve");
  await waitText("Required");
  await waitText("Recommended");
  await waitText("Suggested");
  await waitText("Supported");
  await waitText("Alternative / AnyOf");
  await waitText("Conflict");
  await waitText("ReplacedBy");
  await waitText("Current");
  await waitText("Aging");
  await waitText("Stale");
  await waitText("Unknown");
  await waitText("Compatibilité réelle : PREUVE MANQUANTE");
  console.log("TREE_PROXY_ASSERT 2 version compatibility location reachable");
  console.log("TREE_PROXY_ASSERT 3 dependencies location reachable");
  await clickText(".detail-tabs button","Versions");
  await waitText("Historique de démonstration");
  console.log("TREE_PROXY_ASSERT 8 version history reachable");
  await clickText(".detail-tabs button","Fichiers");
  await waitText("Fichiers de cette version");
  await waitText("Variante pédagogique A");
  await waitText("Source ≠ auteur ≠ variante");
  await waitText("Aucun provider réel connecté");
  await waitText("Aucun scan réel associé");
  await clickText(".detail-tabs button","Plan avancé");
  await waitText("Plan avancé — démonstration");
  await waitText("Receipt futur");
  await waitText("0 mutation réelle");
  await waitText("Capability handshake indisponible");
  const forgeButtonDisabled=await evaluate(`(() => {const b=document.querySelector('.manager-capability-panel button');return !!b&&b.disabled;})()`);
  if(!forgeButtonDisabled) throw new Error("MODARYX Forge CTA must stay disabled without capability handshake");
  await clickText(".detail-tabs button","Support");
  await waitText("Support indisponible dans cette démo");
  await clickText(".detail-tabs button","Signalement");
  await waitText("Signaler ce contenu");
  await clickText(".report-section .primary","Préparer le signalement local");
  await waitText("Choisissez une raison avant de préparer le signalement.");
  await selectValue(".report-field select","Droits / licence");
  await clickText(".report-section .primary","Préparer le signalement local");
  await waitText("Brouillon de signalement — non envoyé");
  console.log("TREE_PROXY_ASSERT 7 report-content path reachable");
  console.log("FLOW_ASSERT report validation error retry recovered");
  await clickText(".detail-tabs button","Permissions");
  await waitText("Aucune licence de distribution réelle");

  await clickAria("Compte");
  await waitText("Vous explorez MODARYX en mode invité.");
  await clickText(".account-nav button","Notifications");
  await waitText("Centre de notifications");
  await waitText("Aucune notification réelle");
  await waitText("Réponse éditeur reçue — Aetherlands");
  await waitText("APPROVED_WITH_LIMITS");
  await waitText("Revue juridique requise — Project Meridian");
  await waitText("LEGAL_REVIEW_REQUIRED");
  await waitText("DÉMONSTRATION · NON REÇUE");
  console.log("FLOW_ASSERT publisher rights notification preview truthful");
  await clickText(".account-nav button","Confidentialité");
  await waitText("Privé par défaut");

  await clickText(".account-nav button","Compte");
  await waitText("Vous explorez MODARYX en mode invité.");
  await clickText(".account-panel .primary","Découvrir l’onboarding joueur");
  await waitText("Onboarding joueur · 1/4");
  await clickText(".onboarding-actions .primary","Suivant");
  await waitText("Types de contenus");
  await clickText(".onboarding-actions .quiet","Passer l’onboarding");

  await clickText("footer button","Bibliothèque");
  await waitText("Retrouvez favoris, suivis, collections, profils et historique sans les confondre.");
  await clickText(".library-tabs button","Favoris");
  await waitText("Contenus enregistrés");
  console.log("TREE_PROXY_ASSERT 9 favorites reachable");
  await clickText(".library-tabs button","Historique");
  await waitText("Aucun historique réel disponible");
  await waitText("Privé par défaut");
  await clickText(".library-tabs button","Collections");
  await waitText("Sélections organisées");
  console.log("TREE_PROXY_ASSERT 4 collections reachable");
  await clickText(".library-tabs button","Profils de jeu");
  await waitText("Connexion MODARYX Forge");
  await clickText(".profile-library article:first-child .quiet","Ouvrir");
  await waitText("Configuration personnelle de démonstration pour Aetherlands 1.4.2");
  await waitText("Choisi par vous");
  await waitText("Épinglé");
  await waitText("Minimum accepté");
  await clickText(".profile-preview-actions .quiet","Prévisualiser une mise à jour");
  await waitText("Copie avant promotion");
  await waitText("1.4.2 → 1.5.0-démo");
  await clickText(".profile-preview-actions .quiet","Prévisualiser import / export");
  await waitText("Rapport d’import / export — démonstration");
  await waitText("0 autorisée");
  await waitText("0 fichier importé");
  await clickText(".profile-preview-actions .quiet","Prévisualiser impact d’une désactivation");
  await waitText("Impact avant désactivation — démonstration");
  await waitText("Dépendant direct");
  await waitText("Diagnostic propre / Safe Profile — runtime indisponible");
  const safeProfileDisabled=await evaluate(`(() => {const b=[...document.querySelectorAll('.manager-state button')].find(x=>x.textContent.includes('Safe Profile'));return !!b&&b.disabled;})()`);
  if(!safeProfileDisabled) throw new Error("Safe Profile action must stay disabled without desktop runtime");
  await clickText(".back","← Retour à la Bibliothèque");
  await waitText("Retrouvez favoris, suivis, collections, profils et historique sans les confondre.");

  await clickText(".global-nav button","Créateurs");
  await clickText(".creators-page .creator-studio-entry","Ouvrir Creator Studio");
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
  console.log("TREE_PROXY_ASSERT 5 publish-new-version path reachable");
  await waitText("Crédits & droits");
  await waitText("Validation par plateforme");
  await waitText("Crossplay");
  await waitText("PREUVE MANQUANTE");

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
  console.log("TREE_PROXY_ASSERT 6 creator lookup reachable");
  await fill(".creators-search input","");
  assertEqual(await count(".creator-index-card"),3,"creators reset count");

  await clickText(".global-nav button","Communauté");
  await waitText("Des échanges utiles autour des créations.");
  await clickText(".community-tabs button","Questions");
  await clickText(".community-board .primary","Créer un brouillon local");
  await waitText("Brouillon local — non envoyé");
  await clickText(".community-tabs button","Studios / équipes");
  await waitText("Équipes de création");


  await clickText("footer button","Aide & documentation");
  await waitText("Comprendre MODARYX sans deviner.");
  await waitText("Installation");
  await waitText("futur handoff MODARYX Forge");
  console.log("TREE_PROXY_ASSERT 10 installation documentation reachable");

  await clickText("footer button","Modération · démo admin");
  await waitText("Modération, signalements et appels.");
  await waitText("Aucune action de modération réelle n’est exécutée dans cette démo.");
  const moderationDisabledActions=await evaluate(`[...document.querySelectorAll('.moderation-actions button')].filter(b=>b.disabled).length`);
  if(moderationDisabledActions!==3) throw new Error("moderation server actions must remain disabled");
  await evaluate(`document.querySelectorAll('.moderation-case-list button')[1]?.click()`);
  await sleep(160);
  await waitText("UNDER_REVIEW");
  await waitText("La quarantaine réelle nécessite une autorité serveur");
  await evaluate(`document.querySelectorAll('.moderation-case-list button')[2]?.click()`);
  await sleep(160);
  await waitText("APPEALED");
  await waitText("L’appel reste rattaché à la décision précédente");
  console.log("FLOW_ASSERT moderation appeals preserves server authority and prior decision");

  await clickText("footer button","Droits jeux · démo admin");
  await waitText("Droits des jeux");
  await waitText("Aucune demande réelle n’est envoyée dans ce prototype.");
  await waitText("APPROVED_WITH_LIMITS");
  await clickText(".rights-case-list button","RivenfallStudio fictif · démonstrationAWAITING_RESPONSE");
  await waitText("AWAITING_RESPONSE");
  await waitText("Aucun droit supplémentaire");
  await clickText(".rights-case-list button","Solstice FrontierÉditeur fictif · démonstrationNO_RESPONSE");
  await waitText("NO_RESPONSE ≠ autorisation");
  await waitText("AUCUNE RÉPONSE INTERPRÉTABLE");
  await waitText("LEGAL_REVIEW_REQUIRED");
  await clickText(".rights-case-list button","AetherlandsÉditeur fictif · démonstrationAPPROVED_WITH_LIMITS");
  await waitText("Key art");
  await waitText("Refusé — reste bloqué");
  await waitText("SAFE_AUTOMATION");
  await waitText("Notification admin fictive préparée · aucune notification réelle envoyée.");
  await waitText("LEGAL_REVIEW_REQUIRED");
  console.log("FLOW_ASSERT publisher response interpretation safe automation with legal fallback");
  await waitText("Expiration et révocation");
  await clickText(".rights-lifecycle-actions .quiet","Simuler expiration");
  await waitText("EXPIRED");
  await waitText("Usages dépendants rebloqués");
  await waitText("Fallback vers la baseline originale MODARYX.");
  await clickText(".rights-lifecycle-actions .quiet","Réinitialiser le scénario");
  await waitText("ACTIVE_WITH_LIMITS");
  await clickText(".rights-lifecycle-actions .quiet","Simuler révocation");
  await waitText("REVOKED");
  await waitText("Aucune réactivation silencieuse après expiration ou révocation.");
  await clickText(".rights-lifecycle-actions .quiet","Réinitialiser le scénario");
  await waitText("ACTIVE_WITH_LIMITS");
  console.log("FLOW_ASSERT rights lifecycle expired revoked scopes reblocked");
  await waitText("IP / TAKEDOWN · DÉMONSTRATION");
  const ipFallbackInitiallyDisabled=await evaluate(`(() => {const b=[...document.querySelectorAll('.ip-case-actions button')].find(x=>x.textContent.includes('Appliquer fallback temporaire'));return !!b&&b.disabled;})()`);
  if(!ipFallbackInitiallyDisabled) throw new Error("IP fallback must stay disabled before asset localization");
  await clickText(".ip-case-actions .quiet","Localiser l’asset de démonstration");
  await waitText("CONTENT_LOCATED");
  await clickText(".ip-case-actions .quiet","Appliquer fallback temporaire");
  await waitText("TEMP_RESTRICTED");
  await waitText("Asset contesté retiré du scénario public");
  await waitText("Fallback original MODARYX actif dans la démonstration.");
  await clickText(".ip-case-actions .quiet","Escalader en revue juridique");
  await waitText("LEGAL_REVIEW_REQUIRED");
  await waitText("aucune restauration automatique");
  await waitText("Preuves");
  await waitText("Conservées");
  await clickText(".ip-case-actions .quiet","Réinitialiser le cas IP");
  await waitText("RECEIVED");
  console.log("FLOW_ASSERT ip takedown containment preserves evidence fallback legal escalation");
  const rightsSendDisabled=await evaluate(`(() => {const b=[...document.querySelectorAll('.rights-detail button')].find(x=>x.textContent.includes('Envoyer une demande'));return !!b&&b.disabled;})()`);
  if(!rightsSendDisabled) throw new Error("rights outbound must stay disabled without backend");
  await waitText("Triage avant tout contact éditeur");
  await waitText("TRIAGE");
  await clickText(".support-triage-actions .primary","Accepter la baseline sûre");
  await waitText("ACCEPTED_SAFE_BASELINE");
  await waitText("Rights Case de démonstration préparé — non créé réellement.");
  await waitText("Aucun contact éditeur, aucun outbound et aucun asset officiel n’est activé par cette action locale.");
  console.log("FLOW_ASSERT member support triage accepted safe baseline only");
  await waitText("Vérifier le canal avant toute demande");
  await waitText("CONTACT_CANDIDATE");
  const requestPrepareInitiallyDisabled=await evaluate(`(() => {const b=[...document.querySelectorAll('.publisher-contact-actions button')].find(x=>x.textContent.includes('Préparer la demande structurée'));return !!b&&b.disabled;})()`);
  if(!requestPrepareInitiallyDisabled) throw new Error("publisher request preparation must stay disabled before contact verification");
  const outboundQueueInitiallyDisabled=await evaluate(`(() => {const b=[...document.querySelectorAll('.publisher-outbound-actions button')].find(x=>x.textContent.includes('Simuler mise en file locale'));return !!b&&b.disabled;})()`);
  if(!outboundQueueInitiallyDisabled) throw new Error("publisher outbound queue must stay disabled before REQUEST_READY");
  await clickText(".publisher-contact-actions .quiet","Vérifier le canal de démonstration");
  await waitText("CONTACT_VERIFIED");
  await clickText(".publisher-contact-actions .primary","Préparer la demande structurée");
  await waitText("REQUEST_READY");
  await waitText("Demande fictive prête : scopes explicites, canal vérifié, aucun envoi réel.");
  await waitText("Outbound réel indisponible · aucune adresse réelle utilisée.");
  console.log("FLOW_ASSERT publisher contact verified before request ready");
  await waitText("Transport outbound · démonstration");
  await clickText(".publisher-outbound-actions .quiet","Simuler mise en file locale");
  await waitText("OUTBOUND_QUEUED");
  await waitText("Queue locale simulée — aucun envoi réel");
  await clickText(".publisher-outbound-actions .quiet","Simuler provider accepted");
  await waitText("PROVIDER_ACCEPTED");
  await waitText("Provider accepté — droits inchangés");
  await clickText(".publisher-outbound-actions .quiet","Simuler livraison");
  await waitText("DELIVERED");
  await waitText("DELIVERED ≠ autorisation éditeur");
  await waitText("La livraison du message n’accorde aucun scope.");
  await waitText("Inbound éditeur · démonstration");
  const inboundReceiveEnabled=await evaluate(`(() => {const b=[...document.querySelectorAll('.publisher-inbound-actions button')].find(x=>x.textContent.includes('Simuler réponse reçue'));return !!b&&!b.disabled;})()`);
  if(!inboundReceiveEnabled) throw new Error("publisher inbound reception must unlock only after delivered outbound demo");
  await clickText(".publisher-inbound-actions .quiet","Simuler réponse reçue");
  await waitText("INBOUND_RECEIVED");
  await waitText("Réponse fictive reçue · corrélation requise");
  await clickText(".publisher-inbound-actions .quiet","Corréler au Rights Case");
  await waitText("CORRELATED");
  await waitText("Réponse corrélée · provenance encore à vérifier");
  await clickText(".publisher-inbound-actions .quiet","Vérifier la provenance");
  await waitText("PROVENANCE_VERIFIED");
  await waitText("Provenance technique vérifiée · droits inchangés");
  await clickText(".publisher-inbound-actions .quiet","Préparer l’interprétation");
  await waitText("READY_FOR_INTERPRETATION");
  await waitText("READY_FOR_INTERPRETATION ≠ autorisation");
  await waitText("SPF/DKIM/DMARC simulés ne prouvent jamais à eux seuls l’autorité juridique.");
  await clickText(".publisher-inbound-actions .quiet","Simuler provenance non fiable");
  await waitText("REJECTED_UNTRUSTED");
  await waitText("Inbound non fiable : fail closed");
  await clickText(".publisher-inbound-actions .quiet","Réinitialiser l’inbound");
  await waitText("NO_INBOUND");
  console.log("FLOW_ASSERT publisher inbound correlation provenance fail-closed");
  await clickText(".publisher-outbound-actions .quiet","Réinitialiser le transport");
  await waitText("NOT_QUEUED");
  await clickText(".publisher-outbound-actions .quiet","Simuler mise en file locale");
  await clickText(".publisher-outbound-actions .quiet","Simuler bounce");
  await waitText("BOUNCED");
  await waitText("Bounce : arrêt sûr, aucun contact deviné");
  console.log("FLOW_ASSERT publisher outbound transport permission-neutral");



  await setViewport(390,844);
  await clickAria("Ouvrir le menu");
  await clickText(".mobile-nav-utility","MODARYX IA");
  await waitText("Une IA native du produit, pas un chatbot greffé.");
  await waitText("MODARYX IA n’est pas active dans cette démo.");
  await waitText("READ → PLAN → EXECUTE_SAFE → EXECUTE_SENSITIVE → BLOCKED.");
  await waitText("preuve insuffisante");
  const aiSendDisabled=await evaluate(`(() => {const b=document.querySelector('.ai-input-shell button');const i=document.querySelector('.ai-input-shell input');return !!b&&!!i&&b.disabled&&i.disabled;})()`);
  if(!aiSendDisabled) throw new Error("MODARYX AI input must stay disabled without AI backend");
  console.log("FLOW_ASSERT modaryx ai preview no fake model or action");

  await setViewport(1440,1024);
  await sleep(120);
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
  const logoHome=await evaluate(`(() => {const el=document.querySelector('.topbar .logo');if(!el)return false;el.click();return true;})()`);
  if(!logoHome) throw new Error("MODARYX logo home navigation unavailable");
  await waitText("Redécouvrez vos jeux");
  console.log("FLOW_ASSERT MODARYX logo returns to discover");

  await load(390,844);
  await clickAria("Ouvrir le menu");
  await clickText(".global-nav button","Jeux");
  await waitText("Trouvez votre prochain terrain de jeu");
  await clickText(".game-support-request>.quiet","Demander le support d’un jeu");
  await fill(".game-request-form input","Project Meridian");
  await clickText(".game-request-form .primary","Préparer la demande locale");
  await waitText("Brouillon de demande — non envoyé");

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
  await waitText("Réponse éditeur reçue — Aetherlands");
  await waitText("LEGAL_REVIEW_REQUIRED");
  await clickAria("Ouvrir le menu");
  await clickText(".global-nav .mobile-nav-utility","Compte");
  await waitText("Vous explorez MODARYX en mode invité.");


  await clickAria("Ouvrir le menu");
  await clickText(".global-nav .mobile-nav-utility","MODARYX IA");
  await waitText("Une IA native du produit, pas un chatbot greffé.");
  await waitText("Aucune réponse générée, aucun historique IA et aucune action automatique ne sont simulés.");

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
  await clickText(".profile-preview-actions .quiet","Prévisualiser import / export");
  await waitText("Rapport d’import / export — démonstration");
  await clickText(".back","← Retour à la Bibliothèque");


  await clickText("footer button","Droits jeux · démo admin");
  await waitText("Droits des jeux");
  await waitText("Aucune demande réelle n’est envoyée dans ce prototype.");
  await clickText(".rights-case-list button","Solstice FrontierÉditeur fictif · démonstrationNO_RESPONSE");
  await waitText("NO_RESPONSE ≠ autorisation");
  await clickText(".support-triage-actions .primary","Accepter la baseline sûre");
  await waitText("ACCEPTED_SAFE_BASELINE");
  await waitText("Rights Case de démonstration préparé — non créé réellement.");
  await waitText("Vérifier le canal avant toute demande");
  await clickText(".publisher-contact-actions .quiet","Vérifier le canal de démonstration");
  await waitText("CONTACT_VERIFIED");
  await clickText(".publisher-contact-actions .primary","Préparer la demande structurée");
  await waitText("REQUEST_READY");
  await waitText("Expiration et révocation");
  await clickText(".rights-lifecycle-actions .quiet","Simuler expiration");
  await waitText("EXPIRED");
  await waitText("Usages dépendants rebloqués");
  await clickText(".rights-lifecycle-actions .quiet","Réinitialiser le scénario");
  await waitText("ACTIVE_WITH_LIMITS");


  await clickAria("Ouvrir le menu");
  await clickText(".global-nav button","Créateurs");
  await clickText(".creators-page .creator-studio-entry","Ouvrir Creator Studio");
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


  const assertRoute=async(path,selector,label)=>{
    let last;
    for(let attempt=0;attempt<45;attempt++){
      last=await evaluate(`({path:window.location.pathname,main:document.querySelector('main')?.className||''})`);
      if(last.path===path && (await evaluate(`!!document.querySelector(${JSON.stringify(selector)})`)))return;
      await sleep(100);
    }
    throw new Error(label+" route mismatch: "+JSON.stringify(last));
  };

  // CTA navigation: real routes, no fabricated commerce or installation.
  await load(1440,1024);
  await clickText(".global-nav button","Découvrir");
  await waitText("Redécouvrez vos jeux");
  await clickText(".canon-reconciled-hero .primary","Découvrir maintenant");
  await assertRoute("/mods",".catalog","Discover CTA");
  console.log("FLOW_ASSERT_DISCOVER_CTA");

  await clickText("footer button","Bibliothèque");
  await waitText("Bibliothèque");
  await clickText(".library-focus .primary","Ouvrir le Game Hub");
  await assertRoute("/games/aetherlands",".game-hub-page","Library CTA");
  console.log("FLOW_ASSERT_LIBRARY_GAME_HUB_CTA");

  await waitText("Mes profils pour ce jeu");
  await clickAria("Consulter les détails de Sentiers de l’aube");
  await assertRoute("/content/sentiers-de-laube","main","Hub row details");
  console.log("FLOW_ASSERT_GAME_HUB_CONTENT_DETAILS");

  console.log("PASS_V2_LIVING_THRESHOLD_PRODUCT_FLOWS");
} finally {
  try{ws?.close();}catch{}
  proc.kill("SIGTERM");
}
