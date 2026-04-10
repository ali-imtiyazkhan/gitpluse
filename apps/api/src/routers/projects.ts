import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../trpc.js";
import { projectService } from "../services/project.service.js";
import { z } from "zod";
import { ProjectStatus } from "@prisma/client";

export const projectRouter = router({
  /**
   * List all community projects
   */
  list: publicProcedure.query(async ({ ctx }) => {
    return await projectService.listProjects(ctx.db.prisma);
  }),

  /**
   * Get project stats
   */
  getStats: publicProcedure.query(async ({ ctx }) => {
    return await projectService.getProjectStats(ctx.db.prisma);
  }),

  /**
   * Get single project detail
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await projectService.getProject(ctx.db.prisma, input.id);
    }),

  /**
   * Create project (Admin/Maintainer only)
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        repoUrl: z.string().url().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await projectService.createProject(ctx.db.prisma, {
        ...input,
        ownerId: ctx.user!.id,
      });
    }),

  /**
   * Update project (Admin/Maintainer only)
   */
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.nativeEnum(ProjectStatus).optional(),
        repoUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await projectService.updateProject(ctx.db.prisma, id, data);
    }),

  /**
   * Delete project (Owner only - placeholder for more complex check)
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await projectService.deleteProject(ctx.db.prisma, input.id);
    }),
});
