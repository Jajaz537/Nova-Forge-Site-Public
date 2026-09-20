import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN=(process.env.MODARYX_TEST_ORIGIN||'http://127.0.0.1:4179').replace(/\/$/,'');
const CHROME_BIN=process.env.CHROME_BIN||'google-chrome';
const OUT=process.env.MODARYX_STATIC_REVIEW_OUT||path.join(process.cwd(),'static-premium-review-output');
const TEMP_ROOT=fs.mkdtempSync(path.join(os.tmpdir(),'modaryx-static-premium-'));
const USER_DATA_DIR=path.join(TEMP_ROOT,'chrome-profile');
const pages=[
  {id:'ecosystem',path:'ecosystem.html'},
  {id:'security',path:'security.html'},
  {id:'documentation',path:'documentation.html'},
  {id:'games',path:'games/index.html'},
  {id:'404',path:'404.html'}
];
const viewports=[
  {id:'desktop',width:1440,height:1000,mobile:false},
  {id:'mobile',width:390,height:844,mobile:true}
];
const failures=[];
const observations=[];
fs.mkdirSync(OUT,{recursive:true});

const sleep=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms));

async function waitForDevToolsPort(timeoutMs=12000){
  const file=path.join(USER_DATA_DIR,'DevToolsActivePort');
  const deadline=Date.now()+timeoutMs;
  while(Date.now()<deadline){
    if(fs.existsSync(file)){
      const [port]=fs.readFileSync(file,'utf8').trim().split(/\r?\n/);
      if(/^\d+$/.test(port)) return Number(port);
    }
    await sleep(100);
  }
  throw new Error('DevToolsActivePort not created');
}

async function waitForJson(url,timeoutMs=10000){
  const deadline=Date.now()+timeoutMs;
  let lastError;
  while(Date.now()<deadline){
    try{
      const response=await fetch(url,{cache:'no-store'});
      if(response.ok) return response.json();
    }catch(error){lastError=error;}
    await sleep(100);
  }
  throw lastError||new Error('timeout waiting for '+url);
}

