import assert from "node:assert/strict";
import fs from "node:fs";
import {appealOutcomeNotification, moderationDecisionNotification, validateNotificationEvent} from "../functions/_lib/notifications.mjs";

const common={recipientIdentitySub:"auth0|author-1",submissionId:"submission-11111111-2222-4333-8444-555555555555",receiptId:"moderation:11111111-2222-4333-8444-555555555555",occurredAt:"2026-10-06T08:45:00Z"};
for(const outcome of ["publish","hold","reject"]){
  const n=moderationDecisionNotification({...common,outcome,moderationState:outcome==="publish"?"accepted":outcome==="hold"?"held-for-review":"rejected"});
  assert.ok(n);
  assert.equal(n.recipientIdentitySub,"auth0|author-1");
  assert.equal(n.eventType,"MODERATION_UPDATE");
  assert.equal(n.sourceKind,"moderation");
  assert.equal(validateNotificationEvent(n).ok,true);
}
assert.equal(moderationDecisionNotification({...common,outcome:"fake",moderationState:"pending"}),null);

for(const result of ["upheld","modified","reversed"]){
  const n=appealOutcomeNotification({...common,result,moderationState:result==="reversed"?"accepted":"rejected"});
  assert.ok(n);
  assert.equal(n.href,"/community");
  assert.equal(validateNotificationEvent(n).ok,true);
}
assert.equal(appealOutcomeNotification({...common,result:"fake",moderationState:"rejected"}),null);

const decisions=fs.readFileSync("functions/api/v1/moderation/decisions.js","utf8");
const appeals=fs.readFileSync("functions/api/v1/moderation/appeal-outcomes.js","utf8");
for(const [name,source] of [["decisions",decisions],["appeals",appeals]]){
  assert.ok(source.includes("actor_identity_sub"),name+" owner identity mapping missing");
  assert.ok(source.includes("recordInAppNotification"),name+" notification producer missing");
  assert.ok(source.includes("LEFT JOIN modaryx_profiles"),name+" owner join missing");
}
assert.ok(decisions.indexOf("await recordInAppNotification")>decisions.indexOf("await db.batch"),"moderation notification must be fail-soft after decision write");
assert.ok(appeals.indexOf("await recordInAppNotification")>appeals.indexOf("await db.batch"),"appeal notification must be fail-soft after outcome write");

console.log("PASS_V2_MODERATION_NOTIFICATION_PRODUCERS");
