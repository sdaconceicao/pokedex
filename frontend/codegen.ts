import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/pokedex-graphql/src/schema.graphql",
  documents: ["app/**/*.{ts,tsx}"],
  generates: {
    "./app/lib/types.ts": {
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
