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
  /**
   * Analyze skills from a block of text
   */
  analyzeSkills: protectedProcedure
    .input(z.object({ 
      text: z.string().optional(),
      fileData: z.string().optional(), // Base64 encoded file
      fileType: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      let textToAnalyze = input.text || "";

      // Handle PDF extraction if file is provided
      if (input.fileData && input.fileType === "application/pdf") {
        const { pdfService } = await import("../services/pdf.service.js");
        const buffer = Buffer.from(input.fileData.split(",")[1] || input.fileData, "base64");
        textToAnalyze = await pdfService.extractText(buffer);
        console.log("📄 PDF Text Extracted. Length:", textToAnalyze.length);
      }

      if (!textToAnalyze) {
        throw new Error("No text or file provided for analysis");
      }

      const { aiService } = await import("../services/ai.service.js");
      const skills = await aiService.extractSkillsWithAI(textToAnalyze);
      console.log("🎯 Extracted Skills:", Object.values(skills).flat().length, "found");
      
      // Save skills to user profile
      await ctx.db.prisma.user.update({
        where: { id: ctx.user!.id },
        data: { skills: skills as any },
      });

      return skills;
    }),
});
