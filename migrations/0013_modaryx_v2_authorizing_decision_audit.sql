PRAGMA foreign_keys = ON;

-- MODARYX V2 authorizing decision audit candidate.
-- This records only manual decisions derived from an eligible preflight.
-- No legal review is simulated and no remote migration is applied here.

CREATE TABLE IF NOT EXISTS modaryx_v2_rights_authorizing_reviews (
  authorizing_review_id TEXT PRIMARY KEY CHECK (authorizing_review_id GLOB 'mx_rights_authorizing_review_*'),
  decision_id TEXT NOT NULL UNIQUE,
  case_id TEXT NOT NULL,
  preflight_id TEXT NOT NULL UNIQUE,
  response_evidence_id TEXT NOT NULL,
  right_scope TEXT NOT NULL,
  product_surface TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('GRANTED','GRANTED_WITH_LIMITS')),
  legal_review_ref_digest_sha256 TEXT NOT NULL CHECK (length(legal_review_ref_digest_sha256)=64),
  source_snapshot_sha256 TEXT NOT NULL CHECK (length(source_snapshot_sha256)=64),
  reviewer_actor_key TEXT NOT NULL,
  confirmed_at TEXT NOT NULL,
  FOREIGN KEY (decision_id) REFERENCES modaryx_v2_rights_scope_decisions(decision_id),
  FOREIGN KEY (case_id) REFERENCES modaryx_v2_rights_cases(case_id) ON DELETE CASCADE,
  FOREIGN KEY (preflight_id) REFERENCES modaryx_v2_rights_license_preflight(preflight_id),
  FOREIGN KEY (response_evidence_id) REFERENCES modaryx_v2_rights_response_evidence(response_evidence_id)
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_authorizing_reviews_case
  ON modaryx_v2_rights_authorizing_reviews(case_id, confirmed_at DESC);
