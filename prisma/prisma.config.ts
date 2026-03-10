import path from "node:path";
import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://luminaled:luminaled@localhost:5433/luminaled",
  },
  migrate: {
    async url() {
      return process.env.DATABASE_URL ?? "postgresql://luminaled:luminaled@localhost:5433/luminaled";
    },
  },
});
