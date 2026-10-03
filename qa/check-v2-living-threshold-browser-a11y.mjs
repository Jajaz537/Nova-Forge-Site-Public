import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome = process.env.CHROME_BIN;
const origin = process.env.MODARYX_REVIEW_ORIGIN || "http://127.0.0.1:4174";
if (!chrome) throw new Error("CHROME_BIN missing");

const port = 9223;
const proc = spawn(chrome, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--hide-scrollbars",
  "--remote-debugging-port=" + port,
  "--user-data-dir=/tmp/modaryx-v2-cdp-profile",
  "about:blank",
], { stdio: "ignore" });

const fail = (message) => {
  console.error("FAIL_V2_LIVING_THRESHOLD_BROWSER_A11Y", message);
  process.exitCode = 1;
  throw new Error(message);
};

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

let ws;
let nextId = 1;
const pending = new Map();
function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}
async function evaluate(expression) {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text || "Runtime.evaluate failed");
  return r.result?.result?.value;
}
async function pressTab() {
  const common = { key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 };
  await send("Input.dispatchKeyEvent", { type: "keyDown", ...common });
  await send("Input.dispatchKeyEvent", { type: "keyUp", ...common });
}
async function navigate(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: 1, mobile: width < 760,
  });
  await send("Page.navigate", { url: origin });
  for (let i = 0; i < 60; i++) {
    if (await evaluate("document.readyState === 'complete'")) break;
    await sleep(100);
  }
  await sleep(250);
}

try {
  await waitJson("/json/version");
  const targets = await waitJson("/json/list");
  const target = targets.find(x => x.type === "page");
  if (!target?.webSocketDebuggerUrl) fail("page target missing");
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
  await send("Accessibility.enable");

  await navigate(1440, 1024);
  const axResponse=await send("Accessibility.getFullAXTree");
  const axNodes=axResponse.result?.nodes||[];
  const axUseful=axNodes.filter(node=>!node.ignored);
  const axNames=axUseful.map(node=>({role:node.role?.value||"",name:node.name?.value||""}));
  const hasMainNav=axNames.some(node=>node.role==="navigation"&&node.name==="Navigation principale");
  const hasGameHeading=axNames.some(node=>node.role==="heading"&&node.name==="Aetherlands");
  const hasGameSearch=axNames.some(node=>node.role==="textbox"&&node.name==="Rechercher dans ce jeu");
  if(!hasMainNav) fail("AX tree missing named primary navigation");
  if(!hasGameHeading) fail("AX tree missing Aetherlands heading");
  if(!hasGameSearch) fail("AX tree missing contextual game search textbox");
  console.log("AX_TREE_NODES",axUseful.length);
  console.log("AX_ASSERT primary navigation / game heading / contextual search");
  const desktopOverflow = await evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth");
  if (desktopOverflow > 1) fail("desktop horizontal overflow " + desktopOverflow);

  const focusableCount = await evaluate(`(() => {
    const selector='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const list=[...document.querySelectorAll(selector)].filter(el => {
      const r=el.getBoundingClientRect(), s=getComputedStyle(el);
      return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && r.height>0;
    });
    list.forEach((el,i)=>el.dataset.qaFocusId=String(i));
    document.body.setAttribute('tabindex','-1'); document.body.focus();
    return list.length;
  })()`);
  if (!focusableCount || focusableCount < 10) fail("unexpected focusable count " + focusableCount);

  const reached = new Set();
  for (let i = 0; i < focusableCount; i++) {
    await pressTab();
    const id = await evaluate("document.activeElement?.dataset?.qaFocusId ?? null");
    if (id !== null) reached.add(Number(id));
  }
  if (reached.size !== focusableCount) {
    fail(`keyboard reachability incomplete: ${reached.size}/${focusableCount}`);
  }
  console.log("KEYBOARD_REACHABLE", reached.size, "/", focusableCount);

  await navigate(390, 844);
  const mobileOverflow = await evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth");
  if (mobileOverflow > 1) fail("mobile horizontal page overflow " + mobileOverflow);

  const smallTargets = await evaluate(`(() => {
    const selector='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    return [...document.querySelectorAll(selector)].filter(el => {
      const r=el.getBoundingClientRect(), s=getComputedStyle(el);
      return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && r.height>0 && (r.width < 44 || r.height < 44);
    }).map(el => ({
      tag:el.tagName,
      label:el.getAttribute('aria-label') || el.textContent.trim().slice(0,50),
      width:Math.round(el.getBoundingClientRect().width*10)/10,
      height:Math.round(el.getBoundingClientRect().height*10)/10
    }));
  })()`);
  if (smallTargets.length) {
    console.error(JSON.stringify(smallTargets, null, 2));
    fail("mobile targets below 44x44: " + smallTargets.length);
  }

  const mobileMenuVisible = await evaluate(`(() => {
    const el=document.querySelector('.mobile-menu'); if(!el) return false;
    const r=el.getBoundingClientRect(),s=getComputedStyle(el);
    return s.display!=='none' && r.width>=44 && r.height>=44;
  })()`);
  if (!mobileMenuVisible) fail("mobile menu target not visible/44px");

  console.log("DESKTOP_OVERFLOW", desktopOverflow);
  console.log("MOBILE_OVERFLOW", mobileOverflow);
  console.log("PASS_V2_LIVING_THRESHOLD_BROWSER_A11Y");
} finally {
  try { ws?.close(); } catch {}
  proc.kill("SIGTERM");
}
