import { createYoga, createSchema, type CORSOptions } from "graphql-yoga";

import { typeDefs } from "./schema.generated";
import { resolvers } from "./resolvers";
import { createContext, type DataSourceContext } from "./context";

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["*"];

function cors(request: Request): CORSOptions {
  const requestOrigin = request.headers.get("origin") ?? undefined;
  const origin =
    ALLOWED_ORIGINS.includes("*") ||
    (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin))
      ? (requestOrigin ?? "*")
      : ALLOWED_ORIGINS[0];

  return {
    origin,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  };
}

// Fetch-based handler usable as a Node http listener (src/index.ts),
// a Vercel serverless function (api/graphql.ts), and a Cloudflare
// Worker (src/worker.ts).
export const yoga = createYoga({
  schema: createSchema<DataSourceContext>({ typeDefs, resolvers }),
  context: () => createContext(),
  graphqlEndpoint: "/graphql",
  cors,
});
