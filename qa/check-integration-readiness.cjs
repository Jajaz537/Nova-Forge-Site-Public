'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/integration-readiness.json'), 'utf8'));
assert.equal(data.schemaVersion, 1);
assert.equal(data.surface, 'modaryx-web');
assert.ok(Array.isArray(data.capabilities) && data.capabilities.length >= 7);
assert.equal(new Set(data.capabilities.map(item => item.id)).size, data.capabilities.length);
for (const item of data.capabilities) {
  assert.match(item.id, /^[a-z0-9][a-z0-9.-]+$/);
  assert.ok(['local-only', 'contract-ready', 'blocked-inputs', 'not-connected', 'distribution-locked'].includes(item.state));
  assert.ok(item.contractPaths.length);
  for (const contractPath of item.contractPaths) {
    assert.ok(contractPath.startsWith('./'));
    assert.ok(fs.existsSync(path.join(root, contractPath.slice(2))), contractPath);
  }
  assert.ok(item.requiredInputs.length);
  assert.ok(item.permissions.length);
  for (const state of ['loading', 'empty', 'error', 'unavailable']) assert.ok(item.uiStates[state]?.trim(), item.id + ':' + state);
  assert.ok(item.publicationGate.trim());
}
const byId = new Map(data.capabilities.map(item => [item.id, item]));
assert.equal(byId.get('game-hubs.gta6-rdr2')?.state, 'contract-ready');
assert.equal(byId.get('game-corpus.gta6-rdr2')?.state, 'blocked-inputs');
for (const page of [
  'gta-6/index.html',
  'gta-6/mods/index.html',
  'gta-6/guides/index.html',
  'red-dead-redemption-2/index.html',
  'red-dead-redemption-2/mods/index.html',
  'red-dead-redemption-2/guides/index.html'
]) assert.ok(fs.existsSync(path.join(root, page)), page);
const status = JSON.parse(fs.readFileSync(path.join(root, 'public-status.json'), 'utf8'));
assert.equal(status.integrations.nova_forge_os_bridge, 'not_connected');
assert.equal(status.integrations.storage_broker_resolver, 'not_connected');
assert.equal(status.integrations.repair_network, 'not_connected');
assert.equal(status.integrations.community_backend, 'not_connected');
const downloads = JSON.parse(fs.readFileSync(path.join(root, 'downloads.json'), 'utf8'));
assert.equal(downloads.available, false);
assert.deepEqual(downloads.artifacts, []);
console.log(JSON.stringify({marker:'PASS_TARGETED_INTEGRATION_READINESS',result:'PASS',scope:'Contract and source readiness only; no missing service is claimed as implemented',capabilities:data.capabilities.map(({id,state})=>({id,state}))},null,2));
