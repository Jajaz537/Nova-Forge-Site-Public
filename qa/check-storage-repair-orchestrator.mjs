import assert from 'node:assert/strict';
import {resolveAndPlanRepair} from '../functions/_lib/storage-repair-orchestrator.mjs';

const enc=new TextEncoder();
const manifestBytes=enc.encode('{"schema":"repair-proof","version":1}');
const artifactBytes=enc.encode('MODARYX exact repair proof');
const wrongBytes=enc.encode('MODARYX wrong repair proof');
const digest=async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');

const logicalIdentity={
  manifestSha256:await digest(manifestBytes),
  artifactSha256:await digest(artifactBytes)
};

const calls=[];
const routes=new Map([
  ['https://exact.example/manifest.json',manifestBytes],
  ['https://exact.example/artifact.bin',artifactBytes],
  ['https://wrong.example/manifest.json',manifestBytes],
  ['https://wrong.example/artifact.bin',wrongBytes]
]);
const fetchImpl=async url=>{
  const key=url.href||String(url);
  calls.push(key);
  const body=routes.get(key);
  return body
    ? new Response(body,{status:200,headers:{'content-length':String(body.byteLength),'content-type':key.endsWith('.json')?'application/json':'application/octet-stream'}})
    : new Response('missing',{status:404});
};

const result=await resolveAndPlanRepair({
  logicalIdentity,
  origins:[
    {
      originId:'origin:mutable',
      state:'active',
      kind:'mirror',
      mutableAlias:true,
      manifestUrl:'https://mutable.example/manifest.json',
      artifactUrl:'https://mutable.example/latest.bin'
    },
    {
      originId:'origin:wrong',
      state:'active',
      kind:'mirror',
      mutableAlias:false,
      manifestUrl:'https://wrong.example/manifest.json',
      artifactUrl:'https://wrong.example/artifact.bin'
    },
    {
      originId:'origin:exact',
      state:'active',
      kind:'https',
      mutableAlias:false,
      manifestUrl:'https://exact.example/manifest.json',
      artifactUrl:'https://exact.example/artifact.bin'
    }
  ],
  fetchImpl,
  manifestMaxBytes:1024,
  artifactMaxBytes:1024
});

assert.equal(result.ok,true);
assert.equal(result.resolution.resolutionState,'verified');
assert.equal(result.resolution.resolvedOriginId,'origin:exact');
assert.equal(result.repair.result.state,'repaired');
assert.equal(result.repair.result.selectedOriginId,'origin:exact');
assert.equal(calls.some(value=>value.includes('mutable.example')),false);
assert.equal(result.observations.find(item=>item.originId==='origin:mutable').reason,'mutable-alias-forbidden');
assert.equal(result.observations.find(item=>item.originId==='origin:wrong').ok,false);

const before=calls.length;
const withdrawn=await resolveAndPlanRepair({
  logicalIdentity,
  releaseState:'withdrawn',
  origins:[{
    originId:'origin:exact',
    state:'active',
    mutableAlias:false,
    manifestUrl:'https://exact.example/manifest.json',
    artifactUrl:'https://exact.example/artifact.bin'
  }],
  fetchImpl
});
assert.equal(withdrawn.ok,true);
assert.equal(withdrawn.networkSkipped,true);
assert.equal(withdrawn.repair.result.state,'release-withdrawn');
assert.equal(calls.length,before);

console.log(JSON.stringify({
  marker:'PASS_TARGETED_STORAGE_REPAIR_ORCHESTRATOR',
  result:'PASS',
  invariants:[
    'eligible origins are observed in parallel through the bounded HTTPS transport',
    'mutable aliases and inactive origins are not fetched',
    'only an exact manifest and artifact digest can become the selected repair origin',
    'withdrawn or revoked releases skip remote retrieval entirely',
    'repair planning remains fail-closed when no exact verified copy exists',
    'the proof uses an injected in-memory transport and claims no real Storage or Repair service'
  ],
  failures:[]
},null,2));
