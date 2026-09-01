const CACHE_NAME = 'nova-site-shell-v32';
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
  './assets/nova-mark.svg'
];
const RUNTIME_PUBLIC_PATHS = [
  './public-build.json',
  './SHA256SUMS.txt'
];

const toAbsoluteSet = (paths) => new Set(paths.map((path) => new URL(path, BASE_URL).href));
const PUBLIC_PAGES = toAbsoluteSet(PUBLIC_PAGE_PATHS);
const SHELL = [...toAbsoluteSet(SHELL_PATHS)];
const CACHEABLE_PUBLIC = new Set([...SHELL, ...toAbsoluteSet(RUNTIME_PUBLIC_PATHS)]);
const INDEX_URL = new URL('./index.html', BASE_URL).href;

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
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(BASE_URL.href)) return;

  if (event.request.mode === 'navigate') {
    if (!PUBLIC_PAGES.has(url.href)) return;
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) return response;
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match(INDEX_URL)))
    );
    return;
  }

  if (!CACHEABLE_PUBLIC.has(url.href)) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
