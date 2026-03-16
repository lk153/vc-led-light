import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL!;
  const needsSsl = rawUrl.includes("sslmode=require") || rawUrl.includes("supabase");
  // Strip sslmode from URL to prevent pg from enforcing verify-full
  const connectionString = rawUrl
    .replace(/[?&]sslmode=require/g, (m) => (m.startsWith("?") ? "?" : ""))
    .replace(/\?$/, "")
    .replace(/\?&/, "?");
  const isProduction = process.env.NODE_ENV === "production";
  const pool = new pg.Pool({
    connectionString,
    max: isProduction ? 1 : 10,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
