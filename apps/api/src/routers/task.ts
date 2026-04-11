import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../trpc.js";
import { taskService } from "../services/task.service.js";
import { z } from "zod";
import { TaskStatus } from "@prisma/client";

export const taskRouter = router({
  /**
   * List all tasks for a project
   */
  listByProject: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await taskService.listTasks(ctx.db.prisma, input.projectId);
    }),

  /**
   * Create a task (Admin/Maintainer only)
   */
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        projectId: z.string(),
        priority: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await taskService.createTask(ctx.db.prisma, {
        ...input,
        userId: ctx.user!.id,
      });
    }),

  /**
   * Claim a task (Contributor and above)
   */
  claim: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await taskService.claimTask(ctx.db.prisma, input.taskId, ctx.user!.id);
    }),

  /**
   * Update task status (Assignee or Admin)
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        status: z.nativeEnum(TaskStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await taskService.updateStatus(
        ctx.db.prisma,
        input.taskId,
        input.status,
        ctx.user!.id
      );
    }),

  /**
   * Get all tasks (Dashboard)
   */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await taskService.getAllTasks(ctx.db.prisma);
  }),
});
