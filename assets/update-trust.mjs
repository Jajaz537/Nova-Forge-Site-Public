const encoder = new TextEncoder();
const SHA256_RE = /^[0-9a-f]{64}$/;

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function canonicalText(value) {
  return JSON.stringify(canonicalize(value));
}

function base64UrlToBytes(value) {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(padded, 'base64'));
  const raw = atob(padded);
  return Uint8Array.from(raw, (ch) => ch.charCodeAt(0));
}

async function sha256HexText(text) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function signedEnvelope(metadata) {
  return {
    role: metadata.role,
    version: metadata.version,
    issuedAt: metadata.issuedAt,
    expires: metadata.expires,
    signed: metadata.signed
  };
}

export async function metadataDigest(metadata) {
  return sha256HexText(canonicalText(signedEnvelope(metadata)));
}

async function verifyRole(metadata, roleName, trustRole, nowMs, minimumVersion) {
  if (!metadata || metadata.role !== roleName) throw new Error(`${roleName}-role-mismatch`);
  if (!Number.isSafeInteger(metadata.version) || metadata.version < 1) throw new Error(`${roleName}-version-invalid`);
  if (metadata.version < minimumVersion) throw new Error(`${roleName}-rollback-detected`);
  const issuedMs = Date.parse(metadata.issuedAt);
  const expiresMs = Date.parse(metadata.expires);
  if (!Number.isFinite(issuedMs) || !Number.isFinite(expiresMs) || issuedMs > nowMs + 300000 || expiresMs <= issuedMs) {
    throw new Error(`${roleName}-time-window-invalid`);
  }
  if (expiresMs <= nowMs) throw new Error(`${roleName}-expired`);
  if (roleName === 'timestamp' && expiresMs - issuedMs > 48 * 60 * 60 * 1000) throw new Error('timestamp-lifetime-too-long');

  if (!trustRole || !Number.isSafeInteger(trustRole.threshold) || trustRole.threshold < 1 || !Array.isArray(trustRole.keys)) {
    throw new Error(`${roleName}-trust-config-invalid`);
  }
  const authorized = new Map(trustRole.keys.map((key) => [key.keyId, key]));
  const signatures = Array.isArray(metadata.signatures) ? metadata.signatures : [];
  const data = encoder.encode(canonicalText(signedEnvelope(metadata)));
  const validKeyIds = new Set();

  for (const signature of signatures) {
    const key = authorized.get(signature?.keyId);
    if (!key || validKeyIds.has(key.keyId)) continue;
    if (key.algorithm !== 'ECDSA-P256-SHA256' || !key.publicKeyJwk) continue;
    try {
      const publicKey = await crypto.subtle.importKey(
        'jwk',
        key.publicKeyJwk,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      );
      const ok = await crypto.subtle.verify(
        { name: 'ECDSA', hash: 'SHA-256' },
        publicKey,
        base64UrlToBytes(signature.signature),
        data
      );
      if (ok) validKeyIds.add(key.keyId);
    } catch {
      // Invalid keys/signatures stay invalid.
    }
  }

  if (validKeyIds.size < trustRole.threshold) throw new Error(`${roleName}-signature-threshold-not-met`);
}

function validateRoleSeparation(trust) {
  const roleNames = ['timestamp', 'snapshot', 'targets'];
  const seen = new Map();
  for (const role of roleNames) {
    const config = trust?.roles?.[role];
    if (!config) throw new Error(`trust-role-missing:${role}`);
    for (const key of config.keys || []) {
      if (!key?.keyId) throw new Error(`trust-key-id-missing:${role}`);
      if (seen.has(key.keyId) && seen.get(key.keyId) !== role) throw new Error(`trust-key-role-reuse:${key.keyId}`);
      seen.set(key.keyId, role);
    }
  }
}

export async function verifyUpdateMetadataChain({ trust, metadata, trustedVersions = {}, now = Date.now() }) {
  if (trust?.schema !== 'nova-forge-update-trust/v1') throw new Error('trust-schema-invalid');
  validateRoleSeparation(trust);
  const timestamp = metadata?.timestamp;
  const snapshot = metadata?.snapshot;
  const targets = metadata?.targets;

  await verifyRole(timestamp, 'timestamp', trust.roles.timestamp, now, trustedVersions.timestamp || 1);
  await verifyRole(snapshot, 'snapshot', trust.roles.snapshot, now, trustedVersions.snapshot || 1);
  await verifyRole(targets, 'targets', trust.roles.targets, now, trustedVersions.targets || 1);

  const snapshotDigest = await metadataDigest(snapshot);
  const targetsDigest = await metadataDigest(targets);
  const tsLink = timestamp?.signed?.snapshot;
  const snapLink = snapshot?.signed?.targets;
  if (!tsLink || tsLink.version !== snapshot.version || !SHA256_RE.test(String(tsLink.sha256 || '')) || tsLink.sha256 !== snapshotDigest) {
    throw new Error('timestamp-snapshot-binding-invalid');
  }
  if (!snapLink || snapLink.version !== targets.version || !SHA256_RE.test(String(snapLink.sha256 || '')) || snapLink.sha256 !== targetsDigest) {
    throw new Error('snapshot-targets-binding-invalid');
  }
  if (!Array.isArray(targets?.signed?.artifacts)) throw new Error('targets-artifacts-invalid');

  return {
    verified: true,
    versions: {
      timestamp: timestamp.version,
      snapshot: snapshot.version,
      targets: targets.version
    },
    targetsDigest
  };
}

export { canonicalText };
