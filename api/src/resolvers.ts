import { Resolvers } from "./types";

export const resolvers: Resolvers = {
  Query: {
    pokemon: async (_, { id }, { dataSources }) => {
      return dataSources.pokemonAPI.getPokemon(id);
    },
    searchPokemon: async (_, { query, limit = 20 }, { dataSources }) => {
      const results = dataSources.pokemonAPI.searchPokemon(query, limit);
      return Promise.all(
        results.map(({ id }) => dataSources.pokemonAPI.getPokemon(id))
      );
    },
  },

  Pokemon: {
    abilities: ({ abilitiesLite }, _, { dataSources }) => {
      return dataSources.pokemonAPI.getAbilities(abilitiesLite);
    },
  },
};
