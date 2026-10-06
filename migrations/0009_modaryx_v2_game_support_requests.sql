PRAGMA foreign_keys = ON;

-- MODARYX V2 member game-support request + admin triage candidate.
-- This migration is not applied remotely by this change.

CREATE TABLE IF NOT EXISTS modaryx_v2_game_support_requests (
  request_id TEXT PRIMARY KEY CHECK (request_id GLOB 'mx_game_support_request_*'),
  requester_identity_sub TEXT NOT NULL,
  requester_actor_key TEXT NOT NULL,
  game_name TEXT NOT NULL,
  normalized_game_key TEXT NOT NULL,
  platforms_json TEXT NOT NULL DEFAULT '[]',
  developer_name TEXT,
  publisher_name TEXT,
  reason TEXT NOT NULL DEFAULT '',
  source_urls_json TEXT NOT NULL DEFAULT '[]',
  state TEXT NOT NULL CHECK (state IN (
    'REQUESTED','TRIAGE','ACCEPTED_SAFE_BASELINE','DECLINED_PRODUCT','DUPLICATE','ABUSE_BLOCKED'
  )),
  triage_json TEXT NOT NULL DEFAULT '{}',
  decision_reason TEXT,
  game_id TEXT,
  rights_case_id TEXT,
  safe_baseline_allowed INTEGER NOT NULL DEFAULT 0 CHECK (safe_baseline_allowed IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  decided_at TEXT,
  FOREIGN KEY (rights_case_id) REFERENCES modaryx_v2_rights_cases(case_id),
  CHECK (game_id IS NULL OR game_id GLOB 'mx_*'),
  CHECK (state <> 'ACCEPTED_SAFE_BASELINE' OR (
    safe_baseline_allowed = 1 AND game_id IS NOT NULL AND rights_case_id IS NOT NULL
  )),
  CHECK (state = 'ACCEPTED_SAFE_BASELINE' OR safe_baseline_allowed = 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_modaryx_v2_game_support_active_key
  ON modaryx_v2_game_support_requests(normalized_game_key)
  WHERE state IN ('REQUESTED','TRIAGE','ACCEPTED_SAFE_BASELINE');

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_game_support_requester_time
  ON modaryx_v2_game_support_requests(requester_identity_sub, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_game_support_state_time
  ON modaryx_v2_game_support_requests(state, updated_at DESC);

CREATE TABLE IF NOT EXISTS modaryx_v2_game_support_records (
  support_id TEXT PRIMARY KEY CHECK (support_id GLOB 'mx_game_support_*'),
  request_id TEXT NOT NULL UNIQUE,
  game_id TEXT NOT NULL UNIQUE CHECK (game_id GLOB 'mx_*'),
  game_name TEXT NOT NULL,
  rights_case_id TEXT NOT NULL,
  safe_baseline_allowed INTEGER NOT NULL DEFAULT 1 CHECK (safe_baseline_allowed = 1),
  official_assets_allowed INTEGER NOT NULL DEFAULT 0 CHECK (official_assets_allowed = 0),
  partnership_claim_allowed INTEGER NOT NULL DEFAULT 0 CHECK (partnership_claim_allowed = 0),
  forge_permission_inferred INTEGER NOT NULL DEFAULT 0 CHECK (forge_permission_inferred = 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (request_id) REFERENCES modaryx_v2_game_support_requests(request_id),
  FOREIGN KEY (rights_case_id) REFERENCES modaryx_v2_rights_cases(case_id)
);
