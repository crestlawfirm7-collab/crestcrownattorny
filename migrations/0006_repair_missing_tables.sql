-- Crest Crown Attorneys: safely create any missing D1 tables and indexes.
-- Existing rows are preserved. Run against the D1 database bound as DB.
-- This does not add sections.image_url: apply 0005_section_images.sql
-- separately only when PRAGMA table_info(sections) shows it is absent.
CREATE TABLE IF NOT EXISTS sections (id TEXT PRIMARY KEY, page TEXT NOT NULL DEFAULT '/', title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS sections_page_idx ON sections(page,published,sort_order);
CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS content_entries (id TEXT PRIMARY KEY, kind TEXT NOT NULL, slug TEXT NOT NULL, title TEXT NOT NULL, summary TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '', image_url TEXT NOT NULL DEFAULT '', seo_title TEXT NOT NULL DEFAULT '', seo_description TEXT NOT NULL DEFAULT '', published INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(kind,slug));
CREATE INDEX IF NOT EXISTS content_entries_public ON content_entries(kind,published,slug);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, topic TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS admin_login_limits (id TEXT PRIMARY KEY, attempts INTEGER NOT NULL DEFAULT 0, blocked_until INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS admin_login_limits_updated ON admin_login_limits(updated_at);
CREATE TABLE IF NOT EXISTS media_assets (id TEXT PRIMARY KEY, mime TEXT NOT NULL, data TEXT NOT NULL, filename TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
