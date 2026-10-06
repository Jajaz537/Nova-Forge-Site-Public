import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {
  evaluateExternalDeliveryReadiness,
  notificationDeliveryProviderApprovalState,
  planExternalDelivery
} from "../functions/_lib/notification-delivery.mjs";

const contract=JSON.parse(fs.readFileSync("qa/modaryx-v2-notification-delivery-contract.json","utf8"));
assert.equal(contract.status,"DELIVERY_GUARD_CANDIDATE_PROVIDER_MISSING");
assert.equal(contract.remoteApplication,"NOT_EXECUTED");
assert.equal(contract.dispatchImplementation,"NOT_IMPLEMENTED");
assert.equal(contract.providerSelection,"NOT_SELECTED");
const inv=new Set(contract.invariants||[]);
for(const x of [
  "NO_NETWORK_DISPATCH","NO_PROVIDER_SELECTED_BY_THIS_CHANGE","NO_RAW_EMAIL_ADDRESS_IN_OUTBOX",
  "NO_RAW_PUSH_TOKEN_IN_OUTBOX","DESTINATION_REFERENCE_DIGEST_ONLY",
  "EMAIL_PUSH_BLOCKED_UNLESS_PROVIDER_STATE_CONFIGURED_PRODUCTION_APPROVED",
  "USER_PREFERENCE_REQUIRED","PROVIDER_PRODUCTION_APPROVAL_REQUIRED","PRODUCTION_BLOCKER_REMAINS_OPEN"
]) assert.ok(inv.has(x),"missing invariant "+x);

const disabledRegistry={connectors:{
  email:{provider:null,state:"NOT_IMPLEMENTED"},
  push:{provider:null,state:"NOT_IMPLEMENTED"}
}};
const disabled=evaluateExternalDeliveryReadiness(disabledRegistry);
assert.equal(disabled.email.available,false);
assert.equal(disabled.push.available,false);

const digest="a".repeat(64);
assert.deepEqual(
  planExternalDelivery({channel:"EMAIL",registry:disabledRegistry,preferenceEnabled:true,destinationRefDigestSha256:digest}),
  {ok:false,state:"BLOCKED",reason:"provider-not-implemented"}
);
assert.equal(planExternalDelivery({
  channel:"EMAIL",
  registry:{connectors:{email:{provider:"ExampleProvider",state:"CONFIGURED_NOT_PRODUCTION_APPROVED"}}},
  preferenceEnabled:true,destinationRefDigestSha256:digest
}).reason,"provider-not-production-approved");
assert.equal(planExternalDelivery({
  channel:"EMAIL",
  registry:{connectors:{email:{provider:"ExampleProvider",state:notificationDeliveryProviderApprovalState()}}},
  preferenceEnabled:false,destinationRefDigestSha256:digest
}).reason,"user-preference-disabled");
assert.equal(planExternalDelivery({
  channel:"PUSH",
  registry:{connectors:{push:{provider:"ExamplePush",state:notificationDeliveryProviderApprovalState()}}},
  preferenceEnabled:true,destinationRefDigestSha256:"raw-token-not-a-digest"
}).reason,"destination-ref-missing");

const approved=planExternalDelivery({
  channel:"PUSH",
  registry:{connectors:{push:{provider:"ExamplePush",state:notificationDeliveryProviderApprovalState()}}},
  preferenceEnabled:true,destinationRefDigestSha256:digest
});
assert.equal(approved.ok,true);
assert.equal(approved.state,"QUEUED");
assert.equal(approved.provider,"ExamplePush");

const db=new sqlite3.DatabaseSync(":memory:");
for(const p of [
  "migrations/0001_modaryx_dev_foundation.sql",
  "migrations/0002_modaryx_auth_sessions.sql",
  "migrations/0003_modaryx_moderation_publication.sql",
  "migrations/0004_modaryx_v2_core_model.sql",
  "migrations/0005_modaryx_v2_notifications.sql",
  "migrations/0006_modaryx_v2_data_history.sql",
  "migrations/0007_modaryx_v2_notification_delivery_outbox.sql"
]) db.exec(fs.readFileSync(p,"utf8"));

const now="2026-10-06T09:25:00Z";
db.prepare(`INSERT INTO modaryx_v2_notification_events (
  event_id,recipient_identity_sub,event_type,priority,title,summary,href,state_label,
  affected_scopes_json,source_kind,source_id,occurred_at,read_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,NULL,?)`).run(
  "mx_notification_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","auth0|member","MODERATION_UPDATE","IMPORTANT",
  "Mise à jour","Résumé","/community",null,"[]","moderation","moderation:receipt",now,now
);

db.prepare(`INSERT INTO modaryx_v2_notification_delivery_outbox (
 delivery_id,notification_event_id,owner_identity_sub,channel,state,provider_kind,
 destination_ref_digest_sha256,attempt_count,next_attempt_at,last_error_code,created_at,updated_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_delivery_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
 "mx_notification_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
 "auth0|member","EMAIL","BLOCKED",null,null,0,null,"provider-not-implemented",now,now
);

assert.throws(()=>db.prepare(`INSERT INTO modaryx_v2_notification_delivery_outbox (
 delivery_id,notification_event_id,owner_identity_sub,channel,state,provider_kind,
 destination_ref_digest_sha256,attempt_count,next_attempt_at,last_error_code,created_at,updated_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(
 "mx_delivery_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
 "mx_notification_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
 "auth0|member","PUSH","QUEUED",null,null,0,now,null,now,now
));

const source=fs.readFileSync("functions/_lib/notification-delivery.mjs","utf8");
for(const forbidden of ["fetch(","https://","resend.com","postmark","sendgrid","mailgun","vapid","firebase"]) {
  assert.equal(source.toLowerCase().includes(forbidden.toLowerCase()),false,"unexpected dispatch/provider code: "+forbidden);
}
const endpoint=fs.readFileSync("functions/api/v1/notifications/delivery/readiness.js","utf8");
assert.equal(/secret|token|emailAddress|pushToken/.test(endpoint),false,"readiness endpoint must not expose destination/secret fields");

console.log("PASS_V2_NOTIFICATION_DELIVERY_GUARD");
