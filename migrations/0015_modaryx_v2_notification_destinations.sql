PRAGMA foreign_keys = ON;

-- MODARYX V2 encrypted external-notification destination vault candidate.
-- Local/candidate migration only until an explicitly approved remote D1 apply.
-- Raw email addresses and raw push subscription values must never be stored in the outbox.

CREATE TABLE IF NOT EXISTS modaryx_v2_notification_destinations (
  destination_id TEXT PRIMARY KEY CHECK (destination_id GLOB 'mx_destination_*'),
  owner_identity_sub TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('EMAIL','PUSH')),
  provider_kind TEXT NOT NULL,
  destination_ref_digest_sha256 TEXT NOT NULL CHECK (length(destination_ref_digest_sha256)=64),
  ciphertext_b64 TEXT NOT NULL CHECK (length(ciphertext_b64) BETWEEN 16 AND 16384),
  iv_b64 TEXT NOT NULL CHECK (length(iv_b64) BETWEEN 12 AND 64),
  key_version INTEGER NOT NULL DEFAULT 1 CHECK (key_version >= 1),
  state TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (state IN ('ACTIVE','REVOKED')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  revoked_at TEXT,
  UNIQUE (owner_identity_sub, channel, destination_ref_digest_sha256),
  CHECK (
    (state='ACTIVE' AND revoked_at IS NULL)
    OR (state='REVOKED' AND revoked_at IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_notification_destinations_owner
  ON modaryx_v2_notification_destinations(owner_identity_sub, channel, state, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_notification_destinations_digest
  ON modaryx_v2_notification_destinations(destination_ref_digest_sha256, channel, state);
