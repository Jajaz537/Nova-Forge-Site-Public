import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  MODERATION_PERMISSION,
  authorizeModerator,
  buildModerationDecisionReceipt,
  moderationActorKey,
  moderationAuthMaxAgeSeconds,
  moderationTransition,
  validateModerationDecision
} from '../functions/_lib/moderation.mjs';
import {createSession, sessionCookie} from '../functions/_lib/auth-session.mjs';

class FakeStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql.replace(/\s+/g, ' ').trim();
    this.args = [];
  }
  bind(...args) { this.args = args; return this; }
  async run() {
    if (this.sql.startsWith('DELETE FROM modaryx_sessions WHERE expires_at <=')) {
      const [cutoff] = this.args;
      for (const [key,row] of this.db.sessions) {
        if (row.expires_at <= cutoff) this.db.sessions.delete(key);
      }
      return {success:true};
    }
    if (this.sql.startsWith('INSERT INTO modaryx_sessions')) {
      const [session_hash,identity_sub,scope_json,permissions_json,created_at,last_seen_at,expires_at] = this.args;
      this.db.sessions.set(session_hash,{
        session_hash,identity_sub,scope_json,permissions_json,created_at,last_seen_at,expires_at
      });
      return {success:true};
    }
    if (this.sql.startsWith('DELETE FROM modaryx_sessions WHERE session_hash =')) {
      this.db.sessions.delete(this.args[0]);
      return {success:true};
    }
    throw new Error('Unhandled run SQL: ' + this.sql);
  }
  async first() {
    if (this.sql.startsWith('SELECT identity_sub, scope_json, permissions_json, created_at, expires_at FROM modaryx_sessions')) {
      return this.db.sessions.get(this.args[0]) || null;
    }
    throw new Error('Unhandled first SQL: ' + this.sql);
  }
}
class FakeDb {
  constructor() { this.sessions = new Map(); }
  prepare(sql) { return new FakeStatement(this, sql); }
}

const checks = [];
assert.equal(MODERATION_PERMISSION,'community:moderate');
assert.equal(moderationAuthMaxAgeSeconds({}),900);
assert.equal(moderationAuthMaxAgeSeconds({MODARYX_PRIVILEGED_AUTH_MAX_AGE_SECONDS:'5'}),60);
assert.equal(moderationAuthMaxAgeSeconds({MODARYX_PRIVILEGED_AUTH_MAX_AGE_SECONDS:'9000'}),3600);
checks.push('Moderator actions use a dedicated permission and bounded recent-auth window');

const db = new FakeDb();
const nowMs = 1_800_000_000_000;
const moderatorSession = await createSession(db,{
  sub:'auth0|moderator-1',
  scope:['openid','profile'],
  permissions:['community:moderate']
},{},{nowMs});
const cookie = sessionCookie(moderatorSession.token, moderatorSession.ttl).split(';')[0];
const request = new Request('https://preview.example/api/v1/moderation/decisions',{
  method:'POST',
  headers:{
    cookie,
    origin:'https://preview.example',
    'content-type':'application/json'
  },
  body:JSON.stringify({
    submissionId:'submission-11111111-2222-4333-8444-555555555555',
    outcome:'publish',
    category:'policy-violation',
    statementOfReasons:'Contenu relu et accepté selon la politique courante.'
  })
});
let access = await authorizeModerator({request,env:{MODARYX_DB:db}},{
  requireRecentAuthentication:true,
  readBody:true,
  nowMs:nowMs + 60_000
});
assert.equal(access.ok,true);
assert.equal(access.identity.sub,'auth0|moderator-1');
assert.equal(access.body.outcome,'publish');

const staleRequest = new Request('https://preview.example/api/v1/moderation/decisions',{
  method:'POST',
  headers:{
    cookie,
    origin:'https://preview.example',
    'content-type':'application/json'
  },
  body:'{}'
});
access = await authorizeModerator({request:staleRequest,env:{MODARYX_DB:db}},{
  requireRecentAuthentication:true,
  readBody:true,
  nowMs:nowMs + 901_000
});
assert.equal(access.ok,false);
assert.equal(access.reason,'reauthentication-required');

const dbNoPermission = new FakeDb();
const userSession = await createSession(dbNoPermission,{
  sub:'auth0|user-1',
  scope:['openid'],
  permissions:[]
},{},{nowMs});
const userCookie = sessionCookie(userSession.token,userSession.ttl).split(';')[0];
const userRequest = new Request('https://preview.example/api/v1/moderation/queue',{headers:{cookie:userCookie}});
access = await authorizeModerator({request:userRequest,env:{MODARYX_DB:dbNoPermission}},{nowMs:nowMs+1000});
assert.equal(access.ok,false);
assert.equal(access.reason,'moderator-permission-required');
checks.push('Moderator access rejects missing permission and stale privileged sessions');

let decision = validateModerationDecision({
  submissionId:'submission-11111111-2222-4333-8444-555555555555',
  outcome:'publish',
  category:'policy-violation',
  statementOfReasons:'Accepté après revue humaine.',
  ruleOrLegalBasis:'community-policy-v1',
  automatedSignalUsed:false
});
assert.equal(decision.ok,true);
assert.equal(validateModerationDecision({...decision.value,outcome:'auto-publish'}).reason,'moderation-outcome-invalid');
assert.equal(validateModerationDecision({...decision.value,statementOfReasons:''}).reason,'statement-of-reasons-invalid');
checks.push('Moderation decisions are bounded and require explicit outcome, category and reasons');

