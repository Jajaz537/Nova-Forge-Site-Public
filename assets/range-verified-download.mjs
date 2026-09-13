const SHA256_RE = /^[0-9a-f]{64}$/;
const SAFE_ID_RE = /^[a-z0-9][a-z0-9._:-]{1,191}$/i;

async function sha256Hex(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function concatChunks(chunks, size) {
  const output = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

function validateDescriptor(descriptor, maxBytes) {
  if (!descriptor || typeof descriptor !== 'object') throw new Error('descriptor-missing');
  if (!SAFE_ID_RE.test(String(descriptor.contentId || ''))) throw new Error('content-id-invalid');
  if (typeof descriptor.version !== 'string' || !descriptor.version.trim()) throw new Error('version-invalid');
  if (!Number.isSafeInteger(descriptor.sizeBytes) || descriptor.sizeBytes <= 0 || descriptor.sizeBytes > maxBytes) throw new Error('size-out-of-bounds');
  if (!SHA256_RE.test(String(descriptor.sha256 || ''))) throw new Error('sha256-invalid');
  if (descriptor.immutableIdentity !== `sha256:${descriptor.sha256}`) throw new Error('immutable-identity-invalid');
  if (typeof descriptor.url !== 'string' || !descriptor.url) throw new Error('url-invalid');
}

export async function fetchVerifiedArtifact(descriptor, transport, options = {}) {
  const maxBytes = Number.isSafeInteger(options.maxBytes) ? options.maxBytes : 512 * 1024 * 1024;
  const chunkSize = Number.isSafeInteger(options.chunkSize) ? options.chunkSize : 1024 * 1024;
  if (chunkSize <= 0 || chunkSize > 8 * 1024 * 1024) throw new Error('chunk-size-invalid');
  validateDescriptor(descriptor, maxBytes);
  if (!transport?.metadata || !transport?.readRange) throw new Error('transport-invalid');

  const metadata = await transport.metadata(descriptor);
  if (!metadata || metadata.acceptRanges !== 'bytes') throw new Error('range-support-required');
  if (metadata.sizeBytes !== descriptor.sizeBytes) throw new Error('metadata-size-mismatch');
  if (metadata.immutableIdentity !== descriptor.immutableIdentity) throw new Error('metadata-identity-mismatch');
  if (metadata.version !== descriptor.version) throw new Error('metadata-version-mismatch');

  const chunks = [];
  let offset = 0;
  while (offset < descriptor.sizeBytes) {
    const end = Math.min(descriptor.sizeBytes - 1, offset + chunkSize - 1);
    const response = await transport.readRange(descriptor, offset, end);
    if (!response || response.status !== 206) throw new Error('range-status-invalid');
    if (response.start !== offset || response.end !== end || response.total !== descriptor.sizeBytes) throw new Error('content-range-invalid');
    if (response.immutableIdentity !== descriptor.immutableIdentity) throw new Error('cross-release-or-provider-splice-blocked');
    if (response.version !== descriptor.version) throw new Error('range-version-mismatch');
    const bytes = response.bytes instanceof Uint8Array ? response.bytes : new Uint8Array(response.bytes || []);
    if (bytes.byteLength !== end - offset + 1) throw new Error('range-length-invalid');
    chunks.push(bytes);
    offset = end + 1;
  }

  const bytes = concatChunks(chunks, descriptor.sizeBytes);
  const digest = await sha256Hex(bytes);
  if (digest !== descriptor.sha256) throw new Error('whole-object-sha256-mismatch');

  return {
    verified: true,
    bytes,
    sha256: digest,
    immutableIdentity: descriptor.immutableIdentity,
    version: descriptor.version
  };
}

export function createBrowserRangeTransport() {
  return {
    async metadata(descriptor) {
      const response = await fetch(descriptor.url, { method: 'HEAD', cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error(`metadata-http-${response.status}`);
      const length = Number(response.headers.get('content-length'));
      const acceptRanges = String(response.headers.get('accept-ranges') || '').toLowerCase();
      const identity = response.headers.get('x-nova-content-identity');
      const version = response.headers.get('x-nova-artifact-version');
      return {
        acceptRanges,
        sizeBytes: length,
        immutableIdentity: identity || '',
        version: version || ''
      };
    },
    async readRange(descriptor, start, end) {
      const response = await fetch(descriptor.url, {
        headers: { Range: `bytes=${start}-${end}` },
        cache: 'no-store',
        credentials: 'same-origin'
      });
      const contentRange = response.headers.get('content-range') || '';
      const match = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(contentRange);
      const identity = response.headers.get('x-nova-content-identity');
      const version = response.headers.get('x-nova-artifact-version');
      return {
        status: response.status,
        start: match ? Number(match[1]) : -1,
        end: match ? Number(match[2]) : -1,
        total: match ? Number(match[3]) : -1,
        immutableIdentity: identity || '',
        version: version || '',
        bytes: new Uint8Array(await response.arrayBuffer())
      };
    }
  };
}

async function downloadFromManifest(button) {
  const statusNode = button.closest('article')?.querySelector('[data-verified-download-status]');
  const setStatus = (text) => { if (statusNode) statusNode.textContent = text; };
  button.disabled = true;
  setStatus('Vérification du téléchargement en cours…');
  try {
    const response = await fetch(new URL('./downloads.json', document.baseURI), { cache: 'no-store', credentials: 'same-origin' });
    if (!response.ok) throw new Error('download-manifest-unavailable');
    const manifest = await response.json();
    const item = manifest?.artifacts?.find((entry) => entry.id === button.dataset.downloadId);
    if (!item) throw new Error('artifact-not-in-manifest');
    if (item.range_verification?.required !== true || item.immutable_version !== true || item.content_identity !== `sha256:${item.sha256}`) {
      throw new Error('verified-range-contract-missing');
    }
    const result = await fetchVerifiedArtifact({
      contentId: item.id,
      version: item.version,
      sizeBytes: item.size_bytes,
      sha256: item.sha256,
      immutableIdentity: item.content_identity,
      url: item.download_path
    }, createBrowserRangeTransport(), {
      maxBytes: item.range_verification.max_browser_bytes
    });
    const blob = new Blob([result.bytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = item.filename;
    anchor.rel = 'noopener';
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus('Téléchargement complet vérifié SHA-256 avant sauvegarde.');
  } catch (error) {
    setStatus(`Téléchargement bloqué : ${error.message}`);
  } finally {
    button.disabled = false;
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('[data-nova-verified-download]');
    if (!button) return;
    event.preventDefault();
    downloadFromManifest(button);
  });
}
