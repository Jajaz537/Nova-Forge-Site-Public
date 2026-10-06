PRAGMA foreign_keys = ON;

-- MODARYX V2 rights lifecycle candidate.
-- Admin-triggered expiry locking only; no production scheduler is enabled.

CREATE TABLE IF NOT EXISTS modaryx_v2_rights_lifecycle_events (
  lifecycle_event_id TEXT PRIMARY KEY CHECK (lifecycle_event_id GLOB 'mx_rights_lifecycle_*'),
  case_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('EXPIRING_SOON','EXPIRED_LOCKED','REVOKED_LOCKED','REVALIDATION_REQUIRED')),
  derived_from_decision_id TEXT,
  idempotency_key_sha256 TEXT NOT NULL CHECK (length(idempotency_key_sha256)=64),
  effective_at TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  actor_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (idempotency_key_sha256),
  FOREIGN KEY (case_id) REFERENCES modaryx_v2_rights_cases(case_id) ON DELETE CASCADE,
  FOREIGN KEY (decision_id) REFERENCES modaryx_v2_rights_scope_decisions(decision_id),
  FOREIGN KEY (derived_from_decision_id) REFERENCES modaryx_v2_rights_scope_decisions(decision_id)
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_rights_lifecycle_case_time
  ON modaryx_v2_rights_lifecycle_events(case_id, effective_at DESC);
