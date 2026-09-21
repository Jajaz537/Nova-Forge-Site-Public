import {getSessionIdentity} from './_lib/auth-session.mjs';
import {FOUNDER_PERMISSION, hasPermission, publicAuthoritySummary} from './_lib/access-control.mjs';
import {requireSameOrigin} from './_lib/api-security.mjs';
import {onRequestPost as decideModeration} from './api/v1/moderation/decisions.js';
import {onRequestPost as decideAppeal} from './api/v1/moderation/appeal-outcomes.js';

const PREVIEW_HOST = 'design-modaryx-premium-hd-20.nova-forge-site-public.pages.dev';

const HTML_HEADERS = {
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'cross-origin-resource-policy': 'same-origin',
  'x-robots-tag': 'noindex, nofollow, noarchive',
  'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function page({status = 200, authority = null, result = null, message = null} = {}) {
  const role = authority?.role || 'unknown';
  const capabilities = authority?.capabilities || {};
  const resultMarkup = result
    ? `<section class="result"><h2>Résultat de preuve</h2><pre>${escapeHtml(JSON.stringify(result, null, 2))}</pre></section>`
    : '';
  const messageMarkup = message ? `<p class="notice">${escapeHtml(message)}</p>` : '';

  return new Response(`<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MODARYX — preuve Fondateur DEV</title>
<style>
  :root{color-scheme:dark;font-family:Inter,system-ui,sans-serif;background:#0a0b0f;color:#f4f5f7}
  body{max-width:760px;margin:0 auto;padding:32px 20px 64px;background:#0a0b0f}
  main{display:grid;gap:18px}
  .card,.result{border:1px solid #2b2f39;border-radius:18px;padding:20px;background:#12141b}
  h1,h2{margin:0 0 10px}
  p{line-height:1.55;color:#c9ced8}
  ul{line-height:1.7}
  form{margin:14px 0 0}
  button{width:100%;padding:14px 18px;border-radius:12px;border:1px solid #555d6e;background:#202533;color:#fff;font-weight:700;cursor:pointer}
  button:focus-visible{outline:3px solid #fff;outline-offset:3px}
  pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#0b0d12;padding:14px;border-radius:12px}
  .notice{padding:12px 14px;border:1px solid #5e6470;border-radius:12px}
  .danger{font-size:.92rem;color:#f2b8b5}
</style>
</head>
<body>
<main>
  <section class="card">
    <h1>Preuve Fondateur DEV — temporaire</h1>
    <p>Surface strictement réservée au Preview MODARYX DEV. Aucun token, cookie ou secret n'est affiché.</p>
    <ul>
      <li>Rôle serveur : <strong>${escapeHtml(role)}</strong></li>
      <li>Administration : <strong>${capabilities.administration ? 'oui' : 'non'}</strong></li>
      <li>Modération : <strong>${capabilities.moderation ? 'oui' : 'non'}</strong></li>
      <li>Recours : <strong>${capabilities.appealsReview ? 'oui' : 'non'}</strong></li>
    </ul>
    ${messageMarkup}
  </section>

  <section class="card">
    <h2>Micro-preuve mutation modération</h2>
    <p>Crée un fixture DEV éphémère, appelle le vrai handler de décision avec la session HttpOnly, puis nettoie immédiatement les données de preuve.</p>
    <form method="post" action="/founder-proof-dev">
      <input type="hidden" name="proof" value="moderation">
      <button type="submit">Exécuter la preuve modération</button>
    </form>
  </section>

  <section class="card">
    <h2>Micro-preuve mutation recours</h2>
    <p>Crée un recours DEV éphémère, appelle le vrai handler d'issue de recours avec la session HttpOnly, puis nettoie immédiatement les données de preuve.</p>
    <form method="post" action="/founder-proof-dev">
      <input type="hidden" name="proof" value="appeals">
      <button type="submit">Exécuter la preuve recours</button>
    </form>
    <p class="danger">Cette surface doit être retirée dès que les deux preuves ont été acquises.</p>
  </section>
  ${resultMarkup}
</main>
</body>
</html>`, {status, headers: HTML_HEADERS});
}

function allowedPreview(request) {
  try {
    const url = new URL(request.url);
    return url.protocol === 'https:' && url.hostname === PREVIEW_HOST;
  } catch {
    return false;
  }
}

