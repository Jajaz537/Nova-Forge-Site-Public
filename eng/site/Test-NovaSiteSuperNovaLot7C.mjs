import { evaluateC2paEvidence } from '../../assets/content-credentials.mjs';
import { canonicalText, metadataDigest, verifyUpdateMetadataChain } from '../../assets/update-trust.mjs';
import { fetchVerifiedArtifact } from '../../assets/range-verified-download.mjs';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const encoder = new TextEncoder();
function toBase64Url(bytes) { return Buffer.from(bytes).toString('base64url'); }
async function signMetadata(role, version, issuedAt, expires, signed, keyId, privateKey) {
  const envelope = { role, version, issuedAt, expires, signed };
  const signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, encoder.encode(canonicalText(envelope)));
  return { ...envelope, signatures: [{ keyId, signature: toBase64Url(new Uint8Array(signature)) }] };
}
async function testC2pa() {
  const sha = 'a'.repeat(64);
  const valid = { schema:'nova-forge-c2pa-evidence/v1', standard:'c2pa', validationState:'valid', validatorProvider:'nova.c2pa.adapter', validationReceiptSha256:'b'.repeat(64), manifestClaimDigestSha256:'c'.repeat(64), assetSha256:sha, rightsOwnershipInferred:false, lineageState:'derived' };
  assert(evaluateC2paEvidence(valid, sha).accepted === true, 'valid C2PA receipt should pass');
  assert(evaluateC2paEvidence({ ...valid, assetSha256: 'd'.repeat(64) }, sha).accepted === false, 'C2PA digest mismatch must fail');
  assert(evaluateC2paEvidence({ ...valid, validationState: 'unknown' }, sha).accepted === false, 'unvalidated C2PA must fail');
  assert(evaluateC2paEvidence({ ...valid, rightsOwnershipInferred: true }, sha).accepted === false, 'C2PA may not imply ownership');
}
async function testUpdateTrust() {
  const now = Date.parse('2026-09-13T14:20:00Z'); const issuedAt = '2026-09-13T14:00:00Z'; const expires = '2026-09-13T16:00:00Z';
  const roles = {}; const privateKeys = {};
  for (const role of ['timestamp','snapshot','targets']) {
    const pair = await crypto.subtle.generateKey({ name:'ECDSA', namedCurve:'P-256' }, true, ['sign','verify']);
    roles[role] = { threshold:1, keys:[{ keyId:`${role}-key-1`, algorithm:'ECDSA-P256-SHA256', publicKeyJwk:await crypto.subtle.exportKey('jwk', pair.publicKey) }] };
    privateKeys[role] = pair.privateKey;
  }
  const trust = { schema:'nova-forge-update-trust/v1', roles };
  const targets = await signMetadata('targets',4,issuedAt,expires,{ artifacts:[{ id:'nova-public', version:'1.0.0', sha256:'e'.repeat(64) }] },'targets-key-1',privateKeys.targets);
  const snapshot = await signMetadata('snapshot',7,issuedAt,expires,{ targets:{ version:targets.version, sha256:await metadataDigest(targets) } },'snapshot-key-1',privateKeys.snapshot);
  const timestamp = await signMetadata('timestamp',11,issuedAt,expires,{ snapshot:{ version:snapshot.version, sha256:await metadataDigest(snapshot) } },'timestamp-key-1',privateKeys.timestamp);
  const result = await verifyUpdateMetadataChain({ trust, metadata:{timestamp,snapshot,targets}, trustedVersions:{timestamp:11,snapshot:7,targets:4}, now });
  assert(result.verified === true, 'valid update chain should pass');
  let blocked = 0;
  try { await verifyUpdateMetadataChain({ trust, metadata:{timestamp,snapshot,targets}, trustedVersions:{timestamp:12,snapshot:7,targets:4}, now }); } catch (e) { assert(e.message.includes('rollback'),'rollback must be detected'); blocked++; }
  const expiredTargets = { ...targets, expires:'2026-09-13T13:00:00Z' };
  try { await verifyUpdateMetadataChain({ trust, metadata:{timestamp,snapshot,targets:expiredTargets}, trustedVersions:{timestamp:11,snapshot:7,targets:4}, now }); } catch (e) { assert(e.message.includes('expired') || e.message.includes('time-window'),'expiry must fail closed'); blocked++; }
  const reusedTrust = structuredClone(trust); reusedTrust.roles.snapshot.keys[0].keyId = reusedTrust.roles.timestamp.keys[0].keyId;
  try { await verifyUpdateMetadataChain({ trust:reusedTrust, metadata:{timestamp,snapshot,targets}, trustedVersions:{timestamp:11,snapshot:7,targets:4}, now }); } catch (e) { assert(e.message.includes('role-reuse'),'role key reuse must fail'); blocked++; }
  assert(blocked === 3, 'all update-trust fail-closed checks must run');
}
async function testRangeDownload() {
  const bytes = encoder.encode('Nova Forge verified range download fixture 7C');
  const digestBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const sha256 = [...new Uint8Array(digestBuffer)].map((b) => b.toString(16).padStart(2,'0')).join('');
  const descriptor = { contentId:'nova-fixture', version:'1.0.0', sizeBytes:bytes.byteLength, sha256, immutableIdentity:`sha256:${sha256}`, url:'./fixtures/nova-fixture.bin' };
  const transport = { async metadata(){ return {acceptRanges:'bytes',sizeBytes:bytes.byteLength,immutableIdentity:descriptor.immutableIdentity,version:descriptor.version}; }, async readRange(_d,start,end){ return {status:206,start,end,total:bytes.byteLength,immutableIdentity:descriptor.immutableIdentity,version:descriptor.version,bytes:bytes.slice(start,end+1)}; } };
  const result = await fetchVerifiedArtifact(descriptor, transport, {chunkSize:7,maxBytes:1024}); assert(result.verified && result.sha256 === sha256,'verified range artifact should pass');
  let blocked=0;
  const spliceTransport={...transport,async readRange(_d,start,end){const r=await transport.readRange(_d,start,end);if(start>0)r.immutableIdentity=`sha256:${'f'.repeat(64)}`;return r;}};
  try{await fetchVerifiedArtifact(descriptor,spliceTransport,{chunkSize:7,maxBytes:1024});}catch(e){assert(e.message.includes('splice'),'cross-release splice must fail');blocked++;}
  const wrongOffsetTransport={...transport,async readRange(_d,start,end){const r=await transport.readRange(_d,start,end);r.start=start+1;return r;}};
  try{await fetchVerifiedArtifact(descriptor,wrongOffsetTransport,{chunkSize:7,maxBytes:1024});}catch(e){assert(e.message.includes('content-range'),'wrong offset must fail');blocked++;}
  const tampered=Uint8Array.from(bytes);tampered[tampered.length-1]^=1;
  const tamperedTransport={async metadata(){return transport.metadata();},async readRange(_d,start,end){return {status:206,start,end,total:tampered.byteLength,immutableIdentity:descriptor.immutableIdentity,version:descriptor.version,bytes:tampered.slice(start,end+1)};}};
  try{await fetchVerifiedArtifact(descriptor,tamperedTransport,{chunkSize:7,maxBytes:1024});}catch(e){assert(e.message.includes('whole-object'),'whole-object digest must fail');blocked++;}
  assert(blocked===3,'all range fail-closed checks must run');
}
await testC2pa(); await testUpdateTrust(); await testRangeDownload();
console.log('PASS_NODE_SITE_SUPERNOVA_LOT7C_TRUST_RANGE_PROOF');
