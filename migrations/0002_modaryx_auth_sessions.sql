PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS modaryx_auth_transactions (
  state_hash TEXT PRIMARY KEY,
  code_verifier TEXT NOT NULL,
  return_to TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_modaryx_auth_transactions_expires
  ON modaryx_auth_transactions(expires_at);

CREATE TABLE IF NOT EXISTS modaryx_sessions (
  session_hash TEXT PRIMARY KEY,
  identity_sub TEXT NOT NULL,
  scope_json TEXT NOT NULL DEFAULT '[]',
  permissions_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_modaryx_sessions_identity
  ON modaryx_sessions(identity_sub);

CREATE INDEX IF NOT EXISTS idx_modaryx_sessions_expires
  ON modaryx_sessions(expires_at);
