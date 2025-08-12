export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface Pokemon {
  id: string;
  name: string;
  type: string[];
  image: string;
  stats: PokemonStats;
}

export interface PokemonList {
  total: number;
  offset: number;
  pokemon: Pokemon[];
}

export interface PokemonByTypeData {
  pokemonByType: PokemonList;
}

export interface TypesData {
  types: string[];
}
