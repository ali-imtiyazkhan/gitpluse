import { initTRPC, TRPCError, type AnyProcedure } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context.js";
import { verifyToken } from "./utils/auth.js";
import type { User } from "@prisma/client";
import { Role } from "@prisma/client";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
  const authHeader = ctx.req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing or invalid authorization header",
    });
  }

  const token = authHeader.substring(7);

  try {
    const user = await verifyToken(token);
    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }
});

/**
 * Middleware that checks if the user has one of the allowed roles
 */
const hasRole = (allowedRoles: Role[]) =>
  t.middleware(async ({ ctx, next }) => {
    const user = (ctx as any).user as User;

    if (!user || !allowedRoles.includes(user.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  });

export type ProtectedContext = Context & { user: User };

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure: typeof t.procedure = t.procedure.use(
  isAuthed
) as any;

/**
 * Role-protected procedure factory
 */
export const roleProcedure = (allowedRoles: Role[]) =>
  protectedProcedure.use(hasRole(allowedRoles)) as typeof t.procedure;

// Shortcut procedures
export const adminProcedure = roleProcedure([Role.OWNER, Role.MAINTAINER]) as typeof t.procedure;
export const ownerProcedure = roleProcedure([Role.OWNER]) as typeof t.procedure;

