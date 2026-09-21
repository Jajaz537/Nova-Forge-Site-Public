'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const guide=JSON.parse(fs.readFileSync(path.join(root,'schemas/modaryx-guide-connection.schema.json'),'utf8'));
const bridge=JSON.parse(fs.readFileSync(path.join(root,'schemas/nova-forge-os-bridge.schema.json'),'utf8'));
const readiness=JSON.parse(fs.readFileSync(path.join(root,'data/integration-readiness.json'),'utf8'));
const status=JSON.parse(fs.readFileSync(path.join(root,'public-status.json'),'utf8'));

assert.equal(guide.$id,'urn:modaryx:schemas:guide-connection:v1');
assert.equal(guide.properties.product.const,'modaryx-guide');
assert.equal(guide.properties.consent.properties.required.const,true);
assert.equal(guide.properties.sessionSharing.const,false);
assert.equal(guide.properties.credentialForwarding.const,false);
assert.equal(guide.properties.remoteTelemetryRequired.const,false);
assert.ok(guide.properties.state.enum.includes('connected'));

assert.equal(bridge.$id,'urn:modaryx:schemas:nova-forge-os-bridge:v1');
assert.equal(bridge.properties.sourceProduct.const,'modaryx-web');
assert.equal(bridge.properties.targetProduct.const,'nova-forge-os');
assert.equal(bridge.properties.consent.properties.required.const,true);
assert.equal(bridge.properties.implicitAccountLinking.const,false);
assert.equal(bridge.properties.sessionSharing.const,false);
assert.equal(bridge.properties.credentialForwarding.const,false);

const capability=readiness.capabilities.find(item=>item.id==='integrations.guide-os-bridge');
assert.ok(capability,'guide/os bridge readiness missing');
assert.equal(capability.state,'not-connected');
for(const p of [
  './schemas/modaryx-guide-connection.schema.json',
  './schemas/nova-forge-os-bridge.schema.json'
]) assert.ok(capability.contractPaths.includes(p),p);
assert.ok(capability.permissions.some(v=>/Moindre privilège/i.test(v)));
assert.ok(capability.permissions.some(v=>/Aucune session partagée implicite/i.test(v)));
assert.match(capability.publicationGate,/MODARYX reste autonome/i);
assert.equal(status.integrations.nova_forge_os_bridge,'not_connected');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_GUIDE_OS_BRIDGE_CONTRACTS',
  result:'PASS',
  scope:'Source contracts only; MODARYX Guide service and Nova Forge OS bridge runtime remain not-connected',
  invariants:[
    'MODARYX and Nova Forge OS remain distinct products',
    'explicit consent is required before connection',
    'least privilege is contractual',
    'implicit account linking is forbidden',
    'session sharing is forbidden',
    'credential forwarding is forbidden'
  ],
  failures:[]
},null,2));
