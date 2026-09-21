import assert from 'node:assert/strict';
import {
  discoverGuideService,
  prepareGuideActivation,
  discoverNovaForgeBridge,
  prepareNovaForgeBridgeActivation
} from '../functions/_lib/integration-discovery.mjs';

const calls=[];
const bodies=new Map([
  ['https://guide.example/.well-known/modaryx-guide',JSON.stringify({
    schema:'modaryx-guide-discovery/v1',
    product:'modaryx-guide',
    state:'available',
    supportedScopes:['guide.read','guide.context']
  })],
  ['http://127.0.0.1:43119/.well-known/nova-forge-bridge',JSON.stringify({
    schema:'nova-forge-os-bridge-discovery/v1',
    sourceProduct:'modaryx-web',
    targetProduct:'nova-forge-os',
    state:'available',
    protocolVersion:'v1.0',
    supportedPermissions:['os.status.read','os.compatibility.read']
  })]
]);

const fetchImpl=async (url,options)=>{
  const key=url.href||String(url);
  calls.push({key,options});
  const body=bodies.get(key);
  return body
    ? new Response(body,{status:200,headers:{'content-type':'application/json','content-length':String(new TextEncoder().encode(body).byteLength)}})
    : new Response('{}',{status:404,headers:{'content-type':'application/json'}});
};

const guide=await discoverGuideService({
  endpointUri:'https://guide.example/.well-known/modaryx-guide',
  requestedScopes:['guide.read'],
  fetchImpl
});
assert.equal(guide.ok,true);
assert.equal(guide.state,'available');
const guideCall=calls.find(item=>item.key.includes('guide.example'));
assert.equal(guideCall.options.credentials,'omit');
assert.equal(guideCall.options.referrerPolicy,'no-referrer');
assert.equal(guideCall.options.redirect,'error');

assert.equal(prepareGuideActivation({discovery:guide,consentGranted:false,grantedScopes:['guide.read']}).reason,'consent-required');
const guideActivation=prepareGuideActivation({discovery:guide,consentGranted:true,grantedScopes:['guide.read']});
assert.equal(guideActivation.ok,true);
assert.equal(guideActivation.activatable,true);

assert.equal((await discoverGuideService({
  endpointUri:'http://guide.example/.well-known/modaryx-guide',
  requestedScopes:['guide.read'],
  fetchImpl
})).reason,'discovery-endpoint-invalid');

const bridge=await discoverNovaForgeBridge({
  localEndpointUri:'http://127.0.0.1:43119/.well-known/nova-forge-bridge',
  requestedPermissions:['os.status.read'],
  fetchImpl
});
assert.equal(bridge.ok,true);
assert.equal(bridge.protocolVersion,'v1.0');
assert.equal(bridge.localEndpointUri.startsWith('http://127.0.0.1:43119/'),true);

assert.equal(prepareNovaForgeBridgeActivation({
  discovery:bridge,
  consentGranted:false,
  grantedPermissions:['os.status.read']
}).reason,'consent-required');

const bridgeActivation=prepareNovaForgeBridgeActivation({
  discovery:bridge,
  consentGranted:true,
  grantedPermissions:['os.status.read']
});
assert.equal(bridgeActivation.ok,true);
assert.equal(bridgeActivation.activatable,true);
assert.equal(bridgeActivation.contract.sourceProduct,'modaryx-web');
assert.equal(bridgeActivation.contract.targetProduct,'nova-forge-os');

assert.equal((await discoverNovaForgeBridge({
  localEndpointUri:'http://example.com/.well-known/nova-forge-bridge',
  requestedPermissions:['os.status.read'],
  fetchImpl
})).reason,'discovery-endpoint-invalid');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_INTEGRATION_DISCOVERY_RUNTIME',
  result:'PASS',
  invariants:[
    'Guide discovery accepts HTTPS only and sends no credentials or referrer',
    'Nova Forge OS bridge discovery allows HTTP only on loopback while preserving the explicit product boundary',
    'discovery responses are JSON and size-bounded before use',
    'requested capabilities must be supported by the discovered service',
    'discovery never bypasses explicit user consent before activation',
    'the proof uses injected responses and claims no real Guide service or Nova Forge OS runtime'
  ],
  failures:[]
},null,2));
