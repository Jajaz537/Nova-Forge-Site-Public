import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {
  listNotificationDestinations,
  notificationDestinationDigest,
  notificationDestinationKeyVersion,
  notificationDestinationProviders,
  normalizeNotificationDestination,
  registerNotificationDestination,
  resolveNotificationDestination,
  revokeNotificationDestination
} from "../functions/_lib/notification-destinations.mjs";

const contract=JSON.parse(fs.readFileSync("qa/modaryx-v2-notification-destination-vault-contract.json","utf8"));
assert.equal(contract.status,"ENCRYPTED_DESTINATION_VAULT_CANDIDATE_LOCAL_PROOF");
assert.equal(contract.remoteApplication,"NOT_EXECUTED");
assert.equal(contract.networkDispatch,"NOT_IMPLEMENTED");
assert.equal(contract.keyAlgorithm,"AES-256-GCM");
assert.equal(notificationDestinationKeyVersion(),1);
assert.deepEqual(notificationDestinationProviders(),{
  EMAIL:"Cloudflare Email Service",
  PUSH:"Web Push standard + VAPID"
});
const inv=new Set(contract.invariants||[]);
for(const x of [
  "RAW_EMAIL_NEVER_STORED_IN_OUTBOX","RAW_PUSH_SUBSCRIPTION_NEVER_STORED_IN_OUTBOX",
  "VAULT_DESTINATION_ENCRYPTED_AT_REST","AES_GCM_256_KEY_FROM_SECRET_ONLY",
  "PUBLIC_API_NEVER_RETURNS_DESTINATION_CIPHERTEXT_OR_DIGEST",
  "REVOKED_DESTINATION_CANNOT_RESOLVE","NO_NETWORK_DISPATCH_BY_THIS_SLICE",
  "NO_REMOTE_D1_APPLY","NO_PROVIDER_ACTIVATION","NO_CUTOVER"
]) assert.ok(inv.has(x),"missing invariant "+x);

const db=new sqlite3.DatabaseSync(":memory:");
for(const p of [
  "migrations/0001_modaryx_dev_foundation.sql",
  "migrations/0002_modaryx_auth_sessions.sql",
  "migrations/0003_modaryx_moderation_publication.sql",
  "migrations/0004_modaryx_v2_core_model.sql",
  "migrations/0005_modaryx_v2_notifications.sql",
  "migrations/0006_modaryx_v2_data_history.sql",
  "migrations/0007_modaryx_v2_notification_delivery_outbox.sql",
  "migrations/0008_modaryx_v2_game_rights_registry.sql",
  "migrations/0009_modaryx_v2_game_support_requests.sql",
  "migrations/0010_modaryx_v2_rights_evidence.sql",
  "migrations/0011_modaryx_v2_publisher_outbound_readiness.sql",
  "migrations/0012_modaryx_v2_publisher_inbound_quarantine.sql",
  "migrations/0013_modaryx_v2_authorizing_decision_audit.sql",
  "migrations/0014_modaryx_v2_cwv_rum.sql",
  "migrations/0015_modaryx_v2_notification_destinations.sql"
]) db.exec(fs.readFileSync(p,"utf8"));

function d1(db){
  return {
    prepare(sql){
      const statement=db.prepare(sql);
      let args=[];
      return {
        bind(...values){args=values;return this;},
        async run(){const info=statement.run(...args);return {success:true,meta:{changes:Number(info.changes||0)}};},
        async first(){return statement.get(...args)||null;},
        async all(){return {results:statement.all(...args)};}
      };
    }
  };
}

const key=Buffer.alloc(32,0x5a).toString("base64");
const env={MODARYX_DB:d1(db),MODARYX_NOTIFICATION_DESTINATION_KEY_B64:key};
const owner="auth0|member-123";
const rawEmail="Owner.Example@Example.COM";
const emailNormalized=normalizeNotificationDestination("EMAIL",rawEmail);
assert.equal(emailNormalized.ok,true);
assert.equal(emailNormalized.value.email,"Owner.Example@example.com");
assert.equal(normalizeNotificationDestination("EMAIL","not-an-email").ok,false);
assert.equal(normalizeNotificationDestination("PUSH",{endpoint:"http://unsafe.example",keys:{p256dh:"a".repeat(40),auth:"b".repeat(16)}}).ok,false);

const emailDigest=await notificationDestinationDigest("EMAIL",rawEmail);
assert.equal(emailDigest.ok,true);
assert.match(emailDigest.digest,/^[a-f0-9]{64}$/);

const emailReg=await registerNotificationDestination(env,{ownerIdentitySub:owner,channel:"EMAIL",destination:rawEmail});
assert.equal(emailReg.ok,true);
assert.equal(emailReg.destination.channel,"EMAIL");
assert.equal(emailReg.destination.provider,"Cloudflare Email Service");
assert.equal("digest" in emailReg.destination,false);
assert.equal("ciphertext" in emailReg.destination,false);

const row=db.prepare("SELECT * FROM modaryx_v2_notification_destinations WHERE channel='EMAIL'").get();
assert.ok(row);
assert.equal(row.destination_ref_digest_sha256,emailDigest.digest);
assert.equal(JSON.stringify(row).includes(rawEmail),false,"raw email leaked into vault row");
assert.equal(row.ciphertext_b64.includes("Owner.Example"),false,"email leaked into ciphertext");

