(() => {
  'use strict';

  const button = document.querySelector('#clear-local-data');
  const status = document.querySelector('#clear-local-data-status');
  if (!button || !status) return;

  const ownedName = (name) => /^(?:nova(?:[-_:]|$)|modaryx(?:[-_:]|$))/i.test(String(name || ''));
  const ownedCache = (name) => /^(?:nova-site-|modaryx-)/i.test(String(name || ''));
  const ownedOpfsEntries = new Set(['modaryx-workbench', 'nova-forge-workbench']);

  const removeOwnedStorage = (storage) => {
    let removed = 0;
    try {
      const keys = [];
      for (let i = 0; i < storage.length; i += 1) keys.push(storage.key(i));
      for (const key of keys) {
        if (ownedName(key)) {
          storage.removeItem(key);
          removed += 1;
        }
      }
    } catch {}
    return removed;
  };

  const removeOwnedCookies = () => {
    let removed = 0;
    try {
      for (const part of document.cookie.split(';')) {
        const name = part.split('=')[0]?.trim();
        if (!ownedName(name)) continue;
        document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/; SameSite=Lax`;
        removed += 1;
      }
    } catch {}
    return removed;
  };

  const removeOwnedCaches = async () => {
    if (!('caches' in window)) return 0;
    let removed = 0;
    for (const name of await caches.keys()) {
      if (ownedCache(name) && await caches.delete(name)) removed += 1;
    }
    return removed;
  };

  const removeOwnedDatabases = async () => {
    if (!('indexedDB' in window) || typeof indexedDB.databases !== 'function') return 0;
    let removed = 0;
    const databases = await indexedDB.databases();
    for (const info of databases) {
      if (!info?.name || !ownedName(info.name)) continue;
      await new Promise((resolve) => {
        const request = indexedDB.deleteDatabase(info.name);
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
        request.onblocked = () => resolve();
      });
      removed += 1;
    }
    return removed;
  };

  const removeOwnedOpfs = async () => {
    if (!navigator.storage?.getDirectory) return 0;
    let removed = 0;
    try {
      const root = await navigator.storage.getDirectory();
      for (const name of ownedOpfsEntries) {
        try {
          await root.removeEntry(name, {recursive: true});
          removed += 1;
        } catch (error) {
          if (error?.name !== 'NotFoundError') throw error;
        }
      }
    } catch {}
    return removed;
  };

  button.addEventListener('click', async () => {
    const accepted = window.confirm('Effacer les données locales appartenant à MODARYX sur ce site ? Les fichiers que vous avez exportés ou téléchargés ne seront pas touchés.');
    if (!accepted) {
      status.textContent = 'Purge annulée. Aucune donnée n’a été modifiée.';
      return;
    }

    button.disabled = true;
    status.textContent = 'Purge locale en cours…';
    try {
      const local = removeOwnedStorage(localStorage);
      const session = removeOwnedStorage(sessionStorage);
      const cookies = removeOwnedCookies();
      const [cacheCount, databaseCount, opfsCount] = await Promise.all([
        removeOwnedCaches(),
        removeOwnedDatabases(),
        removeOwnedOpfs()
      ]);
      status.textContent = `Purge terminée : ${local} clé(s) locale(s), ${session} clé(s) de session, ${cookies} cookie(s), ${cacheCount} cache(s), ${databaseCount} base(s) locale(s) et ${opfsCount} espace(s) de travail MODARYX supprimés. Les fichiers exportés/téléchargés restent intacts.`;
    } catch {
      status.textContent = 'Purge partielle : certaines API de stockage sont indisponibles ou ont refusé l’opération. Aucun fichier exporté/téléchargé n’a été touché.';
    } finally {
      button.disabled = false;
    }
  });
})();
