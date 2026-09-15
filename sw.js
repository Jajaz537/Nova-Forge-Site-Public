const CACHE_NAME = 'nova-site-shell-v63-modaryx-premium';
const BASE_URL = new URL('./', self.location.href);
const PUBLIC_PAGE_PATHS = [
  './',
  './index.html',
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
const SHELL_PATHS = [
  ...PUBLIC_PAGE_PATHS,
  './robots.txt',
  './public-status.json',
  './downloads.json',
  './data/catalog.json',
  './data/compatibility-graph.json',
  './data/search-index.json',
  './schemas/universal-mod-manifest.schema.json',
  './schemas/compatibility-graph.schema.json',
  './schemas/public-profile.schema.json',
  './schemas/account-security.schema.json',
  './schemas/collection.schema.json',
  './schemas/community-submission.schema.json',
  './schemas/community-write.schema.json',
  './schemas/moderation-receipt.schema.json',
  './schemas/moderation-export.schema.json',
  './schemas/publication-receipt.schema.json',
  './schemas/storage-resolver.schema.json',
  './schemas/repair-network.schema.json',
  './schemas/search-adapter.schema.json',
  './schemas/smart-profile.schema.json',
  './site.webmanifest',
  './assets/site.css',
  './assets/official.css',
  './assets/catalog.css',
  './assets/search.css',
  './assets/creator-studio.css',
  './assets/project-hub.css',
  './assets/profiles.css',
  './assets/app.js',
  './assets/catalog.js',
  './assets/search.js',
  './assets/json-schema-lite.js',
  './assets/creator-studio.js',
  './assets/project-hub.js',
  './assets/profiles.js',
  './assets/community.js',
  './assets/downloads.js',
  './assets/verify.js',
  './assets/modaryx-mark-192.png',
  './assets/modaryx-mark-512.png',
  './assets/modaryx-mark.svg',
  './assets/nova-kingdom-panorama.svg',
  './assets/tokens.css',
  './assets/nova-premium-hd.css',
  './assets/nova-premium-hd-secondary.css',
  './assets/modaryx-premium-refinement.css',
  './assets/modaryx-platform-refinement.css',
  './assets/modaryx-foundations.css',
  './assets/modaryx-wolf-dragon-hero.webp',
  './assets/modaryx-world-portals.webp',
  './favicon.svg',
  './assets/nova-premium-hd.js',
  './assets/forge-field.svg',
  './assets/shell.js'
];
const RUNTIME_PUBLIC_PATHS = [
  './public-build.json',
  './SHA256SUMS.txt'
];

const toAbsoluteSet = (paths) => new Set(paths.map((path) => new URL(path, BASE_URL).href));
const PUBLIC_PAGES = toAbsoluteSet(PUBLIC_PAGE_PATHS);
const SHELL = [...toAbsoluteSet(SHELL_PATHS)];
const CACHEABLE_PUBLIC = new Set([...SHELL, ...toAbsoluteSet(RUNTIME_PUBLIC_PATHS)]);
const FRESH_PUBLIC = toAbsoluteSet([
  './public-status.json', './downloads.json', './public-build.json', './SHA256SUMS.txt',
  './data/catalog.json', './data/compatibility-graph.json', './data/search-index.json'
]);
// Normalize only explicitly public page aliases. Never turn an arbitrary path into a cached page.
const PAGE_KEYS = new Map();
for (const href of PUBLIC_PAGES) {
  const page = new URL(href);
  PAGE_KEYS.set(page.pathname, href);
  if (page.pathname.endsWith('.html')) PAGE_KEYS.set(page.pathname.slice(0, -5), href);
}
const readCache = async (key) => (await caches.open(CACHE_NAME)).match(key);
const storeResponse = async (key, response) => {
  if (!response || response.status !== 200 || response.type !== 'basic') return;
  try { await (await caches.open(CACHE_NAME)).put(key, response.clone()); }
  catch { /* Quota/cache failures must not discard a usable network response. */ }
};
const staleResponse = (cached) => {
  if (!cached) return Response.error();
  const headers = new Headers(cached.headers);
  headers.set('X-Modaryx-Cache', 'offline-stale');
  return new Response(cached.body, {status: cached.status, statusText: cached.statusText, headers});
};
const networkFirst = async (request, key, metadata = false) => {
  try {
    const response = await fetch(request, metadata ? {cache: 'no-store'} : undefined);
    await storeResponse(key, response);
    return response; // Preserve real HTTP errors; do not hide a server 404/500 with old data.
  } catch {
    return staleResponse(await readCache(key));
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('nova-site-shell-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
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
  } else {
    // Exact allowlist for data/assets, including queries: do not silently cache personalized variants.
    if (!CACHEABLE_PUBLIC.has(url.href)) return;
    operation = FRESH_PUBLIC.has(url.href)
      ? networkFirst(event.request, url.href, true)
      : readCache(url.href).then(async (cached) => {
        if (cached) return cached;
        const response = await fetch(event.request);
        await storeResponse(url.href, response);
        return response;
      });
  }
  event.respondWith(operation);
  // Register synchronously so cache writes stay alive even after a response is delivered.
  event.waitUntil(operation.then(() => {}, () => {}));
});
