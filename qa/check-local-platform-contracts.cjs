'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const status=JSON.parse(fs.readFileSync(path.join(root,'public-status.json'),'utf8'));
const smart=JSON.parse(fs.readFileSync(path.join(root,'schemas/smart-profile.schema.json'),'utf8'));
const collection=JSON.parse(fs.readFileSync(path.join(root,'schemas/collection.schema.json'),'utf8'));
const compatibilitySchema=JSON.parse(fs.readFileSync(path.join(root,'schemas/compatibility-graph.schema.json'),'utf8'));
const compatibility=JSON.parse(fs.readFileSync(path.join(root,'data/compatibility-graph.json'),'utf8'));
const searchAdapter=JSON.parse(fs.readFileSync(path.join(root,'schemas/search-adapter.schema.json'),'utf8'));

assert.equal(status.stage,'pre-vf');
assert.equal(status.principles.static_first,true);
assert.equal(status.principles.local_first,true);
assert.equal(status.principles.fail_closed,true);
assert.equal(status.principles.public_only,true);
assert.equal(status.runtime.account_required,false);
assert.equal(status.runtime.remote_telemetry_required,false);
assert.equal(status.runtime.third_party_runtime_dependency_required,false);
assert.equal(status.runtime.local_preference_persisted_only_after_explicit_user_action,true);
assert.equal(status.runtime.default_preference_state_persisted,false);
assert.equal(status.runtime.service_worker_cache_policy,'public-allowlist-only');
assert.equal(status.runtime.arbitrary_same_origin_get_cached,false);
assert.equal(status.verification.hash_match_proves_provenance,false);

assert.equal(status.integrations.nova_forge_os_bridge,'not_connected');
assert.equal(status.integrations.storage_broker_resolver,'not_connected');
assert.equal(status.integrations.repair_network,'not_connected');
assert.equal(status.integrations.community_backend,'not_connected');
assert.equal(status.integrations.external_search_adapter,'not_required');

assert.equal(status.community.execution,'browser-local-drafts');
assert.equal(status.community.sync_state,'local-only');
assert.equal(status.community.draft_state,'local-draft');
assert.equal(status.community.publication_state,'not-submitted');
assert.equal(status.community.remote_write_available,false);
assert.equal(status.community.remote_identity_claimed,false);
assert.equal(status.community.service_worker_caches_drafts,false);

assert.equal(status.smart_profile.execution,'browser-local');
assert.equal(status.smart_profile.remote_profile_upload_required,false);
assert.equal(status.smart_profile.fps_guarantee,false);
assert.equal(status.smart_profile.stability_guarantee,false);

assert.equal(smart.$id,'urn:nova-forge:schemas:web-smart-profile:v1');
assert.match(smart.description,/never guarantee FPS or stability/i);
assert.equal(smart.properties.execution.const,'browser-local');
assert.deepEqual(smart.properties.observations.items.properties.evidence.enum,['measured','estimated','unknown']);
assert.deepEqual(smart.properties.observations.items.properties.source.enum,['browser-api','browser-approximation','unavailable']);
assert.equal(smart.properties.recommendation.properties.evidence.const,'estimated');
assert.equal(smart.properties.guarantees.properties.fps.const,false);
assert.equal(smart.properties.guarantees.properties.stability.const,false);
const smartRules=JSON.stringify(smart.properties.observations.items.allOf);
for(const token of [
  '"evidence":{"const":"measured"}',
  '"source":{"const":"browser-api"}',
  '"evidence":{"const":"unknown"}',
  '"source":{"const":"unavailable"}',
  '"value":{"type":"null"}'
]) assert.ok(smartRules.includes(token),token);

assert.equal(collection.$id,'urn:nova-forge:schemas:collection:v1');
assert.deepEqual(collection.properties.visibility.enum,['private-local','unlisted','public']);
assert.equal(collection.properties.visibility.default,'private-local');
assert.deepEqual(collection.properties.syncState.enum,['local-only','sync-pending','synced']);
assert.equal(collection.properties.itemIds.uniqueItems,true);

assert.equal(compatibilitySchema.$id,'urn:nova-forge:schemas:compatibility-graph:v1');
assert.deepEqual(compatibilitySchema.properties.dataClass.enum,['demonstration','published']);
assert.deepEqual(compatibilitySchema.properties.edges.items.properties.evidence.enum,['measured','estimated','unknown']);
const compatibilityRules=JSON.stringify(compatibilitySchema.properties.edges.items.allOf);
assert.ok(compatibilityRules.includes('"evidence":{"const":"measured"}'));
assert.ok(compatibilityRules.includes('"required":["evidenceReceipt"]'));

assert.equal(compatibility.schemaVersion,1);
assert.equal(compatibility.dataClass,'demonstration');
const ids=new Set();
for(const node of compatibility.nodes){
  assert.ok(!ids.has(node.id),'duplicate compatibility node: '+node.id);
  ids.add(node.id);
}
for(const edge of compatibility.edges){
  assert.ok(ids.has(edge.from),'edge source missing: '+edge.from);
  assert.ok(ids.has(edge.to),'edge target missing: '+edge.to);
  if(edge.evidence==='measured') assert.ok(edge.evidenceReceipt,'measured edge missing receipt');
}
assert.equal(compatibility.edges.filter(edge=>edge.evidence==='measured').length,0);

assert.equal(searchAdapter.$id,'urn:nova-forge:schemas:search-adapter:v1');
assert.match(searchAdapter.description,/local search remains authoritative for core availability/i);
assert.equal(searchAdapter.properties.requiredForCore.const,false);
assert.equal(searchAdapter.properties.identityPolicy.const,'preserve-local-content-id');
assert.deepEqual(searchAdapter.properties.costPolicy.enum,[
  'disabled','explicit-budget-only','free-tier-with-hard-ceiling'
]);
assert.deepEqual(searchAdapter.properties.state.enum,['disabled','configured','degraded']);
const searchRules=JSON.stringify(searchAdapter.allOf);
assert.ok(searchRules.includes('"state":{"const":"disabled"}'));
assert.ok(searchRules.includes('"endpoint":{"type":"null"}'));

console.log(JSON.stringify({
  marker:'PASS_TARGETED_LOCAL_PLATFORM_CONTRACTS',
  result:'PASS',
  scope:'Browser-local platform contracts only; no external search, remote profile, OS bridge, community backend, or performance guarantee is claimed',
  historicalSchemaIdsRetained:true,
  current:{
    smartProfile:status.smart_profile.execution,
    community:status.community.execution,
    externalSearch:status.integrations.external_search_adapter,
    compatibilityDataClass:compatibility.dataClass
  },
  invariants:[
    'public runtime stays static-first local-first fail-closed',
    'hash match never proves provenance',
    'smart profile is browser-local and carries no FPS/stability guarantee',
    'unknown observations map to unavailable/null semantics',
    'collections default private-local',
    'compatibility graph remains demonstration data with no measured edge lacking a receipt',
    'external search is optional and cannot replace local content identity',
    'remote integrations remain explicitly disconnected'
  ],
  failures:[]
},null,2));
