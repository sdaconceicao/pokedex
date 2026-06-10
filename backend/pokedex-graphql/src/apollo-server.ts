import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";

import type { DataSourceContext } from "./context";
import { resolvers } from "./resolvers";

const typeDefs = gql(
  readFileSync(path.resolve(process.cwd(), "src/schema.graphql"), {
    encoding: "utf-8",
  })
);

export function createApolloServer(): ApolloServer<DataSourceContext> {
  return new ApolloServer<DataSourceContext>({ typeDefs, resolvers });
}
