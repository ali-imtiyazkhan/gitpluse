import {
  router,
  protectedProcedure,
  adminProcedure,
  ownerProcedure,
} from "../trpc.js";
import { memberService } from "../services/member.service.js";
import { z } from "zod";
import { Role } from "@prisma/client";

export const memberRouter = router({
  /**
   * Apply to join the community
   */
  joinCommunity: protectedProcedure.mutation(async ({ ctx }) => {
    return await memberService.applyToJoin(ctx.db.prisma, ctx.user!.id);
  }),

  /**
   * Approve a member (Admin only)
   */
  approve: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await memberService.approveMember(
        ctx.db.prisma,
        input.userId,
        ctx.user!.id
      );
    }),

  /**
   * Ban a member (Admin only)
   */
  ban: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await memberService.banMember(
        ctx.db.prisma,
        input.userId,
        ctx.user!.id
      );
    }),

  /**
   * Update member role (Admin only)
   */
  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.nativeEnum(Role),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await memberService.updateRole(
        ctx.db.prisma,
        input.userId,
        input.role,
        ctx.user!.id
      );
    }),

  /**
   * List all members (Admin only)
   */
  list: adminProcedure.query(async ({ ctx }) => {
    return await memberService.listMembers(ctx.db.prisma);
  }),

  /**
   * Get audit logs (Admin only)
   */
  getAuditLogs: adminProcedure.query(async ({ ctx }) => {
    return await memberService.getAuditLogs(ctx.db.prisma);
  }),
});
