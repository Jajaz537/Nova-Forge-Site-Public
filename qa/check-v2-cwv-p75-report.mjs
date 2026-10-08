import assert from "node:assert/strict";
import fs from "node:fs";
import {buildCwvP75Report,nearestRankPercentile} from "../functions/_lib/cwv-rum-report.mjs";

const c=JSON.parse(fs.readFileSync("qa/modaryx-v2-cwv-p75-report-contract.json","utf8"));
assert.equal(c.status,"P75_AGGREGATION_CANDIDATE_READ_ONLY");
assert.equal(c.blockerClosedByThisContract,false);
assert.equal(c.retentionPolicy,"PENDING_EXPLICIT_PRODUCTION_APPROVAL");
const inv=new Set(c.invariants||[]);
for(const x of [
  "READ_ONLY_REPORT","ADMIN_AUTH_REQUIRED","P75_REPORT_NEVER_EQUALS_PRODUCTION_PROOF_BY_ITSELF",
  "SAMPLE_TARGET_IS_CANDIDATE_NOT_CRUX_CERTIFICATION","PRODUCTION_ORIGIN_PROOF_REQUIRED",
  "RETENTION_POLICY_APPROVAL_REQUIRED","REAL_TRAFFIC_REQUIRED","COLLECTION_REMAINS_DISABLED_BY_DEFAULT"
]) assert.ok(inv.has(x),"missing invariant "+x);

assert.equal(nearestRankPercentile([],0.75),null);
assert.equal(nearestRankPercentile([4,1,3,2],0.75),3);
assert.equal(nearestRankPercentile([100,200,300,400],0.5),200);

const rows=[];
for(let i=1;i<=100;i++){
  rows.push({metric_name:"LCP",metric_value:1000+i*10,route_class:"ROOT",viewport_class:i%2?"mobile":"desktop"});
  rows.push({metric_name:"INP",metric_value:50+i,route_class:"ROOT",viewport_class:i%2?"mobile":"desktop"});
  rows.push({metric_name:"CLS",metric_value:i/1000,route_class:"ROOT",viewport_class:i%2?"mobile":"desktop"});
}
const report=buildCwvP75Report(rows,{candidateSampleTarget:75});
assert.equal(report.metrics.LCP.sampleCount,100);
assert.equal(report.metrics.LCP.p75,1750);
assert.equal(report.metrics.INP.p75,125);
assert.equal(report.metrics.CLS.p75,0.075);
assert.equal(report.candidateSampleTargetsMet,true);
assert.equal(report.blockerClosed,false);
assert.equal(report.fieldEvidenceState,"SAMPLE_TARGET_MET_EXTERNAL_PRODUCTION_PROOF_STILL_REQUIRED");

const insufficient=buildCwvP75Report(rows.slice(0,30),{candidateSampleTarget:75});
assert.equal(insufficient.candidateSampleTargetsMet,false);
assert.equal(insufficient.fieldEvidenceState,"INSUFFICIENT_SAMPLES");
assert.equal(insufficient.blockerClosed,false);

const endpoint=fs.readFileSync("functions/api/v1/rum/cwv/report.js","utf8");
assert.ok(endpoint.includes("ADMIN_CONSOLE_PERMISSION"));
assert.ok(endpoint.includes("hasPermission"));
assert.ok(endpoint.includes("WHERE observed_at >= ?"));
assert.equal(/INSERT|UPDATE|DELETE/i.test(endpoint),false,"report endpoint must be read-only");
assert.equal(/identity_sub|ip_address|user_agent|referrer/i.test(endpoint),false,"report endpoint must not query sensitive fields");

console.log("PASS_V2_CWV_P75_REPORT_CANDIDATE");
