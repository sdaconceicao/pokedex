import type { DataSourceContext } from "./context.js";
import type { PokemonIndex } from "./datasources/pokemon-api.types.js";
import { logger } from "./logger.js";
import { type PokemonFilter, PokemonSort, type Resolvers } from "./types.js";
import { intersect, sortResults, union } from "./utils/filter.js";
import { getPaginatedResults } from "./utils/pagination.js";

/**
 * Reduce a filter to one candidate list per facet. Every facet is dispatched
 * before any is awaited, so the slow one (regions, which fans out over each of
 * its pokedexes) overlaps the rest instead of following them.
 *
 * Facets are OR internally and the caller ANDs them together. `dualType` is the
 * sole exception: its two type lists are intersected, and that pair is then
 * OR'd back into the type facet alongside the plain `types` list.
 */
const resolveFacets = (
  { dataSources }: DataSourceContext,
  { query, types, dualType, pokedexes, regions }: PokemonFilter,
): Promise<PokemonIndex[]>[] => {
  const { pokemonAPI } = dataSources;
  const facets: Promise<PokemonIndex[]>[] = [];

  if (types?.length || dualType) {
    facets.push(
      Promise.all([
        Promise.all((types ?? []).map((type) => pokemonAPI.getPokemonByType(type))),
        dualType
          ? Promise.all([
              pokemonAPI.getPokemonByType(dualType.primary),
              pokemonAPI.getPokemonByType(dualType.secondary),
            ])
          : Promise.resolve([]),
      ]).then(([anyOf, bothOf]) => union([...anyOf, intersect(bothOf)])),
    );
  }

  if (pokedexes?.length) {
    facets.push(
      Promise.all(pokedexes.map((pokedex) => pokemonAPI.getPokemonByPokedex(pokedex))).then(union),
    );
  }

  if (regions?.length) {
    facets.push(
      Promise.all(regions.map((region) => pokemonAPI.getPokemonByRegion(region))).then(union),
    );
  }

  if (query) {
    facets.push(Promise.resolve(pokemonAPI.searchPokemonIndex(query)));
  }

  return facets;
};

