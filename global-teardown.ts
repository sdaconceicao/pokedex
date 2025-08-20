import { execSync } from "child_process";

async function globalTeardown() {
  console.log("Stopping test Postgres container...");
  execSync("docker-compose -f docker-compose.test.yml down", {
    stdio: "inherit",
  });
}

export default globalTeardown;
