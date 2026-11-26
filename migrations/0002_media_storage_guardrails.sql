-- SES Version 2: R2 storage quota guardrails.
-- The account's R2 free allowance is 10 GB-month. SES warns at 5 GB and refuses
-- new uploads when used + reserved capacity would exceed 8 GB.

CREATE TABLE IF NOT EXISTS media_storage_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  used_bytes INTEGER NOT NULL DEFAULT 0 CHECK (used_bytes >= 0),
  reserved_bytes INTEGER NOT NULL DEFAULT 0 CHECK (reserved_bytes >= 0),
  warning_threshold_bytes INTEGER NOT NULL DEFAULT 5000000000 CHECK (warning_threshold_bytes > 0),
  upload_limit_bytes INTEGER NOT NULL DEFAULT 8000000000 CHECK (upload_limit_bytes > 0),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

INSERT OR IGNORE INTO media_storage_state (id) VALUES (1);

CREATE TABLE IF NOT EXISTS media_upload_reservations (
  id TEXT PRIMARY KEY,
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_upload_reservations_expires_at
  ON media_upload_reservations(expires_at);

-- Reservations are accounted for atomically as they are added or removed.
CREATE TRIGGER IF NOT EXISTS trg_media_reservation_insert
AFTER INSERT ON media_upload_reservations
BEGIN
  UPDATE media_storage_state
  SET reserved_bytes = reserved_bytes + NEW.size_bytes,
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_media_reservation_delete
AFTER DELETE ON media_upload_reservations
BEGIN
  UPDATE media_storage_state
  SET reserved_bytes = MAX(0, reserved_bytes - OLD.size_bytes),
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = 1;
END;

-- The media_assets inventory is the source of truth for bytes stored by the app.
CREATE TRIGGER IF NOT EXISTS trg_media_asset_insert
AFTER INSERT ON media_assets
BEGIN
  UPDATE media_storage_state
  SET used_bytes = used_bytes + NEW.size_bytes,
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_media_asset_delete
AFTER DELETE ON media_assets
BEGIN
  UPDATE media_storage_state
  SET used_bytes = MAX(0, used_bytes - OLD.size_bytes),
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_media_asset_size_update
AFTER UPDATE OF size_bytes ON media_assets
WHEN NEW.size_bytes != OLD.size_bytes
BEGIN
  UPDATE media_storage_state
  SET used_bytes = MAX(0, used_bytes - OLD.size_bytes) + NEW.size_bytes,
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = 1;
END;
