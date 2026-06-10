import { PokemonAPI } from "./datasources/pokemon-api";

export type DataSourceContext = {
  dataSources: {
    pokemonAPI: PokemonAPI;
  };
};

export async function createContext(
  cache?: ConstructorParameters<typeof PokemonAPI>[0]
): Promise<DataSourceContext> {
  const pokemonAPI = cache ? new PokemonAPI(cache) : new PokemonAPI();

  // Lazy-load index on first request; static cache reuses across warm instances
  await pokemonAPI.loadPokemonIndex();

  return {
    dataSources: {
      pokemonAPI,
    },
  };
}
