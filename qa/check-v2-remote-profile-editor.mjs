import assert from "node:assert/strict";
import fs from "node:fs";
import {getProfile,saveProfile} from "../v2/src/api/modaryx-api.js";

const widget=fs.readFileSync("v2/src/components/TurnstileWidget.jsx","utf8");
const editor=fs.readFileSync("v2/src/components/RemoteProfileEditor.jsx","utf8");
const app=fs.readFileSync("v2/src/App.jsx","utf8");
const css=fs.readFileSync("v2/src/profile-editor.css","utf8");

assert.ok(widget.includes("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"));
assert.ok(widget.includes("turnstile.render"));
assert.ok(widget.includes('"expired-callback"'));
assert.ok(widget.includes('"error-callback"'));
assert.equal(/localStorage|sessionStorage/.test(widget+editor),false,"Turnstile/profile proof must not persist tokens client-side");
assert.equal(/console\.(log|info|debug)\s*\(/.test(widget+editor),false,"No token-capable debug logging allowed");

assert.ok(editor.includes('action="profile-write"'));
assert.ok(editor.includes("turnstileToken"));
assert.ok(editor.includes("getBackendStatus"));
assert.ok(editor.includes("getProfile"));
assert.ok(editor.includes("saveProfile"));
assert.ok(editor.includes("Profil enregistré"));
assert.ok(app.includes("RemoteProfileEditor"));
assert.ok(app.includes("sessionProfile={profile}"));
assert.ok(css.includes(".remote-profile-editor"));

const calls=[];
const profileBody={
  schemaVersion:1,
  profileId:"profile:proof",
  handle:"proof-user",
  displayName:"Proof User",
  bio:"Proof",
  visibility:"private",
  creator:{isCreator:false},
  links:[],
  collections:[],
  createdAt:"2026-10-07T00:00:00Z",
  updatedAt:"2026-10-07T00:00:00Z"
};
const fetchImpl=async(path,options={})=>{
  calls.push({path,options});
  if(options.method==="PUT"){
    const body=JSON.parse(options.body);
    assert.equal(body.turnstileToken,"proof-turnstile-token");
    assert.equal(body.handle,"proof-user");
    return new Response(JSON.stringify(profileBody),{
      status:200,
      headers:{"content-type":"application/json"}
    });
  }
  return new Response(JSON.stringify(profileBody),{
    status:200,
    headers:{"content-type":"application/json"}
  });
};

const read=await getProfile({fetchImpl,timeoutMs:1000});
assert.equal(read.ok,true);
assert.equal(read.body.handle,"proof-user");
assert.equal(calls[0].path,"/api/v1/profile");
assert.equal(calls[0].options.method,"GET");
assert.equal(calls[0].options.credentials,"same-origin");

const saved=await saveProfile({
  handle:"proof-user",
  displayName:"Proof User",
  bio:"Proof",
  visibility:"private",
  creator:{isCreator:false},
  links:[],
  turnstileToken:"proof-turnstile-token"
},{fetchImpl,timeoutMs:1000});
assert.equal(saved.ok,true);
assert.equal(calls[1].path,"/api/v1/profile");
assert.equal(calls[1].options.method,"PUT");
assert.equal(calls[1].options.credentials,"same-origin");
assert.match(calls[1].options.headers["content-type"],/application\/json/);

console.log("PASS_V2_REMOTE_PROFILE_EDITOR");
