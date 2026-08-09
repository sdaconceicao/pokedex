/**
 * The type URL itself has no Pokemon open. This has to exist as a real page: a
 * slot that doesn't match the target URL keeps whatever it was already showing
 * across a soft navigation, so without it, navigating from a Pokemon back to
 * the type would leave the detail on screen.
 */
export default function Page() {
  return null;
}
