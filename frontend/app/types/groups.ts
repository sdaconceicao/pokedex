export interface PokemonGroup {
  id: string;
  name: string;
  isDefault: boolean;
  pokemonCount: number;
}

export interface GroupPokemon {
  pokemonId: string;
  speciesId: string;
}

/** One (list, Pokemon) pairing -- every membership across all of the user's lists. */
export interface GroupMembership {
  groupId: string;
  pokemonId: string;
}

export interface CreateGroupRequest {
  name: string;
  isDefault?: boolean;
}

export interface UpdateGroupRequest {
  name?: string;
  isDefault?: boolean;
}
