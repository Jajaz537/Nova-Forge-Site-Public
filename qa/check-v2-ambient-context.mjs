import assert from "node:assert/strict";
import fs from "node:fs";
import {ambientFromPayload,deriveDayPhase,deriveSeason,resolveAmbientContext} from "../v2/src/api/local-context.js";

const contract=JSON.parse(fs.readFileSync("qa/modaryx-v2-ambient-context-contract.json","utf8"));
assert.equal(contract.schemaVersion,1);
assert.equal(contract.status,"IMPLEMENTED_CANDIDATE_PROOF_REQUIRED");
assert.equal(contract.endpoint,"/api/local-context");
const inv=new Set(contract.invariants||[]);
for(const x of ["NO_NAVIGATOR_GEOLOCATION","NO_EXACT_LOCATION_IN_CLIENT","NO_PROVIDER_SECRET_IN_CLIENT","NO_PROVIDER_ACTIVATION_BY_THIS_CHANGE","NO_CLOUDFLARE_CRITICAL_CHANGE","NO_CUTOVER"]) assert.ok(inv.has(x),"missing invariant "+x);

assert.equal(deriveSeason(1,"north-temperate"),"winter");
assert.equal(deriveSeason(1,"south-temperate"),"summer");
assert.equal(deriveSeason(7,"south-temperate"),"winter");
assert.equal(deriveSeason(4,"tropical"),"tropical");
assert.equal(deriveDayPhase(2),"night");
assert.equal(deriveDayPhase(7),"dawn");
assert.equal(deriveDayPhase(12),"day");
assert.equal(deriveDayPhase(19),"dusk");

const safePayload={
  source:"cloudflare-coarse",
  privacy:{exactCoordinatesReturned:false,cityReturned:false,gpsPermissionRequested:false},
  context:{timezone:"Europe/Paris",climateBand:"north-temperate"},
  weather:{status:"live",condition:"rain",intensity:0.42,attribution:{label:"Provider",url:"https://example.invalid"}}
};
const winter=ambientFromPayload(safePayload,{now:new Date("2026-01-15T12:00:00Z")});
assert.equal(winter.state,"CONTEXT_READY");
assert.equal(winter.season,"winter");
assert.equal(winter.weatherCondition,"rain");
assert.equal(winter.weatherIntensity,0.42);

const providerOff=ambientFromPayload({...safePayload,weather:{status:"not-connected",reason:"provider-not-configured"}},{now:new Date("2026-07-15T12:00:00Z")});
assert.equal(providerOff.season,"summer");
assert.equal(providerOff.weatherCondition,"off");
assert.equal(providerOff.weatherStatus,"not-connected");

const rejected=ambientFromPayload({...safePayload,privacy:{exactCoordinatesReturned:true,cityReturned:false,gpsPermissionRequested:false}});
assert.equal(rejected.state,"PRIVACY_REJECTED");
assert.equal(rejected.weatherCondition,"off");

let request=null;
const resolved=await resolveAmbientContext({
  now:new Date("2026-01-15T12:00:00Z"),
  fetchImpl:async(path,options)=>{
    request={path,options};
    return new Response(JSON.stringify(safePayload),{status:200,headers:{"content-type":"application/json"}});
  }
});
assert.equal(request.path,"/api/local-context");
assert.equal(request.options.credentials,"same-origin");
assert.equal(resolved.state,"CONTEXT_READY");

const client=fs.readFileSync("v2/src/api/local-context.js","utf8");
const app=fs.readFileSync("v2/src/App.jsx","utf8");
assert.equal(/navigator\.geolocation|watchPosition|getCurrentPosition/.test(client+app),false,"browser geolocation forbidden");
assert.equal(/api\.weatherapi\.com|open-meteo\.com|openweathermap/.test(client),false,"provider must remain server-side");

console.log("PASS_V2_AMBIENT_CONTEXT_CONTRACT");
