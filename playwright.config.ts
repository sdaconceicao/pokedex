import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      name: "pokedex-graphql",
      command: "cd backend/pokedex-graphql && npm run start:dev:mock",
      url: "http://localhost:4000",
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      name: "pokedex-rest",
      command: "cd backend/pokedex-rest && npm run start:test",
      url: "http://localhost:3005/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      env: {
        DB_HOST: "localhost",
        DB_PORT: "5434",
        DB_USERNAME: "pokedex_user",
        DB_PASSWORD: "pokedex_password",
        DB_DATABASE: "pokedex_test",
        DB_SCHEMA: "users",
        JWT_SECRET: "test-secret-key-for-e2e-tests",
        PORT: "3005",
      },
    },
    {
      name: "frontend",
      command: "cd frontend && npm run start:dev:test",
      url: "http://localhost:3001",
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});
