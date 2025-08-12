import { Resolvers } from "./types";

export const resolvers: Resolvers = {
  Query: {
    pokemon: async (_, { id }, { dataSources }) => {
      console.log(`Resolving pokemon query for ID: ${id}`);
      try {
        const result = await dataSources.pokemonAPI.getPokemon(id);
        console.log(`Pokemon ${id} resolved successfully:`, {
          name: result.name,
          image: result.image,
        });
        return result;
      } catch (error) {
        console.error(`Error resolving pokemon ${id}:`, error);
        throw error;
      }
    },
    pokemonSearch: async (
      _,
      { query, limit = 20, offset = 0 },
      { dataSources }
    ) => {
      console.log(
        `Resolving pokemonSearch query: "${query}" with limit: ${limit}`
      );
      try {
        const results = dataSources.pokemonAPI.searchPokemon(
          query,
          offset,
          limit
        );
        const pokemon = await Promise.all(
          results.pokemon.map(({ id }) => dataSources.pokemonAPI.getPokemon(id))
        );
        console.log(`pokemonSearch resolved ${pokemon.length} Pokemon`);
        return {
          pokemon,
          total: results.total,
          offset,
        };
      } catch (error) {
        console.error(`Error resolving pokemonSearch "${query}":`, error);
        throw error;
      }
    },
    pokemonByType: async (
      _,
      { type, limit = 20, offset = 0 },
      { dataSources }
    ) => {
      console.log(
        `Resolving pokemonByType query: type=${type}, limit=${limit}, offset=${offset}`
      );
      if (!type) {
        console.log("No type specified, returning empty result");
        return { total: 0, offset, pokemon: [] };
      }

      try {
        const results = await dataSources.pokemonAPI.getPokemonByType(type);
        const total = results.length;
        const limitedResults = limit
          ? results.slice(offset, offset + limit)
          : results.slice(offset);

        console.log(
          `Fetching ${limitedResults.length} Pokemon details for type ${type}`
        );

        const pokemon = await Promise.all(
          limitedResults.map(async ({ id }) => {
            try {
              const pokemonData = await dataSources.pokemonAPI.getPokemon(id);
              console.log(
                `Pokemon ${id} (${pokemonData.name}) image: ${pokemonData.image}`
              );
              return pokemonData;
            } catch (error) {
              console.error(`Error fetching Pokemon ${id}:`, error);
              throw error;
            }
          })
        );

        console.log(
          `pokemonByType resolved ${pokemon.length} Pokemon for type ${type}`
        );
        return {
          total,
          offset,
          pokemon,
        };
      } catch (error) {
        console.error(`Error resolving pokemonByType for type ${type}:`, error);
        throw error;
      }
    },
    ability: async (_, { id }, { dataSources }) => {
      console.log(`Resolving ability query for ID: ${id}`);
      try {
        const result = await dataSources.pokemonAPI.getAbility(id);
        console.log(`Ability ${id} resolved successfully`);
        return result;
      } catch (error) {
        console.error(`Error resolving ability ${id}:`, error);
        throw error;
      }
    },
    types: async (_, __, { dataSources }) => {
      console.log("Resolving types query");
      try {
        const result = await dataSources.pokemonAPI.getTypes();
        console.log(
          `Types resolved successfully: ${result.length} types found`
        );
        return result;
      } catch (error) {
        console.error("Error resolving types:", error);
        throw error;
      }
    },
  },

  Pokemon: {
    abilities: ({ abilitiesLite }, _, { dataSources }) => {
      console.log(
        `Resolving abilities for Pokemon with ${abilitiesLite.length} abilities`
      );
      try {
        const result =
          dataSources.pokemonAPI.getAbilitiesForPokemon(abilitiesLite);
        console.log("Abilities resolved successfully");
        return result;
      } catch (error) {
        console.error("Error resolving abilities:", error);
        throw error;
      }
    },
  },
};
