import type { GroupMembership } from "@/types/groups";

export const isPokemonSaved = (memberships: GroupMembership[], pokemonId: string): boolean =>
  memberships.some((membership) => membership.pokemonId === pokemonId);
