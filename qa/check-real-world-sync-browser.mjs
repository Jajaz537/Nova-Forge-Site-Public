import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ORIGIN=process.env.MODARYX_TEST_ORIGIN||'http://127.0.0.1:4178';
const CHROME_BIN=process.env.CHROME_BIN||'google-chrome';
const USER_DATA_DIR='/tmp/modaryx-reality-'+process.pid;
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const failures=[];
const assert=(name,condition)=>{if(!condition)failures.push(name);};

async function waitPort(timeoutMs=12000){
  const file=path.join(USER_DATA_DIR,'DevToolsActivePort');
  const deadline=Date.now()+timeoutMs;
  while(Date.now()<deadline){
    if(fs.existsSync(file)){
      const port=Number(fs.readFileSync(file,'utf8').trim().split(/\r?\n/)[0]);
      if(Number.isInteger(port))return port;
    }
    await sleep(100);
  }
  throw new Error('DevToolsActivePort not created');
}
class Cdp{
  constructor(url){
    this.ws=new WebSocket(url);this.id=1;this.pending=new Map();this.listeners=new Map();
    this.ready=new Promise((resolve,reject)=>{this.ws.addEventListener('open',resolve,{once:true});this.ws.addEventListener('error',reject,{once:true});});
    this.ws.addEventListener('message',(event)=>{
      const msg=JSON.parse(String(event.data));
      if(msg.id){const p=this.pending.get(msg.id);if(!p)return;this.pending.delete(msg.id);msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg.result);return;}
      for(const fn of [...(this.listeners.get(msg.method)||[])])fn(msg.params);
    });
  }
  async send(method,params={}){await this.ready;const id=this.id++;const result=new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}));this.ws.send(JSON.stringify({id,method,params}));return result;}
  once(method,timeoutMs=12000){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{cleanup();reject(new Error('timeout '+method));},timeoutMs);const fn=(value)=>{cleanup();resolve(value);};const cleanup=()=>{clearTimeout(timer);this.listeners.get(method)?.delete(fn);};if(!this.listeners.has(method))this.listeners.set(method,new Set());this.listeners.get(method).add(fn);});}
  close(){this.ws.close();}
}
async function evalv(cdp,expression,awaitPromise=false){
  const result=await cdp.send('Runtime.evaluate',{expression,awaitPromise,returnByValue:true});
  if(result.exceptionDetails)throw new Error(result.exceptionDetails.text||'eval failed');
  return result.result?.value;
}
async function waitFor(cdp,expression,label){
  const deadline=Date.now()+12000;
  while(Date.now()<deadline){
    if(await evalv(cdp,expression,true))return;
    await sleep(150);
  }
  throw new Error('timeout '+label);
}

const chrome=spawn(CHROME_BIN,[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking',
  '--disable-default-apps','--disable-extensions','--disable-sync','--no-first-run',
  '--remote-debugging-address=127.0.0.1','--remote-debugging-port=0',
  '--user-data-dir='+USER_DATA_DIR,'about:blank'
],{stdio:['ignore','ignore','pipe']});
let stderr='';chrome.stderr.on('data',d=>stderr=(stderr+String(d)).slice(-6000));

