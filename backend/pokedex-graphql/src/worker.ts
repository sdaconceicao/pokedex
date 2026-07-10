import { yoga } from "./yoga";

// Cloudflare Workers entry point. Deploy with `wrangler deploy`; the
// GraphQL endpoint is served at /graphql on the workers.dev URL.
export default {
  fetch: (request: Request) => yoga.fetch(request),
};