const pending = {
  submission_id:'submission-11111111-2222-4333-8444-555555555555',
  kind:'discussion',
  abuse_state:'passed',
  moderation_state:'pending',
  publication_state:'received',
  created_at:'2026-09-21T00:00:00.000Z'
};
let transition = moderationTransition(pending,'publish');
assert.deepEqual(
  {
    moderationState:transition.moderationState,
    publicationState:transition.publicationState,
    distributable:transition.distributable,
    action:transition.action,
    scope:transition.scope
  },
  {
    moderationState:'accepted',
    publicationState:'published',
    distributable:true,
    action:'no-action',
    scope:'thread'
  }
);
transition = moderationTransition({...pending,publication_state:'published'},'hold');
assert.equal(transition.moderationState,'held-for-review');
assert.equal(transition.publicationState,'withdrawn');
assert.equal(transition.distributable,false);
transition = moderationTransition({...pending,publication_state:'published'},'reject');
assert.equal(transition.moderationState,'rejected');
assert.equal(transition.publicationState,'withdrawn');
assert.equal(moderationTransition({...pending,abuse_state:'blocked'},'publish').reason,'abuse-state-not-passed');
checks.push('Publication requires passed abuse state; hold/reject withdraw already-published content');

const receiptId='moderation:11111111-2222-4333-8444-555555555555';
const receipt = buildModerationDecisionReceipt({
  receiptId,
  submission:pending,
  decision:decision.value,
  transition:moderationTransition(pending,'publish'),
  previousReceiptId:null,
  now:'2026-09-21T00:05:00.000Z'
});
assert.equal(receipt.receiptType,'decision');
assert.equal(receipt.decision.humanDecision,true);
assert.equal(receipt.provenance.recordedBy,'moderator');
assert.equal(receipt.provenance.previousReceiptId,null);
assert.match(await moderationActorKey('auth0|moderator-1'),/^moderator:[a-f0-9]{40}$/);
checks.push('Decision receipts are immutable-shaped and moderator identities are pseudonymized');

const migration=fs.readFileSync(new URL('../migrations/0003_modaryx_moderation_publication.sql',import.meta.url),'utf8');
for(const token of [
  'CREATE TABLE IF NOT EXISTS modaryx_moderation_receipts',
  'receipt_id TEXT PRIMARY KEY',
  "receipt_type IN ('decision', 'appeal', 'appeal-outcome')",
  'payload_json TEXT NOT NULL',
  'actor_key TEXT NOT NULL',
  'previous_receipt_id TEXT',
  'FOREIGN KEY (submission_id) REFERENCES modaryx_community_submissions(submission_id)'
]) assert.ok(migration.includes(token),'moderation migration invariant missing: '+token);

const queue=fs.readFileSync(new URL('../functions/api/v1/moderation/queue.js',import.meta.url),'utf8');
const decisions=fs.readFileSync(new URL('../functions/api/v1/moderation/decisions.js',import.meta.url),'utf8');
const publicFeed=fs.readFileSync(new URL('../functions/api/v1/community/public.js',import.meta.url),'utf8');
const submission=fs.readFileSync(new URL('../functions/api/v1/community/submissions.js',import.meta.url),'utf8');
const securitySchema=fs.readFileSync(new URL('../schemas/account-security.schema.json',import.meta.url),'utf8');

for(const token of [
  'authorizeModerator(context)',
  "s.moderation_state IN ('pending','held-for-review')",
  'ORDER BY s.created_at ASC'
]) assert.ok(queue.includes(token),'moderation queue invariant missing: '+token);

for(const token of [
  'requireRecentAuthentication:true',
  "receiptId = 'moderation:' + crypto.randomUUID()",
  'modaryx_moderation_receipts',
  'db.batch([',
  'moderation_state = ?, publication_state = ?'
]) assert.ok(decisions.includes(token),'moderation decisions invariant missing: '+token);

for(const token of [
  "s.abuse_state = 'passed'",
  "s.moderation_state = 'accepted'",
  "s.publication_state = 'published'",
  "row.profile_visibility === 'public'"
]) assert.ok(publicFeed.includes(token),'public community endpoint invariant missing: '+token);

assert.ok(submission.includes("'passed', 'pending', 'received'"));
assert.ok(!submission.includes("'passed', 'accepted', 'published'"));
assert.ok(securitySchema.includes('"moderate"'));
assert.ok(securitySchema.includes('"publish"'));
assert.ok(securitySchema.includes('"reauthenticationRequired":{"const":true}'));
checks.push('Queue, decisions and public feed preserve no-auto-publish and privileged-action reauthentication boundaries');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_MODERATION_PUBLICATION_ENGINE',
  result:'PASS',
  scope:'Moderation/publication engine source and local contract proof only; no D1 0003 migration, Auth0 moderator permission or live moderation decision is claimed',
  checks,
  failures:[]
},null,2));
