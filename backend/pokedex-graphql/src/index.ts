import { startStandaloneServer } from "@apollo/server/standalone";
import { logger } from "./logger";

import { createApolloServer } from "./apollo-server";
import { createContext } from "./context";
import { startMockServer } from "./mocks/server.js";

async function startApolloServer(useMockAPI: boolean = false) {
  const apolloServer = createApolloServer();
  const apiName = useMockAPI ? "Mock" : "Real";

  const { url } = await startStandaloneServer(apolloServer, {
    context: async () => createContext({ cache: apolloServer.cache }),
  });

  logger.info(`
    🚀  ${apiName} Server is running!
    📭  Query at ${url}
  `);
}

const useMockAPI =
  process.env.USE_MOCK_API === "true" || process.argv.includes("--mock");

if (useMockAPI) {
  startMockServer();
}

startApolloServer(useMockAPI);
