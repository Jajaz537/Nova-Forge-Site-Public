PRAGMA foreign_keys = ON;

-- MODARYX V2 anonymous Core Web Vitals RUM candidate.
-- Not applied remotely by this change.
-- No account id, IP address, user-agent, raw URL, query string or referrer is stored.

CREATE TABLE IF NOT EXISTS modaryx_v2_cwv_samples (
  sample_id TEXT PRIMARY KEY CHECK (sample_id GLOB 'mx_cwv_*'),
  page_view_id TEXT NOT NULL CHECK (length(page_view_id)=32),
  metric_name TEXT NOT NULL CHECK (metric_name IN ('LCP','INP','CLS')),
  metric_value REAL NOT NULL CHECK (metric_value >= 0),
  rating TEXT NOT NULL CHECK (rating IN ('good','needs-improvement','poor')),
  route_class TEXT NOT NULL CHECK (route_class IN (
    'ROOT','DISCOVER','GAMES','GAME_HUB','MODS','CONTENT_DETAIL','SEARCH','COLLECTIONS','CREATORS',
    'COMMUNITY','STUDIO','LIBRARY','ACCOUNT','NOTIFICATIONS','RIGHTS','AI','TRUST','HELP','MODERATION','OTHER'
  )),
  viewport_class TEXT NOT NULL CHECK (viewport_class IN ('mobile','tablet','desktop','unknown')),
  navigation_type TEXT NOT NULL CHECK (navigation_type IN ('navigate','reload','back_forward','prerender','unknown')),
  observed_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (page_view_id, metric_name)
);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_cwv_metric_time
  ON modaryx_v2_cwv_samples(metric_name, observed_at DESC);

CREATE INDEX IF NOT EXISTS idx_modaryx_v2_cwv_route_metric
  ON modaryx_v2_cwv_samples(route_class, metric_name, observed_at DESC);
