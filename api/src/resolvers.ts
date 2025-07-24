import { Resolvers } from "./types";

export const resolvers: Resolvers = {
  Query: {
    pokemon: async (_, { id }, { dataSources }) => {
      return dataSources.pokemonAPI.getPokemon(id);
    },
  },

  Pokemon: {
    abilities: ({ abilitiesLite }, _, { dataSources }) => {
      return dataSources.pokemonAPI.getAbilities(abilitiesLite);
    },
  },
};
