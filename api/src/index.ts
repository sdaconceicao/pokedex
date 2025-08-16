import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";
import { logger } from "./logger";

import { resolvers } from "./resolvers";
import { PokemonAPI } from "./datasources/pokemon-api";

const typeDefs = gql(
  readFileSync(path.resolve(process.cwd(), "src/schema.graphql"), {
    encoding: "utf-8",
  })
);

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  // Pre-load the Pokémon index on startup
  const pokemonAPI = new PokemonAPI();
  await pokemonAPI.loadPokemonIndex();

  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;

      return {
        dataSources: {
          pokemonAPI: new PokemonAPI({ cache }),
        },
      };
    },
  });

  logger.info(`
    🚀  Server is running!
    📭  Query at ${url}
  `);
}

startApolloServer();
