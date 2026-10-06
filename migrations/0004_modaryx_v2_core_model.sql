PRAGMA foreign_keys = ON;

-- MODARYX V2 candidate data model.
-- This migration is committed for targeted local validation only.
-- It is NOT applied to remote DEV or production by this change.

CREATE TABLE IF NOT EXISTS modaryx_v2_games (
  game_id TEXT PRIMARY KEY CHECK (game_id GLOB 'mx_*'),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('editorial-only','catalog-enabled','distribution-enabled','deprecated')),
  platforms_json TEXT NOT NULL DEFAULT '[]',
  versions_json TEXT NOT NULL DEFAULT '[]',
  dlcs_json TEXT NOT NULL DEFAULT '[]',
  content_type_ids_json TEXT NOT NULL DEFAULT '[]',
  category_ids_json TEXT NOT NULL DEFAULT '[]',
  loader_ids_json TEXT NOT NULL DEFAULT '[]',
  environment_model TEXT NOT NULL CHECK (environment_model IN ('client','server','client-server','mixed','unknown')),
  install_capabilities_json TEXT NOT NULL DEFAULT '{}',
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS modaryx_v2_content_types (
  content_type_id TEXT PRIMARY KEY CHECK (content_type_id GLOB 'mx_*'),
  game_id TEXT,
  label TEXT NOT NULL,
  family TEXT NOT NULL CHECK (family IN ('gameplay','visual-audio','technical','aggregate','other')),
  install_mode TEXT NOT NULL CHECK (install_mode IN ('none','manual','manager','direct','contextual')),
  capabilities_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (game_id) REFERENCES modaryx_v2_games(game_id)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_creators (
  creator_id TEXT PRIMARY KEY CHECK (creator_id GLOB 'mx_*'),
  profile_id TEXT,
  handle TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  links_json TEXT NOT NULL DEFAULT '[]',
  verification_state TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_state IN ('unverified','identity-verified','program-verified')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES modaryx_profiles(profile_id)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_teams (
  team_id TEXT PRIMARY KEY CHECK (team_id GLOB 'mx_*'),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','unlisted','public')),
  members_json TEXT NOT NULL DEFAULT '[]',
  roles_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS modaryx_v2_content_items (
  content_id TEXT PRIMARY KEY CHECK (content_id GLOB 'mx_*'),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  game_id TEXT NOT NULL,
  content_type_id TEXT NOT NULL,
  creator_ids_json TEXT NOT NULL DEFAULT '[]',
  team_id TEXT,
  categories_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL CHECK (status IN ('draft','submitted','published','withdrawn','revoked','archived')),
  license_ref TEXT,
  permission_ref TEXT,
  provenance_state TEXT NOT NULL DEFAULT 'unknown' CHECK (provenance_state IN ('unknown','declared','verified')),
  provenance_receipt_id TEXT,
  moderation_state TEXT NOT NULL DEFAULT 'unreviewed'
    CHECK (moderation_state IN ('unreviewed','pending','approved','restricted','rejected')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','unlisted','public')),
  current_release_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (game_id) REFERENCES modaryx_v2_games(game_id),
  FOREIGN KEY (content_type_id) REFERENCES modaryx_v2_content_types(content_type_id),
  FOREIGN KEY (team_id) REFERENCES modaryx_v2_teams(team_id),
  CHECK (provenance_state <> 'verified' OR provenance_receipt_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_releases (
  release_id TEXT PRIMARY KEY CHECK (release_id GLOB 'mx_*'),
  content_id TEXT NOT NULL,
  version TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('stable','beta','alpha','legacy')),
  state TEXT NOT NULL CHECK (state IN ('draft','submitted','published','withdrawn','revoked','archived')),
  published_at TEXT,
  game_versions_json TEXT NOT NULL DEFAULT '[]',
  loaders_json TEXT NOT NULL DEFAULT '[]',
  platforms_json TEXT NOT NULL DEFAULT '[]',
  dlcs_json TEXT NOT NULL DEFAULT '[]',
  environment TEXT NOT NULL CHECK (environment IN ('client','server','client-server','mixed','unknown')),
  changelog TEXT NOT NULL DEFAULT '',
  provenance_state TEXT NOT NULL DEFAULT 'unknown' CHECK (provenance_state IN ('unknown','declared','verified')),
  provenance_source TEXT,
  distribution_state TEXT NOT NULL DEFAULT 'draft'
    CHECK (distribution_state IN ('draft','available','withdrawn','revoked','archived')),
  downloadable INTEGER NOT NULL DEFAULT 0 CHECK (downloadable IN (0,1)),
  distribution_reason TEXT,
  release_receipt_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (content_id) REFERENCES modaryx_v2_content_items(content_id),
  UNIQUE (content_id, version, channel),
  CHECK (distribution_state NOT IN ('withdrawn','revoked','archived') OR downloadable = 0),
  CHECK (provenance_state <> 'verified' OR release_receipt_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_dependencies (
  dependency_id TEXT PRIMARY KEY CHECK (dependency_id GLOB 'mx_*'),
  source_content_id TEXT NOT NULL,
  source_release_range TEXT NOT NULL,
  target_content_id TEXT NOT NULL,
  target_release_range TEXT NOT NULL,
  relation_type TEXT NOT NULL CHECK (relation_type IN ('required','optional','recommended','incompatible','replaces')),
  reason TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('manifest','creator','curator','measured','moderator','unknown')),
  verification_state TEXT NOT NULL CHECK (verification_state IN ('verified','declared','unverified','unknown')),
  created_at TEXT NOT NULL,
  FOREIGN KEY (source_content_id) REFERENCES modaryx_v2_content_items(content_id),
  FOREIGN KEY (target_content_id) REFERENCES modaryx_v2_content_items(content_id),
  UNIQUE (source_content_id, source_release_range, target_content_id, target_release_range, relation_type)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_compatibility_claims (
  claim_id TEXT PRIMARY KEY CHECK (claim_id GLOB 'mx_*'),
  content_id TEXT NOT NULL,
  release_id TEXT NOT NULL,
  game_id TEXT NOT NULL,
  game_version TEXT NOT NULL,
  loader TEXT,
  platform TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('client','server','client-server','mixed','unknown')),
  state TEXT NOT NULL CHECK (state IN ('compatible','partial','incompatible','unknown')),
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('measured','declared','estimated','unknown')),
  receipt_id TEXT,
  source TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (content_id) REFERENCES modaryx_v2_content_items(content_id),
  FOREIGN KEY (release_id) REFERENCES modaryx_v2_releases(release_id),
  FOREIGN KEY (game_id) REFERENCES modaryx_v2_games(game_id),
  CHECK (evidence_type <> 'measured' OR receipt_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_file_artifacts (
  file_id TEXT PRIMARY KEY CHECK (file_id GLOB 'mx_*'),
  release_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  object_key TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes >= 0),
  media_type TEXT NOT NULL,
  executable INTEGER NOT NULL DEFAULT 0 CHECK (executable IN (0,1)),
  sha256 TEXT NOT NULL CHECK (length(sha256)=64),
  sha512 TEXT,
  signature_state TEXT NOT NULL DEFAULT 'absent'
    CHECK (signature_state IN ('absent','unverified','verified','invalid')),
  signer_id TEXT,
  signature_receipt_id TEXT,
  provenance_state TEXT NOT NULL DEFAULT 'unknown' CHECK (provenance_state IN ('unknown','declared','verified')),
  provenance_receipt_id TEXT,
  distribution_state TEXT NOT NULL CHECK (distribution_state IN ('available','withdrawn','revoked','archived')),
  downloadable INTEGER NOT NULL DEFAULT 0 CHECK (downloadable IN (0,1)),
  created_at TEXT NOT NULL,
  FOREIGN KEY (release_id) REFERENCES modaryx_v2_releases(release_id),
  CHECK (distribution_state NOT IN ('withdrawn','revoked','archived') OR downloadable = 0),
  CHECK (provenance_state <> 'verified' OR provenance_receipt_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_collections (
  collection_id TEXT PRIMARY KEY CHECK (collection_id GLOB 'mx_*'),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  curator_id TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','unlisted','public')),
  game_ids_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (curator_id) REFERENCES modaryx_v2_creators(creator_id)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_collection_items (
  collection_id TEXT NOT NULL,
  content_id TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL CHECK (display_order >= 0),
  recommended_release_id TEXT,
  PRIMARY KEY (collection_id, content_id),
  UNIQUE (collection_id, display_order),
  FOREIGN KEY (collection_id) REFERENCES modaryx_v2_collections(collection_id) ON DELETE CASCADE,
  FOREIGN KEY (content_id) REFERENCES modaryx_v2_content_items(content_id),
  FOREIGN KEY (recommended_release_id) REFERENCES modaryx_v2_releases(release_id)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_modpacks (
  modpack_id TEXT PRIMARY KEY CHECK (modpack_id GLOB 'mx_*'),
  title TEXT NOT NULL,
  game_id TEXT NOT NULL,
  game_version TEXT NOT NULL,
  loader TEXT,
  version TEXT NOT NULL,
  release_constraints_json TEXT NOT NULL DEFAULT '[]',
  config_artifact_ids_json TEXT NOT NULL DEFAULT '[]',
  dependency_ids_json TEXT NOT NULL DEFAULT '[]',
  conflict_ids_json TEXT NOT NULL DEFAULT '[]',
  rights_state TEXT NOT NULL DEFAULT 'unknown' CHECK (rights_state IN ('unknown','cleared','restricted','blocked')),
  rights_receipt_id TEXT,
  provenance_state TEXT NOT NULL DEFAULT 'unknown' CHECK (provenance_state IN ('unknown','declared','verified')),
  provenance_receipt_id TEXT,
  distribution_state TEXT NOT NULL DEFAULT 'draft'
    CHECK (distribution_state IN ('draft','available','withdrawn','revoked','archived')),
  downloadable INTEGER NOT NULL DEFAULT 0 CHECK (downloadable IN (0,1)),
  history_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (game_id) REFERENCES modaryx_v2_games(game_id),
  UNIQUE (modpack_id, version),
  CHECK (distribution_state NOT IN ('withdrawn','revoked','archived') OR downloadable = 0),
  CHECK (provenance_state <> 'verified' OR provenance_receipt_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_game_profiles (
  game_profile_id TEXT PRIMARY KEY CHECK (game_profile_id GLOB 'mx_*'),
  owner_profile_id TEXT,
  game_id TEXT NOT NULL,
  game_version TEXT NOT NULL,
  selected_release_ids_json TEXT NOT NULL DEFAULT '[]',
  enabled_state_json TEXT NOT NULL DEFAULT '{}',
  load_order_json TEXT NOT NULL DEFAULT '[]',
  local_config_refs_json TEXT NOT NULL DEFAULT '[]',
  sync_state TEXT NOT NULL DEFAULT 'local-only'
    CHECK (sync_state IN ('local-only','sync-pending','synced','sync-error')),
  visibility TEXT NOT NULL DEFAULT 'private-local'
    CHECK (visibility IN ('private-local','private-synced','shared-unlisted','shared-public')),
  share_consent_receipt_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (owner_profile_id) REFERENCES modaryx_profiles(profile_id),
  FOREIGN KEY (game_id) REFERENCES modaryx_v2_games(game_id),
  CHECK (visibility NOT IN ('shared-unlisted','shared-public') OR share_consent_receipt_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS modaryx_v2_search_documents (
  entity_id TEXT NOT NULL CHECK (entity_id GLOB 'mx_*'),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('game','content','release','creator','team','collection','modpack')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  href TEXT NOT NULL,
  game_id TEXT,
  content_type_id TEXT,
  creator_ids_json TEXT NOT NULL DEFAULT '[]',
  categories_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',
  game_versions_json TEXT NOT NULL DEFAULT '[]',
  loaders_json TEXT NOT NULL DEFAULT '[]',
  platforms_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  ranking_signals_json TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (entity_type, entity_id),
  CHECK (substr(href,1,1)='/')
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_content_game_type
  ON modaryx_v2_content_items(game_id, content_type_id, status);
CREATE INDEX IF NOT EXISTS idx_modaryx_v2_release_content
  ON modaryx_v2_releases(content_id, state, updated_at);
CREATE INDEX IF NOT EXISTS idx_modaryx_v2_claim_release
  ON modaryx_v2_compatibility_claims(release_id, game_version, platform);
CREATE INDEX IF NOT EXISTS idx_modaryx_v2_artifact_release
  ON modaryx_v2_file_artifacts(release_id, distribution_state);
CREATE INDEX IF NOT EXISTS idx_modaryx_v2_collection_curator
  ON modaryx_v2_collections(curator_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_modaryx_v2_game_profile_owner
  ON modaryx_v2_game_profiles(owner_profile_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_modaryx_v2_search_game_type
  ON modaryx_v2_search_documents(game_id, entity_type, updated_at);
