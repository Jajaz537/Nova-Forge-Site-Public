PRAGMA foreign_keys = ON;

-- MODARYX V2 Game Rights Registry candidate.
-- This change does NOT apply the migration remotely and does NOT contact publishers.

CREATE TABLE IF NOT EXISTS modaryx_v2_rights_cases (
  case_id TEXT PRIMARY KEY CHECK (case_id GLOB 'mx_rights_case_*'),
  game_id TEXT NOT NULL CHECK (game_id GLOB 'mx_*'),
  game_name TEXT NOT NULL,
  publisher_name TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN (
    'RIGHTS_CASE_CREATED','CONTACT_CANDIDATE','CONTACT_VERIFIED','REQUEST_READY',
    'REQUEST_SENT','AWAITING_RESPONSE','APPROVED','APPROVED_WITH_LIMITS',
    'DECLINED','NO_RESPONSE','EXPIRED','REVOKED','GAME_SUPPORT_BLOCKED'
  )),
  requested_scopes_json TEXT NOT NULL DEFAULT '[]',
  product_surfaces_json TEXT NOT NULL DEFAULT '[]',
  contact_state TEXT NOT NULL DEFAULT 'CONTACT_NOT_FOUND'
    CHECK (contact_state IN ('CONTACT_NOT_FOUND','CONTACT_CANDIDATE','CONTACT_VERIFIED')),
  created_by_actor_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (game_id, publisher_name)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_rights_scope_decisions (
  decision_id TEXT PRIMARY KEY CHECK (decision_id GLOB 'mx_rights_decision_*'),
  case_id TEXT NOT NULL,
  right_scope TEXT NOT NULL,
  product_surface TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN (
    'UNKNOWN','NOT_REQUESTED','PENDING','GRANTED','GRANTED_WITH_LIMITS','DENIED',
    'RESTRICTED','EXPIRED','REVOKED','FORBIDDEN'
  )),
  territories_json TEXT NOT NULL DEFAULT '[]',
  platforms_json TEXT NOT NULL DEFAULT '[]',
  allowed_uses_json TEXT NOT NULL DEFAULT '[]',
  forbidden_uses_json TEXT NOT NULL DEFAULT '[]',
  conditions_json TEXT NOT NULL DEFAULT '[]',
  credits_required INTEGER NOT NULL DEFAULT 0 CHECK (credits_required IN (0,1)),
  valid_from TEXT,
  valid_until TEXT,
  evidence_refs_json TEXT NOT NULL DEFAULT '[]',
  evidence_archived INTEGER NOT NULL DEFAULT 0 CHECK (evidence_archived IN (0,1)),
  source_verified INTEGER NOT NULL DEFAULT 0 CHECK (source_verified IN (0,1)),
  conditions_satisfied INTEGER NOT NULL DEFAULT 0 CHECK (conditions_satisfied IN (0,1)),
  asset_linked INTEGER NOT NULL DEFAULT 0 CHECK (asset_linked IN (0,1)),
  reviewer_actor_key TEXT,
  verified_at TEXT,
  supersedes_decision_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (case_id) REFERENCES modaryx_v2_rights_cases(case_id) ON DELETE CASCADE,
  FOREIGN KEY (supersedes_decision_id) REFERENCES modaryx_v2_rights_scope_decisions(decision_id),
  CHECK (
    status NOT IN ('GRANTED','GRANTED_WITH_LIMITS')
    OR (
      evidence_archived = 1
      AND source_verified = 1
      AND conditions_satisfied = 1
      AND asset_linked = 1
      AND reviewer_actor_key IS NOT NULL
      AND verified_at IS NOT NULL
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_rights_scope_lookup
  ON modaryx_v2_rights_scope_decisions(case_id, right_scope, product_surface, created_at DESC);

CREATE TABLE IF NOT EXISTS modaryx_v2_rights_audit (
  audit_id TEXT PRIMARY KEY CHECK (audit_id GLOB 'mx_rights_audit_*'),
  case_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'CASE_CREATED','NON_AUTHORIZING_DECISION_RECORDED','EFFECTIVE_SCOPE_CHECKED'
  )),
  actor_key TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (case_id) REFERENCES modaryx_v2_rights_cases(case_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_rights_audit_case_time
  ON modaryx_v2_rights_audit(case_id, created_at DESC);
