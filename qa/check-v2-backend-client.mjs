import assert from "node:assert/strict";
import fs from "node:fs";
import {authLoginUrl, logoutAccountSession, resolveAccountRemoteState} from "../v2/src/api/modaryx-api.js";

const c=JSON.parse(fs.readFileSync("qa/modaryx-v2-backend-client-contract.json","utf8"));
assert.equal(c.schemaVersion,1);
assert.equal(c.status,"IMPLEMENTED_CANDIDATE_PROOF_REQUIRED");
const inv=new Set(c.invariants||[]);
for(const x of ["SAME_ORIGIN_ONLY","NO_BROWSER_BEARER_TOKEN","NO_LOCALSTORAGE_SESSION_TOKEN","NO_FAKE_AUTHENTICATED_STATE","PRODUCTION_BACKEND_BLOCKER_REMAINS_OPEN","PASSKEY_REAL_DEVICE_BLOCKER_REMAINS_OPEN"]) assert.ok(inv.has(x),"missing invariant "+x);

const source=fs.readFileSync("v2/src/api/modaryx-api.js","utf8");
assert.equal(/localStorage|sessionStorage|Authorization|Bearer\s/i.test(source),false,"browser token storage/auth header forbidden");
assert.equal(authLoginUrl("https://evil.example/"),"/api/v1/auth/login?returnTo=%2Faccount");
assert.equal(authLoginUrl("/account?tab=profile"),"/api/v1/auth/login?returnTo=%2Faccount%3Ftab%3Dprofile");

const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json"}});
const html=()=>new Response("<!doctype html>",{status:200,headers:{"content-type":"text/html"}});

let calls=[];
let state=await resolveAccountRemoteState({fetchImpl:async(path,opts)=>{calls.push([path,opts]);return html();}});
assert.equal(state.state,"BACKEND_UNAVAILABLE");
assert.equal(state.loginAvailable,false);
assert.equal(calls[0][1].credentials,"same-origin");

state=await resolveAccountRemoteState({fetchImpl:async(path)=>{
  if(path.endsWith("/status")) return json({bindings:{d1:false},auth0:{loginConfigured:false}});
  throw new Error("unexpected session call");
}});
assert.equal(state.state,"BACKEND_UNAVAILABLE");
assert.equal(state.reason,"D1_NOT_READY");

state=await resolveAccountRemoteState({fetchImpl:async(path)=>{
  if(path.endsWith("/status")) return json({bindings:{d1:true},auth0:{loginConfigured:true}});
  return json({authenticated:false});
}});
assert.equal(state.state,"GUEST");
assert.equal(state.loginAvailable,true);

state=await resolveAccountRemoteState({fetchImpl:async(path)=>{
  if(path.endsWith("/status")) return json({bindings:{d1:true},auth0:{loginConfigured:true}});
  return json({authenticated:true,authority:{role:"founder"},profile:{handle:"demo",displayName:"Demo",visibility:"public",isCreator:true}});
}});
assert.equal(state.state,"AUTHENTICATED");
assert.equal(state.profile.handle,"demo");
assert.equal(state.authority.role,"founder");

let logoutRequest=null;
const logout=await logoutAccountSession({fetchImpl:async(path,opts)=>{logoutRequest={path,opts};return json({ok:true});}});
assert.equal(logout.ok,true);
assert.equal(logoutRequest.path,"/api/v1/auth/logout");
assert.equal(logoutRequest.opts.method,"POST");
assert.equal(logoutRequest.opts.credentials,"same-origin");

console.log("PASS_V2_BACKEND_CLIENT_CONTRACT");
