PRAGMA foreign_keys = ON;

-- MODARYX V2 external notification delivery outbox candidate.
-- Not applied remotely by this change.
-- No provider, destination address or network dispatch is enabled here.

CREATE TABLE IF NOT EXISTS modaryx_v2_notification_delivery_outbox (
  delivery_id TEXT PRIMARY KEY CHECK (delivery_id GLOB 'mx_delivery_*'),
  notification_event_id TEXT NOT NULL,
  owner_identity_sub TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('EMAIL','PUSH')),
  state TEXT NOT NULL CHECK (state IN ('BLOCKED','QUEUED','SENDING','SENT','FAILED','CANCELLED')),
  provider_kind TEXT,
  destination_ref_digest_sha256 TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  next_attempt_at TEXT,
  last_error_code TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (notification_event_id, channel),
  FOREIGN KEY (notification_event_id) REFERENCES modaryx_v2_notification_events(event_id) ON DELETE CASCADE,
  CHECK (
    state = 'BLOCKED'
    OR (provider_kind IS NOT NULL AND destination_ref_digest_sha256 IS NOT NULL AND length(destination_ref_digest_sha256)=64)
  )
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_delivery_state_time
  ON modaryx_v2_notification_delivery_outbox(state, next_attempt_at, created_at);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_delivery_owner
  ON modaryx_v2_notification_delivery_outbox(owner_identity_sub, created_at DESC);
