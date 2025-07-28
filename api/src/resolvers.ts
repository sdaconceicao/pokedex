import { Resolvers } from "./types";

export const resolvers: Resolvers = {
  Query: {
    pokemon: async (_, { id }, { dataSources }) => {
      return dataSources.pokemonAPI.getPokemon(id);
    },
    pokemonSearch: async (_, { query, limit = 20 }, { dataSources }) => {
      const results = dataSources.pokemonAPI.searchPokemon(query, limit);
      return Promise.all(
        results.map(({ id }) => dataSources.pokemonAPI.getPokemon(id))
      );
    },
    pokemonByType: async (
      _,
      { type, limit = 20, offset = 0 },
      { dataSources }
    ) => {
      const results = await dataSources.pokemonAPI.getPokemonByType(type);
      const limitedResults = limit ? results.slice(offset, limit) : results;
      return Promise.all(
        limitedResults.map(({ id }) => dataSources.pokemonAPI.getPokemon(id))
      );
    },
  },

  Pokemon: {
    abilities: ({ abilitiesLite }, _, { dataSources }) => {
      return dataSources.pokemonAPI.getAbilities(abilitiesLite);
    },
  },
};
