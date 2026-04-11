import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
  log: ["error", "warn"],
});

const withTimeout = async <T>(
  operation: Promise<T>,
  timeoutMs: number = 20000
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error("Database operation timed out")),
      timeoutMs
    );
  });

  return Promise.race([operation, timeoutPromise]);
};

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

export { withTimeout };
export default { prisma, connectDB };

export type ExtendedPrismaClient = typeof prisma;
