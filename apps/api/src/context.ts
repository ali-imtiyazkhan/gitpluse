import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import prisma from "./prisma.js";
import type { User } from "@prisma/client";

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<{
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  db: typeof prisma;
  ip?: string;
  user?: User | null;
}> {
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  return {
    req,
    res,
    db: prisma,
    ip,
    user: null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
