PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS modaryx_profiles (
  profile_id TEXT PRIMARY KEY,
  identity_sub TEXT NOT NULL UNIQUE,
  handle TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  visibility TEXT NOT NULL DEFAULT 'private'
    CHECK (visibility IN ('public', 'unlisted', 'private')),
  creator_is_creator INTEGER NOT NULL DEFAULT 0
    CHECK (creator_is_creator IN (0, 1)),
  creator_display_label TEXT,
  links_json TEXT NOT NULL DEFAULT '[]',
  collections_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS modaryx_community_submissions (
  submission_id TEXT PRIMARY KEY,
  actor_profile_id TEXT NOT NULL,
  kind TEXT NOT NULL
    CHECK (kind IN ('discussion', 'review', 'comment')),
  target_id TEXT NOT NULL,
  title TEXT,
  body TEXT NOT NULL,
  rating INTEGER
    CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  parent_submission_id TEXT,
  abuse_state TEXT NOT NULL DEFAULT 'pending'
    CHECK (abuse_state IN ('pending', 'passed', 'blocked')),
  moderation_state TEXT NOT NULL DEFAULT 'pending'
    CHECK (moderation_state IN ('pending', 'accepted', 'rejected', 'held-for-review')),
  publication_state TEXT NOT NULL DEFAULT 'received'
    CHECK (publication_state IN ('received', 'published', 'withdrawn', 'revoked')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (actor_profile_id) REFERENCES modaryx_profiles(profile_id)
);

CREATE INDEX IF NOT EXISTS idx_modaryx_profiles_identity_sub
  ON modaryx_profiles(identity_sub);

CREATE INDEX IF NOT EXISTS idx_modaryx_submissions_actor
  ON modaryx_community_submissions(actor_profile_id);

CREATE INDEX IF NOT EXISTS idx_modaryx_submissions_target
  ON modaryx_community_submissions(target_id);

CREATE INDEX IF NOT EXISTS idx_modaryx_submissions_moderation
  ON modaryx_community_submissions(moderation_state, created_at);
