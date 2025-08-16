import { PokemonEntity } from "../datasources/pokemon-api.types";
import {
  getPokemonAbilitiesLite,
  getPokemonDefaultImageUrl,
  getPokemonTypes,
  getPokemonStats,
  convertPokemonEntityToPokemon,
} from "./pokemon";

describe("getPokemonAbilitiesLite", () => {
  it("should extract ability information correctly", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
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
    } as PokemonEntity;

    const result = getPokemonAbilitiesLite(mockPokemon);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "65",
      name: "overgrow",
      url: "https://pokeapi.co/api/v2/ability/65/",
      isHidden: false,
      slot: 1,
    });
    expect(result[1]).toEqual({
      id: "34",
      name: "chlorophyll",
      url: "https://pokeapi.co/api/v2/ability/34/",
      isHidden: true,
      slot: 3,
    });
  });

  it("should handle empty abilities array", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      abilities: [],
    } as PokemonEntity;

    const result = getPokemonAbilitiesLite(mockPokemon);

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it("should handle ability URL with trailing slash", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      abilities: [
        {
          ability: {
            name: "overgrow",
            url: "https://pokeapi.co/api/v2/ability/65/",
          },
          is_hidden: false,
          slot: 1,
        },
      ],
    } as PokemonEntity;

    const result = getPokemonAbilitiesLite(mockPokemon);

    expect(result[0].id).toBe("65");
  });

  it("should handle ability URL without trailing slash", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      abilities: [
        {
          ability: {
            name: "overgrow",
            url: "https://pokeapi.co/api/v2/ability/65",
          },
          is_hidden: false,
          slot: 1,
        },
      ],
    } as PokemonEntity;

    const result = getPokemonAbilitiesLite(mockPokemon);

    expect(result[0].id).toBe("65");
  });
});

describe("getPokemonDefaultImageUrl", () => {
  it("should return front_default sprite when available", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      sprites: {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        front_shiny: null,
        back_default: null,
        back_shiny: null,
        other: {
          "official-artwork": {
            front_default:
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            front_shiny:
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png",
          },
          home: {
            front_default: null,
            front_shiny: null,
          },
          dream_world: {
            front_default: null,
            front_shiny: null,
          },
          showdown: {
            front_default: null,
            front_shiny: null,
          },
        },
      },
    } as PokemonEntity;

    const result = getPokemonDefaultImageUrl(mockPokemon);

    expect(result).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    );
  });

  it("should fallback to front_shiny when front_default is null", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      sprites: {
        front_default: null,
        front_shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png",
        back_default: null,
        back_shiny: null,
        other: {
          "official-artwork": {
            front_default:
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            front_shiny:
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png",
          },
          home: {
            front_default: null,
            front_shiny: null,
          },
          dream_world: {
            front_default: null,
            front_shiny: null,
          },
          showdown: {
            front_default: null,
            front_shiny: null,
          },
        },
      },
    } as PokemonEntity;

    const result = getPokemonDefaultImageUrl(mockPokemon);

    expect(result).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png"
    );
  });

  it("should fallback to back_default when front sprites are null", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      sprites: {
        front_default: null,
        front_shiny: null,
        back_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
        back_shiny: null,
        other: {
          "official-artwork": {
            front_default:
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            front_shiny:
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png",
          },
          home: {
            front_default: null,
            front_shiny: null,
          },
          dream_world: {
            front_default: null,
            front_shiny: null,
          },
          showdown: {
            front_default: null,
            front_shiny: null,
          },
        },
      },
    } as PokemonEntity;

    const result = getPokemonDefaultImageUrl(mockPokemon);

    expect(result).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png"
    );
  });

  it("should fallback to official-artwork when basic sprites are null", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      sprites: {
        front_default: null,
        front_shiny: null,
        back_default: null,
        back_shiny: null,
        other: {
          "official-artwork": {
            front_default:
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            front_shiny:
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png",
          },
          home: {
            front_default: null,
            front_shiny: null,
          },
          dream_world: {
            front_default: null,
            front_shiny: null,
          },
          showdown: {
            front_default: null,
            front_shiny: null,
          },
        },
      },
    } as PokemonEntity;

    const result = getPokemonDefaultImageUrl(mockPokemon);

    expect(result).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
    );
  });

  it("should return placeholder image when no sprites are available", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      sprites: {
        front_default: null,
        front_shiny: null,
        back_default: null,
        back_shiny: null,
        other: {
          "official-artwork": {
            front_default: null,
            front_shiny: null,
          },
          home: {
            front_default: null,
            front_shiny: null,
          },
          dream_world: {
            front_default: null,
            front_shiny: null,
          },
          showdown: {
            front_default: null,
            front_shiny: null,
          },
        },
      },
    } as PokemonEntity;

    const result = getPokemonDefaultImageUrl(mockPokemon);

    expect(result).toBe(
      "https://dummyimage.com/96x96/f0f0f0/666666.png&text=bulbasaur"
    );
  });

  it("should handle Pokemon name with special characters in placeholder", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "mr. mime",
      sprites: {
        front_default: null,
        front_shiny: null,
        back_default: null,
        back_shiny: null,
        other: {
          "official-artwork": {
            front_default: null,
            front_shiny: null,
          },
          home: {
            front_default: null,
            front_shiny: null,
          },
          dream_world: {
            front_default: null,
            front_shiny: null,
          },
          showdown: {
            front_default: null,
            front_shiny: null,
          },
        },
      },
    } as PokemonEntity;

    const result = getPokemonDefaultImageUrl(mockPokemon);

    expect(result).toBe(
      "https://dummyimage.com/96x96/f0f0f0/666666.png&text=mr.%20mime"
    );
  });
});

