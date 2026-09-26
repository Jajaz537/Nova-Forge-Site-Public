import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const handlers={};
const entries=new Map();
const deletedCaches=[];
let networkOffline=false;
let networkCalls=0;
let lastFetchOptions;
let networkBody='fresh';

const response=(body='fresh',status=200)=>({
  status,statusText:'',type:'basic',body,headers:new Headers(),
  clone(){return response(body,status);}
});

const cache={
  addAll:async urls=>{for(const url of urls)entries.set(url,response('cached'));},
  match:async key=>entries.get(typeof key==='string'?key:key.url),
  put:async(key,value)=>entries.set(typeof key==='string'?key:key.url,value),
  delete:async key=>entries.delete(typeof key==='string'?key:key.url),
  keys:async()=>[...entries.keys()].map(url=>({url}))
};

const context={
  URL,Set,Map,Promise,Response,Headers,
  self:{
    location:new URL('https://example.test/sw.js'),
    addEventListener:(type,fn)=>handlers[type]=fn,
    skipWaiting:async()=>{},
    clients:{claim:async()=>{}}
  },
  caches:{
    open:async()=>cache,
    keys:async()=>['unrelated-application-cache','nova-site-shell-v119-profile-depth','modaryx-site-old'],
    delete:async key=>deletedCaches.push(key)
  },
  fetch:async(request,options)=>{
    networkCalls++;
    lastFetchOptions=options;
    if(networkOffline)throw new Error('offline');
    return response(networkBody);
  }
};

vm.runInNewContext(source,context,{filename:'sw.js'});

let installPromise;
handlers.install({waitUntil:p=>installPromise=p});
await installPromise;

const expectedCore=[
  'https://example.test/',
  'https://example.test/index.html',
  'https://example.test/404.html',
  'https://example.test/site.webmanifest',
  'https://example.test/favicon.svg',
  'https://example.test/assets/modaryx-mark-192.png',
  'https://example.test/assets/modaryx-mark-512.png',
  'https://example.test/assets/modaryx-mark.svg',
  'https://example.test/assets/tokens.css',
  'https://example.test/assets/nova-premium-hd.css',
  'https://example.test/assets/modaryx-premium-refinement.css',
  'https://example.test/assets/modaryx-foundations.css',
  'https://example.test/assets/modaryx-home-cinematic.css',
  'https://example.test/assets/modaryx-home-finishline.css',
  'https://example.test/assets/shell.js',
  'https://example.test/assets/app.js',
  'https://example.test/assets/nova-premium-hd.js'
];
const coreSet=new Set(expectedCore);

function assert(name,condition){
  if(!condition)throw new Error(name);
}

assert('precache keys mismatch',entries.size===expectedCore.length);
assert('precache core mismatch',expectedCore.every(key=>entries.has(key)));
assert('heavy hero art must not install-precache',[...entries.keys()].every(key=>!key.includes('modaryx-wolf-dragon-hero.webp')));
assert('large panorama must not install-precache',[...entries.keys()].every(key=>!key.includes('modaryx-world-portals.webp')));

let activatePromise;
handlers.activate({waitUntil:p=>activatePromise=p});
await activatePromise;
assert(
  'cache cleanup must only delete MODARYX/legacy site caches',
  JSON.stringify(deletedCaches.sort())===JSON.stringify(['modaryx-site-old','nova-site-shell-v119-profile-depth'].sort())
);

async function probe(url,mode='cors',method='GET'){
  let intercepted=false,promise;
  const waits=[];
  const before=networkCalls;
  handlers.fetch({
    request:{url:url.startsWith('https:')?url:'https://example.test'+url,mode,method},
    respondWith:p=>{intercepted=true;promise=p;},
    waitUntil:p=>waits.push(p)
  });
  const result=intercepted?await promise:undefined;
  await Promise.all(waits);
  return {intercepted,result,networkCalls:networkCalls-before};
}

let result=await probe('/assets/future-game-art.webp?v=123');
assert('future public asset should runtime-cache without SW allowlist edit',result.intercepted&&result.networkCalls===1&&result.result?.body==='fresh');
assert('runtime static queries must canonicalize',entries.has('https://example.test/assets/future-game-art.webp'));

networkBody='updated';
result=await probe('/assets/future-game-art.webp?v=999');
assert('runtime art should refresh online even when cached',result.intercepted&&result.networkCalls===1&&result.result?.body==='updated');

networkOffline=true;
result=await probe('/assets/future-game-art.webp?v=999');
assert('runtime art should fall back to the latest cached copy offline',result.intercepted&&result.networkCalls===1&&result.result?.headers?.get('X-Modaryx-Cache')==='offline-stale');
networkOffline=false;
networkBody='fresh';

result=await probe('/catalog','navigate');
assert('known public page should network-first cache',result.intercepted&&result.networkCalls===1&&entries.has('https://example.test/catalog.html'));

networkOffline=true;
result=await probe('/catalog?game=demo','navigate');
assert('visited page should have explicit offline-stale fallback',result.intercepted&&result.result?.headers?.get('X-Modaryx-Cache')==='offline-stale');
networkOffline=false;

result=await probe('/data/catalog.json');
assert('fresh public data should remain network-first',result.intercepted&&result.networkCalls===1&&lastFetchOptions?.cache==='no-store');

result=await probe('/private.json');
assert('arbitrary private path must not be intercepted',!result.intercepted);

for(let i=0;i<100;i++)await probe(`/assets/runtime-${i}.svg`);
const runtimeEntries=[...entries.keys()].filter(key=>!coreSet.has(key));
assert('runtime cache must stay bounded',runtimeEntries.length<=80);
assert('runtime trimming must never evict core',expectedCore.every(key=>entries.has(key)));

console.log(JSON.stringify({
  assertions:'PASS',
  installPrecacheRequests:expectedCore.length,
  runtimeEntryLimit:80,
  runtimeEntriesAfterStress:runtimeEntries.length,
  heavyArtInstallPrecached:false,
  futureAssetRuntimeCaching:'PASS',
  runtimeAssetFreshness:'PASS',
  pageOfflineAfterVisit:'PASS',
  metadataNetworkFirst:'PASS',
  cacheCleanupScope:'PASS'
},null,2));
