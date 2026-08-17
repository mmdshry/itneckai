import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/busywork/tables.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.BUSYWORK_SQLITE_PATH ?? "data/busywork.sqlite",
  },
});
