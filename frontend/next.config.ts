import { withRelatedProject } from "@vercel/related-projects";
import type { NextConfig } from "next";

// Resolve each backend's origin for the current deployment: the same
// branch's preview deployment on previews, the production alias in
// production, and the env var / localhost default everywhere else.
// Project names must match the Vercel project names exactly.
const graphqlOrigin = withRelatedProject({
  projectName: "pokedex-graphql",
  defaultHost:
    process.env.NEXT_PUBLIC_GRAPHQL_URL?.replace(/\/graphql$/, "") ?? "http://localhost:4000",
});

const authOrigin = withRelatedProject({
  projectName: "pokedex-rest",
  defaultHost: process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:3004",
});

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GRAPHQL_URL: `${graphqlOrigin}/graphql`,
    NEXT_PUBLIC_AUTH_API_URL: authOrigin,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
    ],
  },
};

export default nextConfig;
