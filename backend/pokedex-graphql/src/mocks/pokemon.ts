import type { EvolutionChainResponse, PokemonSpecies } from "../datasources/pokemon-api.types.js";

export const pokemonList: {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
} = {
  count: 1281,
  next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  previous: null,
  results: [
    {
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon/1/",
    },
    {
      name: "ivysaur",
      url: "https://pokeapi.co/api/v2/pokemon/2/",
    },
    {
      name: "venusaur",
      url: "https://pokeapi.co/api/v2/pokemon/3/",
    },
    {
      name: "charmander",
      url: "https://pokeapi.co/api/v2/pokemon/4/",
    },
    {
      name: "charmeleon",
      url: "https://pokeapi.co/api/v2/pokemon/5/",
    },
    {
      name: "charizard",
      url: "https://pokeapi.co/api/v2/pokemon/6/",
    },
    {
      name: "charizard-mega-x",
      url: "https://pokeapi.co/api/v2/pokemon/10034/",
    },
    {
      name: "bulbasaur-gmax",
      url: "https://pokeapi.co/api/v2/pokemon/10186/",
    },
    {
      name: "pikachu-gmax",
      url: "https://pokeapi.co/api/v2/pokemon/10199/",
    },
  ],
};

export const pokemonSpeciesList: typeof pokemonList = {
  count: 1025,
  next: "https://pokeapi.co/api/v2/pokemon-species?offset=20&limit=20",
  previous: null,
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
    { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon-species/3/" },
    { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon-species/4/" },
    { name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon-species/5/" },
    { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon-species/6/" },
  ],
};

export const pokemonEntity: {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  order: number;
  is_default: boolean;
  location_area_encounters: string;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  forms: Array<{
    name: string;
    url: string;
  }>;
  game_indices: Array<{
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }>;
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      order: number | null;
      version_group: {
        name: string;
        url: string;
      };
    }>;
  }>;
  past_abilities: Array<{
    abilities: Array<{
      ability: {
        name: string;
        url: string;
      } | null;
      is_hidden: boolean;
      slot: number;
    }>;
    generation: {
      name: string;
      url: string;
    };
  }>;
  species: {
    name: string;
    url: string;
  };
  sprites: {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: {
      dream_world: {
        front_default: string | null;
        front_female: string | null;
      };
      home: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      "official-artwork": {
        front_default: string | null;
        front_shiny: string | null;
      };
      showdown: {
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
    versions: {
      [key: string]: {
        [key: string]: {
          back_default: string | null;
          back_gray: string | null;
          back_transparent: string | null;
          front_default: string | null;
          front_gray: string | null;
          front_transparent: string | null;
        };
      };
    };
  };
  cries: {
    latest: string;
    legacy: string;
  };
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
} = {
  id: 1,
  name: "bulbasaur",
  base_experience: 64,
  height: 7,
  weight: 69,
  order: 1,
  is_default: true,
  location_area_encounters: "https://pokeapi.co/api/v2/pokemon/1/encounters",
  abilities: [
    {
      ability: {
        name: "overgrow",
        url: "https://pokeapi.co/api/v2/ability/65/",
      },
      is_hidden: false,
      slot: 1,
    },
    {
      ability: {
        name: "chlorophyll",
        url: "https://pokeapi.co/api/v2/ability/34/",
      },
      is_hidden: true,
      slot: 3,
    },
  ],
  forms: [
    {
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon-form/1/",
    },
  ],
  game_indices: [
    {
      game_index: 153,
      version: {
        name: "red",
        url: "https://pokeapi.co/api/v2/version/1/",
      },
    },
  ],
  moves: [
    {
      move: {
        name: "razor-wind",
        url: "https://pokeapi.co/api/v2/move/13/",
      },
      version_group_details: [
        {
          level_learned_at: 0,
          move_learn_method: {
            name: "machine",
            url: "https://pokeapi.co/api/v2/move-learn-method/4/",
          },
          order: null,
          version_group: {
            name: "red-blue",
            url: "https://pokeapi.co/api/v2/version-group/1/",
          },
        },
      ],
    },
  ],
  past_abilities: [],
  species: {
    name: "bulbasaur",
    url: "https://pokeapi.co/api/v2/pokemon-species/1/",
  },
  sprites: {
    back_default:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
    back_female: null,
    back_shiny:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png",
    back_shiny_female: null,
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    front_female: null,
    front_shiny:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png",
    front_shiny_female: null,
    other: {
      dream_world: {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg",
        front_female: null,
      },
      home: {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png",
        front_female: null,
        front_shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/1.png",
        front_shiny_female: null,
      },
      "official-artwork": {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        front_shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png",
      },
      showdown: {
        back_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/1.gif",
        back_female: null,
        back_shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/shiny/1.gif",
        back_shiny_female: null,
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1.gif",
        front_female: null,
        front_shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/1.gif",
        front_shiny_female: null,
      },
    },
    versions: {
      "generation-i": {
        "red-blue": {
          back_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/1.png",
          back_gray:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/gray/1.png",
          back_transparent:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/1.png",
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/1.png",
          front_gray:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/1.png",
          front_transparent:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/1.png",
        },
      },
    },
  },
  cries: {
    latest: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg",
    legacy: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/1.ogg",
  },
  stats: [
    {
      base_stat: 45,
      effort: 0,
      stat: {
        name: "hp",
        url: "https://pokeapi.co/api/v2/stat/1/",
      },
    },
    {
      base_stat: 49,
      effort: 0,
      stat: {
        name: "attack",
        url: "https://pokeapi.co/api/v2/stat/2/",
      },
    },
    {
      base_stat: 49,
      effort: 0,
      stat: {
        name: "defense",
        url: "https://pokeapi.co/api/v2/stat/3/",
      },
    },
    {
      base_stat: 65,
      effort: 1,
      stat: {
        name: "special-attack",
        url: "https://pokeapi.co/api/v2/stat/4/",
      },
    },
    {
      base_stat: 65,
      effort: 0,
      stat: {
        name: "special-defense",
        url: "https://pokeapi.co/api/v2/stat/5/",
      },
    },
    {
      base_stat: 45,
      effort: 0,
      stat: {
        name: "speed",
        url: "https://pokeapi.co/api/v2/stat/6/",
      },
    },
  ],
  types: [
    {
      slot: 1,
      type: {
        name: "grass",
        url: "https://pokeapi.co/api/v2/type/12/",
      },
    },
    {
      slot: 2,
      type: {
        name: "poison",
        url: "https://pokeapi.co/api/v2/type/4/",
      },
    },
  ],
};

const version = (name: string) => ({
  name,
  url: `https://pokeapi.co/api/v2/version/${name}/`,
});

const english = { name: "en", url: "https://pokeapi.co/api/v2/language/9/" };

export const pokemonSpecies: PokemonSpecies = {
  id: 1,
  name: "bulbasaur",
  evolution_chain: {
    url: "https://pokeapi.co/api/v2/evolution-chain/1/",
  },
  flavor_text_entries: [
    {
      flavor_text: "A strange seed was\nplanted on its\nback at birth.",
      language: english,
      version: version("red"),
    },
    {
      flavor_text: "It can go for days\nwithout eating a\nsingle morsel.",
      language: english,
      version: version("blue"),
    },
    {
      flavor_text: "Une graine étrange\nlui a été plantée\ndans le dos.",
      language: { name: "fr", url: "https://pokeapi.co/api/v2/language/5/" },
      version: version("red"),
    },
    {
      flavor_text: "It can go for days\nwithout eating a\nsingle morsel.",
      language: english,
      version: version("leafgreen"),
    },
    {
      flavor_text: "While it is young,\nit uses the nutri\u00ad\nents in its seed.",
      language: english,
      version: version("shield"),
    },
  ],
  varieties: [
    {
      is_default: true,
      pokemon: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    },
    {
      is_default: false,
      pokemon: { name: "bulbasaur-gmax", url: "https://pokeapi.co/api/v2/pokemon/10186/" },
    },
  ],
};

const formEntity = (id: number, name: string, speciesId: number): typeof pokemonEntity => ({
  ...pokemonEntity,
  id,
  name,
  is_default: false,
  species: {
    name: name.split("-")[0],
    url: `https://pokeapi.co/api/v2/pokemon-species/${speciesId}/`,
  },
});

export const pokemonFormEntity: typeof pokemonEntity = {
  ...formEntity(10186, "bulbasaur-gmax", 1),
  sprites: {
    ...pokemonEntity.sprites,
    back_default: null,
    back_shiny: null,
    front_default: null,
    front_shiny: null,
    other: {
      ...pokemonEntity.sprites.other,
      "official-artwork": {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10186.png",
        front_shiny: null,
      },
    },
  },
};

export const charizardMegaXEntity = formEntity(10034, "charizard-mega-x", 6);
export const pikachuGmaxEntity = formEntity(10199, "pikachu-gmax", 25);

export const evolutionChain: EvolutionChainResponse = {
  id: 1,
  chain: {
    is_baby: false,
    species: {
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon-species/1/",
    },
    evolution_details: [],
    evolves_to: [
      {
        is_baby: false,
        species: {
          name: "ivysaur",
          url: "https://pokeapi.co/api/v2/pokemon-species/2/",
        },
        evolution_details: [
          {
            min_level: 16,
            item: null,
            trigger: {
              name: "level-up",
              url: "https://pokeapi.co/api/v2/evolution-trigger/1/",
            },
          },
        ],
        evolves_to: [
          {
            is_baby: false,
            species: {
              name: "venusaur",
              url: "https://pokeapi.co/api/v2/pokemon-species/3/",
            },
            evolution_details: [
              {
                min_level: 32,
                item: null,
                trigger: {
                  name: "level-up",
                  url: "https://pokeapi.co/api/v2/evolution-trigger/1/",
                },
              },
            ],
            evolves_to: [],
          },
        ],
      },
    ],
  },
};

export const pokemonAbility = {
  id: 65,
  name: "overgrow",
  is_main_series: true,
  generation: {
    name: "generation-iii",
    url: "https://pokeapi.co/api/v2/generation/3/",
  },
  names: [
    {
      name: "Overgrow",
      language: {
        name: "en",
        url: "https://pokeapi.co/api/v2/language/9/",
      },
    },
  ],
  effect_entries: [
    {
      effect:
        "When this Pokémon has 1/3 or less of its HP remaining, its grass-type moves inflict 1.5× as much regular damage.",
      short_effect: "Strengthens grass moves to inflict 1.5× damage at 1/3 max HP or less.",
      language: {
        name: "en",
        url: "https://pokeapi.co/api/v2/language/9/",
      },
    },
  ],
  flavor_text_entries: [
    {
      flavor_text: "Ups GRASS moves in a pinch.",
      language: {
        name: "en",
        url: "https://pokeapi.co/api/v2/language/9/",
      },
      version_group: {
        name: "ruby-sapphire",
        url: "https://pokeapi.co/api/v2/version-group/5/",
      },
    },
  ],
  pokemon: [
    {
      is_hidden: false,
      slot: 1,
      pokemon: {
        name: "bulbasaur",
        url: "https://pokeapi.co/api/v2/pokemon/1/",
      },
    },
  ],
};

export const typeResponse: {
  id: number;
  name: string;
  damage_relations: {
    no_damage_to: Array<{
      name: string;
      url: string;
    }>;
    half_damage_to: Array<{
      name: string;
      url: string;
    }>;
    double_damage_to: Array<{
      name: string;
      url: string;
    }>;
    no_damage_from: Array<{
      name: string;
      url: string;
    }>;
    half_damage_from: Array<{
      name: string;
      url: string;
    }>;
    double_damage_from: Array<{
      name: string;
      url: string;
    }>;
  };
  game_indices: Array<{
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }>;
  generation: {
    name: string;
    url: string;
  };
  move_damage_class: {
    name: string;
    url: string;
  } | null;
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  pokemon: Array<{
    slot: number;
    pokemon: {
      name: string;
      url: string;
    };
  }>;
  moves: Array<{
    name: string;
    url: string;
  }>;
  sprites: Record<string, Record<string, { name_icon: string | null; symbol_icon: string | null }>>;
} = {
  id: 12,
  name: "grass",
  damage_relations: {
    no_damage_to: [],
    half_damage_to: [
      {
        name: "fire",
        url: "https://pokeapi.co/api/v2/type/10/",
      },
      {
        name: "grass",
        url: "https://pokeapi.co/api/v2/type/12/",
      },
      {
        name: "poison",
        url: "https://pokeapi.co/api/v2/type/4/",
      },
      {
        name: "flying",
        url: "https://pokeapi.co/api/v2/type/3/",
      },
      {
        name: "bug",
        url: "https://pokeapi.co/api/v2/type/7/",
      },
      {
        name: "dragon",
        url: "https://pokeapi.co/api/v2/type/16/",
      },
      {
        name: "steel",
        url: "https://pokeapi.co/api/v2/type/9/",
      },
    ],
    double_damage_to: [
      {
        name: "water",
        url: "https://pokeapi.co/api/v2/type/11/",
      },
      {
        name: "ground",
        url: "https://pokeapi.co/api/v2/type/5/",
      },
      {
        name: "rock",
        url: "https://pokeapi.co/api/v2/type/6/",
      },
    ],
    no_damage_from: [],
    half_damage_from: [
      {
        name: "water",
        url: "https://pokeapi.co/api/v2/type/11/",
      },
      {
        name: "electric",
        url: "https://pokeapi.co/api/v2/type/13/",
      },
      {
        name: "grass",
        url: "https://pokeapi.co/api/v2/type/12/",
      },
      {
        name: "ground",
        url: "https://pokeapi.co/api/v2/type/5/",
      },
    ],
    double_damage_from: [
      {
        name: "fire",
        url: "https://pokeapi.co/api/v2/type/10/",
      },
      {
        name: "ice",
        url: "https://pokeapi.co/api/v2/type/15/",
      },
      {
        name: "poison",
        url: "https://pokeapi.co/api/v2/type/4/",
      },
      {
        name: "flying",
        url: "https://pokeapi.co/api/v2/type/3/",
      },
      {
        name: "bug",
        url: "https://pokeapi.co/api/v2/type/7/",
      },
    ],
  },
  game_indices: [
    {
      game_index: 20,
      version: {
        name: "red",
        url: "https://pokeapi.co/api/v2/version/1/",
      },
    },
  ],
  generation: {
    name: "generation-i",
    url: "https://pokeapi.co/api/v2/generation/1/",
  },
  move_damage_class: {
    name: "special",
    url: "https://pokeapi.co/api/v2/move-damage-class/3/",
  },
  names: [
    {
      name: "Grass",
      language: {
        name: "en",
        url: "https://pokeapi.co/api/v2/language/9/",
      },
    },
  ],
  pokemon: [
    {
      slot: 1,
      pokemon: {
        name: "bulbasaur",
        url: "https://pokeapi.co/api/v2/pokemon/1/",
      },
    },
    {
      slot: 1,
      pokemon: {
        name: "ivysaur",
        url: "https://pokeapi.co/api/v2/pokemon/2/",
      },
    },
  ],
  moves: [
    {
      name: "absorb",
      url: "https://pokeapi.co/api/v2/move/71/",
    },
  ],
  sprites: {
    "generation-ix": {
      "scarlet-violet": {
        name_icon:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/12.png",
        symbol_icon:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small/12.png",
      },
    },
  },
};

/**
 * Poison, so a dual-type Pokemon can be served both of its real halves.
 * Bulbasaur is grass/poison: handed one type twice, a matchup product squares
 * every multiplier — a quarter where a half belongs — and reads as plausible
 * while being wrong.
 */
export const poisonTypeResponse: typeof typeResponse = {
  ...typeResponse,
  id: 4,
  name: "poison",
  // Overridden alongside the relations so this fixture never answers "Grass"
  names: [
    {
      name: "Poison",
      language: {
        name: "en",
        url: "https://pokeapi.co/api/v2/language/9/",
      },
    },
  ],
  damage_relations: {
    no_damage_to: [{ name: "steel", url: "https://pokeapi.co/api/v2/type/9/" }],
    half_damage_to: [
      { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
      { name: "ground", url: "https://pokeapi.co/api/v2/type/5/" },
      { name: "rock", url: "https://pokeapi.co/api/v2/type/6/" },
      { name: "ghost", url: "https://pokeapi.co/api/v2/type/8/" },
    ],
    double_damage_to: [
      { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
      { name: "fairy", url: "https://pokeapi.co/api/v2/type/18/" },
    ],
    no_damage_from: [],
    half_damage_from: [
      { name: "fighting", url: "https://pokeapi.co/api/v2/type/2/" },
      { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
      { name: "bug", url: "https://pokeapi.co/api/v2/type/7/" },
      { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
      { name: "fairy", url: "https://pokeapi.co/api/v2/type/18/" },
    ],
    double_damage_from: [
      { name: "ground", url: "https://pokeapi.co/api/v2/type/5/" },
      { name: "psychic", url: "https://pokeapi.co/api/v2/type/14/" },
    ],
  },
};

/** Keyed the way `pokedexesBySlug` is, so the type handler can answer with the
 *  type it was actually asked for. */
export const typesBySlug: Record<string, typeof typeResponse> = {
  grass: typeResponse,
  poison: poisonTypeResponse,
};

export const pokedex = {
  id: 2,
  name: "kanto",
  is_main_series: true,
  descriptions: [
    {
      description: "Red and Blue version Pokémon",
      language: {
        name: "en",
        url: "https://pokeapi.co/api/v2/language/9/",
      },
    },
  ],
  names: [
    {
      name: "Kanto",
      language: {
        name: "en",
        url: "https://pokeapi.co/api/v2/language/9/",
      },
    },
  ],
  pokemon_entries: [
    {
      entry_number: 1,
      pokemon_species: {
        name: "bulbasaur",
        url: "https://pokeapi.co/api/v2/pokemon-species/1/",
      },
    },
    {
      entry_number: 2,
      pokemon_species: {
        name: "ivysaur",
        url: "https://pokeapi.co/api/v2/pokemon-species/2/",
      },
    },
  ],
  region: {
    name: "kanto",
    url: "https://pokeapi.co/api/v2/region/1/",
  },
  version_groups: [
    {
      name: "red-blue",
      url: "https://pokeapi.co/api/v2/version-group/1/",
    },
  ],
};

export const region = {
  id: 1,
  name: "kanto",
  names: [
    {
      name: "Kanto",
      language: {
        name: "en",
        url: "https://pokeapi.co/api/v2/language/9/",
      },
    },
  ],
  main_generation: {
    name: "generation-i",
    url: "https://pokeapi.co/api/v2/generation/1/",
  },
  locations: [
    {
      name: "pallet-town",
      url: "https://pokeapi.co/api/v2/location/1/",
    },
  ],
  version_groups: [
    {
      name: "red-blue",
      url: "https://pokeapi.co/api/v2/version-group/1/",
    },
  ],
  pokedexes: [
    {
      name: "kanto",
      url: "https://pokeapi.co/api/v2/pokedex/2/",
    },
  ],
};

/**
 * The dexes beyond `kanto`, so the mock list is not four copies of one dex.
 *
 * `national` covers a dex the API ties to no region and gives no version
 * groups; the Johto pair covers a place with two revisions, which is what the
 * nav collapses and the page offers a switcher for.
 */
export const pokedexNational = {
  id: 1,
  name: "national",
  is_main_series: true,
  descriptions: [
    {
      description: "Entire National dex",
      language: { name: "en", url: "https://pokeapi.co/api/v2/language/9/" },
    },
  ],
  names: [
    { name: "National", language: { name: "en", url: "https://pokeapi.co/api/v2/language/9/" } },
  ],
  pokemon_entries: [
    {
      entry_number: 1,
      pokemon_species: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
    },
    {
      entry_number: 2,
      pokemon_species: { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
    },
    {
      entry_number: 3,
      pokemon_species: { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon-species/3/" },
    },
  ],
  region: null,
  version_groups: [],
};

export const pokedexOriginalJohto = {
  id: 3,
  name: "original-johto",
  is_main_series: true,
  descriptions: [
    {
      description: "Gold/Silver/Crystal Johto dex",
      language: { name: "en", url: "https://pokeapi.co/api/v2/language/9/" },
    },
  ],
  names: [
    {
      name: "Original Johto",
      language: { name: "en", url: "https://pokeapi.co/api/v2/language/9/" },
    },
  ],
  pokemon_entries: [
    {
      entry_number: 1,
      pokemon_species: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
    },
  ],
  region: { name: "johto", url: "https://pokeapi.co/api/v2/region/2/" },
  version_groups: [{ name: "gold-silver", url: "https://pokeapi.co/api/v2/version-group/3/" }],
};

export const pokedexUpdatedJohto = {
  id: 7,
  name: "updated-johto",
  is_main_series: true,
  descriptions: [
    {
      description: "HeartGold/SoulSilver Johto dex",
      language: { name: "en", url: "https://pokeapi.co/api/v2/language/9/" },
    },
  ],
  names: [
    {
      name: "Updated Johto",
      language: { name: "en", url: "https://pokeapi.co/api/v2/language/9/" },
    },
  ],
  pokemon_entries: [
    {
      entry_number: 1,
      pokemon_species: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
    },
    {
      entry_number: 2,
      pokemon_species: { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
    },
  ],
  region: { name: "johto", url: "https://pokeapi.co/api/v2/region/2/" },
  version_groups: [
    { name: "heartgold-soulsilver", url: "https://pokeapi.co/api/v2/version-group/10/" },
  ],
};

/** Every mocked dex by slug, for the `pokedex/{name}` handler. */
export const pokedexesBySlug: Record<string, typeof pokedex | typeof pokedexNational> = {
  kanto: pokedex,
  national: pokedexNational,
  "original-johto": pokedexOriginalJohto,
  "updated-johto": pokedexUpdatedJohto,
};

export const pokedexListResponse: {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
} = {
  count: 28,
  next: null,
  previous: null,
  results: [
    {
      name: "national",
      url: "https://pokeapi.co/api/v2/pokedex/1/",
    },
    {
      name: "kanto",
      url: "https://pokeapi.co/api/v2/pokedex/2/",
    },
    {
      name: "original-johto",
      url: "https://pokeapi.co/api/v2/pokedex/3/",
    },
    {
      name: "updated-johto",
      url: "https://pokeapi.co/api/v2/pokedex/7/",
    },
  ],
};

export const regionListResponse: {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
} = {
  count: 8,
  next: null,
  previous: null,
  results: [
    {
      name: "kanto",
      url: "https://pokeapi.co/api/v2/region/1/",
    },
    {
      name: "johto",
      url: "https://pokeapi.co/api/v2/region/2/",
    },
  ],
};

export const typeListResponse: {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
} = {
  count: 20,
  next: null,
  previous: null,
  results: [
    {
      name: "normal",
      url: "https://pokeapi.co/api/v2/type/1/",
    },
    {
      name: "fighting",
      url: "https://pokeapi.co/api/v2/type/2/",
    },
    {
      name: "grass",
      url: "https://pokeapi.co/api/v2/type/12/",
    },
  ],
};
