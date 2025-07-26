import { PokemonAPI } from "./datasources/pokemon-api";

export type DataSourceContext = {
  dataSources: {
    pokemonAPI: PokemonAPI;
  };
};

export async function createContext(): Promise<DataSourceContext> {
  const pokemonAPI = new PokemonAPI();

  // Load the Pokémon index on startup for fast searching
  await pokemonAPI.loadPokemonIndex();

  return {
    dataSources: {
      pokemonAPI,
    },
  };
}
