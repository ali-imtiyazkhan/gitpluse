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
   * Get community stats (Admin only)
   */
  getStats: adminProcedure.query(async ({ ctx }) => {
    return await memberService.getMemberStats(ctx.db.prisma);
  }),

  /**
   * Get audit logs (Admin only)
   */
  getAuditLogs: adminProcedure.query(async ({ ctx }) => {
    return await memberService.getAuditLogs(ctx.db.prisma);
  }),

  /**
   * Get recent activity for the dashboard (Protected)
   */
  getRecentActivities: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { firstName: true, email: true },
        },
      },
    });
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
        
        // Robust base64 extraction
        const base64Data = input.fileData.includes(",") 
          ? input.fileData.split(",")[1] 
          : input.fileData;
          
        if (!base64Data) {
          throw new Error("Invalid file data format");
        }
        
        const buffer = Buffer.from(base64Data, "base64");
        textToAnalyze = await pdfService.extractText(buffer);
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
