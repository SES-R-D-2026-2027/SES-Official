export const MEDIA_STORAGE_WARNING_BYTES = 5_000_000_000;
export const MEDIA_STORAGE_UPLOAD_LIMIT_BYTES = 8_000_000_000;
export const MEDIA_UPLOAD_RESERVATION_TTL_MINUTES = 60;

export interface MediaStorageUsage {
  usedBytes: number;
  reservedBytes: number;
  totalCommittedAndReservedBytes: number;
  warningThresholdBytes: number;
  uploadLimitBytes: number;
  warning: boolean;
  uploadsBlocked: boolean;
  remainingBytes: number;
  percentageOfUploadLimit: number;
}

interface MediaStorageRow {
  used_bytes: number;
  reserved_bytes: number;
  warning_threshold_bytes: number;
  upload_limit_bytes: number;
}

export class MediaStorageLimitError extends Error {
  readonly code = "MEDIA_STORAGE_LIMIT_REACHED";

  constructor(message = "Media uploads are paused because the storage safety limit has been reached.") {
    super(message);
    this.name = "MediaStorageLimitError";
  }
}

export function toMediaStorageUsage(row: MediaStorageRow): MediaStorageUsage {
  const usedBytes = Number(row.used_bytes);
  const reservedBytes = Number(row.reserved_bytes);
  const total = usedBytes + reservedBytes;
  const uploadLimitBytes = Number(row.upload_limit_bytes);
  const warningThresholdBytes = Number(row.warning_threshold_bytes);

  return {
    usedBytes,
    reservedBytes,
    totalCommittedAndReservedBytes: total,
    warningThresholdBytes,
    uploadLimitBytes,
    warning: total >= warningThresholdBytes,
    uploadsBlocked: total >= uploadLimitBytes,
    remainingBytes: Math.max(0, uploadLimitBytes - total),
    percentageOfUploadLimit: uploadLimitBytes > 0 ? Math.min(100, (total / uploadLimitBytes) * 100) : 100,
  };
}

export async function getMediaStorageUsage(db: D1Database): Promise<MediaStorageUsage> {
  const row = await db
    .prepare(
      `SELECT used_bytes, reserved_bytes, warning_threshold_bytes, upload_limit_bytes
       FROM media_storage_state WHERE id = 1`,
    )
    .first<MediaStorageRow>();

  if (!row) throw new Error("Media storage guardrails have not been installed. Apply migration 0002.");
  return toMediaStorageUsage(row);
}

/**
 * Reserve capacity before writing to R2. The INSERT ... SELECT is atomic in D1,
 * so simultaneous uploads cannot reserve beyond the 8 GB application limit.
 */
export async function reserveMediaUpload(
  db: D1Database,
  reservationId: string,
  sizeBytes: number,
): Promise<MediaStorageUsage> {
  if (!Number.isSafeInteger(sizeBytes) || sizeBytes <= 0) {
    throw new RangeError("Upload size must be a positive safe integer.");
  }
  if (!reservationId || reservationId.length > 128) {
    throw new TypeError("A valid upload reservation ID is required.");
  }

  const expiresAt = new Date(Date.now() + MEDIA_UPLOAD_RESERVATION_TTL_MINUTES * 60_000).toISOString();
  await db
    .prepare("DELETE FROM media_upload_reservations WHERE expires_at <= ?")
    .bind(new Date().toISOString())
    .run();

  const result = await db
    .prepare(
      `INSERT INTO media_upload_reservations (id, size_bytes, expires_at)
       SELECT ?, ?, ?
       WHERE EXISTS (
         SELECT 1 FROM media_storage_state
         WHERE id = 1 AND used_bytes + reserved_bytes + ? <= upload_limit_bytes
       )`,
    )
    .bind(reservationId, sizeBytes, expiresAt, sizeBytes)
    .run();

  if (result.meta.changes !== 1) throw new MediaStorageLimitError();
  return getMediaStorageUsage(db);
}

/**
 * Release a reservation when an R2 write fails or is cancelled.
 * Deleting the reservation automatically updates reserved_bytes via its trigger.
 */
export async function releaseMediaUpload(db: D1Database, reservationId: string): Promise<void> {
  await db.prepare("DELETE FROM media_upload_reservations WHERE id = ?").bind(reservationId).run();
}

/**
 * Call in the same D1 batch as inserting the media_assets row after the R2 put.
 * The media_assets trigger increments used_bytes; deleting the reservation frees
 * the reserved capacity in the same transaction.
 */
export function completeMediaUploadStatement(db: D1Database, reservationId: string): D1PreparedStatement {
  return db.prepare("DELETE FROM media_upload_reservations WHERE id = ?").bind(reservationId);
}

export interface MediaAssetRecord {
  id: string;
  objectKey: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  altText?: string;
  isPublic?: boolean;
}

/** Persist media metadata and release its reservation in one atomic D1 batch. */
export async function completeMediaUpload(
  db: D1Database,
  reservationId: string,
  asset: MediaAssetRecord,
): Promise<MediaStorageUsage> {
  if (!Number.isSafeInteger(asset.sizeBytes) || asset.sizeBytes <= 0) {
    throw new RangeError("Media asset size must be a positive safe integer.");
  }

  const results = await db.batch([
    db
      .prepare(
        `INSERT INTO media_assets (
           id, object_key, original_file_name, mime_type, size_bytes, alt_text, is_public
         )
         SELECT ?, ?, ?, ?, ?, ?, ?
         WHERE EXISTS (
           SELECT 1 FROM media_upload_reservations
           WHERE id = ? AND size_bytes >= ?
         )
         ON CONFLICT(object_key) DO UPDATE SET
           original_file_name = excluded.original_file_name,
           mime_type = excluded.mime_type,
           size_bytes = excluded.size_bytes,
           alt_text = excluded.alt_text,
           is_public = excluded.is_public,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
      )
      .bind(
        asset.id,
        asset.objectKey,
        asset.originalFileName,
        asset.mimeType,
        asset.sizeBytes,
        asset.altText ?? "",
        asset.isPublic === false ? 0 : 1,
        reservationId,
        asset.sizeBytes,
      ),
    completeMediaUploadStatement(db, reservationId),
  ]);

  if (results[0]?.meta.changes !== 1) {
    throw new Error("The media upload reservation expired or no longer exists.");
  }
  return getMediaStorageUsage(db);
}
