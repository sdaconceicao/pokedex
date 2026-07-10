import { createServer } from "node:http";

import { logger } from "./logger.js";
import { startMockServer } from "./mocks/server.js";
import { yoga } from "./yoga.js";

const useMockAPI =
  process.env.USE_MOCK_API === "true" || process.argv.includes("--mock");

if (useMockAPI) {
  startMockServer();
}

const port = Number(process.env.PORT ?? 4000);
const apiName = useMockAPI ? "Mock" : "Real";

createServer(yoga).listen(port, () => {
  logger.info(`
    🚀  ${apiName} Server is running!
    📭  Query at http://localhost:${port}${yoga.graphqlEndpoint}
  `);
});
