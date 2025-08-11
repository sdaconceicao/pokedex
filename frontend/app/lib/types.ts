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

export interface PokemonByTypeData {
  pokemonByType: Pokemon[];
}

export interface TypesData {
  types: string[];
}
