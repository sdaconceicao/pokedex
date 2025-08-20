// global-setup.ts
import { execSync } from "child_process";

async function globalSetup() {
  execSync(
    "cd backend/pokedex-rest && docker-compose -f docker-compose.test.yml up -d postgres-test",
    {
      stdio: "inherit",
    }
  );

  // wait until Postgres is healthy
  execSync(
    `bash -c "until docker exec postgres-test pg_isready -U test ; do sleep 1; done"`
  );
}

export default globalSetup;
