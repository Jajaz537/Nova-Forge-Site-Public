PRAGMA foreign_keys = ON;

-- MODARYX V2 immutable owner history candidate.
-- Not applied remotely by this change.

CREATE TABLE IF NOT EXISTS modaryx_v2_data_history (
  history_id TEXT PRIMARY KEY CHECK (history_id GLOB 'mx_history_*'),
  owner_identity_sub TEXT NOT NULL,
  entity_kind TEXT NOT NULL CHECK (entity_kind IN (
    'profile','notification-preferences','game-profile','content','release','collection','modpack',
    'community-submission','moderation','appeal'
  )),
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'created','updated','preferences-updated','submitted','published','withdrawn','revoked',
    'moderation-decision','appeal-outcome','sync-conflict'
  )),
  revision INTEGER NOT NULL CHECK (revision >= 1),
  changed_fields_json TEXT NOT NULL DEFAULT '[]',
  previous_history_id TEXT,
  source_receipt_id TEXT,
  snapshot_digest_sha256 TEXT NOT NULL CHECK (length(snapshot_digest_sha256)=64),
  occurred_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (owner_identity_sub, entity_kind, entity_id, revision),
  FOREIGN KEY (previous_history_id) REFERENCES modaryx_v2_data_history(history_id)
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_history_owner_time
  ON modaryx_v2_data_history(owner_identity_sub, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_history_entity
  ON modaryx_v2_data_history(owner_identity_sub, entity_kind, entity_id, revision DESC);
