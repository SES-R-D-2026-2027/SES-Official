-- SES Version 2: initial content-management schema
-- Database: Cloudflare D1 (SQLite)
-- Media binaries live in Cloudflare R2. This database stores media metadata and object keys.

CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL UNIQUE,
  original_file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes >= 0),
  width INTEGER CHECK (width IS NULL OR width > 0),
  height INTEGER CHECK (height IS NULL OR height > 0),
  alt_text TEXT NOT NULL DEFAULT '',
  is_public INTEGER NOT NULL DEFAULT 1 CHECK (is_public IN (0, 1)),
  metadata_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata_json)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Fixed routes and their editable section payloads. Structured collections below remain normalized.
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  og_media_id TEXT REFERENCES media_assets(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS page_sections (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  section_type TEXT NOT NULL,
  content_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(content_json)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_enabled INTEGER NOT NULL DEFAULT 1 CHECK (is_enabled IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (page_id, section_key)
);

-- Small global settings are JSON so navigation, footer, contact details and social links
-- can be edited without a code deployment. Never store secrets in this table.
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL CHECK (json_valid(value_json)),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS site_stats_items (
  id TEXT PRIMARY KEY,
  value REAL NOT NULL,
  suffix TEXT,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  note TEXT,
  color TEXT NOT NULL CHECK (color IN ('yellow', 'mint', 'lilac', 'coral', 'sky', 'blue', 'paper')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_enabled INTEGER NOT NULL DEFAULT 1 CHECK (is_enabled IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(responsibilities_json)),
  color TEXT CHECK (color IS NULL OR color IN ('yellow', 'mint', 'lilac', 'coral', 'sky', 'blue', 'paper')),
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  directory_role TEXT NOT NULL CHECK (directory_role IN ('leadership', 'head', 'member', 'advisor')),
  photo_asset_id TEXT REFERENCES media_assets(id) ON DELETE SET NULL,
  bio TEXT,
  fun_fact TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- A member can be assigned to a department with a role and display order.
-- is_head identifies the department's primary head; a partial index enforces one per department.
CREATE TABLE IF NOT EXISTS department_members (
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  team_member_id TEXT NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  member_role TEXT NOT NULL DEFAULT 'member' CHECK (member_role IN ('lead', 'co-lead', 'member')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_head INTEGER NOT NULL DEFAULT 0 CHECK (is_head IN (0, 1)),
  PRIMARY KEY (department_id, team_member_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_department_one_primary_head
  ON department_members(department_id) WHERE is_head = 1;

CREATE TABLE IF NOT EXISTS team_member_links (
  id TEXT PRIMARY KEY,
  team_member_id TEXT NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('workshop', 'talk', 'hackathon', 'competition', 'meetup', 'other')),
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  venue TEXT,
  is_online INTEGER NOT NULL DEFAULT 0 CHECK (is_online IN (0, 1)),
  online_url TEXT,
  registration_url TEXT,
  registration_label TEXT,
  badge TEXT,
  cover_media_id TEXT REFERENCES media_assets(id) ON DELETE SET NULL,
  is_featured INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1)),
  color TEXT CHECK (color IS NULL OR color IN ('yellow', 'mint', 'lilac', 'coral', 'sky', 'blue', 'paper')),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS event_media (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  media_asset_id TEXT NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,
  alt_text TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  project_status TEXT NOT NULL CHECK (project_status IN ('idea', 'in-progress', 'shipped', 'maintained')),
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  initiative_id TEXT REFERENCES research_initiatives(id) ON DELETE SET NULL,
  repo_url TEXT,
  live_url TEXT,
  docs_url TEXT,
  stars INTEGER CHECK (stars IS NULL OR stars >= 0),
  cover_media_id TEXT REFERENCES media_assets(id) ON DELETE SET NULL,
  is_featured INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1)),
  looking_for_contributors INTEGER NOT NULL DEFAULT 0 CHECK (looking_for_contributors IN (0, 1)),
  color TEXT CHECK (color IS NULL OR color IN ('yellow', 'mint', 'lilac', 'coral', 'sky', 'blue', 'paper')),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS project_technologies (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, technology)
);

CREATE TABLE IF NOT EXISTS project_contributors (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  team_member_id TEXT NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, team_member_id)
);

CREATE TABLE IF NOT EXISTS project_media (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_asset_id TEXT NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,
  alt_text TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tech_areas (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  color TEXT CHECK (color IS NULL OR color IN ('yellow', 'mint', 'lilac', 'coral', 'sky', 'blue', 'paper')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS project_tech_areas (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tech_area_id TEXT NOT NULL REFERENCES tech_areas(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, tech_area_id)
);

CREATE TABLE IF NOT EXISTS research_initiatives (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS initiative_members (
  initiative_id TEXT NOT NULL REFERENCES research_initiatives(id) ON DELETE CASCADE,
  team_member_id TEXT NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (initiative_id, team_member_id)
);

CREATE TABLE IF NOT EXISTS initiative_projects (
  initiative_id TEXT NOT NULL REFERENCES research_initiatives(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (initiative_id, project_id)
);

CREATE TABLE IF NOT EXISTS publications (
  id TEXT PRIMARY KEY,
  initiative_id TEXT REFERENCES research_initiatives(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year BETWEEN 1900 AND 2200),
  url TEXT,
  file_asset_id TEXT REFERENCES media_assets(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS publication_authors (
  publication_id TEXT NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (publication_id, sort_order)
);

CREATE TABLE IF NOT EXISTS resource_categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES resource_categories(id) ON DELETE RESTRICT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('file', 'link', 'video', 'doc')),
  url TEXT,
  file_asset_id TEXT REFERENCES media_assets(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS resource_tech_areas (
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  tech_area_id TEXT NOT NULL REFERENCES tech_areas(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (resource_id, tech_area_id)
);

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('news', 'research', 'partnership', 'community', 'notice')),
  published_at TEXT NOT NULL,
  is_pinned INTEGER NOT NULL DEFAULT 0 CHECK (is_pinned IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS mentors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('main', 'minor')),
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  color TEXT NOT NULL,
  photo_asset_id TEXT REFERENCES media_assets(id) ON DELETE SET NULL,
  tagline TEXT,
  comment TEXT,
  bio TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS mentor_links (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL CHECK (link_type IN ('email', 'linkedin', 'github', 'website', 'other')),
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Public forms write here. Admin access and retention controls are implemented with the API layer.
CREATE TABLE IF NOT EXISTS join_submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  roll_number TEXT,
  batch TEXT,
  interests_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(interests_json)),
  experience TEXT,
  message TEXT,
  submission_status TEXT NOT NULL DEFAULT 'new' CHECK (submission_status IN ('new', 'reviewing', 'accepted', 'rejected', 'closed')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  submission_status TEXT NOT NULL DEFAULT 'new' CHECK (submission_status IN ('new', 'reviewing', 'responded', 'closed')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Query-oriented indexes used by public pages and the future admin interface.
CREATE INDEX IF NOT EXISTS idx_page_sections_page_order ON page_sections(page_id, is_enabled, sort_order);
CREATE INDEX IF NOT EXISTS idx_departments_status_order ON departments(status, sort_order);
CREATE INDEX IF NOT EXISTS idx_team_members_status_order ON team_members(status, sort_order);
CREATE INDEX IF NOT EXISTS idx_department_members_order ON department_members(department_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_events_status_start ON events(status, starts_at);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(status, is_featured, starts_at);
CREATE INDEX IF NOT EXISTS idx_projects_status_order ON projects(status, project_status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(status, is_featured);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(status, is_pinned, published_at);
CREATE INDEX IF NOT EXISTS idx_resources_status_category ON resources(status, category_id);
CREATE INDEX IF NOT EXISTS idx_publications_status_year ON publications(status, year DESC);
CREATE INDEX IF NOT EXISTS idx_mentors_status_tier ON mentors(status, tier, sort_order);
CREATE INDEX IF NOT EXISTS idx_join_submissions_status_date ON join_submissions(submission_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status_date ON contact_submissions(submission_status, created_at DESC);
