import path from "node:path";
import fs from "node:fs";
import { defineConfig } from "prisma/config";

// Parse .env.local manually since Prisma config runs before dotenv
function loadEnvFile(filePath: string): Record<string, string> {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const vars: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const match = line.match(/^([^#=]+)=["']?(.+?)["']?\s*$/);
      if (match) vars[match[1].trim()] = match[2];
    }
    return vars;
  } catch {
    return {};
  }
}

const envLocal = {
  ...loadEnvFile(path.join(process.cwd(), ".env.local")),
  ...loadEnvFile(path.join(__dirname, "..", ".env.local")),
};

function getUrl(): string {
  const raw = envLocal.DIRECT_URL || envLocal.DATABASE_URL || process.env.DIRECT_URL || process.env.DATABASE_URL || "postgresql://luminaled:luminaled@localhost:5433/luminaled";
  // Strip sslmode=require which causes issues with Prisma migrate
  return raw.replace(/[?&]sslmode=require/g, (m) => (m.startsWith("?") ? "?" : "")).replace(/\?$/, "").replace(/\?&/, "?");
}

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url: getUrl(),
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
