import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {classifyRightsLifecycle,expiryLockDecision,lifecycleIdempotencyKey} from "../functions/_lib/rights-lifecycle.mjs";

const source={
  decision_id:"mx_rights_decision_"+"a".repeat(32),
  case_id:"mx_rights_case_"+"b".repeat(32),
  right_scope:"OFFICIAL_LOGO",product_surface:"WEB_PUBLIC",status:"GRANTED_WITH_LIMITS",
  territories_json:'["FR"]',platforms_json:'["web"]',conditions_json:'["credit"]',
  evidence_refs_json:'["response:1"]',valid_from:"2026-01-01T00:00:00Z",valid_until:"2026-10-01T00:00:00Z"
};
assert.equal(classifyRightsLifecycle(source,{now:"2026-09-01T00:00:00Z",expiringWindowDays:30}).state,"EXPIRING_SOON");
assert.equal(classifyRightsLifecycle(source,{now:"2026-10-06T00:00:00Z"}).state,"EXPIRED");
assert.equal(classifyRightsLifecycle({...source,status:"REVOKED"},{now:"2026-09-01T00:00:00Z"}).state,"REVOKED");
assert.equal(classifyRightsLifecycle({...source,valid_until:null},{now:"2026-09-01T00:00:00Z"}).state,"ACTIVE_WITH_LIMITS");

const lock=expiryLockDecision(source,{
  decisionId:"mx_rights_decision_"+"c".repeat(32),createdAt:"2026-10-06T11:30:00Z"
});
assert.equal(lock.ok,true);
assert.equal(lock.value.status,"EXPIRED");
assert.equal(lock.value.supersedesDecisionId,source.decision_id);
assert.deepEqual(lock.value.territories,["FR"]);

const key1=await lifecycleIdempotencyKey({caseId:source.case_id,decisionId:source.decision_id,eventType:"EXPIRED_LOCKED",effectiveAt:"2026-10-01T00:00:00Z"});
const key2=await lifecycleIdempotencyKey({caseId:source.case_id,decisionId:source.decision_id,eventType:"EXPIRED_LOCKED",effectiveAt:"2026-10-01T00:00:00Z"});
assert.equal(key1,key2);
assert.match(key1,/^[a-f0-9]{64}$/);

const db=new sqlite3.DatabaseSync(":memory:");
for(const p of [
  "migrations/0001_modaryx_dev_foundation.sql","migrations/0002_modaryx_auth_sessions.sql",
  "migrations/0003_modaryx_moderation_publication.sql","migrations/0004_modaryx_v2_core_model.sql",
  "migrations/0005_modaryx_v2_notifications.sql","migrations/0006_modaryx_v2_data_history.sql",
  "migrations/0007_modaryx_v2_notification_delivery_outbox.sql","migrations/0008_modaryx_v2_game_rights_registry.sql",
  "migrations/0009_modaryx_v2_game_support_requests.sql","migrations/0010_modaryx_v2_rights_evidence.sql",
  "migrations/0011_modaryx_v2_publisher_outbound_readiness.sql","migrations/0012_modaryx_v2_publisher_inbound_quarantine.sql",
  "migrations/0013_modaryx_v2_authorizing_decision_audit.sql","migrations/0014_modaryx_v2_rights_lifecycle.sql"
]) db.exec(fs.readFileSync(p,"utf8"));
const now="2026-10-06T11:30:00Z";
db.prepare(`INSERT INTO modaryx_v2_rights_cases (
 case_id,game_id,game_name,publisher_name,state,requested_scopes_json,product_surfaces_json,
 contact_state,created_by_actor_key,created_at,updated_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
 source.case_id,"mx_game_aetherlands","Aetherlands","Example Publisher","APPROVED_WITH_LIMITS",
 '["OFFICIAL_LOGO"]','["WEB_PUBLIC"]',"CONTACT_VERIFIED","rights-admin:test",now,now
);
db.prepare(`INSERT INTO modaryx_v2_rights_scope_decisions (
 decision_id,case_id,right_scope,product_surface,status,territories_json,platforms_json,
 allowed_uses_json,forbidden_uses_json,conditions_json,credits_required,valid_from,valid_until,
 evidence_refs_json,evidence_archived,source_verified,conditions_satisfied,asset_linked,
 reviewer_actor_key,verified_at,supersedes_decision_id,created_at
) VALUES (?,?,?,?,?,?,?,'[]','[]',?,0,?,?,?,1,1,1,1,?,?,NULL,?)`).run(
 source.decision_id,source.case_id,"OFFICIAL_LOGO","WEB_PUBLIC","GRANTED_WITH_LIMITS",
 source.territories_json,source.platforms_json,source.conditions_json,source.valid_from,source.valid_until,
 source.evidence_refs_json,"rights-admin:test","2026-01-01T00:00:00Z","2026-01-01T00:00:00Z"
);
db.prepare(`INSERT INTO modaryx_v2_rights_scope_decisions (
 decision_id,case_id,right_scope,product_surface,status,territories_json,platforms_json,
 allowed_uses_json,forbidden_uses_json,conditions_json,credits_required,valid_from,valid_until,
 evidence_refs_json,evidence_archived,source_verified,conditions_satisfied,asset_linked,
 reviewer_actor_key,verified_at,supersedes_decision_id,created_at
) VALUES (?,?,?,?,?,?,?,'[]','[]',?,0,?,?,?,1,1,1,1,?,NULL,?,?)`).run(
 lock.value.decisionId,source.case_id,"OFFICIAL_LOGO","WEB_PUBLIC","EXPIRED",
 source.territories_json,source.platforms_json,source.conditions_json,source.valid_from,source.valid_until,
 source.evidence_refs_json,"rights-admin:test",source.decision_id,now
);
db.prepare(`INSERT INTO modaryx_v2_rights_lifecycle_events (
 lifecycle_event_id,case_id,decision_id,event_type,derived_from_decision_id,
 idempotency_key_sha256,effective_at,payload_json,actor_key,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_rights_lifecycle_"+"d".repeat(32),source.case_id,lock.value.decisionId,"EXPIRED_LOCKED",
 source.decision_id,key1,source.valid_until,'{"rightScope":"OFFICIAL_LOGO"}',"rights-admin:test",now
);
assert.throws(()=>db.prepare(`INSERT INTO modaryx_v2_rights_lifecycle_events (
 lifecycle_event_id,case_id,decision_id,event_type,derived_from_decision_id,
 idempotency_key_sha256,effective_at,payload_json,actor_key,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_rights_lifecycle_"+"e".repeat(32),source.case_id,lock.value.decisionId,"EXPIRED_LOCKED",
 source.decision_id,key1,source.valid_until,'{}',"rights-admin:test",now
));

const endpoint=fs.readFileSync("functions/api/v1/rights/lifecycle/evaluate-case.js","utf8");
assert.ok(endpoint.includes("requireRecentAuthentication:true"));
assert.ok(endpoint.includes("lifecycleIdempotencyKey"));
assert.equal(/GRANTED_WITH_LIMITS.*INSERT|status=['"]GRANTED/i.test(endpoint),false,"lifecycle endpoint must never create grants");
assert.equal(/setInterval|cron|scheduled\(/i.test(endpoint),false,"production scheduler must not be implied");

console.log("PASS_V2_RIGHTS_LIFECYCLE_CANDIDATE");
