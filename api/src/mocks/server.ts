import { setupServer } from "msw/node";
import { handlers } from "./handlers.js";
import { logger } from "../logger.js";

export const server = setupServer(...handlers);

export const startMockServer = () => {
  if (process.env.USE_MOCK_API === "true") {
    server.listen({ onUnhandledRequest: "warn" });
    logger.info("🚀 MSW Mock Server started - intercepting PokeAPI calls");
  }
};

export const stopMockServer = () => {
  if (process.env.USE_MOCK_API === "true") {
    server.close();
    logger.info("🛑 MSW Mock Server stopped");
  }
};
