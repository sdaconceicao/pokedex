import { createRequire } from "node:module";
import type { CodegenConfig } from "@graphql-codegen/cli";

const require = createRequire(import.meta.url);

const config: CodegenConfig = {
  schema: "../backend/pokedex-graphql/src/schema.graphql",
  documents: ["app/**/*.{ts,tsx}"],
  pluginLoader: (mod) => import(require.resolve(mod)),
  generates: {
    "./app/types/graphql.ts": {
      plugins: ["typescript"],
      config: {
        skipTypename: true,
        enumsAsTypes: true,
        scalars: {
          ID: "string",
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
