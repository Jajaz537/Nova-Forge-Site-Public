import assert from "node:assert/strict";

const originRaw=process.env.MODARYX_PRODUCTION_ORIGIN||"";
const mode=process.env.MODARYX_EXPECTED_MODE||"";
const timeoutMs=Number(process.env.MODARYX_PROBE_TIMEOUT_MS||8000);

if(!["PRE_CUTOVER","POST_CUTOVER"].includes(mode)) throw new Error("MODARYX_EXPECTED_MODE must be PRE_CUTOVER or POST_CUTOVER");
let origin;
try{origin=new URL(originRaw)}catch{throw new Error("MODARYX_PRODUCTION_ORIGIN invalid")}
if(origin.protocol!=="https:"||origin.username||origin.password||origin.hash||origin.pathname!=="/"||origin.search) throw new Error("production origin must be a bare HTTPS origin");

const controllerFor=()=>{
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  return {controller,timer};
};
async function request(path,{accept="application/json",method="GET"}={}){
  if(!["GET","HEAD"].includes(method)) throw new Error("mutating method forbidden");
  const {controller,timer}=controllerFor();
  try{
    return await fetch(new URL(path,origin),{
      method,
      redirect:"manual",
      credentials:"omit",
      referrerPolicy:"no-referrer",
      cache:"no-store",
      headers:{accept},
      signal:controller.signal
    });
  }finally{clearTimeout(timer)}
}
async function json(path){
  const response=await request(path);
  const type=response.headers.get("content-type")||"";
  if(!/application\/json/i.test(type)) return {response,body:null};
  let body=null;
  try{body=await response.json();}catch{}
  return {response,body};
}

const root=await request("/",{accept:"text/html"});
assert.equal(root.status,200,"root must be HTTP 200");
const rootHtml=await root.text();
const robotsHeader=(root.headers.get("x-robots-tag")||"").toLowerCase();
const metaNoindex=/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(rootHtml);
const noindex=robotsHeader.includes("noindex")||metaNoindex;
if(mode==="PRE_CUTOVER") assert.equal(noindex,true,"pre-cutover origin must remain noindex");
if(mode==="POST_CUTOVER") assert.equal(noindex,false,"post-cutover origin must be indexable");

const status=await json("/api/v1/status");
assert.equal(status.response.status,200,"status endpoint HTTP");
assert.equal(status.body?.service,"modaryx-backend","unexpected backend service");
assert.equal(status.body?.guarantees?.secretsReturned,false,"secretsReturned guarantee drift");

const session=await json("/api/v1/auth/session");
assert.equal(session.response.status,200,"session endpoint HTTP");
assert.equal(typeof session.body?.authenticated,"boolean","session authenticated boolean missing");

const providers=await json("/api/v1/providers/status");
assert.equal(providers.response.status,200,"provider registry HTTP");
assert.equal(providers.body?.privacy?.secretsReturned,false,"provider registry secret guarantee drift");

const delivery=await json("/api/v1/notifications/delivery/readiness");
assert.equal(delivery.response.status,200,"delivery readiness HTTP");

const cwv=await json("/api/v1/rum/cwv");
assert.equal(cwv.response.status,200,"CWV readiness HTTP");
assert.ok(["DISABLED","STORAGE_MISSING","READY_FOR_FIELD_TRAFFIC"].includes(cwv.body?.state),"unexpected CWV readiness state");
assert.equal(cwv.body?.fieldEvidence,"OPEN_TRAFFIC_AND_P75_REQUIRED","CWV field evidence state drift");

const history=await json("/api/v1/history");
assert.ok([401,503].includes(history.response.status),"anonymous history must be denied or unavailable, got "+history.response.status);

const sw=await request("/sw-v2.js",{accept:"application/javascript"});
if(mode==="POST_CUTOVER") assert.equal(sw.status,200,"post-cutover service worker asset required");

const summary={
  origin:origin.origin,
  mode,
  root:{status:root.status,noindex},
  backend:{
    stage:status.body?.stage||null,
    d1:Boolean(status.body?.bindings?.d1),
    r2:Boolean(status.body?.bindings?.r2),
    remoteWritesReady:Boolean(status.body?.remoteWritesReady)
  },
  session:{authenticated:Boolean(session.body?.authenticated)},
  providers:{
    auth:providers.body?.connectors?.auth?.state||null,
    antiAbuse:providers.body?.connectors?.antiAbuse?.state||null,
    artifactStorage:providers.body?.connectors?.artifactStorage?.state||null,
    weather:providers.body?.connectors?.weather?.state||null,
    email:providers.body?.connectors?.email?.state||null,
    push:providers.body?.connectors?.push?.state||null
  },
  delivery:{
    email:delivery.body?.email?.state||null,
    push:delivery.body?.push?.state||null
  },
  historyAnonymousStatus:history.response.status,
  serviceWorkerAssetStatus:sw.status,
  fieldCwv:{
    collectorState:cwv.body?.state||null,
    explicitlyEnabled:Boolean(cwv.body?.explicitlyEnabled),
    storageReady:Boolean(cwv.body?.storageReady),
    evidence:"EXTERNAL_EVIDENCE_REQUIRED"
  }
};
console.log("PRODUCTION_EVIDENCE_PROBE",JSON.stringify(summary));
console.log(mode==="PRE_CUTOVER"?"PASS_V2_PRE_CUTOVER_READ_ONLY_PROBE":"PASS_V2_POST_CUTOVER_READ_ONLY_PROBE");
