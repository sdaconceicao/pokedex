import type { GroupPokemon, User } from "@/types";

export type GroupDetailState = "loading" | "signedOut" | "notFound" | "empty" | "list";

export const toPokemonIds = (pokemon: GroupPokemon[] | undefined): string[] =>
  (pokemon ?? []).map((entry) => entry.pokemonId);

export const resolveGroupDetailState = (
  isAuthLoading: boolean,
  user: User | undefined,
  isPokemonLoading: boolean,
  pokemonError: Error | null | undefined,
  pokemonIds: string[],
  isDetailLoading: boolean,
): GroupDetailState => {
  if (isAuthLoading) return "loading";
  if (!user) return "signedOut";
  if (isPokemonLoading) return "loading";
  if (pokemonError) return "notFound";
  if (pokemonIds.length === 0) return "empty";
  if (isDetailLoading) return "loading";
  return "list";
};
