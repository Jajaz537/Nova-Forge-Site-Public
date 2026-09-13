const DEFAULT_CHUNK_BYTES = 1024 * 1024;
const DEFAULT_MAX_BYTES = 512 * 1024 * 1024;
const DEFAULT_MAX_LIFETIME_MS = 24 * 60 * 60 * 1000;

export async function sha256Hex(blob) {
  const bytes = blob instanceof ArrayBuffer ? blob : await blob.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
}

const integer = (value, label) => {
  const result = Number(value);
  if (!Number.isSafeInteger(result) || result < 0) throw new Error(`${label}_INVALID`);
  return result;
};

export class NovaResumableUploadClient {
  constructor({transport, chunkBytes = DEFAULT_CHUNK_BYTES, maxBytes = DEFAULT_MAX_BYTES, maxLifetimeMs = DEFAULT_MAX_LIFETIME_MS, now = () => Date.now()} = {}) {
    if (!transport) throw new Error('UPLOAD_TRANSPORT_REQUIRED');
    this.transport = transport;
    this.chunkBytes = integer(chunkBytes, 'CHUNK_BYTES');
    this.maxBytes = integer(maxBytes, 'MAX_BYTES');
    this.maxLifetimeMs = integer(maxLifetimeMs, 'MAX_LIFETIME');
    this.now = now;
    if (this.chunkBytes < 64 * 1024 || this.chunkBytes > 8 * 1024 * 1024) throw new Error('CHUNK_BYTES_OUT_OF_BOUNDS');
  }

  validateFile(file) {
    if (!file || typeof file.slice !== 'function' || typeof file.arrayBuffer !== 'function') throw new Error('UPLOAD_FILE_REQUIRED');
    if (!Number.isSafeInteger(file.size) || file.size <= 0 || file.size > this.maxBytes) throw new Error('UPLOAD_SIZE_OUT_OF_BOUNDS');
  }

  validateState(state, file) {
    if (!state?.uploadId) throw new Error('SERVER_UPLOAD_ID_MISSING');
    const offset = integer(state.offset, 'SERVER_OFFSET');
    const length = integer(state.length, 'SERVER_LENGTH');
    if (length !== file.size || offset > length) throw new Error('SERVER_UPLOAD_STATE_MISMATCH');
    const expiresAt = Date.parse(state.expiresAt || '');
    if (!Number.isFinite(expiresAt) || expiresAt <= this.now() || expiresAt - this.now() > this.maxLifetimeMs) throw new Error('SERVER_UPLOAD_EXPIRY_INVALID');
    return {...state, offset, length, expiresAt};
  }

  async startOrResume(file, priorUploadId = null) {
    this.validateFile(file);
    let state;
    if (priorUploadId) state = await this.transport.status(priorUploadId);
    else state = await this.transport.create({name: String(file.name || 'artifact.bin'), length: file.size, maxLifetimeMs: this.maxLifetimeMs});
    state = this.validateState(state, file);

    let offset = state.offset;
    while (offset < file.size) {
      const end = Math.min(offset + this.chunkBytes, file.size);
      const chunk = file.slice(offset, end);
      const chunkSha256 = await sha256Hex(chunk);
      const patched = await this.transport.patch(state.uploadId, {offset, bytes: chunk, chunkSha256});
      const nextOffset = integer(patched?.offset, 'SERVER_PATCH_OFFSET');
      if (nextOffset !== end || nextOffset <= offset) throw new Error('SERVER_OFFSET_NOT_ACKNOWLEDGED');
      offset = nextOffset;
    }

    const wholeSha256 = await sha256Hex(file);
    const completed = await this.transport.complete(state.uploadId, {wholeSha256, length: file.size});
    if (completed?.wholeSha256 !== wholeSha256) throw new Error('WHOLE_OBJECT_DIGEST_MISMATCH');
    if (completed?.securityVerified !== true || completed?.provenanceVerified !== true) throw new Error('PROMOTION_BLOCKED_UNVERIFIED_OBJECT');
    return {
      uploadId: state.uploadId,
      offset,
      length: file.size,
      wholeSha256,
      securityVerified: true,
      provenanceVerified: true,
      releaseEligible: true
    };
  }
}

export class NovaSameOriginUploadTransport {
  constructor(endpoint, fetchImpl = globalThis.fetch) {
    if (!fetchImpl) throw new Error('FETCH_REQUIRED');
    const base = new URL(endpoint, globalThis.location?.href || 'https://invalid.local/');
    if (globalThis.location && base.origin !== globalThis.location.origin) throw new Error('CROSS_ORIGIN_UPLOAD_ENDPOINT_FORBIDDEN');
    this.base = base;
    this.fetch = fetchImpl;
  }

  async create(request) {
    const response = await this.fetch(this.base, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(request)});
    if (!response.ok) throw new Error(`UPLOAD_CREATE_HTTP_${response.status}`);
    return response.json();
  }

  async status(uploadId) {
    const response = await this.fetch(new URL(encodeURIComponent(uploadId), `${this.base.href.replace(/\/$/, '')}/`), {method: 'HEAD', cache: 'no-store'});
    if (!response.ok) throw new Error(`UPLOAD_STATUS_HTTP_${response.status}`);
    return {
      uploadId,
      offset: Number(response.headers.get('Upload-Offset')),
      length: Number(response.headers.get('Upload-Length')),
      expiresAt: response.headers.get('Upload-Expires')
    };
  }

  async patch(uploadId, {offset, bytes, chunkSha256}) {
    const response = await this.fetch(new URL(encodeURIComponent(uploadId), `${this.base.href.replace(/\/$/, '')}/`), {
      method: 'PATCH',
      headers: {'Content-Type': 'application/offset+octet-stream', 'Upload-Offset': String(offset), 'Upload-Chunk-SHA256': chunkSha256},
      body: bytes
    });
    if (!response.ok) throw new Error(`UPLOAD_PATCH_HTTP_${response.status}`);
    return {offset: Number(response.headers.get('Upload-Offset'))};
  }

  async complete(uploadId, receipt) {
    const target = new URL(`${encodeURIComponent(uploadId)}/complete`, `${this.base.href.replace(/\/$/, '')}/`);
    const response = await this.fetch(target, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(receipt)});
    if (!response.ok) throw new Error(`UPLOAD_COMPLETE_HTTP_${response.status}`);
    return response.json();
  }
}
