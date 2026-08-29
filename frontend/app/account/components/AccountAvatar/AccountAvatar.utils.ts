import type { FileUploadItem } from "@code-x/lago";

/**
 * Accepted formats and ceiling, mirroring the API's own gate
 * (`users/validation/avatar.validation.ts`). The server is authoritative — these
 * copies only buy the user faster feedback than a round trip. There is no shared
 * package between the two, and creating one for two constants would be
 * disproportionate.
 */
export const AVATAR_ACCEPT = "image/png,image/jpeg,image/webp";
export const AVATAR_MAX_BYTES = 512_000;

const STORED_AVATAR_ID = "stored-avatar";

/**
 * Turns a stored avatar's data URI into a `FileUploadItem`, so the round
 * uploader shows the current picture in the same slot a newly picked one lands
 * in.
 *
 * Synchronous on purpose: decoding base64 needs no `fetch`, which lets the
 * caller derive this during render instead of copying it into state from an
 * effect — an async hydration could miss a value that arrived on a later render.
 *
 * lago requires a `File` on every item and a persisted image has none, so the
 * bytes are re-materialised and given a synthetic name — the original filename
 * is not kept server-side. Delete this once `FileUploadItem` can express an
 * already-saved file without inventing one.
 */
export function dataUriToUploadItem(dataUri: string): FileUploadItem {
  const [header, base64 = ""] = dataUri.split(",");
  const mimeType = header.match(/^data:([^;]+)/)?.[1] ?? "image/png";
  const binary = atob(base64);

  return {
    id: STORED_AVATAR_ID,
    file: new File(
      [Uint8Array.from(binary, (char) => char.charCodeAt(0))],
      `avatar.${mimeType.split("/")[1] ?? "png"}`,
      { type: mimeType },
    ),
    // The data URI is already renderable, so it doubles as the preview and
    // there is no object URL to revoke.
    previewUrl: dataUri,
    status: "complete",
  };
}
