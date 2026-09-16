'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/integration-readiness.json'), 'utf8'));
assert.equal(data.schemaVersion, 1);
assert.equal(data.surface, 'modaryx-web');
assert.ok(Array.isArray(data.capabilities) && data.capabilities.length >= 6);
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
const status = JSON.parse(fs.readFileSync(path.join(root, 'public-status.json'), 'utf8'));
assert.equal(status.integrations.nova_forge_os_bridge, 'not_connected');
assert.equal(status.integrations.storage_broker_resolver, 'not_connected');
assert.equal(status.integrations.repair_network, 'not_connected');
assert.equal(status.integrations.community_backend, 'not_connected');
const downloads = JSON.parse(fs.readFileSync(path.join(root, 'downloads.json'), 'utf8'));
assert.equal(downloads.available, false);
assert.deepEqual(downloads.artifacts, []);
console.log(JSON.stringify({result:'PASS',scope:'Contract and source readiness only; no missing service is claimed as implemented',capabilities:data.capabilities.map(({id,state})=>({id,state}))},null,2));
