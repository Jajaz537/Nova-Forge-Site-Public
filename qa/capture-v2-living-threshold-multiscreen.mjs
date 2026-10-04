import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";

const chrome = process.env.CHROME_BIN;
const origin = process.env.MODARYX_REVIEW_ORIGIN || "http://127.0.0.1:4174";
if (!chrome) throw new Error("CHROME_BIN missing");

const port = 9224;
const proc = spawn(chrome, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--hide-scrollbars",
  "--remote-debugging-port=" + port,
  "--user-data-dir=/tmp/modaryx-v2-cdp-multiscreen",
  "about:blank",
], { stdio: "ignore" });

let ws;
let nextId = 1;
const pending = new Map();

function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}
async function waitJson(path) {
  let last;
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}${path}`);
      if (r.ok) return await r.json();
      last = new Error("HTTP " + r.status);
    } catch (e) { last = e; }
    await sleep(100);
  }
  throw last || new Error("CDP unavailable");
}
async function evaluate(expression) {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text || "Runtime.evaluate failed");
  return r.result?.result?.value;
}
async function setViewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: 1, mobile: width < 760,
  });
}
async function navigateHome(width, height) {
  await setViewport(width, height);
  await send("Page.navigate", { url: origin });
  for (let i = 0; i < 60; i++) {
    if (await evaluate("document.readyState === 'complete'")) break;
    await sleep(100);
  }
  await sleep(300);
}
async function clickByText(selector, text) {
  const ok = await evaluate(`(() => {
    const target=[...document.querySelectorAll(${JSON.stringify(selector)})]
      .find(el => {
        if (el.textContent.trim() !== ${JSON.stringify(text)}) return false;
        const r=el.getBoundingClientRect(), s=getComputedStyle(el);
        return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && r.height>0;
      });
    if(!target) return false;
    target.click();
    return true;
  })()`);
  if (!ok) throw new Error("visible target not found: " + selector + " / " + text);
  await sleep(100);
}
async function clickByAriaLabel(label) {
  const ok = await evaluate(`(() => {
    const target=[...document.querySelectorAll('[aria-label]')].find(el => {
      if (el.getAttribute('aria-label') !== ${JSON.stringify(label)}) return false;
      const r=el.getBoundingClientRect(), s=getComputedStyle(el);
      return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && r.height>0;
    });
    if(!target) return false;
    target.click();
    return true;
  })()`);
  if (!ok) throw new Error("visible aria-label target not found: " + label);
  await sleep(150);
}
async function fillVisibleInput(selector, value) {
  const ok = await evaluate(`(() => {
    const target=[...document.querySelectorAll(${JSON.stringify(selector)})].find(el => {
      const r=el.getBoundingClientRect(), s=getComputedStyle(el);
      return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && r.height>0;
    });
    if(!target) return false;
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
    setter.call(target,${JSON.stringify(value)});
    target.dispatchEvent(new Event('input',{bubbles:true}));
    return true;
  })()`);
  if (!ok) throw new Error("visible input not found: " + selector);
  await sleep(200);
}
async function clickSelector(selector) {
  const ok = await evaluate(`(() => {
    const target=document.querySelector(${JSON.stringify(selector)});
    if(!target) return false;
    target.click();
    return true;
  })()`);
  if (!ok) throw new Error("selector not found: " + selector);
  await sleep(250);
}
async function capture(file, width, height, expectedText) {
  let textOk = !expectedText;
  if (expectedText) {
    for (let i = 0; i < 30; i++) {
      textOk = await evaluate(`document.body.innerText.toLocaleLowerCase("fr").includes(${JSON.stringify(expectedText.toLocaleLowerCase("fr"))})`);
      if (textOk) break;
      await sleep(100);
    }
  }
  if (!textOk) {
    const visibleText = await evaluate("document.body.innerText.slice(0,1200)");
    throw new Error("expected text missing before capture: " + expectedText + "\\nVISIBLE_TEXT:\\n" + visibleText);
  }
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
    clip: { x: 0, y: 0, width, height, scale: 1 },
  });
  const data = Buffer.from(shot.result.data, "base64");
  const out = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/visual-proof/multiscreen/" + file;
  mkdirSync(out.substring(0, out.lastIndexOf("/")), { recursive: true });
  writeFileSync(out, data);
  return {
    file,
    width,
    height,
    sha256: createHash("sha256").update(data).digest("hex"),
  };
}

async function captureCurrentViewport(file, width, height, expectedText) {
  let textOk = !expectedText;
  if (expectedText) {
    for (let i = 0; i < 30; i++) {
      textOk = await evaluate(`document.body.innerText.toLocaleLowerCase("fr").includes(${JSON.stringify(expectedText.toLocaleLowerCase("fr"))})`);
      if (textOk) break;
      await sleep(100);
    }
  }
  if (!textOk) throw new Error("expected text missing before viewport capture: " + expectedText);
  const metrics = await send("Page.getLayoutMetrics");
  const viewport = metrics.result.visualViewport || {};
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
    clip: { x: viewport.pageX || 0, y: viewport.pageY || 0, width, height, scale: 1 },
  });
  const data = Buffer.from(shot.result.data, "base64");
  const out = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/visual-proof/multiscreen/" + file;
  mkdirSync(out.substring(0, out.lastIndexOf("/")), { recursive: true });
  writeFileSync(out, data);
  return { file, width, height, sha256: createHash("sha256").update(data).digest("hex") };
}

try {
  await waitJson("/json/version");
  const targets = await waitJson("/json/list");
  const target = targets.find(x => x.type === "page");
  if (!target?.webSocketDebuggerUrl) throw new Error("page target missing");

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  ws.addEventListener("message", event => {
    const msg = JSON.parse(event.data);
    if (!msg.id || !pending.has(msg.id)) return;
    const p = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(msg.error.message));
    else p.resolve(msg);
  });
  await send("Page.enable");
  await send("Runtime.enable");

  const manifest = { commit: process.env.GITHUB_SHA, captures: [] };

  // Desktop states
  await navigateHome(1440, 1024);
  manifest.captures.push(await capture("desktop-game-hub.png", 1440, 1024, "Mes profils pour ce jeu"));
  await clickByText(".atmosphere-preview button", "Rivenfall");
  manifest.captures.push(await capture("desktop-game-hub-atmosphere-rivenfall.png", 1440, 1024, "aucun asset éditeur utilisé"));
  await clickByText(".atmosphere-preview button", "Aetherlands");
  await clickByText(".local-nav button", "Collections");
  manifest.captures.push(await capture("desktop-game-hub-collections.png", 1440, 1024, "Sélections organisées"));
  await clickByText(".local-nav button", "Créateurs");
  manifest.captures.push(await capture("desktop-game-hub-creators.png", 1440, 1024, "Écosystème créateur"));
  await clickByText(".local-nav button", "Guides");
  manifest.captures.push(await capture("desktop-game-hub-guides.png", 1440, 1024, "Guides de démonstration indisponibles"));
  await clickByText(".local-nav button", "Activité");
  manifest.captures.push(await capture("desktop-game-hub-activity.png", 1440, 1024, "Activité de démonstration"));

  await clickByText(".global-nav button", "Jeux");
  manifest.captures.push(await capture("desktop-games-index.png", 1440, 1024, "Trouvez votre prochain terrain de jeu"));
  await clickByText(".game-support-request>.quiet", "Demander le support d’un jeu");
  await fillVisibleInput(".game-request-form input", "Project Meridian");
  await clickByText(".game-request-form .primary", "Préparer la demande locale");
  manifest.captures.push(await capture("desktop-game-support-request.png", 1440, 1024, "Brouillon de demande — non envoyé"));

  await clickByAriaLabel("Recherche globale");
  manifest.captures.push(await capture("desktop-global-search.png", 1440, 1024, "Rechercher dans MODARYX"));
  await fillVisibleInput('.global-search-field input', "aube");
  manifest.captures.push(await capture("desktop-global-search-results.png", 1440, 1024, "Sentiers de l’aube"));

  await clickByText(".global-nav button", "Découvrir");
  manifest.captures.push(await capture("desktop-home.png", 1440, 1024, "Redécouvrez vos jeux"));

  await clickByText(".global-nav button", "Mods & contenus");
  manifest.captures.push(await capture("desktop-catalog.png", 1440, 1024, "Catalogue global"));

  await clickByText(".global-nav button", "Collections");
  manifest.captures.push(await capture("desktop-collections.png", 1440, 1024, "Organiser n’est pas installer"));
  await clickByText(".collection-mode-tabs button", "Modpacks");
  manifest.captures.push(await capture("desktop-modpack.png", 1440, 1024, "Aetherlands — Essentiel"));
  await clickByText(".delta-trigger", "Prévisualiser le delta");
  await clickByText(".apply-mode button", "Remplacer");
  manifest.captures.push(await capture("desktop-modpack-delta.png", 1440, 1024, "Avant toute mutation"));

  await clickByText(".global-nav button", "Créateurs");
  manifest.captures.push(await capture("desktop-creators.png", 1440, 1024, "Créateurs, équipes et studios"));

  await clickByText(".global-nav button", "Mods & contenus");
  await clickSelector(".card-hit");
  manifest.captures.push(await capture("desktop-content-detail.png", 1440, 1024, "Avant d’ajouter"));
  await clickByText(".detail-tabs button", "Compatibilité et prérequis");
  manifest.captures.push(await capture("desktop-content-compatibility-specialized.png", 1440, 1024, "Fraîcheur preuve"));
  await clickByText(".detail-tabs button", "Plan avancé");
  manifest.captures.push(await capture("desktop-content-advanced-plan.png", 1440, 1024, "Plan avancé — démonstration"));
  await clickByText(".detail-tabs button", "Signalement");
  manifest.captures.push(await capture("desktop-content-report.png", 1440, 1024, "Signaler ce contenu"));
  await clickByText(".report-section .primary", "Préparer le signalement local");
  manifest.captures.push(await capture("desktop-content-report-error.png", 1440, 1024, "Choisissez une raison avant de préparer le signalement."));

  await clickByText("footer button", "Game Hub");
  await clickSelector('[aria-label="Bibliothèque"]');
  manifest.captures.push(await capture("desktop-library.png", 1440, 1024, "Retrouvez favoris, suivis, collections, profils et historique"));
  await clickByText(".library-tabs button", "Historique");
  manifest.captures.push(await capture("desktop-library-history.png", 1440, 1024, "Aucun historique réel disponible"));
  await clickByText(".library-tabs button", "Profils de jeu");
  await clickByText(".profile-library article:first-child .quiet", "Ouvrir");
  await clickByText(".profile-preview-actions .quiet", "Prévisualiser une mise à jour");
  manifest.captures.push(await capture("desktop-game-profile-delta.png", 1440, 1024, "Copie avant promotion"));
  await clickByText(".profile-preview-actions .quiet", "Prévisualiser import / export");
  manifest.captures.push(await capture("desktop-game-profile-interop.png", 1440, 1024, "Rapport d’import / export — démonstration"));
  await clickByText(".profile-preview-actions .quiet", "Prévisualiser impact d’une désactivation");
  manifest.captures.push(await capture("desktop-game-profile-reverse-impact.png", 1440, 1024, "Impact avant désactivation — démonstration"));
  await clickByText(".back", "← Retour à la Bibliothèque");

  await clickByText(".global-nav button", "Communauté");
  manifest.captures.push(await capture("desktop-community.png", 1440, 1024, "Des échanges utiles autour des créations"));

  await clickByAriaLabel("Notifications");
  manifest.captures.push(await capture("desktop-notifications.png", 1440, 1024, "Centre de notifications"));
  await evaluate("document.querySelector('.notification-demo-list')?.scrollIntoView({block:'center'})");
  await sleep(120);
  manifest.captures.push(await captureCurrentViewport("desktop-rights-notification-preview.png", 1440, 1024, "Réponse éditeur reçue — Aetherlands"));

  await clickByAriaLabel("Compte");
  manifest.captures.push(await capture("desktop-account.png", 1440, 1024, "Vous explorez MODARYX en mode invité"));

  await clickByText(".global-nav button", "Créer");
  manifest.captures.push(await capture("desktop-creator-studio.png", 1440, 1024, "Creator Studio"));
  await clickByText(".studio-workflow .primary", "Créer un projet local");
  await clickByText(".studio-nav button", "Projects");
  await clickByText(".project-maturity .filter-chips button", "WiP");
  manifest.captures.push(await capture("desktop-creator-project.png", 1440, 1024, "Crédits structurés"));
  await clickByText(".studio-nav button", "Releases");
  manifest.captures.push(await capture("desktop-creator-platform-validation.png", 1440, 1024, "Validation par plateforme"));

  await clickByText("footer button", "Droits jeux · démo admin");
  manifest.captures.push(await capture("desktop-rights-dashboard.png", 1440, 1024, "Aucune demande réelle n’est envoyée dans ce prototype."));
  await clickByText(".support-triage-actions .primary", "Accepter la baseline sûre");
  await evaluate("document.querySelector('.support-triage-result')?.scrollIntoView({block:'center'})");
  await sleep(120);
  manifest.captures.push(await captureCurrentViewport("desktop-rights-triage-accepted.png", 1440, 1024, "Rights Case de démonstration préparé — non créé réellement."));
  await clickByText(".publisher-contact-actions .quiet", "Vérifier le canal de démonstration");
  await clickByText(".publisher-contact-actions .primary", "Préparer la demande structurée");
  await evaluate("document.querySelector('.publisher-contact-demo')?.scrollIntoView({block:'center'})");
  await sleep(120);
  manifest.captures.push(await captureCurrentViewport("desktop-rights-contact-verified.png", 1440, 1024, "REQUEST_READY"));
  await evaluate("document.querySelector('.rights-interpretation-demo')?.scrollIntoView({block:'center'})");
  await sleep(120);
  manifest.captures.push(await captureCurrentViewport("desktop-rights-response-interpretation.png", 1440, 1024, "SAFE_AUTOMATION"));
  await clickByText(".rights-lifecycle-actions .quiet", "Simuler expiration");
  await evaluate("document.querySelector('.rights-lifecycle-demo')?.scrollIntoView({block:'center'})");
  await sleep(120);
  manifest.captures.push(await captureCurrentViewport("desktop-rights-lifecycle-expired.png", 1440, 1024, "Usages dépendants rebloqués"));
  await clickByText(".rights-lifecycle-actions .quiet", "Réinitialiser le scénario");

  // Mobile states
  await navigateHome(390, 844);
  manifest.captures.push(await capture("mobile-game-hub.png", 390, 844, "Mes profils pour ce jeu"));
  await clickByText(".atmosphere-preview button", "Rivenfall");
  manifest.captures.push(await capture("mobile-game-hub-atmosphere-rivenfall.png", 390, 844, "aucun asset éditeur utilisé"));
  await clickByText(".atmosphere-preview button", "Aetherlands");
  await clickByText(".local-nav button", "Collections");
  manifest.captures.push(await capture("mobile-game-hub-collections.png", 390, 844, "Sélections organisées"));
  await clickByText(".local-nav button", "Guides");
  manifest.captures.push(await capture("mobile-game-hub-guides.png", 390, 844, "Guides de démonstration indisponibles"));

  await clickByAriaLabel("Recherche globale");
  manifest.captures.push(await capture("mobile-global-search.png", 390, 844, "Rechercher dans MODARYX"));

  await clickSelector(".mobile-menu");
  await clickByText(".global-nav button", "Découvrir");
  manifest.captures.push(await capture("mobile-home.png", 390, 844, "Redécouvrez vos jeux"));

  await clickSelector(".mobile-menu");
  await clickByText(".global-nav button", "Jeux");
  await clickByText(".game-support-request>.quiet", "Demander le support d’un jeu");
  await fillVisibleInput(".game-request-form input", "Project Meridian");
  await clickByText(".game-request-form .primary", "Préparer la demande locale");
  await evaluate("document.querySelector('.game-request-status')?.scrollIntoView({block:'center'})");
  await sleep(120);
  manifest.captures.push(await captureCurrentViewport("mobile-game-support-request.png", 390, 844, "Brouillon de demande — non envoyé"));

  await clickSelector(".mobile-menu");
  await clickByText(".global-nav button", "Mods & contenus");
  manifest.captures.push(await capture("mobile-catalog.png", 390, 844, "Catalogue global"));

  await clickSelector(".card-hit");
  manifest.captures.push(await capture("mobile-content-detail.png", 390, 844, "Avant d’ajouter"));
  await clickByText(".detail-tabs button", "Compatibilité et prérequis");
  manifest.captures.push(await capture("mobile-content-compatibility-specialized.png", 390, 844, "Fraîcheur preuve"));
  await clickByText(".detail-tabs button", "Plan avancé");
  manifest.captures.push(await capture("mobile-content-advanced-plan.png", 390, 844, "Plan avancé — démonstration"));
  await clickByText(".detail-tabs button", "Signalement");
  manifest.captures.push(await capture("mobile-content-report.png", 390, 844, "Signaler ce contenu"));
  await clickByText(".report-section .primary", "Préparer le signalement local");
  manifest.captures.push(await capture("mobile-content-report-error.png", 390, 844, "Choisissez une raison avant de préparer le signalement."));

  await navigateHome(390, 844);
  await clickSelector(".mobile-menu");
  await clickByText(".global-nav .mobile-nav-utility", "Bibliothèque");
  manifest.captures.push(await capture("mobile-library.png", 390, 844, "Retrouvez favoris, suivis, collections, profils et historique"));
  await clickByText(".library-tabs button", "Historique");
  manifest.captures.push(await capture("mobile-library-history.png", 390, 844, "Aucun historique réel disponible"));
  await clickByText(".library-tabs button", "Profils de jeu");
  await clickByText(".profile-library article:first-child .quiet", "Ouvrir");
  manifest.captures.push(await capture("mobile-game-profile.png", 390, 844, "Manager non connecté"));
  await clickByText(".profile-preview-actions .quiet", "Prévisualiser une mise à jour");
  manifest.captures.push(await capture("mobile-game-profile-delta.png", 390, 844, "Copie avant promotion"));
  await clickByText(".profile-preview-actions .quiet", "Prévisualiser import / export");
  manifest.captures.push(await capture("mobile-game-profile-interop.png", 390, 844, "Rapport d’import / export — démonstration"));
  await clickByText(".profile-preview-actions .quiet", "Prévisualiser impact d’une désactivation");
  manifest.captures.push(await capture("mobile-game-profile-reverse-impact.png", 390, 844, "Impact avant désactivation — démonstration"));
  await clickByText(".back", "← Retour à la Bibliothèque");

  await clickSelector(".mobile-menu");
  await clickByText(".global-nav button", "Créer");
  manifest.captures.push(await capture("mobile-creator-studio.png", 390, 844, "Creator Studio"));
  await clickByText(".studio-workflow .primary", "Créer un projet local");
  await clickByText(".studio-nav button", "Projects");
  await clickByText(".project-maturity .filter-chips button", "WiP");
  manifest.captures.push(await capture("mobile-creator-project.png", 390, 844, "Crédits structurés"));
  await clickByText(".studio-nav button", "Releases");
  manifest.captures.push(await capture("mobile-creator-platform-validation.png", 390, 844, "Validation par plateforme"));

  await clickSelector(".mobile-menu");
  await clickByText(".global-nav button", "Collections");
  manifest.captures.push(await capture("mobile-collections.png", 390, 844, "Organiser n’est pas installer"));
  await clickByText(".collection-mode-tabs button", "Modpacks");
  manifest.captures.push(await capture("mobile-modpack.png", 390, 844, "Aetherlands — Essentiel"));
  await clickByText(".delta-trigger", "Prévisualiser le delta");
  manifest.captures.push(await capture("mobile-modpack-delta.png", 390, 844, "Avant toute mutation"));

  await clickSelector(".mobile-menu");
  await clickByText(".global-nav button", "Créateurs");
  manifest.captures.push(await capture("mobile-creators.png", 390, 844, "Créateurs, équipes et studios"));

  await clickSelector(".mobile-menu");
  await clickByText(".global-nav button", "Communauté");
  manifest.captures.push(await capture("mobile-community.png", 390, 844, "Des échanges utiles autour des créations"));

  await clickSelector(".mobile-menu");
  await clickByText(".global-nav .mobile-nav-utility", "Notifications");
  manifest.captures.push(await capture("mobile-notifications.png", 390, 844, "Centre de notifications"));
  await evaluate("document.querySelector('.notification-demo-list')?.scrollIntoView({block:'center'})");
  await sleep(120);
  manifest.captures.push(await captureCurrentViewport("mobile-rights-notification-preview.png", 390, 844, "Réponse éditeur reçue — Aetherlands"));

  await clickSelector(".mobile-menu");
  await clickByText(".global-nav .mobile-nav-utility", "Compte");
  manifest.captures.push(await capture("mobile-account.png", 390, 844, "Vous explorez MODARYX en mode invité"));

  await clickByText("footer button", "Droits jeux · démo admin");
  manifest.captures.push(await capture("mobile-rights-dashboard.png", 390, 844, "Aucune demande réelle n’est envoyée dans ce prototype."));
  await clickByText(".support-triage-actions .primary", "Accepter la baseline sûre");
  await evaluate("document.querySelector('.support-triage-result')?.scrollIntoView({block:'center'})");
  await sleep(120);
  manifest.captures.push(await captureCurrentViewport("mobile-rights-triage-accepted.png", 390, 844, "Rights Case de démonstration préparé — non créé réellement."));
  await clickByText(".publisher-contact-actions .quiet", "Vérifier le canal de démonstration");
  await clickByText(".publisher-contact-actions .primary", "Préparer la demande structurée");
  await evaluate("document.querySelector('.publisher-contact-demo')?.scrollIntoView({block:'center'})");
  await sleep(120);
  manifest.captures.push(await captureCurrentViewport("mobile-rights-contact-verified.png", 390, 844, "REQUEST_READY"));
  await evaluate("document.querySelector('.rights-interpretation-demo')?.scrollIntoView({block:'center'})");
  await sleep(120);
  manifest.captures.push(await captureCurrentViewport("mobile-rights-response-interpretation.png", 390, 844, "SAFE_AUTOMATION"));
  await clickByText(".rights-lifecycle-actions .quiet", "Simuler expiration");
  await evaluate("document.querySelector('.rights-lifecycle-demo')?.scrollIntoView({block:'center'})");
  await sleep(120);
  manifest.captures.push(await captureCurrentViewport("mobile-rights-lifecycle-expired.png", 390, 844, "Usages dépendants rebloqués"));
  await clickByText(".rights-lifecycle-actions .quiet", "Réinitialiser le scénario");

  const out = "review-evidence/modaryx-v2-living-threshold-prototype-20261003/visual-proof/multiscreen/manifest.json";
  writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n");
  console.log("MULTISCREEN_CAPTURE_COUNT", manifest.captures.length);
  console.log("PASS_V2_LIVING_THRESHOLD_MULTISCREEN_CAPTURE");
} finally {
  try { ws?.close(); } catch {}
  proc.kill("SIGTERM");
}
