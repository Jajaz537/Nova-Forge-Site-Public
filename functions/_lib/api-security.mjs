const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'cross-origin-resource-policy': 'same-origin'
};

export function json(value, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {...JSON_HEADERS, ...extraHeaders}
  });
}

export function requireSameOrigin(request) {
  const origin = request?.headers?.get?.('origin');
  if (!origin) return {ok:false, status:403, reason:'origin-required'};
  let expected;
  try {
    expected = new URL(request.url).origin;
  } catch {
    return {ok:false, status:400, reason:'request-url-invalid'};
  }
  if (origin !== expected) return {ok:false, status:403, reason:'origin-mismatch'};
  return {ok:true, status:200, reason:null};
}

export async function readJson(request, maxBytes = 20_000) {
  const type = request?.headers?.get?.('content-type') || '';
  if (!/^application\/json(?:\s*;|$)/i.test(type)) {
    return {ok:false, status:415, reason:'content-type-invalid'};
  }
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) {
    return {ok:false, status:413, reason:'body-too-large'};
  }

  let text;
  try {
    text = await request.text();
  } catch {
    return {ok:false, status:400, reason:'body-read-failed'};
  }
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return {ok:false, status:413, reason:'body-too-large'};
  }
  try {
    return {ok:true, status:200, reason:null, value:JSON.parse(text)};
  } catch {
    return {ok:false, status:400, reason:'json-invalid'};
  }
}

export function clientIp(request) {
  const value = request?.headers?.get?.('cf-connecting-ip');
  return typeof value === 'string' && value.length <= 64 ? value : null;
}
