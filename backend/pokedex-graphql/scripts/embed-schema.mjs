import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(dir, "../src/schema.graphql");
const outPath = path.join(dir, "../src/schema.generated.ts");

const sdl = readFileSync(schemaPath, "utf8");
const escaped = sdl.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

writeFileSync(
  outPath,
  `// Generated from schema.graphql by scripts/embed-schema.mjs — do not edit.\nexport const typeDefs = /* GraphQL */ \`\n${escaped}\`;\n`,
);

console.log(`Embedded schema.graphql into ${path.relative(process.cwd(), outPath)}`);
