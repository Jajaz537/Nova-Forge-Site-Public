import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {cwvRetentionPolicy,purgeExpiredCwvSamples} from "../functions/_lib/cwv-retention.mjs";

const c=JSON.parse(fs.readFileSync("qa/modaryx-v2-cwv-retention-contract.json","utf8"));
assert.equal(c.status,"RETENTION_CANDIDATE_DISABLED_BY_DEFAULT");
assert.equal(c.blockerClosedByThisContract,false);
assert.equal(c.productionApproval,"OPEN");
const inv=new Set(c.invariants||[]);
for(const x of [
  "RETENTION_DISABLED_BY_DEFAULT","GET_NEVER_PURGES","POST_REQUIRES_SAME_ORIGIN",
  "POST_REQUIRES_ADMIN_PERMISSION","POST_REQUIRES_EXPLICIT_RUNTIME_ENABLE",
  "RETENTION_DAYS_BOUNDED_7_TO_90","ONLY_CWV_SAMPLE_TABLE_PURGED","NO_REMOTE_INVOCATION_BY_THIS_CHANGE"
]) assert.ok(inv.has(x),"missing invariant "+x);

assert.equal(cwvRetentionPolicy({}).state,"DISABLED");
assert.equal(cwvRetentionPolicy({MODARYX_CWV_RETENTION_ENABLED:"1"}).days,28);
assert.equal(cwvRetentionPolicy({MODARYX_CWV_RETENTION_ENABLED:"1",MODARYX_CWV_RETENTION_DAYS:"1"}).days,7);
assert.equal(cwvRetentionPolicy({MODARYX_CWV_RETENTION_ENABLED:"1",MODARYX_CWV_RETENTION_DAYS:"999"}).days,90);

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

const insert=db.prepare(`INSERT INTO modaryx_v2_cwv_samples (
 sample_id,page_view_id,metric_name,metric_value,rating,route_class,viewport_class,navigation_type,observed_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?)`);
insert.run("mx_cwv_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","a".repeat(32),"LCP",1800,"good","ROOT","desktop","navigate","2026-08-01T00:00:00Z","2026-08-01T00:00:00Z");
insert.run("mx_cwv_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","b".repeat(32),"LCP",1900,"good","ROOT","desktop","navigate","2026-10-01T00:00:00Z","2026-10-01T00:00:00Z");

const fakeEnv={
  MODARYX_CWV_RETENTION_ENABLED:"1",
  MODARYX_CWV_RETENTION_DAYS:"28",
  MODARYX_DB:{
    prepare(sql){
      const stmt=db.prepare(sql);
      return {
        bind(...args){
          return {
            first:()=>stmt.get(...args),
            run:()=>stmt.run(...args)
          };
        }
      };
    }
  }
};
const result=await purgeExpiredCwvSamples(fakeEnv,{now:new Date("2026-10-06T00:00:00Z")});
assert.equal(result.ok,true);
assert.equal(result.deleted,1);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM modaryx_v2_cwv_samples").get().n,1);

const disabled=await purgeExpiredCwvSamples({MODARYX_DB:fakeEnv.MODARYX_DB},{now:new Date("2026-10-06T00:00:00Z")});
assert.equal(disabled.ok,false);
assert.equal(disabled.reason,"cwv-retention-disabled");

const endpoint=fs.readFileSync("functions/api/v1/rum/cwv/retention.js","utf8");
assert.ok(endpoint.includes("requireSameOrigin"));
assert.ok(endpoint.includes("ADMIN_CONSOLE_PERMISSION"));
assert.ok(endpoint.includes("cwv-retention-disabled"));
assert.equal(/DELETE FROM/.test(endpoint),false,"SQL purge must stay isolated in retention library");

console.log("PASS_V2_CWV_RETENTION_CANDIDATE");