const emailResolved=await resolveNotificationDestination(env,{
  ownerIdentitySub:owner,channel:"EMAIL",destinationRefDigestSha256:emailDigest.digest
});
assert.equal(emailResolved.ok,true);
assert.equal(emailResolved.destination.email,"Owner.Example@example.com");

const push={
  endpoint:"https://push.example.test/subscription/abc?token=secret-capability",
  keys:{p256dh:"A".repeat(64),auth:"B".repeat(24)}
};
const pushDigest=await notificationDestinationDigest("PUSH",push);
assert.equal(pushDigest.ok,true);
const pushReg=await registerNotificationDestination(env,{ownerIdentitySub:owner,channel:"PUSH",destination:push});
assert.equal(pushReg.ok,true);
assert.equal(pushReg.destination.provider,"Web Push standard + VAPID");
const pushRow=db.prepare("SELECT * FROM modaryx_v2_notification_destinations WHERE channel='PUSH'").get();
assert.equal(JSON.stringify(pushRow).includes("push.example.test"),false,"raw push endpoint leaked into vault row");
assert.equal(JSON.stringify(pushRow).includes("secret-capability"),false,"raw push capability leaked into vault row");

const listed=await listNotificationDestinations(env,{ownerIdentitySub:owner});
assert.equal(listed.ok,true);
assert.equal(listed.destinations.length,2);
for(const item of listed.destinations){
  assert.equal("ciphertext_b64" in item,false);
  assert.equal("destination_ref_digest_sha256" in item,false);
  assert.equal("destination" in item,false);
}

const revoke=await revokeNotificationDestination(env,{ownerIdentitySub:owner,destinationId:pushReg.destination.destinationId});
assert.equal(revoke.ok,true);
assert.equal(revoke.destination.state,"REVOKED");
const afterRevoke=await resolveNotificationDestination(env,{
  ownerIdentitySub:owner,channel:"PUSH",destinationRefDigestSha256:pushDigest.digest
});
assert.equal(afterRevoke.ok,false);
assert.equal(afterRevoke.reason,"destination-not-active");

const wrongKey={...env,MODARYX_NOTIFICATION_DESTINATION_KEY_B64:Buffer.alloc(32,0x33).toString("base64")};
const wrong=await resolveNotificationDestination(wrongKey,{
  ownerIdentitySub:owner,channel:"EMAIL",destinationRefDigestSha256:emailDigest.digest
});
assert.equal(wrong.ok,false);
assert.equal(wrong.reason,"destination-decryption-failed");

const missingKey=await registerNotificationDestination(
  {MODARYX_DB:env.MODARYX_DB},
  {ownerIdentitySub:owner,channel:"EMAIL",destination:"x@example.com"}
);
assert.equal(missingKey.ok,false);
assert.equal(missingKey.reason,"destination-vault-key-missing");

const source=fs.readFileSync("functions/_lib/notification-destinations.mjs","utf8");
for(const forbidden of ["fetch(","https://api.cloudflare.com","resend.com","firebase","onesignal"]){
  assert.equal(source.toLowerCase().includes(forbidden.toLowerCase()),false,"unexpected dispatch code "+forbidden);
}
const api=fs.readFileSync("functions/api/v1/notifications/destinations.js","utf8");
assert.ok(api.includes("authorizeWrite"));
assert.ok(api.includes("notification-destination-write"));
assert.ok(api.includes("notification-destination-revoke"));
assert.equal(api.includes("MODARYX_NOTIFICATION_DESTINATION_KEY_B64"),false,"endpoint must not access key directly");

console.log("DESTINATION_VAULT_ROWS",db.prepare("SELECT count(*) AS n FROM modaryx_v2_notification_destinations").get().n);
console.log("PASS_V2_NOTIFICATION_DESTINATION_VAULT");


const registry=JSON.parse(fs.readFileSync("qa/modaryx-v2-preproduction-contract-registry.json","utf8"));
const registryEntry=registry.contracts.find(x=>x.id==="notification-destination-vault-candidate");
assert.ok(registryEntry,"destination vault contract missing from registry");
assert.equal(registryEntry.contract,"qa/modaryx-v2-notification-destination-vault-contract.json");
assert.equal(registryEntry.checker,"qa/check-v2-notification-destination-vault.mjs");
assert.equal(registryEntry.source,"docs/MODARYX-V2-NOTIFICATION-DESTINATION-VAULT-20261006.md");
assert.ok(fs.existsSync(registryEntry.source),"destination vault source doc missing");

const migrationManifest=JSON.parse(fs.readFileSync("qa/modaryx-v2-d1-migration-execution-manifest.json","utf8"));
assert.equal(migrationManifest.sequence.length,15);
assert.equal(migrationManifest.sequence.at(-1).migration,"0015");
assert.equal(migrationManifest.sequence.at(-1).gitBlobSha1,"a4bb420908bca57992e9549024748d838b9103cc");
assert.equal(migrationManifest.expectedCurrentV2TableCount,32);

const readinessContract=JSON.parse(fs.readFileSync("qa/modaryx-v2-production-readiness-contract.json","utf8"));
assert.equal(readinessContract.requiredCurrentV2TableCount,32);
