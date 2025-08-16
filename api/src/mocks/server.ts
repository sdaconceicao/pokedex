import { setupServer } from "msw/node";
import { handlers } from "./handlers.js";

export const server = setupServer(...handlers);

export const startMockServer = () => {
  if (process.env.USE_MOCK_API === "true") {
    server.listen({ onUnhandledRequest: "warn" });
    console.log("🚀 MSW Mock Server started - intercepting PokeAPI calls");
  }
};

export const stopMockServer = () => {
  if (process.env.USE_MOCK_API === "true") {
    server.close();
    console.log("🛑 MSW Mock Server stopped");
  }
};
