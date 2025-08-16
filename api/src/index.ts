import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";
import { logger } from "./logger";

import { resolvers } from "./resolvers";
import { PokemonAPI } from "./datasources/pokemon-api";
import { startMockServer } from "./mocks/server.js";

const typeDefs = gql(
  readFileSync(path.resolve(process.cwd(), "src/schema.graphql"), {
    encoding: "utf-8",
  })
);

async function startApolloServer(useMockAPI: boolean = false) {
  const apolloServer = new ApolloServer({ typeDefs, resolvers });

  // Choose the appropriate API implementation
  const apiName = useMockAPI ? "Mock" : "Real";

  // Pre-load the Pokémon index on startup
  const pokemonAPI = new PokemonAPI();
  await pokemonAPI.loadPokemonIndex();

  const { url } = await startStandaloneServer(apolloServer, {
    context: async () => {
      const { cache } = apolloServer;

      return {
        dataSources: {
          pokemonAPI: new PokemonAPI({ cache }),
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

// Start MSW mock server if environment variable is set
if (useMockAPI) {
  startMockServer();
}

startApolloServer(useMockAPI);
