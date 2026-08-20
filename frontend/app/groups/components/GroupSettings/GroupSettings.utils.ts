import type { PokemonGroup, User } from "@/types";

export type GroupSettingsState = "loading" | "signedOut" | "error" | "empty" | "list";

export const resolveGroupSettingsState = (
  isAuthLoading: boolean,
  user: User | undefined,
  isGroupsLoading: boolean,
  error: Error | null | undefined,
  groups: PokemonGroup[] | undefined,
): GroupSettingsState => {
  if (isAuthLoading) return "loading";
  if (!user) return "signedOut";
  if (isGroupsLoading) return "loading";
  if (error) return "error";
  if (!groups || groups.length === 0) return "empty";
  return "list";
};

export const shouldCommitRename = (currentName: string, nextName: string): boolean => {
  const trimmed = nextName.trim();
  return trimmed.length > 0 && trimmed !== currentName;
};
