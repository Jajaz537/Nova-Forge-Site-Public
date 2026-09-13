import { NovaResumableUploadClient, NovaSameOriginUploadTransport, sha256Hex } from './resumable-upload.mjs';

const ROOT_DIR = 'nova-forge';
const WORKBENCH_DIR = 'creator-workbench';
const DRAFT_FILE = 'draft.json';
const META_FILE = 'draft.meta.json';
const LOCAL_STAGE_MAX_BYTES = 64 * 1024 * 1024;
const LOCAL_STAGE_CHUNK_BYTES = 1024 * 1024;
const BLOCKED_EXTENSIONS = new Set(['.exe', '.dll', '.com', '.scr', '.msi', '.msp', '.cpl', '.ps1', '.psm1', '.bat', '.cmd', '.vbs', '.vbe', '.js', '.jse', '.wsf', '.wsh', '.hta', '.sh', '.zip', '.7z', '.rar', '.tar', '.gz', '.bz2', '.xz']);

const extensionOf = (name) => {
  const value = String(name || '').toLowerCase();
  const index = value.lastIndexOf('.');
  return index >= 0 ? value.slice(index) : '';
};

async function getWorkbench(create = true) {
  if (!navigator.storage?.getDirectory) throw new Error('OPFS indisponible dans ce navigateur.');
  const root = await navigator.storage.getDirectory();
  const nova = await root.getDirectoryHandle(ROOT_DIR, {create});
  return nova.getDirectoryHandle(WORKBENCH_DIR, {create});
}

async function writeText(directory, name, text) {
  const handle = await directory.getFileHandle(name, {create: true});
  const writable = await handle.createWritable();
  await writable.write(String(text));
  await writable.close();
}

async function readText(directory, name) {
  const handle = await directory.getFileHandle(name);
  return (await handle.getFile()).text();
}

function requireLockedDraft(preview, schemaStatus, form) {
  if (!form?.checkValidity()) throw new Error('Le formulaire contient encore des champs invalides.');
  if (!String(schemaStatus?.textContent || '').includes('brouillon conforme au schéma UMM')) throw new Error('Le schéma UMM doit être valide avant sauvegarde OPFS.');
  const manifest = JSON.parse(String(preview?.textContent || '{}'));
  if (manifest?.distribution?.state !== 'locked' || manifest?.distribution?.downloadable !== false || manifest?.releaseReceipt !== null) throw new Error('Seul un brouillon locked/non téléchargeable/sans releaseReceipt peut entrer dans le workbench.');
  return manifest;
}

function relationLines(items) {
  return (Array.isArray(items) ? items : []).map((entry) => `${entry.id || ''} | ${entry.versionRange || ''} | ${entry.optional === true ? 'true' : 'false'}`).join('\n');
}

function fileLines(items) {
  return (Array.isArray(items) ? items : []).map((entry) => `${entry.path || ''} | ${Number.isInteger(entry.size) ? entry.size : ''} | ${entry.hashes?.sha256 || ''} | ${entry.mediaType || ''} | ${entry.executable === true ? 'true' : 'false'}`).join('\n');
}

function applyDraft(manifest, form) {
  if (!manifest || manifest.schemaVersion !== 1 || manifest.distribution?.state !== 'locked' || manifest.distribution?.downloadable !== false || manifest.releaseReceipt !== null) throw new Error('Brouillon OPFS incompatible ou non verrouillé.');
  const map = {
    'content-id': manifest.content?.id, 'content-version': manifest.content?.version, 'content-name': manifest.content?.name, 'content-kind': manifest.content?.kind, 'content-summary': manifest.content?.summary,
    'game-id': manifest.target?.gameId, 'game-name': manifest.target?.gameName, 'game-versions': (manifest.target?.versions || []).join(', '), 'game-loaders': (manifest.target?.loaders || []).join(', '),
    'compatibility-evidence': manifest.compatibility?.evidence, 'evidence-receipt': manifest.compatibility?.evidenceReceipt, 'compatibility-notes': manifest.compatibility?.notes,
    dependencies: relationLines(manifest.compatibility?.dependencies), conflicts: relationLines(manifest.compatibility?.conflicts),
    'creator-id': manifest.creator?.id, 'creator-name': manifest.creator?.displayName, license: manifest.rights?.license, redistribution: manifest.rights?.redistribution, 'rights-notice': manifest.rights?.notice,
    'provenance-state': manifest.provenance?.state, 'provenance-receipt': manifest.provenance?.receiptId, 'source-uri': manifest.provenance?.sourceUri, 'provenance-notes': manifest.provenance?.notes,
    files: fileLines(manifest.files)
  };
  for (const [id, value] of Object.entries(map)) {
    const node = document.getElementById(id);
    if (node) node.value = value ?? '';
  }
  form.dispatchEvent(new Event('input', {bubbles: true}));
}