try{
  const port=await waitPort();
  const version=await fetch('http://127.0.0.1:'+port+'/json/version').then(r=>r.json());
  if(!version.webSocketDebuggerUrl)throw new Error('no DevTools endpoint');
  const target=await fetch('http://127.0.0.1:'+port+'/json/new?'+encodeURIComponent('about:blank'),{method:'PUT'}).then(r=>r.json());
  const cdp=new Cdp(target.webSocketDebuggerUrl);await cdp.ready;
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');
  const loaded=cdp.once('Page.loadEventFired');
  await cdp.send('Page.navigate',{url:ORIGIN+'/index.html'});await loaded;

  await waitFor(cdp,"document.documentElement.dataset.realitySync==='active'",'automatic sync');
  const automatic=await evalv(cdp,`(()=>({
    source:document.documentElement.dataset.realitySource,
    season:document.documentElement.dataset.localSeason,
    daypart:document.documentElement.dataset.localDaypart,
    weather:document.documentElement.dataset.localWeather,
    text:document.querySelector('[data-real-world-context]')?.textContent||'',
    style:Boolean(document.querySelector('link[data-real-world-sync-style]')),
    layerHidden:document.querySelector('[data-real-weather-layer]')?.hidden
  }))()`);
  assert('browser fallback source',automatic.source==='browser-timezone');
  assert('season detected',Boolean(automatic.season));
  assert('daypart detected',Boolean(automatic.daypart));
  assert('weather stays unavailable without provider',automatic.weather==='unavailable');
  assert('automatic UI copy',automatic.text.startsWith('Automatique · '));
  assert('sync CSS loaded',automatic.style===true);
  assert('weather layer stays mounted for soft transitions',automatic.layerHidden===false);

  const synthetic=await evalv(cdp,`(async()=>{
    const m=await import('./assets/real-world-sync.mjs');
    const state=await m.applyRealitySync({
      document,
      now:new Date('2026-01-15T12:00:00Z'),
      contextOverride:{
        schemaVersion:1,
        source:'proof-coarse',
        context:{timezone:'Australia/Sydney',climateBand:'south-temperate'},
        weather:{status:'live',condition:'rain',intensity:.45,attribution:{label:'Proof weather',url:location.origin+'/source'}}
      }
    });
    return {
      season:state.season,
      weather:document.documentElement.dataset.localWeather,
      layerHidden:document.querySelector('[data-real-weather-layer]')?.hidden,
      text:document.querySelector('[data-real-world-context]')?.textContent||'',
      attribution:document.querySelector('[data-weather-attribution]')?.textContent||''
    };
  })()`,true);
  assert('southern January summer',synthetic.season==='summer');
  assert('rain state active',synthetic.weather==='rain');
  assert('rain layer visible',synthetic.layerHidden===false);
  assert('copy mentions summer',synthetic.text.includes('été'));
  assert('copy mentions rain',synthetic.text.includes('pluie'));
  assert('attribution visible',synthetic.attribution.includes('Proof weather'));

  const clearSpells=await evalv(cdp,`(async()=>{
    const m=await import('./assets/real-world-sync.mjs');
    const state=await m.applyRealitySync({
      document,
      now:new Date('2026-09-20T13:00:00Z'),
      contextOverride:{
        schemaVersion:1,
        source:'proof-coarse',
        context:{timezone:'Europe/Paris',climateBand:'north-temperate'},
        weather:{status:'live',condition:'partly-cloudy',intensity:.43,attribution:{label:'Proof weather',url:location.origin+'/source'}}
      }
    });
    return {
      weather:document.documentElement.dataset.localWeather,
      layerHidden:document.querySelector('[data-real-weather-layer]')?.hidden,
      text:document.querySelector('[data-real-world-context]')?.textContent||''
    };
  })()`,true);
  assert('clear spells state active',clearSpells.weather==='partly-cloudy');
  assert('clear spells layer remains mounted',clearSpells.layerHidden===false);
  assert('copy mentions clear spells',clearSpells.text.includes('éclaircies'));

  const wind=await evalv(cdp,`(async()=>{
    const m=await import('./assets/real-world-sync.mjs');
    await m.applyRealitySync({
      document,
      now:new Date('2026-09-20T13:00:00Z'),
      contextOverride:{
        schemaVersion:1,
        source:'proof-coarse',
        context:{timezone:'Europe/Paris',climateBand:'north-temperate'},
        weather:{status:'live',condition:'wind',intensity:.64,attribution:{label:'Proof weather',url:location.origin+'/source'}}
      }
    });
    return {
      weather:document.documentElement.dataset.localWeather,
      text:document.querySelector('[data-real-world-context]')?.textContent||''
    };
  })()`,true);
  assert('wind state active',wind.weather==='wind');
  assert('copy mentions wind',wind.text.includes('vent soutenu'));

  cdp.close();
  console.log(JSON.stringify({
    marker:failures.length?'FAIL_TARGETED_REAL_WORLD_SYNC_BROWSER':'PASS_TARGETED_REAL_WORLD_SYNC_BROWSER',
    automatic,syntheticSouthRain:synthetic,syntheticClearSpells:clearSpells,syntheticWind:wind,failures
  },null,2));
  if(failures.length)process.exitCode=1;
}catch(error){
  console.error(JSON.stringify({marker:'FAIL_TARGETED_REAL_WORLD_SYNC_BROWSER',fatal:error.message,chromeStderr:stderr,failures},null,2));
  process.exitCode=1;
}finally{
  chrome.kill('SIGTERM');
}