class Cdp{
  constructor(url){
    this.ws=new WebSocket(url);
    this.nextId=1;
    this.pending=new Map();
    this.listeners=new Map();
    this.opened=new Promise((resolve,reject)=>{
      this.ws.addEventListener('open',resolve,{once:true});
      this.ws.addEventListener('error',reject,{once:true});
    });
    this.ws.addEventListener('message',(event)=>{
      const message=JSON.parse(String(event.data));
      if(message.id){
        const waiter=this.pending.get(message.id);
        if(!waiter) return;
        this.pending.delete(message.id);
        if(message.error) waiter.reject(new Error(message.error.message||JSON.stringify(message.error)));
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
  once(method,timeoutMs=15000){
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

async function navigate(cdp,url){
  const loaded=cdp.once('Page.loadEventFired',15000);
  const nav=await cdp.send('Page.navigate',{url});
  if(nav.errorText) throw new Error('navigation failed: '+nav.errorText);
  await loaded;
  await evaluate(cdp,'document.fonts?.ready || Promise.resolve()',true);
  await sleep(350);
}

async function capture(cdp,page,viewport){
  await cdp.send('Emulation.setDeviceMetricsOverride',{
    width:viewport.width,
    height:viewport.height,
    deviceScaleFactor:1,
    mobile:viewport.mobile,
    screenWidth:viewport.width,
    screenHeight:viewport.height
  });

  await navigate(cdp,ORIGIN+'/'+page.path+'?static-premium-proof='+viewport.id);

  const metrics=await evaluate(cdp,`(() => {
    const de=document.documentElement;
    const body=document.body;
    const h1=document.querySelector('h1');
    const hero=document.querySelector('.hero,.catalog-hero,.project-hero,.studio-hero,.profiles-hero');
    const header=document.querySelector('.topbar,.nova-topbar');
    const footer=document.querySelector('.site-footer');
    const nav=document.querySelector('.section-nav');
    const h1Rect=h1?.getBoundingClientRect();
    const heroRect=hero?.getBoundingClientRect();
    const headerRect=header?.getBoundingClientRect();
    const visible=(el)=>{
      if(!el) return false;
      const r=el.getBoundingClientRect();
      const s=getComputedStyle(el);
      return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
    };
    const brokenImages=[...document.images]
      .filter((img)=>img.complete&&img.naturalWidth===0)
      .map((img)=>img.getAttribute('src')||'');
    const clippedControls=[...document.querySelectorAll('a,button,input,select,textarea,summary')]
      .filter((el)=>{
        if(!visible(el)||el.closest('.section-nav')) return false;
        const r=el.getBoundingClientRect();
        return r.right>innerWidth+2||r.left<-2;
      })
      .map((el)=>({
        tag:el.tagName.toLowerCase(),
        text:(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,80),
        left:Math.round(el.getBoundingClientRect().left),
        right:Math.round(el.getBoundingClientRect().right)
      }));
    const heroStyle=hero?getComputedStyle(hero):null;
    return {
      title:document.title,
      h1:(h1?.textContent||'').trim(),
      readyState:document.readyState,
      viewport:{width:innerWidth,height:innerHeight},
      documentWidth:Math.max(de.scrollWidth,body?.scrollWidth||0),
      overflowPx:Math.max(0,Math.max(de.scrollWidth,body?.scrollWidth||0)-de.clientWidth),
      h1Visible:Boolean(h1Rect&&h1Rect.width>0&&h1Rect.height>0),
      h1Geometry:h1Rect?{top:Math.round(h1Rect.top),bottom:Math.round(h1Rect.bottom),width:Math.round(h1Rect.width),height:Math.round(h1Rect.height)}:null,
      heroVisible:visible(hero),
      heroGeometry:heroRect?{top:Math.round(heroRect.top),bottom:Math.round(heroRect.bottom),width:Math.round(heroRect.width),height:Math.round(heroRect.height)}:null,
      headerBottom:headerRect?Math.round(headerRect.bottom):null,
      footerVisible:visible(footer),
      sectionCount:document.querySelectorAll('main .section').length,
      cardCount:document.querySelectorAll('main .card').length,
      sectionNavPresent:Boolean(nav),
      sectionNavScrollable:Boolean(nav&&nav.scrollWidth>nav.clientWidth+1),
      brokenImages,
      clippedControls,
      heroBackgroundImage:heroStyle?.backgroundImage||null
    };
  })()`);

  if(metrics.readyState!=='complete') failures.push(page.id+' '+viewport.id+': document not complete');
  if(metrics.viewport.width!==viewport.width) failures.push(page.id+' '+viewport.id+': viewport mismatch '+metrics.viewport.width);
  if(metrics.overflowPx>1) failures.push(page.id+' '+viewport.id+': horizontal overflow '+metrics.overflowPx+'px');
  if(!metrics.h1Visible) failures.push(page.id+' '+viewport.id+': h1 not visible');
  if(!metrics.heroVisible) failures.push(page.id+' '+viewport.id+': hero not visible');
  if(!metrics.footerVisible) failures.push(page.id+' '+viewport.id+': footer not visible in layout');
  if(metrics.brokenImages.length) failures.push(page.id+' '+viewport.id+': broken images '+metrics.brokenImages.join(','));
  if(metrics.clippedControls.length) failures.push(page.id+' '+viewport.id+': clipped controls '+JSON.stringify(metrics.clippedControls));

  const layout=await cdp.send('Page.getLayoutMetrics');
  const width=Math.ceil(layout.cssContentSize?.width||viewport.width);
  const height=Math.min(14000,Math.ceil(layout.cssContentSize?.height||viewport.height));
  const shot=await cdp.send('Page.captureScreenshot',{
    format:'png',
    fromSurface:true,
    captureBeyondViewport:true,
    clip:{x:0,y:0,width,height,scale:1}
  });
  fs.writeFileSync(path.join(OUT,viewport.id+'-'+page.id+'.png'),Buffer.from(shot.data,'base64'));
  observations.push({page:page.path,viewport:viewport.id,...metrics,screenshot:{width,height}});
}

const chrome=spawn(CHROME_BIN,[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking',
  '--disable-default-apps','--disable-extensions','--disable-sync','--metrics-recording-only','--no-first-run',
  '--remote-debugging-address=127.0.0.1','--remote-debugging-port=0',
  '--user-data-dir='+USER_DATA_DIR,'about:blank'
],{stdio:['ignore','ignore','pipe']});

let chromeStderr='';
chrome.stderr.on('data',(chunk)=>{chromeStderr=(chromeStderr+String(chunk)).slice(-12000);});

try{
  const port=await waitForDevToolsPort();
  await waitForJson('http://127.0.0.1:'+port+'/json/version');
  const tabResponse=await fetch('http://127.0.0.1:'+port+'/json/new?'+encodeURIComponent('about:blank'),{method:'PUT'});
  if(!tabResponse.ok) throw new Error('cannot create Chrome target: HTTP '+tabResponse.status);
  const tab=await tabResponse.json();
  const cdp=new Cdp(tab.webSocketDebuggerUrl);
  await cdp.opened;
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  for(const viewport of viewports){
    for(const page of pages){
      try{await capture(cdp,page,viewport);}
      catch(error){failures.push(page.id+' '+viewport.id+': '+error.message);}
    }
  }

  cdp.close();
  const result={
    marker:failures.length?'FAIL_TARGETED_STATIC_PREMIUM_HD_REVIEW':'PASS_TARGETED_STATIC_PREMIUM_HD_REVIEW',
    scope:'Static surfaces only; structural/visual browser micro-proof, not human artistic sign-off',
    pages:pages.map((page)=>page.path),
    viewports,
    observations,
    failures
  };
  fs.writeFileSync(path.join(OUT,'static-premium-review.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
  if(failures.length) process.exitCode=1;
}catch(error){
  const result={
    marker:'FAIL_TARGETED_STATIC_PREMIUM_HD_REVIEW',
    fatal:error.message,
    failures,
    chromeStderr
  };
  fs.writeFileSync(path.join(OUT,'static-premium-review.json'),JSON.stringify(result,null,2)+'\n');
  console.error(JSON.stringify(result,null,2));
  process.exitCode=1;
}finally{
  chrome.kill('SIGTERM');
  await sleep(150);
  if(!chrome.killed) chrome.kill('SIGKILL');
  fs.rmSync(TEMP_ROOT,{recursive:true,force:true});
}