async function quotaText() {
  try {
    const estimate = await navigator.storage?.estimate?.();
    const usage = Number(estimate?.usage || 0);
    const quota = Number(estimate?.quota || 0);
    const mib = (value) => (value / 1024 / 1024).toFixed(1);
    return `Stockage origine : ${mib(usage)} / ${mib(quota)} Mio.`;
  } catch {
    return 'Quota navigateur non mesurable.';
  }
}

async function saveDraft(preview, schemaStatus, form) {
  const manifest = requireLockedDraft(preview, schemaStatus, form);
  const text = `${JSON.stringify(manifest, null, 2)}\n`;
  const directory = await getWorkbench(true);
  await writeText(directory, DRAFT_FILE, text);
  await writeText(directory, META_FILE, `${JSON.stringify({schema: 'nova-forge-opfs-draft-meta/v1', sha256: await sha256Hex(new Blob([text])), state: 'local-only', releaseEligible: false}, null, 2)}\n`);
  return manifest;
}

async function restoreDraft(form) {
  const directory = await getWorkbench(false);
  const manifest = JSON.parse(await readText(directory, DRAFT_FILE));
  applyDraft(manifest, form);
  return manifest;
}

async function exportDraft() {
  const directory = await getWorkbench(false);
  const text = await readText(directory, DRAFT_FILE);
  const url = URL.createObjectURL(new Blob([text], {type: 'application/json'}));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'nova-forge-creator-workbench-draft.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

async function clearWorkbench() {
  if (!navigator.storage?.getDirectory) return false;
  const root = await navigator.storage.getDirectory();
  try {
    const nova = await root.getDirectoryHandle(ROOT_DIR);
    await nova.removeEntry(WORKBENCH_DIR, {recursive: true});
    return true;
  } catch (error) {
    if (error?.name === 'NotFoundError') return false;
    throw error;
  }
}

async function stageFile(file, onProgress = () => {}) {
  if (!file || !Number.isSafeInteger(file.size) || file.size <= 0 || file.size > LOCAL_STAGE_MAX_BYTES) throw new Error('Fichier absent ou hors limite locale de 64 Mio.');
  if (BLOCKED_EXTENSIONS.has(extensionOf(file.name))) throw new Error('Type actif ou archive non inspectable bloqué en fail-closed avant staging.');

  const fingerprintSource = new Blob([`${file.name}\n${file.size}\n${file.lastModified || 0}`]);
  const fingerprint = await sha256Hex(fingerprintSource);
  const workbench = await getWorkbench(true);
  const staging = await workbench.getDirectoryHandle('quarantine', {create: true});
  const directory = await staging.getDirectoryHandle(fingerprint, {create: true});
  let offset = 0;
  try {
    const existing = JSON.parse(await readText(directory, 'state.json'));
    if (existing?.fingerprint === fingerprint && existing?.size === file.size && Number.isSafeInteger(existing?.offset)) offset = Math.min(existing.offset, file.size);
  } catch {}

  const data = await directory.getFileHandle('payload.bin', {create: true});
  const writable = await data.createWritable({keepExistingData: true});
  await writable.seek(offset);
  while (offset < file.size) {
    const end = Math.min(offset + LOCAL_STAGE_CHUNK_BYTES, file.size);
    const bytes = await file.slice(offset, end).arrayBuffer();
    await writable.write(bytes);
    offset = end;
    await writeText(directory, 'state.json', JSON.stringify({schema: 'nova-forge-local-staging/v1', fingerprint, generatedStorageName: `${fingerprint}.bin`, originalName: file.name, size: file.size, offset, state: 'quarantine-local', releaseEligible: false, securityVerified: false, provenanceVerified: false}));
    onProgress(offset, file.size);
  }
  await writable.close();
  const wholeSha256 = await sha256Hex(file);
  await writeText(directory, 'state.json', `${JSON.stringify({schema: 'nova-forge-local-staging/v1', fingerprint, generatedStorageName: `${fingerprint}.bin`, originalName: file.name, size: file.size, offset, wholeSha256, state: 'quarantine-complete', releaseEligible: false, securityVerified: false, provenanceVerified: false}, null, 2)}\n`);
  return {fingerprint, offset, wholeSha256, releaseEligible: false};
}

function button(label) {
  const node = document.createElement('button');
  node.className = 'button';
  node.type = 'button';
  node.textContent = label;
  return node;
}

function installWorkbench() {
  const form = document.querySelector('#creator-form');
  const actions = form?.querySelector('.studio-actions');
  const preview = document.querySelector('#manifest-preview');
  const schemaStatus = document.querySelector('#schema-status');
  if (!form || !actions || !preview || !schemaStatus || document.querySelector('#opfs-workbench-status')) return;

  const save = button('Sauvegarder dans le workbench OPFS');
  const restore = button('Restaurer OPFS');
  const exportButton = button('Exporter OPFS');
  const clear = button('Vider le workbench OPFS');
  const stage = button('Stager en quarantaine locale');
  const file = document.createElement('input');
  file.type = 'file';
  file.id = 'opfs-stage-file';
  file.setAttribute('aria-label', 'Fichier local à stager dans la quarantaine OPFS');

  const status = document.createElement('p');
  status.id = 'opfs-workbench-status';
  status.className = 'studio-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.textContent = navigator.storage?.getDirectory ? 'Workbench OPFS optionnel prêt. Rien n’est écrit sans action explicite.' : 'OPFS indisponible : le Studio principal reste utilisable sans workbench.';

  const controls = document.createElement('div');
  controls.className = 'studio-inline-actions';
  controls.append(file, stage);
  actions.append(save, restore, exportButton, clear);
  actions.insertAdjacentElement('afterend', controls);
  controls.insertAdjacentElement('afterend', status);

  save.addEventListener('click', async () => {
    try { await saveDraft(preview, schemaStatus, form); status.textContent = `Brouillon OPFS sauvegardé localement. ${await quotaText()}`; }
    catch (error) { status.textContent = `Sauvegarde OPFS bloquée : ${error?.message || 'erreur inconnue'}`; }
  });
  restore.addEventListener('click', async () => {
    try { await restoreDraft(form); status.textContent = 'Brouillon OPFS restauré dans le formulaire. Toujours NON PUBLIÉ.'; }
    catch (error) { status.textContent = `Restauration OPFS impossible : ${error?.message || 'aucun brouillon'}`; }
  });
  exportButton.addEventListener('click', async () => {
    try { await exportDraft(); status.textContent = 'Export local du workbench créé. Le fichier exporté sort du périmètre de purge navigateur.'; }
    catch (error) { status.textContent = `Export OPFS impossible : ${error?.message || 'aucun brouillon'}`; }
  });
  clear.addEventListener('click', async () => {
    try { const removed = await clearWorkbench(); status.textContent = removed ? 'Workbench OPFS Nova Forge vidé.' : 'Aucun workbench OPFS à vider.'; }
    catch (error) { status.textContent = `Purge OPFS impossible : ${error?.message || 'erreur inconnue'}`; }
  });
  stage.addEventListener('click', async () => {
    const selected = file.files?.[0];
    if (!selected) { status.textContent = 'Choisissez un fichier local avant staging.'; file.focus(); return; }
    stage.disabled = true;
    try {
      const result = await stageFile(selected, (offset, total) => { status.textContent = `Staging OPFS en quarantaine : ${offset} / ${total} octets.`; });
      status.textContent = `Staging local terminé · SHA-256 ${result.wholeSha256} · releaseEligible=false tant que sécurité/provenance ne sont pas vérifiées.`;
    } catch (error) {
      status.textContent = `Staging bloqué : ${error?.message || 'erreur inconnue'}`;
    } finally { stage.disabled = false; }
  });
}

if (typeof window !== 'undefined') {
  window.NovaResumableUploadClient = NovaResumableUploadClient;
  window.NovaSameOriginUploadTransport = NovaSameOriginUploadTransport;
  installWorkbench();
}

export { clearWorkbench, restoreDraft, saveDraft, stageFile };