describe("getPokemonTypes", () => {
  it("should extract type names correctly", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      types: [
        {
          slot: 1,
          type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
        },
        {
          slot: 2,
          type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
        },
      ],
    } as PokemonEntity;

    const result = getPokemonTypes(mockPokemon);

    expect(result).toEqual(["grass", "poison"]);
  });

  it("should handle single type Pokemon", () => {
    const mockPokemon: PokemonEntity = {
      id: 25,
      name: "pikachu",
      types: [
        {
          slot: 1,
          type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" },
        },
      ],
    } as PokemonEntity;

    const result = getPokemonTypes(mockPokemon);

    expect(result).toEqual(["electric"]);
  });

  it("should handle Pokemon with no types", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      types: [],
    } as PokemonEntity;

    const result = getPokemonTypes(mockPokemon);

    expect(result).toEqual([]);
  });

  it("should preserve type order based on slot", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      types: [
        {
          slot: 2,
          type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
        },
        {
          slot: 1,
          type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
        },
      ],
    } as PokemonEntity;

    const result = getPokemonTypes(mockPokemon);

    expect(result).toEqual(["poison", "grass"]);
  });
});

describe("getPokemonStats", () => {
  it("should map all stats correctly", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      stats: [
        {
          base_stat: 45,
          effort: 0,
          stat: { name: "hp", url: "https://pokeapi.co/api/v2/stat/1/" },
        },
        {
          base_stat: 49,
          effort: 0,
          stat: { name: "attack", url: "https://pokeapi.co/api/v2/stat/2/" },
        },
        {
          base_stat: 49,
          effort: 0,
          stat: { name: "defense", url: "https://pokeapi.co/api/v2/stat/3/" },
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
          stat: { name: "speed", url: "https://pokeapi.co/api/v2/stat/6/" },
        },
      ],
    } as PokemonEntity;

    const result = getPokemonStats(mockPokemon);

    expect(result).toEqual({
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    });
  });

  it("should handle missing stats by defaulting to 0", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      stats: [
        {
          base_stat: 45,
          effort: 0,
          stat: { name: "hp", url: "https://pokeapi.co/api/v2/stat/1/" },
        },
        // Missing other stats
      ],
    } as PokemonEntity;

    const result = getPokemonStats(mockPokemon);

    expect(result).toEqual({
      hp: 45,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    });
  });

  it("should handle Pokemon with no stats", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      stats: [],
    } as PokemonEntity;

    const result = getPokemonStats(mockPokemon);

    expect(result).toEqual({
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    });
  });

  it("should handle stats in any order", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      stats: [
        {
          base_stat: 65,
          effort: 1,
          stat: {
            name: "special-attack",
            url: "https://pokeapi.co/api/v2/stat/4/",
          },
        },
        {
          base_stat: 45,
          effort: 0,
          stat: { name: "hp", url: "https://pokeapi.co/api/v2/stat/1/" },
        },
        {
          base_stat: 49,
          effort: 0,
          stat: { name: "attack", url: "https://pokeapi.co/api/v2/stat/2/" },
        },
      ],
    } as PokemonEntity;

    const result = getPokemonStats(mockPokemon);

    expect(result).toEqual({
      hp: 45,
      attack: 49,
      defense: 0,
      specialAttack: 65,
      specialDefense: 0,
      speed: 0,
    });
  });

  it("should handle unknown stat names gracefully", () => {
    const mockPokemon: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
      stats: [
        {
          base_stat: 45,
          effort: 0,
          stat: { name: "hp", url: "https://pokeapi.co/api/v2/stat/1/" },
        },
        {
          base_stat: 100,
          effort: 0,
          stat: {
            name: "unknown-stat",
            url: "https://pokeapi.co/api/v2/stat/99/",
          },
        },
      ],
    } as PokemonEntity;

    const result = getPokemonStats(mockPokemon);

    expect(result).toEqual({
      hp: 45,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    });
  });
});

