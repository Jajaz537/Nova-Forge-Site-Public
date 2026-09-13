import assert from 'node:assert/strict';
import { NovaResumableUploadClient, sha256Hex } from '../../assets/resumable-upload.mjs';

class TestFile extends Blob {
  constructor(parts, name) {
    super(parts);
    this.name = name;
    this.lastModified = 1700000000000;
  }
}

class MemoryTransport {
  constructor({badOffset = false, securityVerified = true, provenanceVerified = true} = {}) {
    this.bytes = new Uint8Array();
    this.badOffset = badOffset;
    this.securityVerified = securityVerified;
    this.provenanceVerified = provenanceVerified;
    this.uploadId = 'upload-test';
    this.length = 0;
  }
  async create({length}) {
    this.length = length;
    return {uploadId: this.uploadId, offset: 0, length, expiresAt: new Date(Date.now() + 60_000).toISOString()};
  }
  async status(uploadId) {
    assert.equal(uploadId, this.uploadId);
    return {uploadId, offset: this.bytes.length, length: this.length, expiresAt: new Date(Date.now() + 60_000).toISOString()};
  }
  async patch(uploadId, {offset, bytes, chunkSha256}) {
    assert.equal(uploadId, this.uploadId);
    assert.equal(offset, this.bytes.length);
    assert.equal(chunkSha256, await sha256Hex(bytes));
    const next = new Uint8Array(await bytes.arrayBuffer());
    const merged = new Uint8Array(this.bytes.length + next.length);
    merged.set(this.bytes, 0);
    merged.set(next, this.bytes.length);
    this.bytes = merged;
    return {offset: this.badOffset ? this.bytes.length - 1 : this.bytes.length};
  }
  async complete(uploadId, {wholeSha256, length}) {
    assert.equal(uploadId, this.uploadId);
    assert.equal(length, this.length);
    assert.equal(wholeSha256, await sha256Hex(new Blob([this.bytes])));
    return {wholeSha256, securityVerified: this.securityVerified, provenanceVerified: this.provenanceVerified};
  }
}

const file = new TestFile([new Uint8Array(220_000).fill(7)], 'safe.bin');
const transport = new MemoryTransport();
const client = new NovaResumableUploadClient({transport, chunkBytes: 64 * 1024, maxBytes: 1024 * 1024});
const receipt = await client.startOrResume(file);
assert.equal(receipt.offset, file.size);
assert.equal(receipt.releaseEligible, true);
assert.equal(transport.bytes.length, file.size);

const resumedTransport = new MemoryTransport();
resumedTransport.length = file.size;
resumedTransport.bytes = new Uint8Array(await file.slice(0, 64 * 1024).arrayBuffer());
const resumed = await new NovaResumableUploadClient({transport: resumedTransport, chunkBytes: 64 * 1024, maxBytes: 1024 * 1024}).startOrResume(file, resumedTransport.uploadId);
assert.equal(resumed.offset, file.size);

await assert.rejects(
  () => new NovaResumableUploadClient({transport: new MemoryTransport({badOffset: true}), chunkBytes: 64 * 1024, maxBytes: 1024 * 1024}).startOrResume(file),
  /SERVER_OFFSET_NOT_ACKNOWLEDGED/
);
await assert.rejects(
  () => new NovaResumableUploadClient({transport: new MemoryTransport({securityVerified: false}), chunkBytes: 64 * 1024, maxBytes: 1024 * 1024}).startOrResume(file),
  /PROMOTION_BLOCKED_UNVERIFIED_OBJECT/
);

console.log('PASS_NODE_RESUMABLE_UPLOAD_OFFSET_INTEGRITY_AND_PROMOTION_GUARD');
