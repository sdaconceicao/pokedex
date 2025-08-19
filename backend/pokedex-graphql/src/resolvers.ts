import { Resolvers } from "./types";
import { getPaginatedResults } from "./utils/pagination";
import { logger } from "./logger";

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
        logger.info(
          `Regions resolved successfully: ${result.length} regions found`
        );
        return result;
      } catch (error) {
        logger.error("Error resolving regions:", error);
        throw error;
      }
    },
    types: async (_, __, { dataSources }) => {
      logger.info("Resolving types query");
      try {
        const result = await dataSources.pokemonAPI.getTypes();
        logger.info(
          `Types resolved successfully: ${result.length} types found`
        );
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
        logger.info(
          `Pokedexes resolved successfully: ${result.length} pokedexes found`
        );
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
      { query, limit = 20, offset = 0 },
      { dataSources }
    ) => {
      logger.info(
        `Resolving pokemonSearch query: "${query}" with limit: ${limit}`
      );
      try {
        const results = dataSources.pokemonAPI.getPokemonByName(
          query,
          offset,
          limit
        );
        const pokemon = await Promise.all(
          results.pokemon.map(({ id }) => dataSources.pokemonAPI.getPokemon(id))
        );
        logger.info(`pokemonSearch resolved ${pokemon.length} Pokemon`);
        return {
          pokemon,
          total: results.total,
          offset,
        };
      } catch (error) {
        logger.error(`Error resolving pokemonSearch "${query}":`, error);
        throw error;
      }
    },
    pokemonByType: async (
      _,
      { type, limit = 20, offset = 0 },
      { dataSources }
    ) => {
      logger.info(
        `Resolving pokemonByType query: type=${type}, limit=${limit}, offset=${offset}`
      );
      if (!type) {
        logger.info("No type specified, returning empty result");
        return { total: 0, offset, pokemon: [] };
      }

      try {
        const results = await dataSources.pokemonAPI.getPokemonByType(type);
        const total = results.length;
        const limitedResults = getPaginatedResults(results, limit, offset);

        logger.info(
          `Fetching ${limitedResults.length} Pokemon details for type ${type}`
        );

        const pokemon = await Promise.all(
          limitedResults.map(async ({ id }) => {
            try {
              const pokemonData = await dataSources.pokemonAPI.getPokemon(id);
              logger.info(
                `Pokemon ${id} (${pokemonData.name}) image: ${pokemonData.image}`
              );
              return pokemonData;
            } catch (error) {
              logger.error(`Error fetching Pokemon ${id}:`, error);
              throw error;
            }
          })
        );

        logger.info(
          `pokemonByType resolved ${pokemon.length} Pokemon for type ${type}`
        );
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
      { pokedex, limit = 20, offset = 0 },
      { dataSources }
    ) => {
      logger.info(
        `Resolving pokemonByPokedex query: pokedex=${pokedex}, limit=${limit}, offset=${offset}`
      );
      if (!pokedex) {
        logger.info("No pokedex specified, returning empty result");
        return { total: 0, offset, pokemon: [] };
      }

      try {
        const results = await dataSources.pokemonAPI.getPokemonByPokedex(
          pokedex
        );
        const total = results.length;
        const limitedResults = getPaginatedResults(results, limit, offset);

        logger.info(
          `Fetching ${limitedResults.length} Pokemon details for pokedex ${pokedex}`
        );

        const pokemon = await Promise.all(
          limitedResults.map(async ({ id }) => {
            try {
              const pokemonData = await dataSources.pokemonAPI.getPokemon(id);
              logger.info(
                `Pokemon ${id} (${pokemonData.name}) image: ${pokemonData.image}`
              );
              return pokemonData;
            } catch (error) {
              logger.error(`Error fetching Pokemon ${id}:`, error);
              throw error;
            }
          })
        );

        logger.info(
          `pokemonByPokedex resolved ${pokemon.length} Pokemon for pokedex ${pokedex}`
        );
        return {
          total,
          offset,
          pokemon,
        };
      } catch (error) {
        logger.error(
          `Error resolving pokemonByPokedex for pokedex ${pokedex}:`,
          error
        );
        throw error;
      }
    },

    pokemonByRegion: async (
      _,
      { region, limit = 20, offset = 0 },
      { dataSources }
    ) => {
      logger.info(
        `Resolving pokemonByRegion query: region=${region}, limit=${limit}, offset=${offset}`
      );
      if (!region) {
        logger.info("No region specified, returning empty result");
        return { total: 0, offset, pokemon: [] };
      }

      try {
        const results = await dataSources.pokemonAPI.getPokemonByRegion(region);
        const total = results.length;
        const limitedResults = getPaginatedResults(results, limit, offset);

        logger.info(
          `Fetching ${limitedResults.length} Pokemon details for region ${region}`
        );

        const pokemon = await Promise.all(
          limitedResults.map(async ({ id }) => {
            try {
              const pokemonData = await dataSources.pokemonAPI.getPokemon(id);
              logger.info(
                `Pokemon ${id} (${pokemonData.name}) image: ${pokemonData.image}`
              );
              return pokemonData;
            } catch (error) {
              logger.error(`Error fetching Pokemon ${id}:`, error);
              throw error;
            }
          })
        );

        logger.info(
          `pokemonByRegion resolved ${pokemon.length} Pokemon for region ${region}`
        );
        return {
          total,
          offset,
          pokemon,
        };
      } catch (error) {
        logger.error(
          `Error resolving pokemonByRegion for region ${region}:`,
          error
        );
        throw error;
      }
    },
  },

  Pokemon: {
    abilities: ({ abilitiesLite }, _, { dataSources }) => {
      logger.info(
        `Resolving abilities for Pokemon with ${abilitiesLite.length} abilities`
      );
      try {
        const result =
          dataSources.pokemonAPI.getAbilitiesForPokemon(abilitiesLite);
        logger.info("Abilities resolved successfully");
        return result;
      } catch (error) {
        logger.error("Error resolving abilities:", error);
        throw error;
      }
    },
  },
};