export const resolvers: Resolvers = {
  Query: {
    ability: async (_, { id }, { dataSources }) => {
      logger.info(`Resolving ability query for ID: ${id}`);
      try {
        const result = await dataSources.pokemonAPI.getAbility(id);
        logger.info(`Ability ${id} resolved successfully`);
        return result;
      } catch (error) {
        logger.error(`Error resolving ability ${id}:`, error);
        throw error;
      }
    },
    regions: async (_, __, { dataSources }) => {
      logger.info("Resolving regions query");
      try {
        const result = await dataSources.pokemonAPI.getRegions();
        logger.info(`Regions resolved successfully: ${result.length} regions found`);
        return result;
      } catch (error) {
        logger.error("Error resolving regions:", error);
        throw error;
      }
    },
    region: async (_, { name }, { dataSources }) => {
      logger.info(`Resolving region query for: ${name}`);
      try {
        const result = await dataSources.pokemonAPI.getRegion(name);
        logger.info(`Region ${name} resolved successfully`);
        return result;
      } catch (error) {
        logger.error(`Error resolving region ${name}:`, error);
        throw error;
      }
    },
    type: async (_, { name }, { dataSources }) => {
      logger.info(`Resolving type query for: ${name}`);
      try {
        const result = await dataSources.pokemonAPI.getType(name);
        logger.info(`Type ${name} resolved successfully`);
        return result;
      } catch (error) {
        logger.error(`Error resolving type ${name}:`, error);
        throw error;
      }
    },
    types: async (_, __, { dataSources }) => {
      logger.info("Resolving types query");
      try {
        const result = await dataSources.pokemonAPI.getTypes();
        logger.info(`Types resolved successfully: ${result.length} types found`);
        return result;
      } catch (error) {
        logger.error("Error resolving types:", error);
        throw error;
      }
    },
    pokedexes: async (_, __, { dataSources }) => {
      logger.info("Resolving pokedexes query");
      try {
        const result = await dataSources.pokemonAPI.getPokedexes();
        logger.info(`Pokedexes resolved successfully: ${result.length} pokedexes found`);
        return result;
      } catch (error) {
        logger.error("Error resolving pokedexes:", error);
        throw error;
      }
    },
    pokemon: async (_, { id }, { dataSources }) => {
      logger.info(`Resolving pokemon query for ID: ${id}`);
      try {
        const result = await dataSources.pokemonAPI.getPokemon(id);
        logger.info(`Pokemon ${id} resolved successfully:`, {
          name: result.name,
          image: result.image,
        });
        return result;
      } catch (error) {
        logger.error(`Error resolving pokemon ${id}:`, error);
        throw error;
      }
    },
    pokemonSearch: async (
      _,
      { query, limit = 20, offset = 0, sort = PokemonSort.IdAsc },
      { dataSources },
    ) => {
      logger.info(`Resolving pokemonSearch query: "${query}" with limit: ${limit}`);
      try {
        const results = sortResults(dataSources.pokemonAPI.searchPokemonIndex(query), sort);
        const total = results.length;
        const limitedResults = getPaginatedResults(results, limit, offset);

        const pokemon = await Promise.all(
          limitedResults.map(({ id }) => dataSources.pokemonAPI.getPokemon(id)),
        );
        logger.info(`pokemonSearch resolved ${pokemon.length} Pokemon`);
        return {
          total,
          offset,
          pokemon,
        };
      } catch (error) {
        logger.error(`Error resolving pokemonSearch "${query}":`, error);
        throw error;
      }
    },
    pokemonByType: async (
      _,
      { type, limit = 20, offset = 0, sort = PokemonSort.IdAsc },
      { dataSources },
    ) => {
      logger.info(`Resolving pokemonByType query: type=${type}, limit=${limit}, offset=${offset}`);
      if (!type) {
        logger.info("No type specified, returning empty result");
        return { total: 0, offset, pokemon: [] };
      }

      try {
        const results = sortResults(await dataSources.pokemonAPI.getPokemonByType(type), sort);
        const total = results.length;
        const limitedResults = getPaginatedResults(results, limit, offset);

        logger.info(`Fetching ${limitedResults.length} Pokemon details for type ${type}`);

        const pokemon = await Promise.all(
          limitedResults.map(async ({ id }) => {
            try {
              const pokemonData = await dataSources.pokemonAPI.getPokemon(id);
              logger.info(`Pokemon ${id} (${pokemonData.name}) image: ${pokemonData.image}`);
              return pokemonData;
            } catch (error) {
              logger.error(`Error fetching Pokemon ${id}:`, error);
              throw error;
            }
          }),
        );

        logger.info(`pokemonByType resolved ${pokemon.length} Pokemon for type ${type}`);
        return {
          total,
          offset,
          pokemon,
        };
      } catch (error) {
        logger.error(`Error resolving pokemonByType for type ${type}:`, error);
        throw error;
      }
    },
    pokemonByPokedex: async (
      _,
      { pokedex, limit = 20, offset = 0, sort = PokemonSort.IdAsc },
      { dataSources },
    ) => {
      logger.info(
        `Resolving pokemonByPokedex query: pokedex=${pokedex}, limit=${limit}, offset=${offset}`,
      );
      if (!pokedex) {
        logger.info("No pokedex specified, returning empty result");
        return { total: 0, offset, pokemon: [] };
      }

      try {
        const results = sortResults(
          await dataSources.pokemonAPI.getPokemonByPokedex(pokedex),
          sort,
        );
        const total = results.length;
        const limitedResults = getPaginatedResults(results, limit, offset);

        logger.info(`Fetching ${limitedResults.length} Pokemon details for pokedex ${pokedex}`);

        const pokemon = await Promise.all(
          limitedResults.map(async ({ id }) => {
            try {
              const pokemonData = await dataSources.pokemonAPI.getPokemon(id);
              logger.info(`Pokemon ${id} (${pokemonData.name}) image: ${pokemonData.image}`);
              return pokemonData;
            } catch (error) {
              logger.error(`Error fetching Pokemon ${id}:`, error);
              throw error;
            }
          }),
        );

        logger.info(`pokemonByPokedex resolved ${pokemon.length} Pokemon for pokedex ${pokedex}`);
        return {
          total,
          offset,
          pokemon,
        };
      } catch (error) {
        logger.error(`Error resolving pokemonByPokedex for pokedex ${pokedex}:`, error);
        throw error;
      }
    },

    pokemonByRegion: async (
      _,
      { region, limit = 20, offset = 0, sort = PokemonSort.IdAsc },
      { dataSources },
    ) => {
      logger.info(
        `Resolving pokemonByRegion query: region=${region}, limit=${limit}, offset=${offset}`,
      );
      if (!region) {
        logger.info("No region specified, returning empty result");
        return { total: 0, offset, pokemon: [] };
      }

      try {
        const results = sortResults(await dataSources.pokemonAPI.getPokemonByRegion(region), sort);
        const total = results.length;
        const limitedResults = getPaginatedResults(results, limit, offset);

        logger.info(`Fetching ${limitedResults.length} Pokemon details for region ${region}`);

        const pokemon = await Promise.all(
          limitedResults.map(async ({ id }) => {
            try {
              const pokemonData = await dataSources.pokemonAPI.getPokemon(id);
              logger.info(`Pokemon ${id} (${pokemonData.name}) image: ${pokemonData.image}`);
              return pokemonData;
            } catch (error) {
              logger.error(`Error fetching Pokemon ${id}:`, error);
              throw error;
            }
          }),
        );

        logger.info(`pokemonByRegion resolved ${pokemon.length} Pokemon for region ${region}`);
        return {
          total,
          offset,
          pokemon,
        };
      } catch (error) {
        logger.error(`Error resolving pokemonByRegion for region ${region}:`, error);
        throw error;
      }
    },

    pokemonFilter: async (
      _,
      { filter, limit = 20, offset = 0, sort = PokemonSort.IdAsc },
      context,
    ) => {
      logger.info(
        `Resolving pokemonFilter query: ${JSON.stringify(filter)}, limit=${limit}, offset=${offset}`,
      );

      try {
        const facets = await Promise.all(resolveFacets(context, filter));

        // An empty filter narrows nothing, so browse the whole dex rather than
        // return nothing. sortResults copies before sorting, so the shared
        // index is never reordered in place.
        const matches = sortResults(
          facets.length ? intersect(facets) : context.dataSources.pokemonAPI.getPokemonIndex(),
          sort,
        );

        const total = matches.length;
        const page = getPaginatedResults(matches, limit, offset);

        logger.info(`pokemonFilter matched ${total} Pokemon, hydrating ${page.length}`);

        // Hydration is the only per-row network cost, so it happens after the
        // set algebra has narrowed things down to a single page.
        const pokemon = await Promise.all(
          page.map(({ id }) => context.dataSources.pokemonAPI.getPokemon(id)),
        );

        return { total, offset, pokemon };
      } catch (error) {
        logger.error("Error resolving pokemonFilter:", error);
        throw error;
      }
    },
  },

  Pokemon: {
    abilities: ({ abilitiesLite }, _, { dataSources }) => {
      logger.info(`Resolving abilities for Pokemon with ${abilitiesLite.length} abilities`);
      try {
        const result = dataSources.pokemonAPI.getAbilitiesForPokemon(abilitiesLite);
        logger.info("Abilities resolved successfully");
        return result;
      } catch (error) {
        logger.error("Error resolving abilities:", error);
        throw error;
      }
    },
    evolution: async ({ id }, _, { dataSources }) => {
      logger.info(`Resolving evolution chain for Pokemon ${id}`);
      try {
        const result = await dataSources.pokemonAPI.getEvolutionForPokemon(id);
        logger.info(`Evolution chain for Pokemon ${id} resolved successfully`);
        return result;
      } catch (error) {
        // Evolution data is supplementary — a failure here should not break
        // the whole Pokemon query, so log it and omit the section.
        logger.error(`Error resolving evolution for Pokemon ${id}:`, error);
        return null;
      }
    },
  },
};
