import assert from "node:assert/strict";
import fs from "node:fs";
import sqlite3 from "node:sqlite";
import {defaultNotificationPreferences,publicNotification,validateNotificationEvent,validateNotificationPreferences} from "../functions/_lib/notifications.mjs";

const db=new sqlite3.DatabaseSync(":memory:");
for(const p of ["migrations/0001_modaryx_dev_foundation.sql","migrations/0002_modaryx_auth_sessions.sql","migrations/0003_modaryx_moderation_publication.sql","migrations/0004_modaryx_v2_core_model.sql","migrations/0005_modaryx_v2_notifications.sql"]){
  db.exec(fs.readFileSync(p,"utf8"));
}
const tables=new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(x=>x.name));
for(const t of ["modaryx_v2_notification_events","modaryx_v2_notification_preferences"]) assert.ok(tables.has(t),t+" missing");

const valid=validateNotificationEvent({
  recipientIdentitySub:"auth0|member-1",eventType:"CONTENT_REVOKED",priority:"IMPORTANT",
  title:"Contenu retiré",summary:"Le contenu suivi n’est plus distribuable.",href:"/content/sentiers-de-laube",
  stateLabel:"REVOKED",affectedScopes:["web"],sourceKind:"content",sourceId:"mx_content_dawn",occurredAt:"2026-10-06T08:00:00Z"
});
assert.equal(valid.ok,true);
assert.equal(validateNotificationEvent({...valid.value,href:"https://evil.example"}).ok,false);
assert.equal(validateNotificationEvent({...valid.value,eventType:"FAKE_EVENT"}).ok,false);
assert.equal(validateNotificationEvent({...valid.value,privatePublisherEmail:"secret@example.com"}).ok,false);

const prefs=defaultNotificationPreferences();
assert.equal(prefs.marketing,false);
const p=validateNotificationPreferences({version:0,preferences:prefs});
assert.equal(p.ok,true);
assert.equal(validateNotificationPreferences({version:0,preferences:{...prefs,marketing:"yes"}}).ok,false);

const now="2026-10-06T08:00:00Z";
db.prepare(`INSERT INTO modaryx_v2_notification_events (
  event_id,recipient_identity_sub,event_type,priority,title,summary,href,state_label,
  affected_scopes_json,source_kind,source_id,occurred_at,read_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,NULL,?)`).run(
  "mx_notification_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","auth0|member-1","CONTENT_REVOKED","IMPORTANT",
  "Contenu retiré","Résumé","/content/sentiers-de-laube","REVOKED",'["web"]',
  "content","mx_content_dawn",now,now
);
assert.throws(()=>db.prepare(`INSERT INTO modaryx_v2_notification_events (
  event_id,recipient_identity_sub,event_type,priority,title,summary,href,state_label,
  affected_scopes_json,source_kind,source_id,occurred_at,read_at,created_at
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,NULL,?)`).run(
  "mx_notification_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","auth0|member-1","CONTENT_REVOKED","IMPORTANT",
  "Duplicate","Résumé","/content/sentiers-de-laube","REVOKED","[]","content","mx_content_dawn",now,now
));

const row=db.prepare("SELECT * FROM modaryx_v2_notification_events LIMIT 1").get();
assert.equal(publicNotification(row).affectedScopes[0],"web");

db.prepare(`INSERT INTO modaryx_v2_notification_preferences (
 identity_sub,product_enabled,community_enabled,creator_enabled,profile_enabled,rights_enabled,marketing_enabled,version,updated_at
) VALUES (?,?,?,?,?,?,?,?,?)`).run("auth0|member-1",1,1,1,1,1,0,1,now);
assert.equal(db.prepare("SELECT marketing_enabled FROM modaryx_v2_notification_preferences WHERE identity_sub=?").get("auth0|member-1").marketing_enabled,0);

console.log("PASS_V2_NOTIFICATIONS_INAPP_CANDIDATE");
