(() => {
  'use strict';

  const root = document.querySelector('[data-download-artifacts]');
  const state = document.querySelector('[data-download-state]');
  if (!root || !state) return;

  const SHA256_RE = /^[0-9a-f]{64}$/;
  const SAFE_ID_RE = /^[a-z0-9][a-z0-9._-]{0,95}$/;

  function failClosed(message = 'Aucun téléchargement public validé') {
    root.replaceChildren();
    state.textContent = message;
    state.dataset.state = 'locked';
  }

  function validRelativeDownloadPath(value) {
    if (typeof value !== 'string' || !value.startsWith('./')) return false;
    try {
      const url = new URL(value, document.baseURI);
      const base = new URL('./', document.baseURI);
      return url.origin === base.origin && url.href.startsWith(base.href) && !value.includes('..');
    } catch {
      return false;
    }
  }

  function validateArtifact(item) {
    if (!item || typeof item !== 'object') return false;
    if (!SAFE_ID_RE.test(item.id || '')) return false;
    if (typeof item.name !== 'string' || !item.name.trim()) return false;
    if (typeof item.version !== 'string' || !item.version.trim()) return false;
    if (typeof item.filename !== 'string' || !item.filename.trim()) return false;
    if (!Number.isSafeInteger(item.size_bytes) || item.size_bytes <= 0) return false;
    if (!SHA256_RE.test(item.sha256 || '')) return false;
    if (typeof item.provenance !== 'string' || !item.provenance.trim()) return false;
    if (!validRelativeDownloadPath(item.download_path)) return false;
    if (!['verified', 'not-required'].includes(item.signature_status)) return false;
    return true;
  }

  function formatBytes(value) {
    const units = ['o', 'Kio', 'Mio', 'Gio'];
    let size = value;
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index += 1;
    }
    return `${size.toLocaleString('fr-FR', { maximumFractionDigits: index ? 1 : 0 })} ${units[index]}`;
  }

  function renderArtifact(item) {
    const article = document.createElement('article');
    article.className = 'card download-artifact';

    const kicker = document.createElement('p');
    kicker.className = 'card-kicker';
    kicker.textContent = `Version ${item.version}`;

    const title = document.createElement('h3');
    title.textContent = item.name;

    const meta = document.createElement('p');
    meta.className = 'muted';
    meta.textContent = `${item.filename} · ${formatBytes(item.size_bytes)}`;

    const provenance = document.createElement('p');
    provenance.textContent = item.provenance;

    const hash = document.createElement('code');
    hash.className = 'hash-output';
    hash.textContent = item.sha256;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const download = document.createElement('a');
    download.className = 'button primary';
    download.href = item.download_path;
    download.download = item.filename;
    download.textContent = 'Télécharger';

    const verify = document.createElement('a');
    verify.className = 'button';
    verify.href = `./verify.html#sha256=${item.sha256}`;
    verify.textContent = 'Vérifier le SHA-256';

    actions.append(download, verify);
    article.append(kicker, title, meta, provenance, hash, actions);
    return article;
  }

  async function load() {
    failClosed();
    try {
      const response = await fetch(new URL('./downloads.json', document.baseURI), {
        cache: 'no-cache',
        credentials: 'same-origin'
      });
      if (!response.ok) return;
      const manifest = await response.json();
      if (manifest?.schema !== 'nova-forge-public-downloads/v1') return;
      if (manifest?.policy !== 'verified-artifacts-only') return;
      if (manifest?.available !== true) return;
      if (!Array.isArray(manifest?.artifacts) || !manifest.artifacts.length) return;
      if (!manifest.artifacts.every(validateArtifact)) return;

      const ids = new Set(manifest.artifacts.map((item) => item.id));
      if (ids.size !== manifest.artifacts.length) return;

      root.replaceChildren(...manifest.artifacts.map(renderArtifact));
      state.textContent = `${manifest.artifacts.length} artefact${manifest.artifacts.length > 1 ? 's' : ''} public${manifest.artifacts.length > 1 ? 's' : ''} vérifié${manifest.artifacts.length > 1 ? 's' : ''}`;
      state.dataset.state = 'available';
    } catch {
      failClosed();
    }
  }

  load();
})();
