import type { GroupMembership, PokemonGroup } from "@/types/groups";

export type ExistingListsMode = "none" | "single" | "dropdown";

export const resolveExistingListsMode = (groups: PokemonGroup[]): ExistingListsMode => {
  if (groups.length === 0) return "none";
  if (groups.length === 1) return "single";
  return "dropdown";
};

export const getMembershipGroupIds = (
  memberships: GroupMembership[],
  pokemonId: string,
): string[] =>
  memberships
    .filter((membership) => membership.pokemonId === pokemonId)
    .map((membership) => membership.groupId);

export interface ListSelectionDiff {
  toAdd: string[];
  toRemove: string[];
}

export const diffListSelection = (
  memberGroupIds: string[],
  selectedIds: string[],
): ListSelectionDiff => ({
  toAdd: selectedIds.filter((id) => !memberGroupIds.includes(id)),
  toRemove: memberGroupIds.filter((id) => !selectedIds.includes(id)),
});

export const hasListChanges = (diff: ListSelectionDiff): boolean =>
  diff.toAdd.length > 0 || diff.toRemove.length > 0;

export interface NewListDefaults {
  name: string;
  isDefault: boolean;
}

export const getNewListDefaults = (groups: PokemonGroup[]): NewListDefaults =>
  groups.length === 0 ? { name: "Favorites", isDefault: true } : { name: "", isDefault: false };

export const isValidNewListName = (name: string): boolean => name.trim().length > 0;
