import assert from "node:assert/strict";
import test from "node:test";
import {authorizeFounderAi, requestFounderBridge} from "../functions/_lib/founder-ai-bridge.mjs";

const SESSION="s".repeat(32);
function fakeDb(permissions=[]){
  return {
    prepare(){
      return {
        bind(){
          return {
            async first(){
              return {
                identity_sub:"founder-test",
                scope_json:"[]",
                permissions_json:JSON.stringify(permissions),
                created_at:"2026-10-05T00:00:00.000Z",
                expires_at:"2099-01-01T00:00:00.000Z"
              };
            }
          };
        }
      };
    }
  };
}
function context({permissions=[],origin="https://modaryx.example",env={}}={}){
  return {
    request:new Request("https://modaryx.example/api/founder/ai/chat",{
      method:"POST",
      headers:{cookie:`modaryx_session=${SESSION}`,origin,"content-type":"application/json"},
      body:"{}"
    }),
    env:{MODARYX_DB:fakeDb(permissions),...env}
  };
}

test("non-Founder identities receive a non-disclosing 404", async()=>{
  const access=await authorizeFounderAi(context({permissions:["modaryx:admin"]}),{write:true});
  assert.equal(access.ok,false);
  assert.equal(access.response.status,404);
  assert.deepEqual(await access.response.json(),{error:"not-found"});
});

test("Founder POST requires same origin", async()=>{
  const access=await authorizeFounderAi(context({permissions:["modaryx:founder"],origin:"https://evil.example"}),{write:true});
  assert.equal(access.ok,false);
  assert.equal(access.response.status,403);
  assert.deepEqual(await access.response.json(),{error:"origin-mismatch"});
});

test("plain HTTP is rejected for non-loopback bridge URLs", async()=>{
  const r=await requestFounderBridge({env:{
    MODARYX_AI_BRIDGE_URL:"http://bridge.example/v1/",
    MODARYX_AI_BRIDGE_KEY_HEX:"11".repeat(32)
  }},"GET","/v1/status");
  assert.equal(r.status,503);
  assert.deepEqual(await r.json(),{ok:false,error:"founder-ai-not-configured"});
});

test("Founder bridge request sends complete HMAC envelope and exact JSON body", async()=>{
  const originalFetch=globalThis.fetch;
  let captured=null;
  globalThis.fetch=async (url,options)=>{
    captured={url:String(url),options};
    return new Response(JSON.stringify({ok:true,protocol:"modaryx-founder-bridge-v1"}),{
      status:200,headers:{"content-type":"application/json"}
    });
  };
  try{
    const payload={conversation_id:"site-test",message:"bonjour",max_tokens:64,agent_id:"site"};
    const r=await requestFounderBridge({env:{
      MODARYX_AI_BRIDGE_URL:"https://bridge.example/",
      MODARYX_AI_BRIDGE_KEY_HEX:"22".repeat(32)
    }},"POST","/v1/chat",payload);
    assert.equal(r.status,200);
    assert.equal((await r.json()).ok,true);
    assert.equal(captured.url,"https://bridge.example/v1/chat");
    assert.equal(captured.options.method,"POST");
    assert.equal(captured.options.redirect,"error");
    assert.equal(captured.options.cache,"no-store");
    assert.equal(captured.options.headers["content-type"],"application/json");
    assert.match(captured.options.headers["x-modaryx-timestamp"],/^\d+$/);
    assert.match(captured.options.headers["x-modaryx-nonce"],/^[0-9a-f]{32}$/);
    assert.match(captured.options.headers["x-modaryx-body-sha256"],/^[0-9a-f]{64}$/);
    assert.match(captured.options.headers["x-modaryx-signature"],/^[0-9a-f]{64}$/);
    assert.equal(new TextDecoder().decode(captured.options.body),JSON.stringify(payload));
  }finally{
    globalThis.fetch=originalFetch;
  }
});