async function authorizeFounder(context) {
  if (!allowedPreview(context.request)) {
    return {ok:false, response:page({status:404, message:'Surface indisponible hors Preview DEV autorisé.'})};
  }

  const db = context.env?.MODARYX_DB;
  if (!db || typeof db.prepare !== 'function') {
    return {ok:false, response:page({status:503, message:'Binding D1 DEV indisponible.'})};
  }

  const identity = await getSessionIdentity(context.request, db);
  if (!identity) {
    return {ok:false, response:page({status:401, message:'Session MODARYX requise.'})};
  }
  if (!hasPermission(identity, FOUNDER_PERMISSION)) {
    return {ok:false, response:page({
      status:403,
      authority:publicAuthoritySummary(identity),
      message:'Permission Fondateur requise.'
    })};
  }

  return {
    ok:true,
    identity,
    authority:publicAuthoritySummary(identity),
    db
  };
}

function childRequest(request, pathname, payload) {
  const parent = new URL(request.url);
  const headers = new Headers({
    'content-type':'application/json',
    'origin':parent.origin
  });
  const cookie = request.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);
  return new Request(new URL(pathname, parent.origin), {
    method:'POST',
    headers,
    body:JSON.stringify(payload)
  });
}

function proofIds(prefix) {
  const uuid = crypto.randomUUID().toLowerCase();
  const short = uuid.replaceAll('-', '').slice(0, 12);
  return {
    profileId:`profile:founder-proof-${prefix}-${short}`,
    identitySub:`proof|founder|${prefix}|${uuid}`,
    handle:`proof-${prefix}-${short}`,
    submissionId:`submission-founder-proof-${prefix}-${uuid}`,
    decisionReceiptId:`moderation:${crypto.randomUUID().toLowerCase()}`,
    appealReceiptId:`moderation:${crypto.randomUUID().toLowerCase()}`
  };
}

async function seedProfileAndSubmission(db, ids, {
  moderationState='pending',
  publicationState='received',
  abuseState='passed'
} = {}) {
  const now = new Date().toISOString();
  await db.batch([
    db.prepare(
      `INSERT INTO modaryx_profiles (
        profile_id, identity_sub, handle, display_name, bio, visibility,
        creator_is_creator, links_json, collections_json, created_at, updated_at
      ) VALUES (?, ?, ?, 'Founder DEV proof', '', 'private', 0, '[]', '[]', ?, ?)`
    ).bind(ids.profileId, ids.identitySub, ids.handle, now, now),
    db.prepare(
      `INSERT INTO modaryx_community_submissions (
        submission_id, actor_profile_id, kind, target_id, title, body,
        rating, parent_submission_id, abuse_state, moderation_state,
        publication_state, created_at, updated_at
      ) VALUES (?, ?, 'discussion', 'founder-dev-proof', 'Founder DEV proof',
        'Temporary founder runtime proof fixture.', NULL, NULL, ?, ?, ?, ?, ?)`
    ).bind(
      ids.submissionId,
      ids.profileId,
      abuseState,
      moderationState,
      publicationState,
      now,
      now
    )
  ]);
  return now;
}

async function cleanupFixture(db, ids) {
  await db.batch([
    db.prepare('DELETE FROM modaryx_moderation_receipts WHERE submission_id = ?').bind(ids.submissionId),
    db.prepare('DELETE FROM modaryx_community_submissions WHERE submission_id = ?').bind(ids.submissionId),
    db.prepare('DELETE FROM modaryx_profiles WHERE profile_id = ?').bind(ids.profileId)
  ]);
}

async function responseSummary(response, kind) {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!payload || typeof payload !== 'object') {
    return {proof:kind, httpStatus:response.status, body:'non-json'};
  }

  if (payload.error) {
    return {proof:kind, httpStatus:response.status, error:String(payload.error)};
  }

  if (kind === 'moderation') {
    return {
      proof:kind,
      httpStatus:response.status,
      moderationState:payload.moderationState ?? null,
      publicationState:payload.publicationState ?? null,
      distributable:Boolean(payload.distributable),
      receiptCreated:Boolean(payload.moderationReceiptId)
    };
  }

  return {
    proof:kind,
    httpStatus:response.status,
    result:payload.result ?? null,
    moderationState:payload.moderationState ?? null,
    publicationState:payload.publicationState ?? null,
    distributable:Boolean(payload.distributable),
    receiptCreated:Boolean(payload.outcomeReceiptId)
  };
}

