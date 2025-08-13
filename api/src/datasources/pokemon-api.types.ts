export interface PokemonIndex {
  id: string;
  name: string;
  number: number;
}

export type NamedAPIResource = {
  name: string;
  url: string;
};

export type PokemonAbilityLite = {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
};

export type EffectEntry = {
  effect: string;
  short_effect: string;
  language: NamedAPIResource;
};

export type FlavorTextEntry = {
  flavor_text: string;
  language: NamedAPIResource;
  version_group: NamedAPIResource;
};

export type NameEntry = {
  name: string;
  language: NamedAPIResource;
};

export type AbilityPokemon = {
  is_hidden: boolean;
  slot: number;
  pokemon: NamedAPIResource;
};

export type PokemonAbility = {
  effect_entries: EffectEntry[];
  flavor_text_entries: FlavorTextEntry[];
  generation: NamedAPIResource;
  id: number;
  is_main_series: boolean;
  name: string;
  names: NameEntry[];
  pokemon: AbilityPokemon[];
};

export type PokemonCry = {
  latest: string;
  legacy: string;
};

export type GameIndex = {
  game_index: number;
  version: NamedAPIResource;
};

export type MoveLearnMethod = {
  name: string;
  url: string;
};

export type VersionGroupDetail = {
  level_learned_at: number;
  move_learn_method: MoveLearnMethod;
  order: number | null;
  version_group: NamedAPIResource;
};

export type PokemonMove = {
  move: NamedAPIResource;
  version_group_details: VersionGroupDetail[];
};

export type PastAbility = {
  abilities: {
    ability: NamedAPIResource | null;
    is_hidden: boolean;
    slot: number;
  }[];
  generation: NamedAPIResource;
};

export type SpriteSet = {
  back_default: string | null;
  back_female?: string | null;
  back_shiny?: string | null;
  back_shiny_female?: string | null;
  front_default: string | null;
  front_female?: string | null;
  front_shiny?: string | null;
  front_shiny_female?: string | null;
};

export type OtherSprites = {
  dream_world: SpriteSet;
  home: SpriteSet;
  "official-artwork": {
    front_default: string;
    front_shiny: string;
  };
  showdown: SpriteSet;
};

export type VersionSprites = {
  [version: string]: SpriteSet | any;
};

export type GenerationSprites = {
  [generation: string]: VersionSprites;
};

export type Sprites = SpriteSet & {
  other?: OtherSprites;
  versions?: GenerationSprites;
};

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
};

export type PokemonType = {
  slot: number;
  type: NamedAPIResource;
};

export type PokemonEntity = {
  abilities: PokemonAbilityLite[];
  base_experience: number;
  cries: PokemonCry;
  forms: NamedAPIResource[];
  game_indices: GameIndex[];
  height: number;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: PokemonMove[];
  name: string;
  order: number;
  past_abilities: PastAbility[];
  species: NamedAPIResource;
  sprites: Sprites;
  stats: PokemonStat[];
  types: PokemonType[];
};

export type PokemonResponse = {
  results: PokemonEntity[];
};

export type PokemonListResponse = {
  results: NamedAPIResource[];
};

// Region-related types
export type Region = {
  id: number;
  name: string;
  names: NameEntry[];
  main_generation: NamedAPIResource;
  locations: NamedAPIResource[];
  version_groups: NamedAPIResource[];
  pokedexes: NamedAPIResource[];
};

// Type-related types
export type TypePokemon = {
  slot: number;
  pokemon: NamedAPIResource;
};

export type TypeResponse = {
  id: number;
  name: string;
  damage_relations: {
    no_damage_to: NamedAPIResource[];
    half_damage_to: NamedAPIResource[];
    double_damage_to: NamedAPIResource[];
    no_damage_from: NamedAPIResource[];
    half_damage_from: NamedAPIResource[];
    double_damage_from: NamedAPIResource[];
  };
  game_indices: GameIndex[];
  generation: NamedAPIResource;
  move_damage_class: NamedAPIResource | null;
  names: NameEntry[];
  pokemon: TypePokemon[];
  moves: NamedAPIResource[];
};

// Location-related types
export type Location = {
  id: number;
  name: string;
  region: NamedAPIResource;
  areas: NamedAPIResource[];
  names: NameEntry[];
};

export type LocationArea = {
  id: number;
  name: string;
  game_index: number;
  encounter_method_rates: {
    encounter_method: NamedAPIResource;
    version_details: {
      rate: number;
      version: NamedAPIResource;
    }[];
  }[];
  location: NamedAPIResource;
  names: NameEntry[];
  pokemon_encounters: {
    pokemon: NamedAPIResource;
    version_details: {
      encounter_details: {
        chance: number;
        condition_values: NamedAPIResource[];
        max_level: number;
        method: NamedAPIResource;
        min_level: number;
      }[];
      max_chance: number;
      version: NamedAPIResource;
    }[];
  }[];
};

// Pokedex-related types
export type Pokedex = {
  id: number;
  name: string;
  descriptions: {
    description: string;
    language: NamedAPIResource;
  }[];
  names: NameEntry[];
  pokemon_entries: {
    entry_number: number;
    pokemon_species: NamedAPIResource;
  }[];
  region: NamedAPIResource | null;
  version_groups: NamedAPIResource[];
};

export type PokedexListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
};
