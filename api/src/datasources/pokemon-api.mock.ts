import { RESTDataSource } from "@apollo/datasource-rest";
import { Ability, AbilityLite, Pokemon, Stats } from "../types";
import { PokemonIndex } from "./pokemon-api.types";

// Mock data for testing
const mockPokemonIndex: PokemonIndex[] = [
  { id: "1", name: "bulbasaur", number: 1 },
  { id: "4", name: "charmander", number: 4 },
  { id: "7", name: "squirtle", number: 7 },
  { id: "25", name: "pikachu", number: 25 },
  { id: "133", name: "eevee", number: 133 },
];

const mockFireTypePokemon: PokemonIndex[] = [
  { id: "4", name: "charmander", number: 4 },
  { id: "5", name: "charmeleon", number: 5 },
  { id: "6", name: "charizard", number: 6 },
  { id: "37", name: "vulpix", number: 37 },
  { id: "38", name: "ninetales", number: 38 },
];

const mockStats: Stats = {
  attack: 52,
  defense: 43,
  hp: 39,
  specialAttack: 60,
  specialDefense: 50,
  speed: 65,
};

export class MockPokemonAPI extends RESTDataSource {
  private static pokemonIndex: PokemonIndex[] = mockPokemonIndex;
  private static isIndexLoaded = true;

  async loadPokemonIndex(): Promise<void> {
    // Already loaded in mock
  }

  isIndexLoaded(): boolean {
    return MockPokemonAPI.isIndexLoaded;
  }

  getAbility(id: string): Promise<Ability> {
    return Promise.resolve({
      id,
      name: "mock-ability",
      description: "Mock ability description",
      effect: "Mock ability effect",
      generation: "generation-i",
      slot: 1,
    });
  }

  getAbilitiesForPokemon(abilitiesLite: AbilityLite[]): Promise<Ability[]> {
    return Promise.all(
      abilitiesLite.map((abilityLite) =>
        Promise.resolve({
          id: abilityLite.id,
          name: abilityLite.name,
          description: "Mock ability description",
          effect: "Mock ability effect",
          generation: "generation-i",
          slot: abilityLite.slot,
        })
      )
    );
  }

  getPokemon(id: string): Promise<Pokemon> {
    if (id === "4") {
      // Return mock Charmander data
      return Promise.resolve({
        id: "4",
        name: "charmander",
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
        abilitiesLite: [
          {
            id: "66",
            name: "blaze",
            isHidden: false,
            slot: 1,
            url: "https://pokeapi.co/api/v2/ability/66/",
          },
          {
            id: "94",
            name: "solar-power",
            isHidden: true,
            slot: 3,
            url: "https://pokeapi.co/api/v2/ability/94/",
          },
        ],
        abilities: [
          {
            id: "66",
            name: "blaze",
            description:
              "Powers up Fire-type moves when the Pokémon's HP is low.",
            effect:
              "When this Pokémon has 1/3 or less of its maximum HP, its Fire-type moves inflict 1.5× as much regular damage.",
            generation: "generation-iii",
            slot: 1,
          },
        ],
        stats: mockStats,
        type: ["fire"],
      });
    }

    // Return generic mock data for other Pokemon
    return Promise.resolve({
      id,
      name: "mock-pokemon",
      image: "",
      abilitiesLite: [],
      abilities: [],
      stats: mockStats,
      type: ["normal"],
    });
  }

  getPokemonByName(
    query: string,
    offset: number = 0,
    limit: number = 20
  ): { pokemon: PokemonIndex[]; total: number } {
    const lowerQuery = query.toLowerCase();
    const allMatches = MockPokemonAPI.pokemonIndex.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(lowerQuery)
    );

    const startIndex = offset;
    const endIndex = offset + limit;
    const paginatedResults = allMatches.slice(startIndex, endIndex);

    return { pokemon: paginatedResults, total: allMatches.length };
  }

  getPokemonByType(type: string): Promise<PokemonIndex[]> {
    if (type.toLowerCase() === "fire") {
      return Promise.resolve(mockFireTypePokemon);
    }
    return Promise.resolve([]);
  }

  // Helper method to get full Pokemon data for a type
  async getPokemonByTypeWithDetails(type: string): Promise<Pokemon[]> {
    if (type.toLowerCase() === "fire") {
      // Return full Pokemon objects for fire type
      const firePokemon = await Promise.all(
        mockFireTypePokemon.map(async (index) => {
          return await this.getPokemon(index.id);
        })
      );
      return firePokemon;
    }
    return Promise.resolve([]);
  }

  getPokedexes(): Promise<string[]> {
    return Promise.resolve(["national", "kanto", "johto"]);
  }

  getRegions(): Promise<string[]> {
    return Promise.resolve(["kanto", "johto", "hoenn", "sinnoh"]);
  }

  getTypes(): Promise<string[]> {
    return Promise.resolve([
      "normal",
      "fire",
      "water",
      "electric",
      "grass",
      "ice",
      "fighting",
      "poison",
      "ground",
      "flying",
      "psychic",
      "bug",
      "rock",
      "ghost",
      "dragon",
      "dark",
      "steel",
      "fairy",
    ]);
  }

  // Add missing methods to match PokemonAPI interface
  baseURL = "https://mock-api.co/api/v2/";

  getIndexFromUrl = (entry: any) => {
    const urlParts = entry.url.replace(/\/+$/, "").split("/");
    const number = parseInt(urlParts[urlParts.length - 1], 10);
    return number;
  };

  getPokemonByPokedex(_pokedex: string): Promise<PokemonIndex[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Promise.resolve(mockPokemonIndex);
  }

  getPokemonByRegion(_region: string): Promise<PokemonIndex[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Promise.resolve(mockPokemonIndex);
  }
}
