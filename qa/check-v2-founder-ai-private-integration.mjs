import assert from "node:assert/strict";
import fs from "node:fs";
import {signFounderAiRequest} from "../functions/_lib/founder-ai-bridge.mjs";

const vector={
  keyHex:"00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
  method:"POST",
  pathWithQuery:"/v1/chat?mode=normal",
  timestamp:1791115200,
  nonce:"0123456789abcdef0123456789abcdef",
  bodyUtf8:'{"conversation_id":"demo","message":"Bonjour Nova","max_tokens":256}',
  bodySha256:"405799bc6f51f4dda835350af3b0f3cb4c4fe3039ec5357f2bc84b526058ff75",
  signatureHex:"05fac265d5e68066946e26e4eebb1b78ff141d010cf169c0471adbde89a53250"
};
const signed=await signFounderAiRequest({
  keyHex:vector.keyHex,method:vector.method,pathWithQuery:vector.pathWithQuery,
  bodyBytes:new TextEncoder().encode(vector.bodyUtf8),timestamp:vector.timestamp,nonce:vector.nonce
});
assert.equal(signed.bodyHash,vector.bodySha256);
assert.equal(signed.signature,vector.signatureHex);

const bridge=fs.readFileSync("functions/_lib/founder-ai-bridge.mjs","utf8");
assert.match(bridge,/getSessionIdentity/);
assert.match(bridge,/FOUNDER_PERMISSION/);
assert.match(bridge,/requireSameOrigin/);
assert.match(bridge,/https:/);
assert.doesNotMatch(bridge,/localStorage|sessionStorage|console\.log/);

const app=fs.readFileSync("review-evidence/modaryx-v2-living-threshold-prototype-20261003/src/App.jsx","utf8");
assert.match(app,/authority\?\.capabilities\?\.founder===true/);
assert.match(app,/founderAiEnabled/);
assert.match(app,/founderLive/);
assert.match(app,/\["localhost","127\.0\.0\.1","::1"\]/);
assert.doesNotMatch(app,/MODARYX_AI_BRIDGE_KEY|x-modaryx-signature/);

for(const file of [
  "functions/api/founder/ai/status.js",
  "functions/api/founder/ai/capabilities.js",
  "functions/api/founder/ai/chat.js"
]){
  const text=fs.readFileSync(file,"utf8");
  assert.match(text,/authorizeFounderAi/);
}
console.log("FOUNDER_AI_GOLDEN_VECTOR",signed.signature);
console.log("FOUNDER_AI_PUBLIC_DEFAULT","HIDDEN_UNLESS_VERIFIED_FOUNDER");
console.log("PASS_V2_FOUNDER_AI_PRIVATE_INTEGRATION");
