import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {validateDataHistoryEvent} from "../functions/_lib/data-history.mjs";

const contract=JSON.parse(fs.readFileSync("qa/modaryx-v2-data-history-contract.json","utf8"));
assert.equal(contract.status,"CANDIDATE_LOCAL_MIGRATION_PROVEN_REMOTE_OPEN");
assert.equal(contract.remoteApplication,"NOT_EXECUTED");
const inv=new Set(contract.invariants||[]);
for(const x of ["OWNER_SCOPED_READS_ONLY","HISTORY_APPEND_ONLY","CHANGED_FIELDS_NO_VALUES","NO_REMOTE_D1_APPLY","NO_FAKE_HISTORY","PRODUCTION_BLOCKER_REMAINS_OPEN_UNTIL_REMOTE_PIPELINE_PROVEN"]) assert.ok(inv.has(x),"missing invariant "+x);

const db=new sqlite3.DatabaseSync(":memory:");
for(const p of ["migrations/0001_modaryx_dev_foundation.sql","migrations/0002_modaryx_auth_sessions.sql","migrations/0003_modaryx_moderation_publication.sql","migrations/0004_modaryx_v2_core_model.sql","migrations/0005_modaryx_v2_notifications.sql","migrations/0006_modaryx_v2_data_history.sql"]) db.exec(fs.readFileSync(p,"utf8"));
const tables=new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(x=>x.name));
assert.ok(tables.has("modaryx_v2_data_history"));

const valid=validateDataHistoryEvent({
  ownerIdentitySub:"auth0|member-1",entityKind:"profile",entityId:"mx_profile_member",
  action:"updated",changedFields:["bio","displayName","bio"],occurredAt:"2026-10-06T09:10:00Z"
});
assert.equal(valid.ok,true);
assert.deepEqual(valid.value.changedFields,["bio","displayName"]);
assert.equal(validateDataHistoryEvent({...valid.value,action:"forged"}).ok,false);
assert.equal(validateDataHistoryEvent({...valid.value,changedFields:["x".repeat(81)]}).ok,false);

const now="2026-10-06T09:10:00Z";
db.prepare(`INSERT INTO modaryx_v2_data_history (
 history_id,owner_identity_sub,entity_kind,entity_id,action,revision,changed_fields_json,
 previous_history_id,source_receipt_id,snapshot_digest_sha256,occurred_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_history_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","auth0|member-1","profile","mx_profile_member",
 "created",1,'["displayName"]',null,null,"a".repeat(64),now,now
);
db.prepare(`INSERT INTO modaryx_v2_data_history (
 history_id,owner_identity_sub,entity_kind,entity_id,action,revision,changed_fields_json,
 previous_history_id,source_receipt_id,snapshot_digest_sha256,occurred_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_history_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","auth0|member-1","profile","mx_profile_member",
 "updated",2,'["bio"]',"mx_history_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",null,"b".repeat(64),now,now
);
assert.throws(()=>db.prepare(`INSERT INTO modaryx_v2_data_history (
 history_id,owner_identity_sub,entity_kind,entity_id,action,revision,changed_fields_json,
 previous_history_id,source_receipt_id,snapshot_digest_sha256,occurred_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_history_cccccccccccccccccccccccccccccccc","auth0|member-1","profile","mx_profile_member",
 "updated",2,'[]',"mx_history_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",null,"c".repeat(64),now,now
));

const endpoint=fs.readFileSync("functions/api/v1/history/index.js","utf8");
assert.ok(endpoint.includes("WHERE owner_identity_sub=?"));
assert.equal(endpoint.includes("ownerIdentitySub"),false,"owner identity must not be returned");
const profile=fs.readFileSync("functions/api/v1/profile.js","utf8");
const prefs=fs.readFileSync("functions/api/v1/notifications/preferences.js","utf8");
assert.ok(profile.includes("recordDataHistory"));
assert.ok(prefs.includes("recordDataHistory"));
console.log("PASS_V2_DATA_HISTORY_CANDIDATE");
