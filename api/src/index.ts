import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";
import { logger } from "./logger";

import { resolvers } from "./resolvers";
import { PokemonAPI } from "./datasources/pokemon-api";
import { MockPokemonAPI } from "./datasources/pokemon-api.mock";

const typeDefs = gql(
  readFileSync(path.resolve(process.cwd(), "src/schema.graphql"), {
    encoding: "utf-8",
  })
);

async function startApolloServer(useMockAPI: boolean = false) {
  const server = new ApolloServer({ typeDefs, resolvers });

  // Choose the appropriate API implementation
  const APIClass = useMockAPI ? MockPokemonAPI : PokemonAPI;
  const apiName = useMockAPI ? "Mock" : "Real";

  // Pre-load the Pokémon index on startup
  const pokemonAPI = new APIClass();
  await pokemonAPI.loadPokemonIndex();

  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;

      return {
        dataSources: {
          pokemonAPI: new APIClass({ cache }),
        },
      };
    },
  });

  logger.info(`
    🚀  ${apiName} Server is running!
    📭  Query at ${url}
  `);
}

// Check if we should use the mock API
const useMockAPI =
  process.env.USE_MOCK_API === "true" || process.argv.includes("--mock");

startApolloServer(useMockAPI);
