import { router, adminProcedure, ownerProcedure } from "../trpc.js";
import { z } from "zod";
import { userService } from "../services/user.service.js";
import { Role } from "@prisma/client";

export const adminRouter = router({
  /**
   * List all users with pagination and search
   */
  listUsers: adminProcedure
    .input(
      z.object({
        skip: z.number().int().min(0).optional(),
        take: z.number().int().min(1).max(100).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await userService.getAllUsers(ctx.db.prisma, input);
    }),

  /**
   * Update a user's role
   */
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.nativeEnum(Role),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await userService.updateRole(
        ctx.db.prisma,
        input.userId,
        input.role
      );
    }),

  /**
   * Delete a user (Owner only)
   */
  deleteUser: ownerProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await userService.deleteUser(ctx.db.prisma, input.userId);
    }),
});
