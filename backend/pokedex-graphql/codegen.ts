import { createRequire } from "node:module";
import type { CodegenConfig } from "@graphql-codegen/cli";

const require = createRequire(import.meta.url);

const config: CodegenConfig = {
  schema: "./src/schema.graphql",
  pluginLoader: (mod) => import(require.resolve(mod)),
  hooks: {
    afterAllFileWrite: ["node scripts/embed-schema.mjs"],
  },
  generates: {
    "./src/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "./context.js#DataSourceContext",
      },
    },
  },
};

export default config;
