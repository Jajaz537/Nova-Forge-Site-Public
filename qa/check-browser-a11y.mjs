import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN = process.env.MODARYX_TEST_ORIGIN || 'http://127.0.0.1:4175';
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'modaryx-a11y-proof-'));
const USER_DATA_DIR = path.join(TEMP_ROOT, 'chrome-profile');
const pages = [
  'index.html','catalog.html','search.html','creator-studio.html','community.html','profiles.html',
  'ecosystem.html','documentation.html','security.html','verify.html','downloads.html','project.html',
  'project-ember-textures.html','project-balanced-latency-pack.html','project-forge-night-experience.html',
  '404.html','games/index.html','gta-6/index.html','gta-6/mods/index.html','gta-6/guides/index.html',
  'red-dead-redemption-2/index.html','red-dead-redemption-2/mods/index.html','red-dead-redemption-2/guides/index.html'
];
const failures = [];
const results = [];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

fs.mkdirSync(USER_DATA_DIR, {recursive: true});

async function waitForDevToolsPort(timeoutMs = 12000) {
  const file = path.join(USER_DATA_DIR, 'DevToolsActivePort');
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(file)) {
      const [port] = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
      if (/^\d+$/.test(port)) return Number(port);
    }
    const announced = chromeStderr.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//);
    if (announced) return Number(announced[1]);
    await sleep(120);
  }
  throw new Error('DevToolsActivePort not created');
}

async function waitForJson(url, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, {cache:'no-store'});
      if (response.ok) return response.json();
    } catch (error) { lastError = error; }
    await sleep(120);
  }
  throw lastError || new Error('timeout waiting for ' + url);
}

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.opened = new Promise((resolve,reject) => {
      this.ws.addEventListener('open',resolve,{once:true});
      this.ws.addEventListener('error',reject,{once:true});
    });
    this.ws.addEventListener('message',(event) => {
      const message=JSON.parse(String(event.data));
      if(message.id){
        const waiter=this.pending.get(message.id);
        if(!waiter) return;
        this.pending.delete(message.id);
        if(message.error) waiter.reject(new Error(message.error.message || JSON.stringify(message.error)));
        else waiter.resolve(message.result);
        return;
      }
      if(message.method){
        for(const listener of [...(this.listeners.get(message.method)||[])]) listener(message.params);
      }
    });
  }
  async send(method,params={}){
    await this.opened;
    const id=this.nextId++;
    const promise=new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}));
    this.ws.send(JSON.stringify({id,method,params}));
    return promise;
  }
  once(method,timeoutMs=12000){
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{cleanup();reject(new Error('timeout waiting for '+method));},timeoutMs);
      const listener=(params)=>{cleanup();resolve(params);};
      const cleanup=()=>{
        clearTimeout(timer);
        const set=this.listeners.get(method);
        set?.delete(listener);
        if(set&&!set.size)this.listeners.delete(method);
      };
      if(!this.listeners.has(method))this.listeners.set(method,new Set());
      this.listeners.get(method).add(listener);
    });
  }
  close(){this.ws.close();}
}

async function evaluate(cdp,expression,awaitPromise=false){
  const result=await cdp.send('Runtime.evaluate',{expression,awaitPromise,returnByValue:true});
  if(result.exceptionDetails) throw new Error(result.exceptionDetails.text||'Runtime.evaluate failed');
  return result.result?.value;
}

async function navigate(cdp,relative){
  const loaded=cdp.once('Page.loadEventFired',12000);
  const nav=await cdp.send('Page.navigate',{url:ORIGIN.replace(/\/$/,'')+'/'+relative});
  if(nav.errorText) throw new Error('navigation failed: '+nav.errorText);
  await loaded;
  await sleep(220);
}

const chrome=spawn(CHROME_BIN,[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking',
  '--disable-default-apps','--disable-extensions','--disable-sync','--metrics-recording-only','--no-first-run',
  '--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--user-data-dir='+USER_DATA_DIR,
  'about:blank'
],{stdio:['ignore','ignore','pipe']});

let chromeStderr='';
chrome.stderr.on('data',(chunk)=>{chromeStderr=(chromeStderr+String(chunk)).slice(-12000);});

