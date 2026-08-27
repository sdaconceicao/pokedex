/** 500 KiB, measured on the decoded file — matches the DB's CK_user_avatars_size. */
export const AVATAR_MAX_BYTES = 512_000;

/**
 * Raster formats only: an SVG served back from the API origin would be stored
 * XSS. Mirrored by CK_user_avatars_mime, so a bypass here still hits the DB.
 */
export const AVATAR_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export type AvatarMimeType = (typeof AVATAR_MIME_TYPES)[number];

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);

// Enough for the longest check: RIFF....WEBP needs 12.
const MIN_SIGNATURE_BYTES = 12;

/**
 * Identifies an uploaded avatar by its leading bytes rather than the multipart
 * part's declared `mimetype`, which is client-supplied and unverified. Returns
 * null for anything not on the allow-list — including SVG, which would be
 * stored XSS if served back from the API origin.
 */
export function resolveAvatarMimeType(data: Buffer): AvatarMimeType | null {
  if (data.length < MIN_SIGNATURE_BYTES) return null;

  if (data.subarray(0, 8).equals(PNG_SIGNATURE)) return 'image/png';
  if (data.subarray(0, 3).equals(JPEG_SIGNATURE)) return 'image/jpeg';

  // "RIFF" then a little-endian length then "WEBP". The length is not checked:
  // parsing the container is more than a signature check should do, and a
  // corrupt image simply fails to render.
  if (
    data.subarray(0, 4).toString('ascii') === 'RIFF' &&
    data.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

/**
 * Whether the decoded file is within the stored ceiling. A second gate behind
 * multipart's `limits.fileSize`, which only catches *exceeding* the cap and
 * depends on the plugin being configured correctly.
 */
export function isAvatarWithinSizeLimit(data: Buffer): boolean {
  return data.length > 0 && data.length <= AVATAR_MAX_BYTES;
}
