PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS modaryx_moderation_receipts (
  receipt_id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  receipt_type TEXT NOT NULL
    CHECK (receipt_type IN ('decision', 'appeal', 'appeal-outcome')),
  category TEXT NOT NULL
    CHECK (category IN ('illegal-content', 'policy-violation', 'spam-abuse', 'intellectual-property')),
  payload_json TEXT NOT NULL,
  actor_key TEXT NOT NULL,
  recorded_by TEXT NOT NULL
    CHECK (recorded_by IN ('system', 'moderator', 'appeals-reviewer')),
  previous_receipt_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (submission_id) REFERENCES modaryx_community_submissions(submission_id),
  FOREIGN KEY (previous_receipt_id) REFERENCES modaryx_moderation_receipts(receipt_id)
);

CREATE INDEX IF NOT EXISTS idx_modaryx_moderation_submission
  ON modaryx_moderation_receipts(submission_id, created_at);

CREATE INDEX IF NOT EXISTS idx_modaryx_moderation_type
  ON modaryx_moderation_receipts(receipt_type, created_at);
