import {backendState, requireRemoteWriteFoundation} from './backend-config.mjs';
import {bearerToken, verifyAuth0AccessToken} from './auth0.mjs';
import {verifyTurnstile} from './turnstile.mjs';
import {clientIp, readJson, requireSameOrigin} from './api-security.mjs';
import {getSessionIdentity} from './auth-session.mjs';

const HANDLE_RE = /^[a-z0-9][a-z0-9._-]{2,31}$/;
const ID_RE = /^[a-z0-9][a-z0-9._-]{1,127}$/;
const VISIBILITY = new Set(['public','unlisted','private']);
const KINDS = new Set(['discussion','review','comment']);

function text(value, max, {required=false} = {}) {
  if (value === undefined || value === null) return required ? null : '';
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (required && !normalized) return null;
  if (normalized.length > max) return null;
  return normalized;
}

function httpsLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

export async function profileIdForSub(sub) {
  const bytes = new TextEncoder().encode(sub);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  const hex = [...digest].map((value) => value.toString(16).padStart(2,'0')).join('');
  return 'profile:' + hex.slice(0, 40);
}

export function validateProfilePayload(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {ok:false, reason:'profile-invalid'};
  const handle = typeof input.handle === 'string' ? input.handle.trim().toLowerCase() : '';
  if (!HANDLE_RE.test(handle)) return {ok:false, reason:'handle-invalid'};
  const displayName = text(input.displayName, 80, {required:true});
  if (!displayName) return {ok:false, reason:'display-name-invalid'};
  const bio = text(input.bio ?? '', 500);
  if (bio === null) return {ok:false, reason:'bio-invalid'};
  if (!VISIBILITY.has(input.visibility)) return {ok:false, reason:'visibility-invalid'};

  const creator = input.creator ?? {isCreator:false};
  if (!creator || typeof creator !== 'object' || typeof creator.isCreator !== 'boolean') {
    return {ok:false, reason:'creator-invalid'};
  }
  const creatorDisplayLabel = creator.displayLabel === undefined
    ? ''
    : text(creator.displayLabel, 80);
  if (creatorDisplayLabel === null) return {ok:false, reason:'creator-label-invalid'};

  const links = input.links ?? [];
  if (!Array.isArray(links) || links.length > 12) return {ok:false, reason:'links-invalid'};
  const normalizedLinks = [];
  const seen = new Set();
  for (const item of links) {
    if (!item || typeof item !== 'object') return {ok:false, reason:'link-invalid'};
    const label = text(item.label, 40, {required:true});
    const url = httpsLink(item.url);
    if (!label || !url) return {ok:false, reason:'link-invalid'};
    const signature = label + '\n' + url;
    if (seen.has(signature)) return {ok:false, reason:'link-duplicate'};
    seen.add(signature);
    normalizedLinks.push({label,url});
  }

  return {
    ok:true,
    value:{
      handle,
      displayName,
      bio,
      visibility:input.visibility,
      creator:{isCreator:creator.isCreator, displayLabel:creatorDisplayLabel || undefined},
      links:normalizedLinks
    }
  };
}

export function validateSubmissionPayload(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {ok:false, reason:'submission-invalid'};
  if (!KINDS.has(input.kind)) return {ok:false, reason:'kind-invalid'};
  const targetId = typeof input.targetId === 'string' ? input.targetId.trim().toLowerCase() : '';
  if (!ID_RE.test(targetId)) return {ok:false, reason:'target-invalid'};
  const body = text(input.body, 8000, {required:true});
  if (!body) return {ok:false, reason:'body-invalid'};

  const title = input.title === undefined ? '' : text(input.title, 180);
  if (title === null) return {ok:false, reason:'title-invalid'};
  const parentSubmissionId = input.parentSubmissionId === undefined
    ? ''
    : text(input.parentSubmissionId, 128);
  if (parentSubmissionId === null) return {ok:false, reason:'parent-invalid'};

  let rating = input.rating;
  if (rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return {ok:false, reason:'rating-invalid'};
  }

  if (input.kind === 'review') {
    if (!title || rating === undefined) return {ok:false, reason:'review-fields-required'};
    if (parentSubmissionId) return {ok:false, reason:'review-parent-forbidden'};
  } else if (input.kind === 'discussion') {
    if (!title) return {ok:false, reason:'discussion-title-required'};
    if (rating !== undefined || parentSubmissionId) return {ok:false, reason:'discussion-extra-fields-forbidden'};
  } else {
    if (!parentSubmissionId) return {ok:false, reason:'comment-parent-required'};
    if (title || rating !== undefined) return {ok:false, reason:'comment-extra-fields-forbidden'};
  }

  return {
    ok:true,
    value:{
      kind:input.kind,
      targetId,
      title:title || null,
      body,
      rating:rating ?? null,
      parentSubmissionId:parentSubmissionId || null
    }
  };
}

async function authenticateIdentity(context) {
  const state = backendState(context.env || {});
  if (!state.bindings.d1) return {ok:false, status:503, reason:'d1-binding-missing'};

  const session = await getSessionIdentity(context.request, context.env.MODARYX_DB);
  if (session) {
    return {
      ok:true,
      status:200,
      reason:null,
      authMethod:'session',
      identity:{
        sub:session.sub,
        scope:session.scope,
        permissions:session.permissions
      }
    };
  }

  if (!state.auth0.configured) return {ok:false, status:503, reason:'auth0-not-configured'};
  const token = bearerToken(context.request);
  if (!token) return {ok:false, status:401, reason:'authentication-required'};
  const verified = await verifyAuth0AccessToken({token, env:context.env});
  return verified.ok ? {...verified, authMethod:'bearer'} : verified;
}

export async function authenticateRead(context) {
  return authenticateIdentity(context);
}

export async function authorizeWrite(context, {action, maxBytes=20_000} = {}) {
  const origin = requireSameOrigin(context.request);
  if (!origin.ok) return origin;

  const foundation = requireRemoteWriteFoundation(context.env || {});
  if (!foundation.ok) return foundation;

  const identity = await authenticateIdentity(context);
  if (!identity.ok) return identity;

  const parsed = await readJson(context.request, maxBytes);
  if (!parsed.ok) return parsed;

  const turnstileToken = parsed.value?.turnstileToken;
  const hostname = typeof context.env.MODARYX_TURNSTILE_HOSTNAME === 'string'
    ? context.env.MODARYX_TURNSTILE_HOSTNAME.trim() || null
    : null;
  const turnstile = await verifyTurnstile({
    token:turnstileToken,
    env:context.env,
    remoteIp:clientIp(context.request),
    expectedHostname:hostname,
    expectedAction:action
  });
  if (!turnstile.ok) return turnstile;

  return {ok:true, status:200, reason:null, identity, body:parsed.value};
}
