const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/downloads.js'),'utf8');
class Element {constructor(){this.children=[];this.dataset={};this.hidden=false;this.disabled=false;this.events={};this.attributes={};this.textContent='';} replaceChildren(...x){this.children=x;} append(...x){this.children.push(...x);} addEventListener(k,f){this.events[k]=f;} setAttribute(k,v){this.attributes[k]=v;} removeAttribute(k){delete this.attributes[k];} focus(){this.focused=true;}}
const tick=()=>new Promise(r=>setImmediate(r));
function setup(fetch){const nodes=new Map();const get=k=>{if(!nodes.has(k))nodes.set(k,new Element());return nodes.get(k)};vm.runInNewContext(source,{URL,fetch,document:{baseURI:'https://example.test/',querySelector:get,createElement:()=>new Element()}});return get;}
const empty={schema:'nova-forge-public-downloads/v1',policy:'verified-artifacts-only',available:false,artifacts:[]};
const response=(payload=empty)=>({ok:true,json:async()=>payload});
(async()=>{const checks=[];
const failed=setup(async()=>{throw Error('offline')});await tick();
assert.match(failed('[data-download-state]').textContent,/Impossible/);
assert.equal(failed('[data-download-artifacts]').children.length,0);assert.equal(failed('[data-download-retry]').hidden,false);
checks.push('Network failure is distinct from declared absence and never exposes artifacts');
let finish,calls=0;const recover=setup(()=>{calls++;return calls===1?Promise.reject(Error('offline')):new Promise(r=>finish=r)});await tick();const retry=recover('[data-download-retry]');const first=retry.events.click();retry.events.click();assert.equal(calls,2);assert.equal(retry.disabled,true);finish(response());await first;
assert.equal(retry.hidden,true);assert.equal(recover('[data-download-state]').focused,true);assert.match(recover('[data-download-state]').textContent,/Aucun téléchargement/);checks.push('Retry is deduplicated and returns focus to the resulting status');
let release;const pending=setup(()=>new Promise(r=>release=r));assert.equal(pending('[data-download-state]').attributes['aria-busy'],'true');release(response());await tick();assert.equal(pending('[data-download-state]').attributes['aria-busy'],undefined);checks.push('Loading status exposes and clears aria-busy');
for(const fetch of [async()=>({ok:false}),async()=>response({}),async()=>({...response(),json:async()=>{throw Error('JSON')}})]){const bad=setup(fetch);await tick();assert.equal(bad('[data-download-artifacts]').children.length,0);assert.equal(bad('[data-download-retry]').hidden,false);}
checks.push('HTTP error, invalid contract and invalid JSON keep distribution locked with recovery');
const again=setup(async()=>{throw Error('offline')});await tick();await again('[data-download-retry]').events.click();assert.equal(again('[data-download-retry]').focused,true);checks.push('Repeated failure keeps keyboard focus on retry');
const stale=setup(async()=>({...response(),headers:{get:()=> 'offline-stale'}}));await tick();assert.equal(stale('[data-download-artifacts]').children.length,0);assert.equal(stale('[data-download-retry]').hidden,false);checks.push('Stale manifest remains locked and offers a fresh attempt');
const report={result:'PASS',scope:'Five grouped Node VM scenarios; not native offline or screen reader proof',checks};fs.writeFileSync(require('node:path').join(__dirname,'download-recovery-checks.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1});
