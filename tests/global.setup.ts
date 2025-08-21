// global-setup.ts
import { execSync } from "child_process";
import { test as setup } from "@playwright/test";

setup("create new database", async () => {
  console.log("Starting PostgreSQL test database...");

  // Wait a moment for the container to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Waiting for PostgreSQL to be ready...");

  // Wait until Postgres is healthy - use correct user 'pokedex_user' instead of 'postgres'
  try {
    execSync(
      `bash -c "until docker exec postgres-test pg_isready -U pokedex_user -d pokedex_test; do echo 'Waiting for PostgreSQL...'; sleep 2; done"`,
      { stdio: "inherit" }
    );
    console.log("PostgreSQL is ready!");

    // Test connection with the application user
    console.log("Testing connection with application user...");
    execSync(
      `docker exec postgres-test psql -U pokedex_user -d pokedex_test -c "SELECT 1;"`,
      { stdio: "inherit" }
    );

    console.log("PostgreSQL test database is fully ready!");
  } catch (error) {
    console.error("Failed to wait for PostgreSQL:", error);
    throw error;
  }
});
