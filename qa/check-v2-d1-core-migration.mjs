import { spawnSync } from "node:child_process";

const run=spawnSync("python3",["qa/check-v2-d1-core-migration.py"],{
  encoding:"utf8"
});
process.stdout.write(run.stdout||"");
process.stderr.write(run.stderr||"");
if(run.status!==0) process.exit(run.status??1);
console.log("PASS_V2_D1_CORE_MIGRATION_WRAPPER");
