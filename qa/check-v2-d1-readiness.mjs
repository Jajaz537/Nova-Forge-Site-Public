import assert from "node:assert/strict";
import fs from "node:fs";
import {d1ReadinessExpectedCounts,d1SchemaReadiness} from "../functions/_lib/d1-readiness.mjs";

const contract=JSON.parse(fs.readFileSync("qa/modaryx-v2-d1-readiness-contract.json","utf8"));
assert.equal(contract.status,"READ_ONLY_D1_READINESS_CANDIDATE");
assert.equal(contract.sqlMode,"READ_ONLY");
const inv=new Set(contract.invariants||[]);
for(const x of ["NO_MIGRATION_APPLY","NO_INSERT_UPDATE_DELETE_ALTER_DROP","NO_TABLE_NAMES_RETURNED_PUBLICLY","PARTIAL_MIGRATION_IS_NOT_COMPLETE","PRODUCTION_APPROVAL_REMAINS_OPEN"]) assert.ok(inv.has(x),"missing invariant "+x);

const counts=d1ReadinessExpectedCounts();
assert.deepEqual(counts,{v1Foundation:5,v2Core:14,v2Notifications:2,v2History:1,v2Delivery:1});

class FakeDb{
  constructor(names,{fail=false}={}){this.names=names;this.fail=fail;}
  prepare(sql){
    assert.match(sql,/^SELECT name FROM sqlite_master/);
    assert.equal(/\b(INSERT|UPDATE|DELETE|ALTER|DROP|CREATE|REPLACE)\b/i.test(sql),false);
    return {all:async()=>{
      if(this.fail) throw new Error("query failed");
      return {results:this.names.map(name=>({name}))};
    }};
  }
}
const v1=[
  "modaryx_profiles","modaryx_community_submissions","modaryx_auth_transactions",
  "modaryx_sessions","modaryx_moderation_receipts"
];
const core=[
  "modaryx_v2_games","modaryx_v2_content_types","modaryx_v2_creators","modaryx_v2_teams",
  "modaryx_v2_content_items","modaryx_v2_releases","modaryx_v2_dependencies",
  "modaryx_v2_compatibility_claims","modaryx_v2_file_artifacts","modaryx_v2_collections",
  "modaryx_v2_collection_items","modaryx_v2_modpacks","modaryx_v2_game_profiles",
  "modaryx_v2_search_documents"
];
const notifications=["modaryx_v2_notification_events","modaryx_v2_notification_preferences"];
const history=["modaryx_v2_data_history"];
const delivery=["modaryx_v2_notification_delivery_outbox"];

const missing=await d1SchemaReadiness({});
assert.equal(missing.bindingPresent,false);
assert.equal(missing.migrationLevel,"UNKNOWN");
assert.equal(missing.latestCandidateComplete,false);

const foundation=await d1SchemaReadiness({MODARYX_DB:new FakeDb(v1)});
assert.equal(foundation.migrationLevel,"V1_FOUNDATION");
assert.equal(foundation.groups.v2Core.complete,false);

const partial=await d1SchemaReadiness({MODARYX_DB:new FakeDb([...v1,...core.slice(0,3)])});
assert.equal(partial.migrationLevel,"PARTIAL");
assert.equal(partial.latestCandidateComplete,false);

const full=await d1SchemaReadiness({MODARYX_DB:new FakeDb([...v1,...core,...notifications,...history,...delivery])});
assert.equal(full.migrationLevel,"V2_DELIVERY");
assert.equal(full.latestCandidateComplete,true);

const failed=await d1SchemaReadiness({MODARYX_DB:new FakeDb([],{fail:true})});
assert.equal(failed.queryState,"QUERY_FAILED");
assert.equal(failed.latestCandidateComplete,false);

const endpoint=fs.readFileSync("functions/api/v1/status/d1-readiness.js","utf8");
assert.equal(/sqlite_master|modaryx_v2_|modaryx_profiles/.test(endpoint),false,"endpoint must not embed schema internals");
const source=fs.readFileSync("functions/_lib/d1-readiness.mjs","utf8");
assert.equal(/\b(INSERT|UPDATE|DELETE|ALTER|DROP|CREATE|REPLACE)\b/i.test(source.match(/"SELECT name FROM sqlite_master[^"]+"/)?.[0]||""),false);

console.log("PASS_V2_D1_READINESS_CANDIDATE");
