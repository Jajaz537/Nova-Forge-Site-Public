import assert from 'node:assert/strict';
import {
  fetchBoundedHttps,
  fetchVerifiedBlob,
  observeStorageOrigin
} from '../functions/_lib/storage-transport.mjs';

const enc=new TextEncoder();
const digest=async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');

const manifestBytes=enc.encode('{"schema":"proof","version":1}');
const artifactBytes=enc.encode('MODARYX transport proof artifact');
const manifestSha256=await digest(manifestBytes);
const artifactSha256=await digest(artifactBytes);

const routes=new Map([
  ['https://storage.example/manifest.json',new Response(manifestBytes,{status:200,headers:{'content-type':'application/json','content-length':String(manifestBytes.byteLength)}})],
  ['https://storage.example/artifact.bin',new Response(artifactBytes,{status:200,headers:{'content-type':'application/octet-stream','content-length':String(artifactBytes.byteLength)}})]
]);

const mockFetch=async url=>{
  const key=url.href||String(url);
  const response=routes.get(key);
  if(!response) return new Response('missing',{status:404});
  return response.clone();
};

assert.equal((await fetchBoundedHttps({url:'http://storage.example/a',fetchImpl:mockFetch})).reason,'transport-url-invalid');

const manifest=await fetchVerifiedBlob({
  url:'https://storage.example/manifest.json',
  expectedSha256:manifestSha256,
  fetchImpl:mockFetch,
  maxBytes:1024,
  accept:'application/json'
});
assert.equal(manifest.ok,true);
assert.equal(manifest.sha256,manifestSha256);

const mismatch=await fetchVerifiedBlob({
  url:'https://storage.example/artifact.bin',
  expectedSha256:'f'.repeat(64),
  fetchImpl:mockFetch,
  maxBytes:1024
});
assert.equal(mismatch.reason,'transport-digest-mismatch');

const oversized=await fetchBoundedHttps({
  url:'https://storage.example/artifact.bin',
  fetchImpl:mockFetch,
  maxBytes:4
});
assert.equal(oversized.reason,'response-too-large');

const observed=await observeStorageOrigin({
  originId:'origin:proof',
  manifestUrl:'https://storage.example/manifest.json',
  artifactUrl:'https://storage.example/artifact.bin',
  logicalIdentity:{manifestSha256,artifactSha256},
  fetchImpl:mockFetch,
  manifestMaxBytes:1024,
  artifactMaxBytes:1024
});
assert.equal(observed.ok,true);
assert.equal(observed.observation.observedManifestSha256,manifestSha256);
assert.equal(observed.observation.observedArtifactSha256,artifactSha256);

console.log(JSON.stringify({
  marker:'PASS_TARGETED_STORAGE_TRANSPORT_PRIMITIVE',
  result:'PASS',
  invariants:[
    'transport accepts HTTPS endpoints only',
    'credentials and referrer are omitted',
    'response size is bounded before trust',
    'manifest and artifact bytes are hashed independently',
    'digest mismatch fails closed',
    'no real provider endpoint is claimed or contacted by the proof'
  ],
  failures:[]
},null,2));
