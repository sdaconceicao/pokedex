import { PokemonAPI } from "./datasources/pokemon-api";

export type DataSourceContext = {
  dataSources: {
    pokemonAPI: PokemonAPI;
  };
};
