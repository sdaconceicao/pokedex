import { RESTDataSource } from "@apollo/datasource-rest";
import { logger } from "../logger.js";
import type {
  Ability,
  AbilityLite,
  EvolutionChain,
  EvolutionNode,
  PokedexDetail,
  Pokemon,
  PokemonForm,
  PokemonPokedex,
  PokemonRegion,
  PokemonType,
  RegionDetail,
  TypeDetail,
} from "../types.js";
import { sortByNumber } from "../utils/filter.js";
import { convertPokedexToPokedexDetail, getDisplayName } from "../utils/pokedex.js";
import {
  convertAbilityLiteToAbility,
  convertPokemonEntityToPokemon,
  getEvolutionDetail,
  getIdFromUrl,
  isForm,
  isSpecies,
  toPokemonIndex,
} from "../utils/pokemon.js";
import { convertRegionToRegionDetail } from "../utils/region.js";
import { convertTypeToTypeDetail } from "../utils/type.js";
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

type PokemonIndexes = {
  species: PokemonIndex[];
  forms: PokemonIndex[];
};

export class PokemonAPI extends RESTDataSource {
  baseURL = "https://pokeapi.co/api/v2/";
  private static indexes: PokemonIndexes | null = null;
  private static indexLoad: Promise<PokemonIndexes> | null = null;

  async loadPokemonIndex(): Promise<void> {
    if (PokemonAPI.indexes) return;

    if (!PokemonAPI.indexLoad) {
      PokemonAPI.indexLoad = this.fetchIndexes();
    }

    const load = PokemonAPI.indexLoad;

    try {
      PokemonAPI.indexes = await load;
    } catch (error) {
      if (PokemonAPI.indexLoad === load) PokemonAPI.indexLoad = null;
      logger.error("Failed to load Pokémon index:", error);
      throw error;
    }
  }

  private async fetchIndexes(): Promise<PokemonIndexes> {
    const [speciesResponse, pokemonResponse] = await Promise.all([
      this.get<PokemonListResponse>("pokemon-species?limit=1500"),
      this.get<PokemonListResponse>("pokemon?limit=1500"),
    ]);

    const species = sortByNumber(speciesResponse.results.map(toPokemonIndex));
    const forms = sortByNumber(pokemonResponse.results.map(toPokemonIndex).filter(isForm));

    logger.info(`Loaded ${species.length} Pokémon and ${forms.length} forms into index`);

    return { species, forms };
  }

  isIndexLoaded(): boolean {
    return PokemonAPI.indexes !== null;
  }

  static resetIndexes(): void {
    PokemonAPI.indexes = null;
    PokemonAPI.indexLoad = null;
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
      // The species' name, not the default form's: a chain is a chain of
      // species, and the two differ wherever the base form carries a suffix —
      // a stage reading "Aegislash Shield" would name a form the chain has no
      // other member of.
      name: link.species.name,
      image: pokemon.image,
      ...getEvolutionDetail(link.evolution_details),
      evolvesTo,
    };
  }

  async getEvolutionForSpecies(speciesId: string): Promise<EvolutionChain> {
    const species = await this.getPokemonSpecies(speciesId);
    const chainResponse = await this.get<EvolutionChainResponse>(species.evolution_chain.url);

    return {
      id: chainResponse.id.toString(),
      chain: await this.buildEvolutionNode(chainResponse.chain),
    };
  }

  async getFormsForSpecies(speciesId: string): Promise<PokemonForm[]> {
    const species = await this.getPokemonSpecies(speciesId);

    const forms = await Promise.all(
      species.varieties.map(async (variety) => {
        const pokemon = await this.getPokemon(getIdFromUrl(variety.pokemon.url));

        return {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.image,
          isDefault: variety.is_default,
        };
      }),
    );

    return forms.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
  }

  private static requireIndexes(): PokemonIndexes {
    if (!PokemonAPI.indexes) {
      throw new Error("Pokemon index not loaded. Call loadPokemonIndex() first.");
    }

    return PokemonAPI.indexes;
  }

  getPokemonIndex(): PokemonIndex[] {
    return PokemonAPI.requireIndexes().species;
  }

  getFormsIndex(): PokemonIndex[] {
    return PokemonAPI.requireIndexes().forms;
  }

  private static matchName(entries: PokemonIndex[], query: string): PokemonIndex[] {
    const lowerQuery = query.toLowerCase();

    return entries.filter((pokemon) => pokemon.name.toLowerCase().includes(lowerQuery));
  }

  // Every name match, unpaginated, so it can be composed with other facets.
  searchPokemonIndex(query: string): PokemonIndex[] {
    return PokemonAPI.matchName(this.getPokemonIndex(), query);
  }

  searchFormsIndex(query: string): PokemonIndex[] {
    return PokemonAPI.matchName(this.getFormsIndex(), query);
  }

  // One fetch is enough: the entry list carries the count, so unlike getRegion
  // there is no second request to size the dex.
  getPokedex(name: string): Promise<PokedexDetail> {
    logger.info(`Fetching pokedex: ${name}`);
    return this.get<Pokedex>(`pokedex/${name}`)
      .then(convertPokedexToPokedexDetail)
      .catch((error) => {
        logger.error(`Error fetching pokedex ${name}:`, error);
        throw error;
      });
  }

  getPokemonByPokedex(pokedex: string): Promise<PokemonIndex[]> {
    logger.info(`Fetching Pokemon from pokedex: ${pokedex}`);
    return this.get<Pokedex>(`pokedex/${pokedex}`)
      .then((data) => {
        const results = data.pokemon_entries.map((entry) => toPokemonIndex(entry.pokemon_species));
        return sortByNumber(results);
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

      const mergedPokemon = sortByNumber(Array.from(pokemonMap.values()));

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

  getType(name: string): Promise<TypeDetail> {
    logger.info(`Fetching type: ${name}`);
    return this.get<TypeResponse>(`type/${name}`)
      .then(convertTypeToTypeDetail)
      .catch((error) => {
        logger.error(`Error fetching type ${name}:`, error);
        throw error;
      });
  }

  getPokemonByType(type: string): Promise<PokemonIndex[]> {
    logger.info(`Fetching Pokemon of type: ${type}`);
    return this.get<TypeResponse>(`type/${type}`)
      .then((data) => {
        const results = data.pokemon
          .map((result) => toPokemonIndex(result.pokemon))
          .filter(isSpecies);
        return sortByNumber(results);
      })
      .catch((error) => {
        logger.error(`Error fetching Pokemon of type ${type}:`, error);
        throw error;
      });
  }

  // The per-dex fetch this needs for the count already carries the name and the
  // region, so both come out of the same response rather than costing a request
  // of their own.
  getPokedexes(): Promise<PokemonPokedex[]> {
    return this.get<PokedexListResponse>("pokedex?limit=50").then(async (data) => {
      const pokedexesWithCounts = await Promise.all(
        data.results.map(async (entry: NamedAPIResource) => {
          try {
            const pokedex = await this.get<Pokedex>(`pokedex/${entry.name}`);
            return {
              // Keyed by the slug asked for, not the one echoed back, so the
              // name the routes use is the name the list was built from
              name: entry.name,
              displayName: getDisplayName(pokedex.names, entry.name),
              region: pokedex.region?.name ?? null,
              count: pokedex.pokemon_entries.length,
            };
          } catch (error) {
            logger.error(`Error getting count for pokedex ${entry.name}:`, error);
            return {
              name: entry.name,
              displayName: entry.name,
              region: null,
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
