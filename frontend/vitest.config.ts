import path from "path";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

const cssModuleStubPath = path.resolve(__dirname, "test/css-module-stub.ts");

const cssModulesMock = (): Plugin => ({
  name: "css-modules-mock",
  enforce: "pre",
  resolveId(source) {
    if (source.endsWith(".module.css")) {
      return cssModuleStubPath;
    }
  },
});

export default defineConfig({
  plugins: [cssModulesMock(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
      "@pokemonle/icons-react": path.resolve(
        __dirname,
        "node_modules/@pokemonle/icons-react/dist/index.js"
      ),
    },
  },
});
