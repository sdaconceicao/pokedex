import type { ToastContent } from "@code-x/lago";
import { ToastQueue } from "@code-x/lago";

/**
 * Every toast auto-dismisses. A toast that stays forever overlays whatever is
 * beneath it and swallows clicks there — which is how the "Signed in" toast
 * ended up blocking the account menu.
 */
export const TOAST_TIMEOUT_MS = 30_000;

/** Raise a toast. Wraps ToastQueue.add so no call site can omit the timeout. */
export function notify(content: ToastContent): void {
  ToastQueue.add(content, { timeout: TOAST_TIMEOUT_MS });
}
