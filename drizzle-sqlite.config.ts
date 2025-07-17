import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./shared/schema-sqlite.ts",
  out: "./migrations-sqlite",
  dbCredentials: {
    url: "./smart-crm.db",
  },
});
