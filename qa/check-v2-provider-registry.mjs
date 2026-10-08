import assert from "node:assert/strict";
import fs from "node:fs";
import {providerRegistryState} from "../functions/_lib/provider-registry.mjs";

const c=JSON.parse(fs.readFileSync("qa/modaryx-v2-provider-registry-contract.json","utf8"));
assert.equal(c.schemaVersion,1);
assert.equal(c.status,"IMPLEMENTED_CANDIDATE_PROVIDER_DIRECTION_RECORDED");
const inv=new Set(c.invariants||[]);
for(const x of ["NO_SECRET_VALUES_RETURNED","NO_PROVIDER_ACTIVATION_BY_THIS_CHANGE","WEATHER_PROVIDER_SERVER_SIDE_ONLY","EMAIL_PUSH_DISPATCH_REMAINS_NOT_IMPLEMENTED","TECHNICAL_CANDIDATE_SELECTION_NEVER_EQUALS_PRODUCTION_APPROVAL","PRODUCTION_APPROVAL_REMAINS_OPEN"]) assert.ok(inv.has(x),"missing invariant "+x);

assert.equal(c.notificationProviderCandidates.email.provider,"Cloudflare Email Service");
assert.equal(c.notificationProviderCandidates.push.provider,"Web Push standard + VAPID");
assert.match(c.notificationProviderCandidates.email.selectionState,/NOT_PRODUCTION_APPROVED/);
assert.match(c.notificationProviderCandidates.push.selectionState,/NOT_PRODUCTION_APPROVED/);
const empty=providerRegistryState({});
assert.equal(empty.connectors.weather.mode,"off");
assert.equal(empty.connectors.weather.configured,false);
assert.equal(empty.connectors.email.state,"NOT_IMPLEMENTED");
assert.equal(empty.connectors.push.state,"NOT_IMPLEMENTED");
assert.equal(empty.connectors.artifactStorage.configured,false);
assert.equal(empty.productionApproval,"OPEN");

const env={
  MODARYX_DB:{prepare(){}},
  MODARYX_ARTIFACTS:{get(){}},
  AUTH0_ISSUER_BASE_URL:"https://tenant.example/",
  AUTH0_AUDIENCE:"https://api.example/",
  AUTH0_CLIENT_ID:"client-id-secretish",
  AUTH0_CLIENT_SECRET:"super-client-secret",
  MODARYX_TURNSTILE_SECRET:"turnstile-secret",
  MODARYX_TURNSTILE_SITE_KEY:"public-site-key",
  MODARYX_WEATHER_MODE:"weatherapi",
  MODARYX_WEATHER_API_KEY:"weather-secret"
};
const ready=providerRegistryState(env);
assert.equal(ready.connectors.auth.configured,true);
assert.equal(ready.connectors.antiAbuse.configured,true);
assert.equal(ready.connectors.artifactStorage.configured,true);
assert.equal(ready.connectors.weather.configured,true);
assert.equal(ready.connectors.weather.provider,"WeatherAPI.com");
const serialized=JSON.stringify(ready);
for(const secret of ["super-client-secret","turnstile-secret","weather-secret","client-id-secretish","tenant.example"]) assert.equal(serialized.includes(secret),false,"secret/config identity leaked");
assert.equal(ready.privacy.secretsReturned,false);

const missingKey=providerRegistryState({MODARYX_WEATHER_MODE:"weatherapi"});
assert.equal(missingKey.connectors.weather.state,"CONFIG_MISSING");
assert.equal(missingKey.connectors.weather.configured,false);

const nonCommercial=providerRegistryState({MODARYX_WEATHER_MODE:"open-meteo-noncommercial"});
assert.equal(nonCommercial.connectors.weather.configured,true);
assert.equal(nonCommercial.connectors.weather.legalState,"NON_COMMERCIAL_ONLY");

const endpoint=fs.readFileSync("functions/api/v1/providers/status.js","utf8");
assert.equal(/AUTH0_CLIENT_SECRET|MODARYX_WEATHER_API_KEY|MODARYX_TURNSTILE_SECRET/.test(endpoint),false,"endpoint must not touch secret values directly");

const app=fs.readFileSync("v2/src/App.jsx","utf8");
assert.ok(app.includes("Providers & connecteurs"));
assert.ok(app.includes("Aucun provider n’est déclaré actif par défaut."));

console.log("PASS_V2_PROVIDER_REGISTRY_CANDIDATE");
