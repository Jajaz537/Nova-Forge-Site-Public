import assert from "node:assert/strict";
import fs from "node:fs";
import {createGameSupportRequest,getGameSupportRequests} from "../v2/src/api/modaryx-api.js";

const c=JSON.parse(fs.readFileSync("qa/modaryx-v2-game-support-ui-contract.json","utf8"));
assert.equal(c.status,"REAL_SUBMISSION_UI_CANDIDATE_FAIL_SOFT");
const inv=new Set(c.invariants||[]);
for(const x of [
  "GUEST_LOCAL_DRAFT_REMAINS_AVAILABLE","NO_FAKE_TURNSTILE_TOKEN","REAL_POST_REQUIRES_AUTHENTICATED_SESSION",
  "REAL_POST_REQUIRES_REMOTE_WRITES_READY","REAL_POST_REQUIRES_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_ACTION_GAME_SUPPORT_REQUEST","D1_TABLE_ABSENCE_FAILS_SOFT_IN_UI",
  "SUCCESS_NEVER_IMPLIES_PUBLISHER_PERMISSION","NO_PUBLISHER_CONTACT","NO_REMOTE_D1_APPLY","NO_CUTOVER"
]) assert.ok(inv.has(x),"missing invariant "+x);

const calls=[];
const fetchImpl=async(path,init)=>{
  calls.push({path,init});
  return {
    ok:true,status:init.method==="POST"?201:200,
    headers:{get:()=> "application/json; charset=utf-8"},
    json:async()=>init.method==="POST"
      ? {schemaVersion:1,item:{requestId:"mx_game_support_request_"+"a".repeat(32),gameName:"Project Meridian",state:"REQUESTED"}}
      : {schemaVersion:1,items:[]}
  };
};

const payload={gameName:"Project Meridian",platforms:["PC"],reason:"",sourceUrls:[],turnstileToken:"real-browser-token"};
const post=await createGameSupportRequest(payload,{fetchImpl,timeoutMs:1000});
assert.equal(post.ok,true);
assert.equal(calls[0].path,"/api/v1/game-support/requests");
assert.equal(calls[0].init.method,"POST");
assert.equal(calls[0].init.credentials,"same-origin");
assert.deepEqual(JSON.parse(calls[0].init.body),payload);

const get=await getGameSupportRequests({fetchImpl,timeoutMs:1000});
assert.equal(get.ok,true);
assert.equal(calls[1].init.method,"GET");
assert.equal(calls[1].init.body,undefined);

const app=fs.readFileSync("v2/src/App.jsx","utf8");
const support=fs.readFileSync("v2/src/components/GameSupportRequestPanel.jsx","utf8");
const ui=app+"\n"+support;
assert.ok(ui.includes("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"));
assert.ok(ui.includes('action="game-support-request"'));
assert.ok(ui.includes("Brouillon de demande — non envoyé"));
assert.ok(ui.includes("Envoyer la demande pour triage"));
assert.ok(ui.includes("Elle reste sans permission éditeur"));
assert.equal(ui.includes('turnstileToken:"test"'),false);
assert.equal(ui.includes('turnstileToken:"demo"'),false);
console.log("PASS_V2_GAME_SUPPORT_UI_CANDIDATE");

assert.ok(app.includes('lazy(()=>import("./components/GameSupportRequestPanel.jsx"))'));
console.log("PASS_V2_GAME_SUPPORT_UI_CODE_SPLIT");
