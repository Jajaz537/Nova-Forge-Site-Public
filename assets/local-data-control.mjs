const STORAGE_PREFIXES = ['nova-forge:', 'nova_site_'];
const CACHE_PREFIXES = ['nova-site-', 'nova-forge-'];
const COOKIE_PREFIXES = ['nova-forge-', 'nova_'];
const DATABASE_PREFIXES = ['nova-forge', 'nova_site'];
const OPFS_ROOT = 'nova-forge';

const owned = (value, prefixes) => prefixes.some((prefix) => String(value || '').startsWith(prefix));

export async function inventoryNovaLocalData() {
  const localKeys = [];
  const sessionKeys = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (owned(key, STORAGE_PREFIXES)) localKeys.push(key);
    }
  } catch {}
  try {
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const key = sessionStorage.key(i);
      if (owned(key, STORAGE_PREFIXES)) sessionKeys.push(key);
    }
  } catch {}

  let cacheNames = [];
  try {
    cacheNames = (await caches.keys()).filter((name) => owned(name, CACHE_PREFIXES));
  } catch {}

  let databases = [];
  try {
    if (indexedDB.databases) {
      databases = (await indexedDB.databases())
        .map((entry) => entry.name)
        .filter((name) => owned(name, DATABASE_PREFIXES));
    }
  } catch {}

  let storage = null;
  try {
    if (navigator.storage?.estimate) storage = await navigator.storage.estimate();
  } catch {}

  return {
    localKeys: localKeys.sort(),
    sessionKeys: sessionKeys.sort(),
    cacheNames: cacheNames.sort(),
    databases: databases.sort(),
    opfsSupported: Boolean(navigator.storage?.getDirectory),
    usage: Number(storage?.usage || 0),
    quota: Number(storage?.quota || 0)
  };
}

const deleteDatabase = (name) => new Promise((resolve) => {
  try {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve({name, deleted: true});
    request.onerror = () => resolve({name, deleted: false});
    request.onblocked = () => resolve({name, deleted: false, blocked: true});
  } catch {
    resolve({name, deleted: false});
  }
});

export async function purgeNovaLocalData() {
  const before = await inventoryNovaLocalData();
  const removed = {localStorage: [], sessionStorage: [], caches: [], databases: [], cookies: [], opfs: false};

  for (const key of before.localKeys) {
    try { localStorage.removeItem(key); removed.localStorage.push(key); } catch {}
  }
  for (const key of before.sessionKeys) {
    try { sessionStorage.removeItem(key); removed.sessionStorage.push(key); } catch {}
  }
  for (const name of before.cacheNames) {
    try { if (await caches.delete(name)) removed.caches.push(name); } catch {}
  }
  for (const name of before.databases) {
    const result = await deleteDatabase(name);
    if (result.deleted) removed.databases.push(name);
  }

  try {
    for (const token of String(document.cookie || '').split(';')) {
      const name = token.split('=')[0].trim();
      if (!name || !owned(name, COOKIE_PREFIXES)) continue;
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      removed.cookies.push(name);
    }
  } catch {}

  try {
    if (navigator.storage?.getDirectory) {
      const root = await navigator.storage.getDirectory();
      await root.removeEntry(OPFS_ROOT, {recursive: true});
      removed.opfs = true;
    }
  } catch (error) {
    if (error?.name !== 'NotFoundError') removed.opfs = false;
  }

  return {
    schema: 'nova-forge-local-purge-receipt/v1',
    scope: 'application-owned-browser-data-only',
    exportedFilesTouched: false,
    removed,
    before
  };
}

function formatBytes(value) {
  const bytes = Number(value || 0);
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} Kio`;
  return `${(bytes / 1024 ** 2).toFixed(1)} Mio`;
}

function installControls() {
  const section = document.querySelector('#contracts-title')?.closest('section');
  const actions = section?.querySelector('.actions');
  if (!section || !actions || document.querySelector('#nova-local-data-status')) return;

  const recovery = document.createElement('a');
  recovery.className = 'button';
  recovery.href = './schemas/passkey-recovery.schema.json';
  recovery.textContent = 'Récupération portable';

  const inspect = document.createElement('button');
  inspect.className = 'button';
  inspect.type = 'button';
  inspect.textContent = 'Inspecter les données locales';

  const purge = document.createElement('button');
  purge.className = 'button';
  purge.type = 'button';
  purge.textContent = 'Effacer les données locales Nova';

  const status = document.createElement('p');
  status.id = 'nova-local-data-status';
  status.className = 'profiles-note';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.textContent = 'Aucune purge automatique. Les fichiers exportés hors navigateur ne sont jamais supprimés.';

  inspect.addEventListener('click', async () => {
    const report = await inventoryNovaLocalData();
    status.textContent = `Données Nova détectées : ${report.localKeys.length} clé(s) locale(s), ${report.sessionKeys.length} session, ${report.cacheNames.length} cache(s), ${report.databases.length} base(s). Stockage origine : ${formatBytes(report.usage)} / ${formatBytes(report.quota)}. OPFS : ${report.opfsSupported ? 'disponible' : 'indisponible'}.`;
  });

  purge.addEventListener('click', async () => {
    if (!window.confirm('Effacer uniquement les données navigateur appartenant à Nova Forge sur cette origine ? Les fichiers déjà exportés restent intacts.')) return;
    purge.disabled = true;
    try {
      const receipt = await purgeNovaLocalData();
      const count = receipt.removed.localStorage.length + receipt.removed.sessionStorage.length + receipt.removed.caches.length + receipt.removed.databases.length + receipt.removed.cookies.length;
      status.textContent = `Purge locale terminée : ${count} élément(s) nommé(s) supprimé(s), OPFS Nova ${receipt.removed.opfs ? 'supprimé ou vidé' : 'absent/indisponible'}. Aucun fichier exporté n’a été touché.`;
      window.dispatchEvent(new CustomEvent('nova-local-data-purged', {detail: receipt}));
    } catch (error) {
      status.textContent = `Purge incomplète : ${error?.message || 'erreur inconnue'}. Aucun état distant n’a été modifié.`;
    } finally {
      purge.disabled = false;
    }
  });

  actions.append(recovery, inspect, purge);
  actions.insertAdjacentElement('afterend', status);
}

if (typeof document !== 'undefined') installControls();
