import type { User } from "@/types";

export type AccountProfileState = "loading" | "signedOut" | "error" | "ready";

export const resolveAccountProfileState = (
  isAuthLoading: boolean,
  user: User | undefined,
  error: Error | null | undefined,
): AccountProfileState => {
  if (isAuthLoading) return "loading";
  // Checked before `error` to match resolveGroupSettingsState: useAuth reports
  // `user: undefined` on a failed fetch, so that surfaces as the sign-in prompt
  // rather than an error alert. Keeps /account and /groups consistent.
  if (!user) return "signedOut";
  if (error) return "error";
  return "ready";
};
