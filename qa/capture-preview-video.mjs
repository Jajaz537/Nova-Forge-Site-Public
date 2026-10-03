import {spawn,spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN=(process.env.MODARYX_VIDEO_ORIGIN||'').replace(/\/$/,'');
const CHROME_BIN=process.env.CHROME_BIN||'google-chrome';
const OUT=process.env.MODARYX_VIDEO_OUT||path.join(process.cwd(),'preview-video-output');
const FPS=6;
const routes=[
'index.html','catalog.html','search.html','creator-studio.html','community.html','profiles.html',
'ecosystem.html','documentation.html','security.html','verify.html','downloads.html','project.html',
'project-ember-textures.html','project-balanced-latency-pack.html','project-forge-night-experience.html',
'games/index.html','gta-6/index.html','gta-6/mods/index.html','gta-6/guides/index.html',
'red-dead-redemption-2/index.html','red-dead-redemption-2/mods/index.html','red-dead-redemption-2/guides/index.html','404.html'
];
const viewports=[
{name:'desktop',width:1440,height:900,mobile:false},
{name:'mobile',width:390,height:844,mobile:true}
];
if(!/^https:\/\//.test(ORIGIN)) throw new Error('MODARYX_VIDEO_ORIGIN must be HTTPS');
fs.mkdirSync(OUT,{recursive:true});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

class Cdp{
  constructor(url){
    this.ws=new WebSocket(url); this.next=1; this.pending=new Map(); this.listeners=new Map();
    this.opened=new Promise((resolve,reject)=>{this.ws.addEventListener('open',resolve,{once:true});this.ws.addEventListener('error',reject,{once:true});});
    this.ws.addEventListener('message',(e)=>{
      const m=JSON.parse(String(e.data));
      if(m.id){const p=this.pending.get(m.id);if(!p)return;this.pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);return;}
      for(const fn of this.listeners.get(m.method)||[]) fn(m.params);
    });
  }
  async send(method,params={}){await this.opened;const id=this.next++;const p=new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}));this.ws.send(JSON.stringify({id,method,params}));return p;}
  on(method,fn){if(!this.listeners.has(method))this.listeners.set(method,new Set());this.listeners.get(method).add(fn);return()=>this.listeners.get(method)?.delete(fn);}
  once(method,timeout=15000){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{off();reject(new Error('timeout '+method));},timeout);const off=this.on(method,(p)=>{clearTimeout(timer);off();resolve(p);});});}
  close(){this.ws.close();}
}
async function waitJson(url,timeout=15000){const end=Date.now()+timeout;let err;while(Date.now()<end){try{const r=await fetch(url,{cache:'no-store'});if(r.ok)return r.json();}catch(e){err=e;}await sleep(120);}throw err||new Error('timeout '+url);}
async function evaluate(cdp,expression,awaitPromise=false){const r=await cdp.send('Runtime.evaluate',{expression,awaitPromise,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'evaluate failed');return r.result?.value;}
async function navigate(cdp,url){const loaded=cdp.once('Page.loadEventFired',20000);const r=await cdp.send('Page.navigate',{url});if(r.errorText)throw new Error(r.errorText);await loaded;await evaluate(cdp,'document.fonts?.ready || Promise.resolve()',true);await sleep(500);}
async function openChrome(viewport){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'modaryx-video-'));
  const profile=path.join(root,'profile');
  const chrome=spawn(CHROME_BIN,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking','--disable-default-apps','--disable-extensions','--disable-sync','--no-first-run','--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe']});
  let stderr='';chrome.stderr.on('data',c=>stderr=(stderr+String(c)).slice(-12000));
  const deadline=Date.now()+20000;let port=null;
  while(Date.now()<deadline){
    const f=path.join(profile,'DevToolsActivePort');
    if(fs.existsSync(f)){const p=fs.readFileSync(f,'utf8').trim().split(/\r?\n/)[0];if(/^\d+$/.test(p)){port=Number(p);break;}}
    const marker='DevTools listening on ws://127.0.0.1:';const at=stderr.lastIndexOf(marker);
    if(at>=0){const p=stderr.slice(at+marker.length).split('/')[0];if(/^\d+$/.test(p)){port=Number(p);break;}}
    await sleep(120);
  }
  if(!port) throw new Error('DevTools port unavailable');
  await waitJson('http://127.0.0.1:'+port+'/json/version');
  const tab=await (await fetch('http://127.0.0.1:'+port+'/json/new?'+encodeURIComponent('about:blank'),{method:'PUT'})).json();
  const cdp=new Cdp(tab.webSocketDebuggerUrl);await cdp.opened;await cdp.send('Page.enable');await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:viewport.width,height:viewport.height,deviceScaleFactor:1,mobile:viewport.mobile,screenWidth:viewport.width,screenHeight:viewport.height});
  return {root,chrome,cdp};
}
async function captureViewport(viewport){
  const {root,chrome,cdp}=await openChrome(viewport);
  const framesDir=path.join(root,'frames');fs.mkdirSync(framesDir,{recursive:true});
  let frame=0;const manifest=[];
  const off=cdp.on('Page.screencastFrame',async p=>{
    const n=frame++;fs.writeFileSync(path.join(framesDir,'frame-'+String(n).padStart(6,'0')+'.jpg'),Buffer.from(p.data,'base64'));
    try{await cdp.send('Page.screencastFrameAck',{sessionId:p.sessionId});}catch{}
  });
  try{
    for(const route of routes){
      await navigate(cdp,ORIGIN+'/'+route+'?vf-video='+viewport.name);
      await evaluate(cdp,`(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0);return {h:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight),vh:innerHeight};})()`);
      const start=frame;
      await cdp.send('Page.startScreencast',{format:'jpeg',quality:68,maxWidth:viewport.width,maxHeight:viewport.height,everyNthFrame:2});
      await sleep(450);
      const geom=await evaluate(cdp,`(()=>({h:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight),vh:innerHeight}))()`);
      const max=Math.max(0,geom.h-geom.vh);const stops=Math.max(4,Math.min(12,Math.ceil(geom.h/(geom.vh*.72))));
      for(let s=1;s<=stops;s++){
        const target=Math.round(max*(s/stops));
        const from=await evaluate(cdp,'window.scrollY');
        for(let k=1;k<=5;k++){const y=Math.round(from+(target-from)*(k/5));await evaluate(cdp,'window.scrollTo(0,'+y+')');await sleep(90);}
      }
      await sleep(300);await cdp.send('Page.stopScreencast');await sleep(120);
      manifest.push({route,startFrame:start,endFrame:Math.max(start,frame-1),scrollHeight:geom.h});
    }
  }finally{off();cdp.close();chrome.kill('SIGTERM');await sleep(150);if(!chrome.killed)chrome.kill('SIGKILL');}
  if(frame<routes.length*2) throw new Error(viewport.name+': insufficient frames '+frame);
  const out=path.join(OUT,'modaryx-vf-'+viewport.name+'.mp4');
  const ff=spawnSync('ffmpeg',['-y','-loglevel','error','-framerate',String(FPS),'-i',path.join(framesDir,'frame-%06d.jpg'),'-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',out],{encoding:'utf8'});
  if(ff.status!==0) throw new Error('ffmpeg '+viewport.name+': '+ff.stderr);
  fs.rmSync(root,{recursive:true,force:true});
  return {viewport,frames:frame,video:path.basename(out),routes:manifest};
}
const results=[];
for(const viewport of viewports) results.push(await captureViewport(viewport));
const result={marker:'PASS_TARGETED_FRESH_SITE_VIDEO',origin:ORIGIN,fps:FPS,routeCount:routes.length,results};
fs.writeFileSync(path.join(OUT,'video-manifest.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
