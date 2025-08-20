import { execSync } from "child_process";

import { test as setup } from "@playwright/test";

setup("create new database", async () => {
  console.log("Stopping test Postgres container...");
  /*
  execSync(
    "cd backend/pokedex-rest && docker-compose -f docker-compose.test.yml down",
    {
      stdio: "inherit",
    }
  );
  */
});