describe("convertPokemonEntityToPokemon", () => {
  it("should convert PokemonEntity to Pokemon correctly", () => {
    const mockPokemonEntity: PokemonEntity = {
      id: 1,
      name: "bulbasaur",
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
      types: [
        {
          slot: 1,
          type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
        },
        {
          slot: 2,
          type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
        },
      ],
      stats: [
        {
          base_stat: 45,
          effort: 0,
          stat: { name: "hp", url: "https://pokeapi.co/api/v2/stat/1/" },
        },
        {
          base_stat: 49,
          effort: 0,
          stat: { name: "attack", url: "https://pokeapi.co/api/v2/stat/2/" },
        },
        {
          base_stat: 49,
          effort: 0,
          stat: { name: "defense", url: "https://pokeapi.co/api/v2/stat/3/" },
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
          stat: { name: "speed", url: "https://pokeapi.co/api/v2/stat/6/" },
        },
      ],
      sprites: {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        front_shiny: null,
        back_default: null,
        back_shiny: null,
        other: {
          "official-artwork": {
            front_default: null,
            front_shiny: null,
          },
          home: {
            front_default: null,
            front_shiny: null,
          },
          dream_world: {
            front_default: null,
            front_shiny: null,
          },
          showdown: {
            front_default: null,
            front_shiny: null,
          },
        },
      },
    } as PokemonEntity;

    const result = convertPokemonEntityToPokemon(mockPokemonEntity);

    expect(result).toEqual({
      id: "1",
      name: "bulbasaur",
      type: ["grass", "poison"],
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      stats: {
        hp: 45,
        attack: 49,
        defense: 49,
        specialAttack: 65,
        specialDefense: 65,
        speed: 45,
      },
      abilitiesLite: [
        {
          id: "65",
          name: "overgrow",
          url: "https://pokeapi.co/api/v2/ability/65/",
          isHidden: false,
          slot: 1,
        },
        {
          id: "34",
          name: "chlorophyll",
          url: "https://pokeapi.co/api/v2/ability/34/",
          isHidden: true,
          slot: 3,
        },
      ],
    });
  });

  it("should handle Pokemon with minimal data", () => {
    const mockPokemonEntity: PokemonEntity = {
      id: 999,
      name: "test-pokemon",
      abilities: [],
      types: [],
      stats: [],
      sprites: {
        front_default: null,
        front_shiny: null,
        back_default: null,
        back_shiny: null,
        other: {
          "official-artwork": {
            front_default: null,
            front_shiny: null,
          },
          home: {
            front_default: null,
            front_shiny: null,
          },
          dream_world: {
            front_default: null,
            front_shiny: null,
          },
          showdown: {
            front_default: null,
            front_shiny: null,
          },
        },
      },
    } as PokemonEntity;

    const result = convertPokemonEntityToPokemon(mockPokemonEntity);

    expect(result).toEqual({
      id: "999",
      name: "test-pokemon",
      type: [],
      image: "https://dummyimage.com/96x96/f0f0f0/666666.png&text=test-pokemon",
      stats: {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
      },
      abilitiesLite: [],
    });
  });

  it("should convert ID to string", () => {
    const mockPokemonEntity: PokemonEntity = {
      id: 25,
      name: "pikachu",
      abilities: [],
      types: [],
      stats: [],
      sprites: {
        front_default: null,
        front_shiny: null,
        back_default: null,
        back_shiny: null,
        other: {
          "official-artwork": {
            front_default: null,
            front_shiny: null,
          },
          home: {
            front_default: null,
            front_shiny: null,
          },
          dream_world: {
            front_default: null,
            front_shiny: null,
          },
          showdown: {
            front_default: null,
            front_shiny: null,
          },
        },
      },
    } as PokemonEntity;

    const result = convertPokemonEntityToPokemon(mockPokemonEntity);

    expect(result.id).toBe("25");
    expect(typeof result.id).toBe("string");
  });
});