try {
  const debugPort=await waitForDevToolsPort();
  await waitForJson('http://127.0.0.1:'+debugPort+'/json/version');
  const tabResponse=await fetch('http://127.0.0.1:'+debugPort+'/json/new?'+encodeURIComponent('about:blank'),{method:'PUT'});
  if(!tabResponse.ok) throw new Error('cannot create Chrome target: HTTP '+tabResponse.status);
  const tab=await tabResponse.json();
  const cdp=new Cdp(tab.webSocketDebuggerUrl);
  await cdp.opened;
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Accessibility.enable');

  for(const page of pages){
    await navigate(cdp,page);

    const dom = await evaluate(cdp,`(() => {
      const main=document.querySelector('#main');
      const h1=document.querySelector('h1');
      const skip=document.querySelector('.skip-link');
      const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);
      const duplicates=ids.filter((id,index)=>ids.indexOf(id)!==index);
      const badImages=[...document.images].filter(img=>!img.hasAttribute('alt')).map(img=>img.outerHTML.slice(0,140));
      const badControls=[...document.querySelectorAll('input,select,textarea')].filter(el=>{
        if(el.type==='hidden'||el.disabled) return false;
        if(el.getAttribute('aria-label')||el.getAttribute('aria-labelledby')) return false;
        if(el.closest('label')) return false;
        return !(el.id && document.querySelector('label[for="'+CSS.escape(el.id)+'"]'));
      }).map(el=>el.id||el.outerHTML.slice(0,100));
      return {
        hasMain:Boolean(main),
        h1Count:document.querySelectorAll('h1').length,
        h1Text:h1?.textContent?.trim()||'',
        skipHref:skip?.getAttribute('href')||'',
        duplicateIds:[...new Set(duplicates)],
        badImages,
        badControls
      };
    })()`);

    if(!dom.hasMain) failures.push(page+': main missing');
    if(dom.h1Count!==1) failures.push(page+': expected one h1, got '+dom.h1Count);
    if(dom.skipHref!=='#main') failures.push(page+': skip link does not target #main');
    if(dom.duplicateIds.length) failures.push(page+': duplicate ids '+dom.duplicateIds.join(','));
    if(dom.badImages.length) failures.push(page+': image(s) without alt');
    if(dom.badControls.length) failures.push(page+': unlabeled controls '+dom.badControls.join(','));

    const tree=await cdp.send('Accessibility.getFullAXTree');
    const meaningful=(tree.nodes||[]).filter(n=>!n.ignored);
    const interactiveRoles=new Set(['button','link','textbox','searchbox','combobox','checkbox','radio','switch','slider','spinbutton']);
    const unnamed=meaningful.filter(n=>{
      const role=n.role?.value;
      return interactiveRoles.has(role) && !(n.name?.value||'').trim();
    }).map(n=>({role:n.role?.value,nodeId:n.nodeId}));
    if(unnamed.length) failures.push(page+': unnamed AX controls '+JSON.stringify(unnamed.slice(0,8)));

    await cdp.send('Runtime.evaluate',{expression:'document.activeElement?.blur(); true'});
    await cdp.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await cdp.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await sleep(80);
    const firstFocus=await evaluate(cdp,`(() => {
      const el=document.activeElement;
      return {className:el?.className||'',text:el?.textContent?.trim()||'',href:el?.getAttribute?.('href')||''};
    })()`);
    if(!String(firstFocus.className).includes('skip-link')) failures.push(page+': first keyboard focus is not skip-link');

    await cdp.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
    await cdp.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
    await sleep(80);
    const afterSkip=await evaluate(cdp,`(() => ({
      hash:location.hash,
      mainFocused:document.activeElement?.id==='main'
    }))()`);
    if(afterSkip.hash!=='#main') failures.push(page+': activating skip-link did not navigate to #main');

    results.push({
      page,
      h1:dom.h1Text,
      axNodes:meaningful.length,
      unnamedInteractive:unnamed.length,
      firstFocus:firstFocus.text,
      skipHash:afterSkip.hash
    });
  }

  cdp.close();
  console.log(JSON.stringify({
    marker:failures.length?'FAIL_TARGETED_BROWSER_A11Y_MICROPROOF':'PASS_TARGETED_BROWSER_A11Y_MICROPROOF',
    pages:pages.length,
    results,
    failures
  },null,2));
  if(failures.length) process.exitCode=1;
} catch(error){
  console.error(JSON.stringify({
    marker:'FAIL_TARGETED_BROWSER_A11Y_MICROPROOF',
    fatal:error.message,
    chromeStderr,
    failures
  },null,2));
  process.exitCode=1;
} finally {
  chrome.kill('SIGTERM');
  for (let attempt = 0; attempt < 20 && chrome.exitCode === null; attempt++) await sleep(100);
  if (chrome.exitCode === null) chrome.kill('SIGKILL');
  for (let attempt = 0; attempt < 10 && chrome.exitCode === null; attempt++) await sleep(100);
  fs.rmSync(TEMP_ROOT,{recursive:true,force:true,maxRetries:10,retryDelay:100});
}
