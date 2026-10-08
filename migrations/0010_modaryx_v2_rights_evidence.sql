PRAGMA foreign_keys = ON;

-- MODARYX V2 rights evidence/preflight candidate.
-- Not applied remotely by this change.
-- No publisher contact or outbound transport is performed here.

CREATE TABLE IF NOT EXISTS modaryx_v2_rights_contact_evidence (
  contact_evidence_id TEXT PRIMARY KEY CHECK (contact_evidence_id GLOB 'mx_rights_contact_*'),
  case_id TEXT NOT NULL,
  source_kind TEXT NOT NULL CHECK (source_kind IN (
    'official_publisher_site','official_legal_or_licensing_page','official_business_or_press_contact',
    'official_licensing_form','publisher_supplied_contact'
  )),
  source_url TEXT NOT NULL CHECK (substr(source_url,1,8)='https://'),
  contact_channel TEXT NOT NULL CHECK (contact_channel IN ('EMAIL','FORM','PORTAL','POSTAL','OTHER_OFFICIAL')),
  contact_ref_digest_sha256 TEXT NOT NULL CHECK (length(contact_ref_digest_sha256)=64),
  authority_basis TEXT NOT NULL,
  source_observed_at TEXT NOT NULL,
  verified_by_actor_key TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (case_id, contact_ref_digest_sha256),
  FOREIGN KEY (case_id) REFERENCES modaryx_v2_rights_cases(case_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS modaryx_v2_rights_response_evidence (
  response_evidence_id TEXT PRIMARY KEY CHECK (response_evidence_id GLOB 'mx_rights_response_*'),
  case_id TEXT NOT NULL,
  contact_evidence_id TEXT NOT NULL,
  logical_request_id TEXT NOT NULL,
  raw_message_sha256 TEXT NOT NULL CHECK (length(raw_message_sha256)=64),
  raw_headers_sha256 TEXT NOT NULL CHECK (length(raw_headers_sha256)=64),
  received_at TEXT NOT NULL,
  review_state TEXT NOT NULL CHECK (review_state IN ('SAFE_NON_AUTHORIZING','NEEDS_REVIEW','LEGAL_REVIEW_REQUIRED')),
  extraction_json TEXT NOT NULL,
  source_verified INTEGER NOT NULL DEFAULT 1 CHECK (source_verified IN (0,1)),
  archived INTEGER NOT NULL DEFAULT 1 CHECK (archived IN (0,1)),
  created_by_actor_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (case_id, raw_message_sha256),
  FOREIGN KEY (case_id) REFERENCES modaryx_v2_rights_cases(case_id) ON DELETE CASCADE,
  FOREIGN KEY (contact_evidence_id) REFERENCES modaryx_v2_rights_contact_evidence(contact_evidence_id)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_rights_license_preflight (
  preflight_id TEXT PRIMARY KEY CHECK (preflight_id GLOB 'mx_rights_preflight_*'),
  case_id TEXT NOT NULL,
  response_evidence_id TEXT NOT NULL,
  right_scope TEXT NOT NULL,
  product_surface TEXT NOT NULL,
  requested_status TEXT NOT NULL CHECK (requested_status IN ('GRANTED','GRANTED_WITH_LIMITS')),
  evidence_refs_json TEXT NOT NULL DEFAULT '[]',
  conditions_json TEXT NOT NULL DEFAULT '[]',
  territories_json TEXT NOT NULL DEFAULT '[]',
  platforms_json TEXT NOT NULL DEFAULT '[]',
  valid_from TEXT,
  valid_until TEXT,
  asset_linked INTEGER NOT NULL CHECK (asset_linked IN (0,1)),
  conditions_satisfied INTEGER NOT NULL CHECK (conditions_satisfied IN (0,1)),
  legal_review_ref TEXT,
  result TEXT NOT NULL CHECK (result IN ('ELIGIBLE_FOR_MANUAL_DECISION','BLOCKED')),
  reason TEXT,
  reviewer_actor_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (case_id) REFERENCES modaryx_v2_rights_cases(case_id) ON DELETE CASCADE,
  FOREIGN KEY (response_evidence_id) REFERENCES modaryx_v2_rights_response_evidence(response_evidence_id)
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_rights_contact_case
  ON modaryx_v2_rights_contact_evidence(case_id, verified_at DESC);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_rights_response_case
  ON modaryx_v2_rights_response_evidence(case_id, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_rights_preflight_case
  ON modaryx_v2_rights_license_preflight(case_id, created_at DESC);
