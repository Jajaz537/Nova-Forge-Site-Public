PRAGMA foreign_keys = ON;

-- MODARYX V2 publisher outbound request-preparation candidate.
-- No provider adapter, sender identity or network dispatch is enabled here.

CREATE TABLE IF NOT EXISTS modaryx_v2_rights_contact_suppressions (
  suppression_id TEXT PRIMARY KEY CHECK (suppression_id GLOB 'mx_rights_suppression_*'),
  case_id TEXT NOT NULL,
  contact_ref_digest_sha256 TEXT NOT NULL CHECK (length(contact_ref_digest_sha256)=64),
  suppression_kind TEXT NOT NULL CHECK (suppression_kind IN ('ACTIVE_REFUSAL','OPT_OUT')),
  evidence_ref TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
  created_by_actor_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  cleared_at TEXT,
  FOREIGN KEY (case_id) REFERENCES modaryx_v2_rights_cases(case_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_rights_suppression_contact
  ON modaryx_v2_rights_contact_suppressions(case_id, contact_ref_digest_sha256, active);

CREATE TABLE IF NOT EXISTS modaryx_v2_publisher_outbound_requests (
  outbound_request_id TEXT PRIMARY KEY CHECK (outbound_request_id GLOB 'mx_rights_outbound_*'),
  case_id TEXT NOT NULL,
  contact_evidence_id TEXT NOT NULL,
  logical_request_id TEXT NOT NULL,
  request_version INTEGER NOT NULL CHECK (request_version >= 1),
  template_version TEXT NOT NULL,
  requested_scopes_json TEXT NOT NULL,
  product_surfaces_json TEXT NOT NULL,
  contact_channel TEXT NOT NULL CHECK (contact_channel IN ('EMAIL','FORM','PORTAL','POSTAL','OTHER_OFFICIAL')),
  contact_ref_digest_sha256 TEXT NOT NULL CHECK (length(contact_ref_digest_sha256)=64),
  idempotency_key_sha256 TEXT NOT NULL CHECK (length(idempotency_key_sha256)=64),
  state TEXT NOT NULL CHECK (state IN ('REQUEST_READY','OUTBOUND_QUEUED','CANCELED','SUPPRESSED')),
  provider_kind TEXT,
  provider_message_id_digest_sha256 TEXT,
  prepared_by_actor_key TEXT NOT NULL,
  prepared_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (idempotency_key_sha256),
  UNIQUE (logical_request_id),
  FOREIGN KEY (case_id) REFERENCES modaryx_v2_rights_cases(case_id) ON DELETE CASCADE,
  FOREIGN KEY (contact_evidence_id) REFERENCES modaryx_v2_rights_contact_evidence(contact_evidence_id),
  CHECK (
    state <> 'OUTBOUND_QUEUED'
    OR (provider_kind IS NOT NULL AND provider_message_id_digest_sha256 IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_publisher_outbound_case
  ON modaryx_v2_publisher_outbound_requests(case_id, prepared_at DESC);