async function runModerationProof(context, access) {
  const ids = proofIds('moderation');
  let summary = null;
  let cleanupSucceeded = false;
  try {
    await seedProfileAndSubmission(access.db, ids);
    const request = childRequest(context.request, '/api/v1/moderation/decisions', {
      submissionId:ids.submissionId,
      outcome:'hold',
      category:'policy-violation',
      statementOfReasons:'Temporary DEV-only founder authorization proof.',
      ruleOrLegalBasis:'',
      automatedSignalUsed:false
    });
    const response = await decideModeration({request, env:context.env});
    summary = await responseSummary(response, 'moderation');
  } finally {
    try {
      await cleanupFixture(access.db, ids);
      cleanupSucceeded = true;
    } catch {
      cleanupSucceeded = false;
    }
  }
  return {...(summary || {proof:'moderation', httpStatus:500, error:'proof-runtime-failed'}), cleanupSucceeded};
}

async function runAppealsProof(context, access) {
  const ids = proofIds('appeals');
  let summary = null;
  let cleanupSucceeded = false;
  try {
    const now = await seedProfileAndSubmission(access.db, ids, {
      moderationState:'rejected',
      publicationState:'received',
      abuseState:'passed'
    });

    const decisionPayload = {
      schemaVersion:1,
      receiptId:ids.decisionReceiptId,
      receiptType:'decision',
      category:'policy-violation',
      createdAt:now
    };
    const appealPayload = {
      schemaVersion:1,
      receiptId:ids.appealReceiptId,
      receiptType:'appeal',
      category:'policy-violation',
      createdAt:now,
      appeal:{
        decisionReceiptId:ids.decisionReceiptId,
        grounds:'Temporary DEV-only founder authorization proof.',
        submittedAt:now,
        state:'submitted'
      }
    };

    await access.db.batch([
      access.db.prepare(
        `INSERT INTO modaryx_moderation_receipts (
          receipt_id, submission_id, receipt_type, category, payload_json,
          actor_key, recorded_by, previous_receipt_id, created_at
        ) VALUES (?, ?, 'decision', 'policy-violation', ?, 'proof:system', 'system', NULL, ?)`
      ).bind(ids.decisionReceiptId, ids.submissionId, JSON.stringify(decisionPayload), now),
      access.db.prepare(
        `INSERT INTO modaryx_moderation_receipts (
          receipt_id, submission_id, receipt_type, category, payload_json,
          actor_key, recorded_by, previous_receipt_id, created_at
        ) VALUES (?, ?, 'appeal', 'policy-violation', ?, 'proof:system', 'system', ?, ?)`
      ).bind(ids.appealReceiptId, ids.submissionId, JSON.stringify(appealPayload), ids.decisionReceiptId, now)
    ]);

    const request = childRequest(context.request, '/api/v1/moderation/appeal-outcomes', {
      appealReceiptId:ids.appealReceiptId,
      result:'upheld',
      reason:'Temporary DEV-only founder authorization proof.'
    });
    const response = await decideAppeal({request, env:context.env});
    summary = await responseSummary(response, 'appeals');
  } finally {
    try {
      await cleanupFixture(access.db, ids);
      cleanupSucceeded = true;
    } catch {
      cleanupSucceeded = false;
    }
  }
  return {...(summary || {proof:'appeals', httpStatus:500, error:'proof-runtime-failed'}), cleanupSucceeded};
}

export async function onRequestGet(context) {
  const access = await authorizeFounder(context);
  if (!access.ok) return access.response;
  return page({
    authority:access.authority,
    message:'Session Fondateur DEV reconnue. Les fixtures de preuve sont éphémères et nettoyées après chaque action.'
  });
}

export async function onRequestPost(context) {
  const access = await authorizeFounder(context);
  if (!access.ok) return access.response;

  const origin = requireSameOrigin(context.request);
  if (!origin.ok) {
    return page({status:origin.status, authority:access.authority, message:origin.reason});
  }

  let form;
  try {
    form = await context.request.formData();
  } catch {
    return page({status:400, authority:access.authority, message:'Formulaire de preuve invalide.'});
  }

  const proof = String(form.get('proof') || '');
  if (proof !== 'moderation' && proof !== 'appeals') {
    return page({status:400, authority:access.authority, message:'Action de preuve invalide.'});
  }

  let result;
  try {
    result = proof === 'moderation'
      ? await runModerationProof(context, access)
      : await runAppealsProof(context, access);
  } catch {
    result = {proof, httpStatus:500, error:'proof-runtime-failed'};
  }

  const ok = result.httpStatus >= 200 && result.httpStatus < 300 && result.receiptCreated === true && result.cleanupSucceeded === true;
  return page({
    status:ok ? 200 : result.httpStatus || 500,
    authority:access.authority,
    result,
    message:ok
      ? 'Mutation réelle exécutée avec la session Fondateur et nettoyage du fixture DEV confirmé.'
      : 'La preuve n’est pas acquise. Relever le résultat exact sans contourner la session.'
  });
}
