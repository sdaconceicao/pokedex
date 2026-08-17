import type { DataSourceConfig } from "@apollo/datasource-rest";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";

import { PokemonAPI } from "./datasources/pokemon-api.js";

export type DataSourceContext = {
  dataSources: {
    pokemonAPI: PokemonAPI;
  };
};

// Shared across requests so RESTDataSource HTTP caching survives beyond a
// single request (per-isolate on Workers, per-warm-instance on Vercel).
const sharedCache = new InMemoryLRUCache();

// Explicit global fetch: the default node-fetch path is Node-only, while
// this works on Node >=18, Vercel, and Workers alike.
const fetcher: NonNullable<DataSourceConfig["fetch"]> = (url, init) =>
  fetch(url, init as RequestInit);

export async function createContext(config?: DataSourceConfig): Promise<DataSourceContext> {
  const pokemonAPI = new PokemonAPI({
    cache: sharedCache,
    fetch: fetcher,
    ...config,
  });

  // Lazy-load indexes on first request; static cache reuses across warm instances
  await pokemonAPI.loadPokemonIndex();

  return {
    dataSources: {
      pokemonAPI,
    },
  };
}
