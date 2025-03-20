import {
  defineWorkersProject,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";
import path from "node:path";

export default defineWorkersProject(async () => {
  const migrationsPath = path.join(import.meta.dirname, "migrations");
  const migrations = await readD1Migrations(migrationsPath);

  return {
    test: {
      poolOptions: {
        workers: {
          miniflare: {
            bindings: { TEST_MIGRATIONS: migrations },
          },
          wrangler: { configPath: "../../wrangler.jsonc" },
        },
      },
      setupFiles: ["test/setup.ts"],
    },
  };
});
