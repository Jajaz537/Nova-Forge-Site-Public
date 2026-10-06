const CACHE_NAME = "modaryx-v2-preview-shell-v1";
const EXPLICIT_LEGACY_CACHES = new Set(["modaryx-site-v120-scalable"]);
const SHELL = ["/", "/index.html"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => EXPLICIT_LEGACY_CACHES.has(key)).map(key => caches.delete(key))
    ))
  );
  // Deliberately no clients.claim(): preview migration must never seize production clients.
});

async function networkFirst(request){
  try {
    const response=await fetch(request);
    if(response && response.status===200 && response.type==="basic"){
      const cache=await caches.open(CACHE_NAME);
      await cache.put(request,response.clone());
    }
    return response;
  } catch {
    const cache=await caches.open(CACHE_NAME);
    return (await cache.match(request)) || (await cache.match("/index.html")) || Response.error();
  }
}

async function cacheAsset(request){
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(request);
  if(cached) return cached;
  const response=await fetch(request);
  if(response && response.status===200 && response.type==="basic") await cache.put(request,response.clone());
  return response;
}

self.addEventListener("fetch", event => {
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  if(event.request.mode==="navigate"){
    event.respondWith(networkFirst(event.request));
    return;
  }
  if(url.pathname.startsWith("/assets/")){
    event.respondWith(cacheAsset(event.request));
  }
});
