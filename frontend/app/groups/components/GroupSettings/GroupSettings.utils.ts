import type { PokemonGroup, UpdateGroupRequest, User } from "@/types";

export type GroupSettingsState = "loading" | "signedOut" | "error" | "empty" | "populated";

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
  return "populated";
};

export const isValidGroupName = (name: string): boolean => name.trim().length > 0;

export interface GroupEditValues {
  name: string;
  makeDefault: boolean;
}

/**
 * Diffs a row's edit mode values against the group as loaded, returning only
 * the fields that actually changed. Returns `null` when there is nothing to
 * send: an invalid name, or no changes at all.
 *
 * `isDefault` is never sent as `false` here: the API silently ignores that
 * value (a signed-in user always has exactly one default group, so there is
 * no request that clears one), so this only ever proposes promoting a group
 * that isn't already the default.
 */
export const buildGroupUpdatePayload = (
  group: PokemonGroup,
  edited: GroupEditValues,
): UpdateGroupRequest | null => {
  if (!isValidGroupName(edited.name)) return null;

  const payload: UpdateGroupRequest = {};
  const trimmedName = edited.name.trim();
  if (trimmedName !== group.name) payload.name = trimmedName;
  if (edited.makeDefault && !group.isDefault) payload.isDefault = true;

  return Object.keys(payload).length > 0 ? payload : null;
};
