import assert from "node:assert/strict";
import fs from "node:fs";
import {spawnSync} from "node:child_process";
import sqlite3 from "node:sqlite";
import {requiredProductionTables} from "../functions/_lib/production-readiness.mjs";

const manifest=JSON.parse(fs.readFileSync("qa/modaryx-v2-d1-migration-execution-manifest.json","utf8"));
assert.equal(manifest.schemaVersion,1);
assert.equal(manifest.status,"PREPARED_NOT_EXECUTED");
assert.equal(manifest.sequence.length,14);
assert.equal(manifest.expectedCurrentV2TableCount,31);
assert.equal(manifest.applyPolicy.automaticRemoteApply,false);
assert.equal(manifest.applyPolicy.remoteDev,"EXPLICIT_MANUAL_ONLY");
assert.equal(manifest.applyPolicy.remoteProduction,"BLOCKED_UNTIL_DEV_PROOF_AND_EXPLICIT_APPROVAL");

const inv=new Set(manifest.invariants||[]);
for(const x of [
  "NO_REMOTE_APPLY_BY_THIS_MANIFEST","NO_WRANGLER_D1_EXECUTE_REMOTE_IN_PROOF","NO_PRODUCTION_MUTATION",
  "NO_FIXTURE_SEED","NO_CATALOGUE_PROMOTION","NO_CUTOVER","REAL_DATA_HISTORY_BLOCKER_REMAINS_OPEN"
]) assert.ok(inv.has(x),"missing invariant "+x);

const db=new sqlite3.DatabaseSync(":memory:");
for(let i=0;i<manifest.sequence.length;i++){
  const item=manifest.sequence[i];
  assert.equal(item.order,i+1);
  assert.equal(item.migration,String(i+1).padStart(4,"0"));
  assert.equal(item.path,`migrations/${item.migration}_${item.path.split("_").slice(1).join("_")}`);
  assert.ok(fs.existsSync(item.path),"missing "+item.path);
  assert.equal(fs.statSync(item.path).size,item.sizeBytes,"size drift "+item.path);

  const hash=spawnSync("git",["hash-object",item.path],{encoding:"utf8"});
  assert.equal(hash.status,0,"git hash-object failed "+item.path);
  assert.equal(hash.stdout.trim(),item.gitBlobSha1,"blob drift "+item.path);

  const sql=fs.readFileSync(item.path,"utf8");
  for(const pattern of [/\bDROP\s+TABLE\b/i,/\bDROP\s+COLUMN\b/i,/\bTRUNCATE\b/i]) {
    assert.equal(pattern.test(sql),false,"destructive DDL detected "+item.path+" "+pattern);
  }
  db.exec(sql);
}

const tables=new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(x=>x.name));
const required=requiredProductionTables();
assert.equal(required.length,manifest.expectedCurrentV2TableCount);
for(const table of required) assert.ok(tables.has(table),"required table missing after replay: "+table);

for(const forbidden of ["wrangler d1 execute","--remote","cloudflare api token","curl -x post","curl -x put","curl -x patch","curl -x delete"]) {
  const raw=fs.readFileSync("qa/modaryx-v2-d1-migration-execution-manifest.json","utf8").toLowerCase();
  assert.equal(raw.includes(forbidden),false,"remote mutation token in manifest: "+forbidden);
}

console.log("D1_MIGRATION_SEQUENCE_COUNT",manifest.sequence.length);
console.log("D1_REQUIRED_V2_TABLE_COUNT",required.length);
console.log("PASS_V2_D1_MIGRATION_EXECUTION_MANIFEST");
