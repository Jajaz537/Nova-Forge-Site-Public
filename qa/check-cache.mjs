// Node mocks verify source semantics only: not browser HTTPS/offline or runtime performance proof.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const handlers={}, deleted=[], added=[], writes=[];
const entries=new Map();
let networkCalls=0, networkOffline=false, networkStatus=200, failWrites=false, lastFetchOptions;
const response=(body='fresh',status=200)=>({status,statusText:'',type:'basic',body,headers:new Headers(),clone(){return response(body,status);}});
const cache={addAll:async urls=>{added.push(...urls);for(const url of urls)entries.set(url,response('cached'));},match:async key=>entries.get(key),put:async (key,value)=>{if(failWrites)throw new Error('quota');writes.push(key);entries.set(key,value);}};
const context={URL,Set,Map,Promise,Response,Headers,self:{location:new URL('https://example.test/sw.js'),addEventListener:(type,fn)=>handlers[type]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>cache,keys:async()=>['unrelated-application-cache','nova-site-shell-old','nova-site-shell-v39-modaryx-premium'],delete:async key=>deleted.push(key)},fetch:async(request,options)=>{lastFetchOptions=options;networkCalls++;if(networkOffline)throw new Error('offline');return response('fresh',networkStatus);}};
vm.runInNewContext(source,context,{filename:'sw.js'});
let installPromise;handlers.install({waitUntil:p=>installPromise=p});await installPromise;
let activatePromise;handlers.activate({waitUntil:p=>activatePromise=p});await activatePromise;
const assertions=[];
function check(name,condition){assertions.push({name,passed:!!condition});}
check('Only old site cache deleted',deleted.length===1&&deleted[0]==='nova-site-shell-old');
const probes=[];
async function probe(url,mode='navigate',method='GET'){
  let intercepted=false,promise;const waits=[];const before=networkCalls;
  handlers.fetch({request:{url:url.startsWith('https:')?url:'https://example.test'+url,mode,method},respondWith:p=>{intercepted=true;promise=p;},waitUntil:p=>waits.push(p)});
  const result=await promise;await Promise.all(waits);
  const record={url,mode,method,intercepted,networkCalls:networkCalls-before,waitUntilCalls:waits.length,status:result?.status,stale:result?.headers?.get('X-Modaryx-Cache')||null};
  probes.push(record);return {record,result};
}
for(const url of ['/catalog.html','/catalog.html?game=demo','/catalog','/catalog?game=demo']){
  const {record}=await probe(url);check('Public alias '+url,record.intercepted&&record.networkCalls===1&&record.waitUntilCalls===1);
}
check('Aliases write canonical key',writes.length===4&&writes.every(key=>key==='https://example.test/catalog.html'));
for(const [url,mode,method] of [['/private.html','navigate','GET'],['/catalog.html','navigate','POST'],['https://other.test/catalog.html','navigate','GET'],['/downloads.json?private=1','cors','GET'],['/catalogue','navigate','GET']]){
  check('Excluded '+method+' '+url,!(await probe(url,mode,method)).record.intercepted);
}
for(const url of ['/public-build.json','/downloads.json','/public-status.json','/SHA256SUMS.txt','/data/catalog.json']){
  entries.set('https://example.test'+url,response('cached'));
  const {record}=await probe(url,'cors');check('Metadata network first '+url,record.intercepted&&record.networkCalls===1&&record.waitUntilCalls===1&&lastFetchOptions?.cache==='no-store');
}
networkOffline=true;
for(const [url,mode] of [['/catalog?game=demo','navigate'],['/downloads.json','cors']]){
  const {record,result}=await probe(url,mode);check('Offline explicit stale '+url,record.status===200&&record.stale==='offline-stale'&&await result.text()==='fresh');
}
entries.delete('https://example.test/public-build.json');
check('No cached metadata is network error',(await probe('/public-build.json','cors')).result.type==='error');
networkOffline=false;networkStatus=404;
check('HTTP 404 retained',(await probe('/downloads.json','cors')).record.status===404);
networkStatus=200;failWrites=true;
check('Quota failure preserves network response',(await probe('/downloads.json','cors')).record.status===200);
failWrites=false;
const cachePaths=[...new Set(added.map(url=>new URL(url).pathname.slice(1)||'index.html'))];
const missing=cachePaths.filter(name=>!fs.existsSync(path.join(root,name)));
const measures=names=>{let raw=0,gzip=0;for(const name of names){const bytes=fs.readFileSync(path.join(root,name));raw+=bytes.length;gzip+=zlib.gzipSync(bytes,{level:9}).length;}return {files:names.length,rawBytes:raw,gzipEstimateBytes:gzip};};
const pages=fs.readdirSync(root).filter(name=>name.endsWith('.html')&&!['review.html','comparison.html'].includes(name)).sort().map(name=>{
  const html=fs.readFileSync(path.join(root,name),'utf8');
  const resources=[...html.matchAll(/<(?:link|script)\b[^>]*(?:href|src)=["']([^"']+\.(?:css|js))["'][^>]*>/g)].map(m=>m[1].replace(/^\.\//,''));
  return {page:name,htmlBytes:Buffer.byteLength(html),css:measures(resources.filter(p=>p.endsWith('.css'))),js:measures(resources.filter(p=>p.endsWith('.js')))};
});
const baseline=path.resolve(root,'../site-baseline');
const protectedPaths=['_headers','_redirects','domain-cutover.json','robots.txt','sitemap.xml','site.webmanifest'];
function walk(dir,prefix=''){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name),prefix+entry.name+'/'):[prefix+entry.name]);}
if(fs.existsSync(path.join(root,'.github')))protectedPaths.push(...walk(path.join(root,'.github')).map(p=>'.github/'+p));
const protectedFiles=protectedPaths.map(file=>({file,unchanged:fs.existsSync(path.join(baseline,file))&&fs.readFileSync(path.join(root,file)).equals(fs.readFileSync(path.join(baseline,file)))}));
const results={measuredAt:new Date().toISOString(),scope:'Node mocked service-worker semantics and static file sizes; no browser offline or runtime performance claim',assertions,serviceWorkerSha256:crypto.createHash('sha256').update(source).digest('hex'),probes,activationDeletedCaches:deleted,precache:{requests:added.length,uniqueLocalFiles:cachePaths.length,missing,...(missing.length?{}:measures(cachePaths))},pages,protectedFiles};
fs.writeFileSync(path.join(root,'qa/cache-checks.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({assertions:assertions.length,failed:assertions.filter(a=>!a.passed),precache:results.precache,protectedChanges:protectedFiles.filter(p=>!p.unchanged)},null,2));
if(assertions.some(a=>!a.passed)||missing.length||protectedFiles.some(p=>!p.unchanged))process.exitCode=1;
