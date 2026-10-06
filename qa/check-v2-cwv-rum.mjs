import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {cwvRating,cwvRumReadiness,validateCwvBatch} from "../functions/_lib/cwv-rum.mjs";
import {cwvRouteClass,cwvViewportClass,selectInpValue} from "../v2/src/cwv-rum.js";

const c=JSON.parse(fs.readFileSync("qa/modaryx-v2-cwv-rum-contract.json","utf8"));
assert.equal(c.status,"FIELD_COLLECTION_CANDIDATE_DISABLED_BY_DEFAULT");
assert.equal(c.defaultClientEnabled,false);
assert.equal(c.fieldEvidenceState,"OPEN_TRAFFIC_AND_P75_REQUIRED");
const inv=new Set(c.invariants||[]);
for(const x of ["CLIENT_DISABLED_BY_DEFAULT","SERVER_DISABLED_BY_DEFAULT","DOUBLE_GATE_REQUIRED","NO_ACCOUNT_IDENTITY","NO_IP_STORAGE","NO_RAW_URL_QUERY_REFERRER","DNT_AND_GPC_OPT_OUT","FIELD_P75_NEVER_CLAIMED_FROM_SYNTHETIC_OR_LOCAL_PROOF","REMOTE_D1_MIGRATION_NOT_EXECUTED"]) assert.ok(inv.has(x),"missing invariant "+x);

assert.equal(cwvRating("LCP",2500),"good");
assert.equal(cwvRating("LCP",2500.1),"needs-improvement");
assert.equal(cwvRating("INP",500.1),"poor");
assert.equal(cwvRating("CLS",0.1),"good");
assert.equal(cwvRating("CLS",0.251),"poor");

assert.equal(cwvRouteClass("/"),"ROOT");
assert.equal(cwvRouteClass("/content/sentiers-de-laube"),"CONTENT_DETAIL");
assert.equal(cwvRouteClass("/private/unknown"),"OTHER");
assert.equal(cwvViewportClass(390),"mobile");
assert.equal(cwvViewportClass(800),"tablet");
assert.equal(cwvViewportClass(1440),"desktop");

const interactions=new Map([[1,120],[2,430],[3,210]]);
assert.equal(selectInpValue(interactions,3),430);
assert.equal(selectInpValue(interactions,100),210);

const valid=validateCwvBatch({
  schemaVersion:1,pageViewId:"a".repeat(32),routeClass:"GAME_HUB",viewportClass:"desktop",navigationType:"navigate",
  metrics:[{name:"LCP",value:1700},{name:"INP",value:180},{name:"CLS",value:0.03}]
});
assert.equal(valid.ok,true);
assert.equal(valid.value.metrics[0].rating,"good");
assert.equal(validateCwvBatch({...valid.value,pageViewId:"user@example.com"}).ok,false);
assert.equal(validateCwvBatch({...valid.value,routeClass:"/account?email=x"}).ok,false);
assert.equal(validateCwvBatch({...valid.value,metrics:[{name:"LCP",value:1},{name:"LCP",value:2}]}).ok,false);

assert.equal(cwvRumReadiness({}).state,"DISABLED");
assert.equal(cwvRumReadiness({MODARYX_CWV_RUM_ENABLED:"1"}).state,"STORAGE_MISSING");
const fakeDb={prepare(){}};
assert.equal(cwvRumReadiness({MODARYX_CWV_RUM_ENABLED:"1",MODARYX_DB:fakeDb}).state,"READY_FOR_FIELD_TRAFFIC");

const db=new sqlite3.DatabaseSync(":memory:");
for(const p of [
  "migrations/0001_modaryx_dev_foundation.sql","migrations/0002_modaryx_auth_sessions.sql",
  "migrations/0003_modaryx_moderation_publication.sql","migrations/0004_modaryx_v2_core_model.sql",
  "migrations/0005_modaryx_v2_notifications.sql","migrations/0006_modaryx_v2_data_history.sql",
  "migrations/0007_modaryx_v2_notification_delivery_outbox.sql","migrations/0008_modaryx_v2_game_rights_registry.sql",
  "migrations/0009_modaryx_v2_game_support_requests.sql","migrations/0010_modaryx_v2_rights_evidence.sql",
  "migrations/0011_modaryx_v2_publisher_outbound_readiness.sql","migrations/0012_modaryx_v2_publisher_inbound_quarantine.sql",
  "migrations/0013_modaryx_v2_authorizing_decision_audit.sql","migrations/0014_modaryx_v2_cwv_rum.sql"
]) db.exec(fs.readFileSync(p,"utf8"));

const now="2026-10-06T12:30:00Z";
db.prepare(`INSERT INTO modaryx_v2_cwv_samples (
 sample_id,page_view_id,metric_name,metric_value,rating,route_class,viewport_class,navigation_type,observed_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_cwv_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","a".repeat(32),"LCP",1700,"good","ROOT","desktop","navigate",now,now
);
assert.throws(()=>db.prepare(`INSERT INTO modaryx_v2_cwv_samples (
 sample_id,page_view_id,metric_name,metric_value,rating,route_class,viewport_class,navigation_type,observed_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_cwv_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","a".repeat(32),"LCP",1800,"good","ROOT","desktop","navigate",now,now
));

const migration=fs.readFileSync("migrations/0014_modaryx_v2_cwv_rum.sql","utf8").toLowerCase();
for(const forbidden of ["ip_address","user_agent","referrer","account_id","identity_sub","email"]) assert.equal(migration.includes(forbidden),false,"forbidden field in CWV storage: "+forbidden);
const endpoint=fs.readFileSync("functions/api/v1/rum/cwv.js","utf8");
assert.ok(endpoint.includes("requireSameOrigin"));
assert.ok(endpoint.includes("cwv-rum-disabled"));
const main=fs.readFileSync("v2/src/main.jsx","utf8");
assert.ok(main.includes('import.meta.env.VITE_MODARYX_FIELD_CWV === "1"'));

console.log("PASS_V2_CWV_RUM_CANDIDATE");
