PRAGMA foreign_keys = ON;

-- MODARYX V2 publisher inbound quarantine metadata candidate.
-- No mailbox/webhook/provider is configured by this migration.

CREATE TABLE IF NOT EXISTS modaryx_v2_publisher_inbound_envelopes (
  inbound_id TEXT PRIMARY KEY CHECK (inbound_id GLOB 'mx_rights_inbound_*'),
  case_id TEXT NOT NULL,
  logical_request_id TEXT,
  raw_message_sha256 TEXT NOT NULL CHECK (length(raw_message_sha256)=64),
  raw_headers_sha256 TEXT NOT NULL CHECK (length(raw_headers_sha256)=64),
  archive_ref_digest_sha256 TEXT NOT NULL CHECK (length(archive_ref_digest_sha256)=64),
  received_at TEXT NOT NULL,
  correlation_state TEXT NOT NULL CHECK (correlation_state IN ('CORRELATION_PENDING','CORRELATED')),
  provenance_state TEXT NOT NULL CHECK (provenance_state IN ('PROVENANCE_UNVERIFIED','PROVENANCE_VERIFIED','REJECTED_UNTRUSTED')),
  quarantine_state TEXT NOT NULL CHECK (quarantine_state IN ('RAW_MESSAGE_QUARANTINED','ATTACHMENT_QUARANTINED')),
  interpretation_state TEXT NOT NULL CHECK (interpretation_state IN ('BLOCKED','READY_FOR_INTERPRETATION','LEGAL_REVIEW_REQUIRED')),
  created_by_actor_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (case_id, raw_message_sha256),
  FOREIGN KEY (case_id) REFERENCES modaryx_v2_rights_cases(case_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_publisher_inbound_case_time
  ON modaryx_v2_publisher_inbound_envelopes(case_id, received_at DESC);
