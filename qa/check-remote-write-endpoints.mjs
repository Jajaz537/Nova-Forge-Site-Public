import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  profileIdForSub,
  validateProfilePayload,
  validateSubmissionPayload
} from '../functions/_lib/remote-write.mjs';
import {readJson, requireSameOrigin} from '../functions/_lib/api-security.mjs';

const checks=[];

let origin=requireSameOrigin(new Request('https://preview.example/api', {
  method:'POST',
  headers:{origin:'https://preview.example'}
}));
assert.equal(origin.ok,true);
origin=requireSameOrigin(new Request('https://preview.example/api', {
  method:'POST',
  headers:{origin:'https://evil.example'}
}));
assert.equal(origin.ok,false);
assert.equal(origin.reason,'origin-mismatch');
origin=requireSameOrigin(new Request('https://preview.example/api', {method:'POST'}));
assert.equal(origin.reason,'origin-required');
checks.push('State-changing requests are same-origin only');

let parsed=await readJson(new Request('https://preview.example/api', {
  method:'POST',
  headers:{'content-type':'application/json'},
  body:JSON.stringify({hello:'world'})
}),1000);
assert.equal(parsed.ok,true);
assert.equal(parsed.value.hello,'world');
parsed=await readJson(new Request('https://preview.example/api', {
  method:'POST',
  headers:{'content-type':'text/plain'},
  body:'{}'
}),1000);
assert.equal(parsed.status,415);
checks.push('Remote JSON parsing enforces content type and bounded body size');

const profileId1=await profileIdForSub('auth0|user-123');
const profileId2=await profileIdForSub('auth0|user-123');
assert.equal(profileId1,profileId2);
assert.match(profileId1,/^profile:[a-f0-9]{40}$/);
assert.ok(!profileId1.includes('user-123'));
checks.push('Public profile IDs are stable hashes and do not expose the identity subject');

let profile=validateProfilePayload({
  handle:'Creator.One',
  displayName:'Creator One',
  bio:'Bio',
  visibility:'public',
  creator:{isCreator:true,displayLabel:'Creator'},
  links:[{label:'Site',url:'https://example.com/path'}]
});
assert.equal(profile.ok,true);
assert.equal(profile.value.handle,'creator.one');
assert.equal(profile.value.links[0].url,'https://example.com/path');
assert.equal(validateProfilePayload({...profile.value,handle:'../bad'}).ok,false);
assert.equal(validateProfilePayload({...profile.value,links:[{label:'x',url:'http://example.com'}]}).ok,false);
checks.push('Profile payloads enforce bounded identity fields, visibility and HTTPS public links');

let submission=validateSubmissionPayload({
  kind:'review',targetId:'project-one',title:'Review',body:'Useful',rating:5
});
assert.equal(submission.ok,true);
assert.equal(validateSubmissionPayload({
  kind:'review',targetId:'project-one',body:'Missing fields'
}).reason,'review-fields-required');
assert.equal(validateSubmissionPayload({
  kind:'discussion',targetId:'project-one',title:'Topic',body:'Body',rating:5
}).reason,'discussion-extra-fields-forbidden');
assert.equal(validateSubmissionPayload({
  kind:'comment',targetId:'project-one',body:'Comment'
}).reason,'comment-parent-required');
assert.equal(validateSubmissionPayload({
  kind:'comment',targetId:'project-one',body:'Comment',parentSubmissionId:'parent-1'
}).ok,true);
checks.push('Community payload variants preserve review/discussion/comment field invariants');

const profileSource=fs.readFileSync(new URL('../functions/api/v1/profile.js',import.meta.url),'utf8');
const publicSource=fs.readFileSync(new URL('../functions/api/v1/profiles/[handle].js',import.meta.url),'utf8');
const submissionSource=fs.readFileSync(new URL('../functions/api/v1/community/submissions.js',import.meta.url),'utf8');

for(const token of [
  "authorizeWrite(context, {action:'profile-write'",
  'ON CONFLICT(identity_sub) DO UPDATE SET',
  "return json({error:'profile-write-conflict'}, 409)"
]) assert.ok(profileSource.includes(token),'profile endpoint invariant missing: '+token);

for(const token of [
  "WHERE handle = ? AND visibility = 'public'",
  "return json({error:'d1-binding-missing'}, 503)"
]) assert.ok(publicSource.includes(token),'public profile endpoint invariant missing: '+token);

for(const token of [
  "authorizeWrite(context, {action:'community-write'",
  "'passed', 'pending', 'received'",
  "publicationState:'received'",
  "distributable:false",
  "return json({error:'profile-required'}, 409)"
]) assert.ok(submissionSource.includes(token),'community endpoint invariant missing: '+token);

assert.ok(!submissionSource.includes("publicationState:'published'"));
assert.ok(!submissionSource.includes("'passed', 'accepted', 'published'"));
checks.push('Remote submissions are never auto-published and stay moderation-pending');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_REMOTE_WRITE_ENDPOINTS',
  result:'PASS',
  scope:'Endpoint source/validation proof only; no real Auth0 tenant, D1, Turnstile or remote network write is claimed',
  checks,
  failures:[]
},null,2));
