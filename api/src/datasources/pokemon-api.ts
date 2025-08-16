import { RESTDataSource } from "@apollo/datasource-rest";
import { Ability, AbilityLite, Pokemon } from "../types";
import {
  NamedAPIResource,
  PokemonListResponse,
  PokemonIndex,
  PokemonAbility,
  PokemonEntity,
  TypeResponse,
  Pokedex,
  PokedexListResponse,
  Region,
  RegionListResponse,
} from "./pokemon-api.types";
import {
  convertAbilityLiteToAbility,
  convertPokemonEntityToPokemon,
} from "../utils/pokemon";

export class PokemonAPI extends RESTDataSource {
  baseURL = "https://pokeapi.co/api/v2/";
  private static pokemonIndex: PokemonIndex[] = [];
  private static isIndexLoaded = false;

  // Retrieve id from NamedAPIResource url value
  getIndexFromUrl = (entry: NamedAPIResource) => {
    const urlParts = entry.url.replace(/\/+$/, "").split("/");
    const number = parseInt(urlParts[urlParts.length - 1], 10);
    return number;
  };

  // Request name/ids of all pokemon for search
  async loadPokemonIndex(): Promise<void> {
    if (PokemonAPI.isIndexLoaded) return;

    try {
      const response = await this.get<PokemonListResponse>(
        "pokemon?limit=1500"
      );
      const entries = response.results;

      PokemonAPI.pokemonIndex = entries
        .map((entry: NamedAPIResource) => {
          const number = this.getIndexFromUrl(entry);
          return {
            id: number.toString(),
            name: entry.name,
            number,
          };
        })
        .sort((a: PokemonIndex, b: PokemonIndex) => a.number - b.number);

      PokemonAPI.isIndexLoaded = true;
      console.log(
        `Loaded ${PokemonAPI.pokemonIndex.length} Pokémon into index`
      );
    } catch (error) {
      console.error("Failed to load Pokémon index:", error);
      throw error;
    }
  }

  // Check if index is loaded
  isIndexLoaded(): boolean {
    return PokemonAPI.isIndexLoaded;
  }

  getAbility(id: string): Promise<Ability> {
    return this.get<Ability>(`ability/${id}`);
  }

  getAbilitiesForPokemon(abilitiesLite: AbilityLite[]): Promise<Ability[]> {
    return Promise.all(
      abilitiesLite.map((abilityLite) =>
        this.get<PokemonAbility>(abilityLite.url).then((data) =>
          convertAbilityLiteToAbility(data, abilityLite)
        )
      )
    );
  }

  getPokemon(id: string): Promise<Pokemon> {
    return this.get<PokemonEntity>(`pokemon/${id}`).then((data) => {
      return convertPokemonEntityToPokemon(data);
    });
  }

  // Fast partial string search on name
  getPokemonByName(
    query: string,
    offset: number = 0,
    limit: number = 20
  ): { pokemon: PokemonIndex[]; total: number } {
    if (!PokemonAPI.isIndexLoaded) {
      throw new Error(
        "Pokemon index not loaded. Call loadPokemonIndex() first."
      );
    }

    const lowerQuery = query.toLowerCase();
    const allMatches: PokemonIndex[] = [];
    let totalMatches = 0;

    for (const pokemon of PokemonAPI.pokemonIndex) {
      if (pokemon.name.toLowerCase().includes(lowerQuery)) {
        allMatches.push(pokemon);
        totalMatches++;
      }
    }

    const startIndex = offset;
    const endIndex = offset + limit;
    const paginatedResults = allMatches.slice(startIndex, endIndex);

    return { pokemon: paginatedResults, total: totalMatches };
  }

  getPokemonByPokedex(pokedex: string): Promise<PokemonIndex[]> {
    console.log(`Fetching Pokemon from pokedex: ${pokedex}`);
    return this.get<Pokedex>(`pokedex/${pokedex}`)
      .then((data) => {
        const results = data.pokemon_entries.map((entry) => {
          const number = this.getIndexFromUrl(entry.pokemon_species);
          return {
            name: entry.pokemon_species.name,
            id: number.toString(),
            number,
          };
        });
        return results;
      })
      .catch((error) => {
        console.error(`Error fetching Pokemon from pokedex ${pokedex}:`, error);
        throw error;
      });
  }

  async getPokemonByRegion(region: string): Promise<PokemonIndex[]> {
    console.log(`Fetching Pokemon from region: ${region}`);
    try {
      const regionData = await this.get<Region>(`region/${region}`);
      const pokedexUrls = regionData.pokedexes.map((p) => p.url);

      const pokedexNames = pokedexUrls.map((url) => {
        const urlParts = url.split("/");
        return urlParts[urlParts.length - 2];
      });

      console.log(
        `Found ${pokedexNames.length} pokedexes in region ${region}:`,
        pokedexNames
      );

      const allPokemonPromises = pokedexNames.map((pokedexName) =>
        this.getPokemonByPokedex(pokedexName)
      );

      const allPokemonResults = await Promise.all(allPokemonPromises);

      const pokemonMap = new Map<string, PokemonIndex>();

      allPokemonResults.forEach((pokemonList) => {
        pokemonList.forEach((pokemon) => {
          if (!pokemonMap.has(pokemon.id)) {
            pokemonMap.set(pokemon.id, pokemon);
          }
        });
      });

      const mergedPokemon = Array.from(pokemonMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      console.log(
        `Total unique Pokemon in region ${region}: ${mergedPokemon.length}`
      );
      return mergedPokemon;
    } catch (error) {
      console.error(`Error fetching Pokemon from region ${region}:`, error);
      throw error;
    }
  }

  getPokemonByType(type: String): Promise<PokemonIndex[]> {
    console.log(`Fetching Pokemon of type: ${type}`);
    return this.get<TypeResponse>(`type/${type}`)
      .then((data) => {
        const results = data.pokemon.map((result) => {
          const number = this.getIndexFromUrl(result.pokemon);
          return {
            name: result.pokemon.name,
            id: number.toString(),
            number,
          };
        });
        return results;
      })
      .catch((error) => {
        console.error(`Error fetching Pokemon of type ${type}:`, error);
        throw error;
      });
  }

  getPokedexes(): Promise<string[]> {
    return this.get<PokedexListResponse>("pokedex?limit=50").then((data) =>
      data.results.map((entry: NamedAPIResource) => entry.name).sort()
    );
  }

  getRegions(): Promise<string[]> {
    return this.get<RegionListResponse>("region?limit=50").then((data) =>
      data.results.map((entry: NamedAPIResource) => entry.name).sort()
    );
  }

  getTypes(): Promise<string[]> {
    return this.get<PokemonListResponse>("type?limit=50").then((data) =>
      data.results.map((entry: NamedAPIResource) => entry.name).sort()
    );
  }
}
