'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const routePath=path.join(root,'functions/founder-proof-dev.js');
const evidence=fs.readFileSync(path.join(root,'qa/MODARYX-FOUNDER-DEV-PROOF-SURFACE-20260921.md'),'utf8');

assert.ok(!fs.existsSync(routePath),'Temporary Founder DEV proof route must be removed after runtime proof');

for(const token of [
  'TERMINÉ — preuves runtime Fondateur acquises',
  'proof=moderation',
  'httpStatus=200',
  'proof=appeals',
  'result=upheld',
  'receiptCreated=true',
  'cleanupSucceeded=true',
  'functions/founder-proof-dev.js',
  'garde anti-résurrection'
]) assert.ok(evidence.includes(token),'Founder proof removal evidence missing: '+token);

console.log(JSON.stringify({
  marker:'PASS_TARGETED_FOUNDER_DEV_PROOF_SURFACE_REMOVED',
  result:'PASS',
  scope:'Founder DEV runtime proofs retained as evidence; temporary runtime route removed',
  checks:[
    'temporary founder proof route is absent',
    'moderation runtime proof is retained',
    'appeals runtime proof is retained',
    'receipt and cleanup success are retained',
    'anti-resurrection guard remains active'
  ],
  failures:[]
},null,2));
