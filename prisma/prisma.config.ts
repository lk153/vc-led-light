import path from "node:path";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://luminaled:luminaled@localhost:5433/luminaled",
  },
});
