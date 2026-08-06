import { RESTDataSource } from "@apollo/datasource-rest";
import { logger } from "../logger.js";
import type {
  Ability,
  AbilityLite,
  EvolutionChain,
  EvolutionNode,
  Pokemon,
  PokemonPokedex,
  PokemonRegion,
  PokemonType,
  RegionDetail,
} from "../types.js";
import {
  convertAbilityLiteToAbility,
  convertPokemonEntityToPokemon,
  getEvolutionDetail,
  getIdFromUrl,
  toPokemonIndex,
} from "../utils/pokemon.js";
import { convertRegionToRegionDetail } from "../utils/region.js";
import type {
  ChainLink,
  EvolutionChainResponse,
  NamedAPIResource,
  Pokedex,
  PokedexListResponse,
  PokemonAbility,
  PokemonEntity,
  PokemonIndex,
  PokemonListResponse,
  PokemonSpecies,
  Region,
  RegionListResponse,
  TypeResponse,
} from "./pokemon-api.types.js";

export class PokemonAPI extends RESTDataSource {
  baseURL = "https://pokeapi.co/api/v2/";
  private static pokemonIndex: PokemonIndex[] = [];
  private static isIndexLoaded = false;

  // Request name/ids of all pokemon for search
  async loadPokemonIndex(): Promise<void> {
    if (PokemonAPI.isIndexLoaded) return;

    try {
      const response = await this.get<PokemonListResponse>("pokemon?limit=1500");
      const entries = response.results;

      PokemonAPI.pokemonIndex = entries
        .map(toPokemonIndex)
        .sort((a: PokemonIndex, b: PokemonIndex) => a.number - b.number);

      PokemonAPI.isIndexLoaded = true;
      logger.info(`Loaded ${PokemonAPI.pokemonIndex.length} Pokémon into index`);
    } catch (error) {
      logger.error("Failed to load Pokémon index:", error);
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
          convertAbilityLiteToAbility(data, abilityLite),
        ),
      ),
    );
  }

  getPokemon(id: string): Promise<Pokemon> {
    return this.get<PokemonEntity>(`pokemon/${id}`).then((data) => {
      return convertPokemonEntityToPokemon(data);
    });
  }

  getPokemonSpecies(id: string): Promise<PokemonSpecies> {
    return this.get<PokemonSpecies>(`pokemon-species/${id}`);
  }

  // Build a single evolution node (id, name, image + how it evolves), then
  // recurse into its branches. Uses getPokemon so node images reuse the same
  // sprite/fallback logic as the rest of the app.
  private async buildEvolutionNode(link: ChainLink): Promise<EvolutionNode> {
    const speciesId = getIdFromUrl(link.species.url);
    const [pokemon, evolvesTo] = await Promise.all([
      this.getPokemon(speciesId),
      Promise.all(link.evolves_to.map((next) => this.buildEvolutionNode(next))),
    ]);

    return {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      ...getEvolutionDetail(link.evolution_details),
      evolvesTo,
    };
  }

  // Resolve a Pokemon's full evolution chain: pokemon -> species ->
  // evolution chain -> a tree of nodes with links back to each Pokemon.
  async getEvolutionForPokemon(id: string): Promise<EvolutionChain> {
    const species = await this.getPokemonSpecies(id);
    const chainResponse = await this.get<EvolutionChainResponse>(species.evolution_chain.url);

    return {
      id: chainResponse.id.toString(),
      chain: await this.buildEvolutionNode(chainResponse.chain),
    };
  }

  // Fast partial string search on name
  getPokemonByName(
    query: string,
    offset: number = 0,
    limit: number = 20,
  ): { pokemon: PokemonIndex[]; total: number } {
    if (!PokemonAPI.isIndexLoaded) {
      throw new Error("Pokemon index not loaded. Call loadPokemonIndex() first.");
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
    logger.info(`Fetching Pokemon from pokedex: ${pokedex}`);
    return this.get<Pokedex>(`pokedex/${pokedex}`)
      .then((data) => {
        const results = data.pokemon_entries.map((entry) => toPokemonIndex(entry.pokemon_species));
        return results;
      })
      .catch((error) => {
        logger.error(`Error fetching Pokemon from pokedex ${pokedex}:`, error);
        throw error;
      });
  }

  async getPokemonByRegion(region: string): Promise<PokemonIndex[]> {
    logger.info(`Fetching Pokemon from region: ${region}`);
    try {
      const regionData = await this.get<Region>(`region/${region}`);
      const pokedexUrls = regionData.pokedexes.map((p) => p.url);

      const pokedexNames = pokedexUrls.map((url) => {
        const urlParts = url.split("/");
        return urlParts[urlParts.length - 2];
      });

      logger.info(`Found ${pokedexNames.length} pokedexes in region ${region}:`, pokedexNames);

      const allPokemonPromises = pokedexNames.map((pokedexName) =>
        this.getPokemonByPokedex(pokedexName),
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
        a.name.localeCompare(b.name),
      );

      logger.info(`Total unique Pokemon in region ${region}: ${mergedPokemon.length}`);
      return mergedPokemon;
    } catch (error) {
      logger.error(`Error fetching Pokemon from region ${region}:`, error);
      throw error;
    }
  }

  async getRegion(name: string): Promise<RegionDetail> {
    logger.info(`Fetching region: ${name}`);
    try {
      const [regionData, pokemon] = await Promise.all([
        this.get<Region>(`region/${name}`),
        this.getPokemonByRegion(name),
      ]);

      return convertRegionToRegionDetail(regionData, pokemon.length);
    } catch (error) {
      logger.error(`Error fetching region ${name}:`, error);
      throw error;
    }
  }

  getPokemonByType(type: string): Promise<PokemonIndex[]> {
    logger.info(`Fetching Pokemon of type: ${type}`);
    return this.get<TypeResponse>(`type/${type}`)
      .then((data) => {
        const results = data.pokemon.map((result) => toPokemonIndex(result.pokemon));
        return results;
      })
      .catch((error) => {
        logger.error(`Error fetching Pokemon of type ${type}:`, error);
        throw error;
      });
  }

  getPokedexes(): Promise<PokemonPokedex[]> {
    return this.get<PokedexListResponse>("pokedex?limit=50").then(async (data) => {
      const pokedexesWithCounts = await Promise.all(
        data.results.map(async (entry: NamedAPIResource) => {
          try {
            const count = await this.getPokemonByPokedex(entry.name).then(
              (pokemon) => pokemon.length,
            );
            return {
              name: entry.name,
              count,
            };
          } catch (error) {
            logger.error(`Error getting count for pokedex ${entry.name}:`, error);
            return {
              name: entry.name,
              count: 0,
            };
          }
        }),
      );

      return pokedexesWithCounts.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  getRegions(): Promise<PokemonRegion[]> {
    return this.get<RegionListResponse>("region?limit=50").then(async (data) => {
      const regionsWithCounts = await Promise.all(
        data.results.map(async (entry: NamedAPIResource) => {
          try {
            const count = await this.getPokemonByRegion(entry.name).then(
              (pokemon) => pokemon.length,
            );
            return {
              name: entry.name,
              count,
            };
          } catch (error) {
            logger.error(`Error getting count for region ${entry.name}:`, error);
            return {
              name: entry.name,
              count: 0,
            };
          }
        }),
      );

      return regionsWithCounts.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  getTypes(): Promise<PokemonType[]> {
    return this.get<PokemonListResponse>("type?limit=50").then(async (data) => {
      const typesWithCounts = await Promise.all(
        data.results.map(async (entry: NamedAPIResource) => {
          try {
            const count = await this.getPokemonByType(entry.name).then((pokemon) => pokemon.length);
            return {
              name: entry.name,
              count,
            };
          } catch (error) {
            logger.error(`Error getting count for type ${entry.name}:`, error);
            return {
              name: entry.name,
              count: 0,
            };
          }
        }),
      );

      return typesWithCounts.sort((a, b) => a.name.localeCompare(b.name));
    });
  }
}
