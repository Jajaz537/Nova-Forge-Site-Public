const CACHE_NAME = 'modaryx-site-v120-scalable';
const BASE_URL = new URL('./', self.location.href);
const MAX_RUNTIME_ENTRIES = 80;

const PUBLIC_PAGE_PATHS = [
  './',
  './index.html',
  './games/index.html',
  './gta-6/index.html',
  './gta-6/mods/index.html',
  './gta-6/guides/index.html',
  './red-dead-redemption-2/index.html',
  './red-dead-redemption-2/mods/index.html',
  './red-dead-redemption-2/guides/index.html',
  './catalog.html',
  './search.html',
  './creator-studio.html',
  './profiles.html',
  './community.html',
  './project.html',
  './project-ember-textures.html',
  './project-balanced-latency-pack.html',
  './project-forge-night-experience.html',
  './ecosystem.html',
  './downloads.html',
  './documentation.html',
  './security.html',
  './verify.html',
  './404.html'
];

// Keep installation small and stable. Everything else is cached only after use.
const PRECACHE_PATHS = [
  './',
  './index.html',
  './404.html',
  './site.webmanifest',
  './favicon.svg',
  './assets/modaryx-mark-192.png',
  './assets/modaryx-mark-512.png',
  './assets/modaryx-mark.svg',
  './assets/tokens.css',
  './assets/nova-premium-hd.css',
  './assets/modaryx-premium-refinement.css',
  './assets/modaryx-foundations.css',
  './assets/modaryx-home-cinematic.css',
  './assets/modaryx-home-finishline.css',
  './assets/shell.js',
  './assets/app.js',
  './assets/nova-premium-hd.js'
];

const FRESH_PUBLIC_PATHS = [
  './public-status.json',
  './downloads.json',
  './public-build.json',
  './SHA256SUMS.txt',
  './data/catalog.json',
  './data/compatibility-graph.json',
  './data/search-index.json',
  './data/living-world.json'
];

const STATIC_EXTENSIONS = /\.(?:css|js|json|svg|png|webp|avif|jpe?g|woff2?)$/i;
const STATIC_PREFIXES = [
  new URL('./assets/', BASE_URL).pathname,
  new URL('./schemas/', BASE_URL).pathname
];

const toAbsoluteSet = (paths) => new Set(paths.map((path) => new URL(path, BASE_URL).href));
const PUBLIC_PAGES = toAbsoluteSet(PUBLIC_PAGE_PATHS);
const PRECACHE = [...toAbsoluteSet(PRECACHE_PATHS)];
const CORE_KEYS = new Set(PRECACHE);
const FRESH_PUBLIC = toAbsoluteSet(FRESH_PUBLIC_PATHS);
const CORE_PATH_KEYS = new Map([...CORE_KEYS].map((href) => [new URL(href).pathname, href]));

// Normalize only explicitly public page aliases. Never turn an arbitrary path into a cached page.
const PAGE_KEYS = new Map();
for (const href of PUBLIC_PAGES) {
  const page = new URL(href);
  PAGE_KEYS.set(page.pathname, href);
  if (page.pathname.endsWith('/index.html')) PAGE_KEYS.set(page.pathname.slice(0, -10), href);
  if (page.pathname.endsWith('.html')) PAGE_KEYS.set(page.pathname.slice(0, -5), href);
}

const openedCache = () => caches.open(CACHE_NAME);
const keyHref = (key) => typeof key === 'string' ? key : key.url;
const isCoreKey = (key) => CORE_KEYS.has(keyHref(key));

const readCache = async (key) => {
  try { return await (await openedCache()).match(key); }
  catch { return undefined; }
};

const trimRuntimeCache = async (cache) => {
  try {
    const keys = await cache.keys();
    const runtime = keys.filter((request) => !isCoreKey(request));
    while (runtime.length > MAX_RUNTIME_ENTRIES) {
      const oldest = runtime.shift();
      await cache.delete(oldest);
    }
  } catch {
    // Cache quota/inspection failures must not break a usable network response.
  }
};

const storeResponse = async (key, response) => {
  if (!response || response.status !== 200 || response.type !== 'basic') return;
  try {
    const cache = await openedCache();
    if (!isCoreKey(key)) await cache.delete(key); // Refresh insertion order for runtime entries.
    await cache.put(key, response.clone());
    if (!isCoreKey(key)) await trimRuntimeCache(cache);
  } catch {
    // Quota/cache failures must not discard a usable network response.
  }
};

const staleResponse = (cached) => {
  if (!cached) return Response.error();
  const headers = new Headers(cached.headers);
  headers.set('X-Modaryx-Cache', 'offline-stale');
  return new Response(cached.body, {status: cached.status, statusText: cached.statusText, headers});
};

const networkFirst = async (request, key, metadata = false, revalidate = false) => {
  try {
    const response = await fetch(request, metadata ? {cache: 'no-store'} : revalidate ? {cache: 'no-cache'} : undefined);
    await storeResponse(key, response);
    return response; // Preserve real HTTP errors; do not hide a server 404/500 with old data.
  } catch {
    return staleResponse(await readCache(key));
  }
};

const runtimeStaticKey = (url) => {
  if (url.origin !== BASE_URL.origin || !url.pathname.startsWith(BASE_URL.pathname)) return null;
  if (!STATIC_EXTENSIONS.test(url.pathname)) return null;
  if (!STATIC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return null;
  return new URL(url.pathname, url.origin).href; // Strip query variants to prevent cache-key inflation.
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    openedCache()
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) =>
        (key.startsWith('nova-site-shell-') || key.startsWith('modaryx-site-')) && key !== CACHE_NAME
      ).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(BASE_URL.href)) return;

  let operation;
  if (event.request.mode === 'navigate') {
    const key = PAGE_KEYS.get(url.pathname);
    if (!key) return;
    operation = networkFirst(event.request, key);
  } else if (FRESH_PUBLIC.has(url.href)) {
    operation = networkFirst(event.request, url.href, true);
  } else {
    const coreKey = CORE_PATH_KEYS.get(url.pathname);
    const staticKey = runtimeStaticKey(url);
    const key = coreKey || staticKey;
    if (!key) return;
    operation = /\.(?:css|js)$/i.test(url.pathname)
      ? networkFirst(event.request, key, false, true)
      : networkFirst(event.request, key);
  }

  event.respondWith(operation);
  event.waitUntil(operation.then(() => {}, () => {}));
});
