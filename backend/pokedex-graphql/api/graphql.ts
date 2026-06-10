import { HeaderMap } from "@apollo/server";
import type { VercelRequest, VercelResponse } from "@vercel/node";

import { createApolloServer } from "../src/apollo-server";
import { createContext } from "../src/context";

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["*"];

let apolloServer = createApolloServer();
let serverStarted = false;

async function getServer() {
  if (!serverStarted) {
    await apolloServer.start();
    serverStarted = true;
  }
  return apolloServer;
}

function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  const allowedOrigin =
    ALLOWED_ORIGINS.includes("*") ||
    (origin && ALLOWED_ORIGINS.includes(origin))
      ? origin ?? "*"
      : ALLOWED_ORIGINS[0];

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const server = await getServer();
    const headers = new HeaderMap();

    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
      httpGraphQLRequest: {
        method: req.method,
        headers,
        search: req.url?.includes("?")
          ? req.url.slice(req.url.indexOf("?"))
          : "",
        body:
          req.method === "POST"
            ? typeof req.body === "string"
              ? req.body
              : JSON.stringify(req.body)
            : undefined,
      },
      context: async () => createContext({ cache: server.cache }),
    });

    for (const [key, value] of httpGraphQLResponse.headers) {
      res.setHeader(key, value);
    }

    res.status(httpGraphQLResponse.status ?? 200);

    if (httpGraphQLResponse.body.kind === "complete") {
      return res.send(httpGraphQLResponse.body.string);
    }

    for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
      res.write(chunk);
    }
    return res.end();
  } catch (error) {
    console.error("GraphQL handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
