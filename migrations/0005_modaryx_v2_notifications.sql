PRAGMA foreign_keys = ON;

-- MODARYX V2 in-app notifications candidate.
-- No remote apply is performed by this change.

CREATE TABLE IF NOT EXISTS modaryx_v2_notification_events (
  event_id TEXT PRIMARY KEY CHECK (event_id GLOB 'mx_notification_*'),
  recipient_identity_sub TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'FOLLOWED_RELEASE','COMPATIBILITY_CHANGED','CONTENT_REVOKED','DEPENDENCY_UNAVAILABLE',
    'COMMUNITY_REPLY','COMMUNITY_MENTION','SUPPORT_UPDATE','MODERATION_UPDATE',
    'CREATOR_RELEASE_SUBMITTED','CREATOR_VALIDATION_FAILED','CREATOR_PUBLISHED','CREATOR_REMOVED',
    'CREATOR_APPEAL_STATUS','CREATOR_REPORT_ATTENTION',
    'PROFILE_CONFLICT','PROFILE_DEPENDENCY_MISSING','PROFILE_UPDATE_AVAILABLE','PROFILE_SYNC_CONFLICT',
    'PUBLISHER_RESPONSE','RIGHTS_APPROVED_SCOPED','RIGHTS_APPROVED_WITH_LIMITS','RIGHTS_MORE_INFO',
    'LEGAL_REVIEW_REQUIRED','RIGHTS_DECLINED','RIGHTS_EXPIRING','RIGHTS_EXPIRED','RIGHTS_REVOKED'
  )),
  priority TEXT NOT NULL CHECK (priority IN ('CRITICAL','IMPORTANT','NORMAL','SILENT')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  href TEXT NOT NULL CHECK (substr(href,1,1)='/' AND substr(href,1,2)<>'//'),
  state_label TEXT,
  affected_scopes_json TEXT NOT NULL DEFAULT '[]',
  source_kind TEXT NOT NULL CHECK (source_kind IN ('content','community','creator','profile','rights','moderation','system')),
  source_id TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  read_at TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (recipient_identity_sub, source_kind, source_id, event_type)
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_notifications_recipient_time
  ON modaryx_v2_notification_events(recipient_identity_sub, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_notifications_recipient_unread
  ON modaryx_v2_notification_events(recipient_identity_sub, read_at, occurred_at DESC);

CREATE TABLE IF NOT EXISTS modaryx_v2_notification_preferences (
  identity_sub TEXT PRIMARY KEY,
  product_enabled INTEGER NOT NULL DEFAULT 1 CHECK (product_enabled IN (0,1)),
  community_enabled INTEGER NOT NULL DEFAULT 1 CHECK (community_enabled IN (0,1)),
  creator_enabled INTEGER NOT NULL DEFAULT 1 CHECK (creator_enabled IN (0,1)),
  profile_enabled INTEGER NOT NULL DEFAULT 1 CHECK (profile_enabled IN (0,1)),
  rights_enabled INTEGER NOT NULL DEFAULT 1 CHECK (rights_enabled IN (0,1)),
  marketing_enabled INTEGER NOT NULL DEFAULT 0 CHECK (marketing_enabled IN (0,1)),
  version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
  updated_at TEXT NOT NULL
);
