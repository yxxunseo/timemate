import "dotenv/config";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env");
}

export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
