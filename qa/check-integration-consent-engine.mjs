import assert from 'node:assert/strict';
import {evaluateGuideConnection,evaluateNovaForgeBridge} from '../functions/_lib/integration-consent.mjs';

const guideClosed=evaluateGuideConnection({
  state:'not-connected',
  requestedScopes:['guide.read'],
  grantedScopes:[]
});
assert.equal(guideClosed.ok,true);
assert.equal(guideClosed.activatable,false);
assert.equal(guideClosed.contract.sessionSharing,false);
assert.equal(guideClosed.contract.credentialForwarding,false);

const guideEscalation=evaluateGuideConnection({
  state:'connected',
  consentGranted:true,
  requestedScopes:['guide.read'],
  grantedScopes:['guide.write'],
  endpointUri:'https://guide.example/api'
});
assert.equal(guideEscalation.reason,'scope-escalation-forbidden');

const guideNoConsent=evaluateGuideConnection({
  state:'connected',
  consentGranted:false,
  requestedScopes:['guide.read'],
  grantedScopes:['guide.read'],
  endpointUri:'https://guide.example/api'
});
assert.equal(guideNoConsent.reason,'consent-required');

const guideOk=evaluateGuideConnection({
  state:'connected',
  consentGranted:true,
  requestedScopes:['guide.read','guide.context'],
  grantedScopes:['guide.read'],
  endpointUri:'https://guide.example/api'
});
assert.equal(guideOk.ok,true);
assert.equal(guideOk.activatable,true);

const bridgeClosed=evaluateNovaForgeBridge({
  state:'not-connected',
  requestedPermissions:['os.status.read'],
  grantedPermissions:[]
});
assert.equal(bridgeClosed.activatable,false);
assert.equal(bridgeClosed.contract.sourceProduct,'modaryx-web');
assert.equal(bridgeClosed.contract.targetProduct,'nova-forge-os');
assert.equal(bridgeClosed.contract.implicitAccountLinking,false);

const bridgeEscalation=evaluateNovaForgeBridge({
  state:'connected',
  consentGranted:true,
  requestedPermissions:['os.status.read'],
  grantedPermissions:['os.files.write'],
  localEndpointUri:'http://127.0.0.1:43119/',
  protocolVersion:'v1'
});
assert.equal(bridgeEscalation.reason,'permission-escalation-forbidden');

const bridgeRemoteHttp=evaluateNovaForgeBridge({
  state:'connected',
  consentGranted:true,
  requestedPermissions:['os.status.read'],
  grantedPermissions:['os.status.read'],
  localEndpointUri:'http://example.com/',
  protocolVersion:'v1'
});
assert.equal(bridgeRemoteHttp.reason,'os-bridge-endpoint-invalid');

const bridgeNoConsent=evaluateNovaForgeBridge({
  state:'connected',
  consentGranted:false,
  requestedPermissions:['os.status.read'],
  grantedPermissions:['os.status.read'],
  localEndpointUri:'http://127.0.0.1:43119/',
  protocolVersion:'v1'
});
assert.equal(bridgeNoConsent.reason,'consent-required');

const bridgeOk=evaluateNovaForgeBridge({
  state:'connected',
  consentGranted:true,
  requestedPermissions:['os.status.read','os.compatibility.read'],
  grantedPermissions:['os.status.read'],
  localEndpointUri:'http://127.0.0.1:43119/',
  protocolVersion:'v1.0'
});
assert.equal(bridgeOk.ok,true);
assert.equal(bridgeOk.activatable,true);
assert.equal(bridgeOk.contract.sessionSharing,false);
assert.equal(bridgeOk.contract.credentialForwarding,false);

console.log(JSON.stringify({
  marker:'PASS_TARGETED_INTEGRATION_CONSENT_ENGINE',
  result:'PASS',
  invariants:[
    'grants must be a subset of requested scopes or permissions',
    'explicit consent is mandatory before connected activation',
    'Guide remote endpoints require HTTPS',
    'OS bridge HTTP is limited to loopback while HTTPS is allowed',
    'MODARYX and Nova Forge OS product identities remain explicit',
    'implicit account linking, session sharing and credential forwarding stay forbidden'
  ],
  failures:[]
},null,2));
