import { PrismaClient, TaskStatus } from "@prisma/client";
import type { ExtendedPrismaClient } from "../prisma.js";
import { emitActivity } from "../socket/index.js";

export const taskService = {
  /**
   * Create a new task
   */
  async createTask(
    prisma: ExtendedPrismaClient | PrismaClient,
    data: { title: string; description?: string | undefined; projectId: string; priority?: string | undefined }
  ) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        projectId: data.projectId,
        priority: data.priority || "MEDIUM",
      },
    });

    emitActivity("TASK_CREATED", {
      taskId: task.id,
      title: task.title,
      projectId: task.projectId,
    });

    return task;
  },

  /**
   * List all tasks for a project
   */
  async listTasks(prisma: ExtendedPrismaClient | PrismaClient, projectId: string) {
    return await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: { firstName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Claim a task (Self-assign)
   * Includes conflict detection
   */
  async claimTask(
    prisma: ExtendedPrismaClient | PrismaClient,
    taskId: string,
    userId: string
  ) {
    // 1. Fetch task and check if already assigned
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { assigneeId: true, status: true, title: true, projectId: true },
    });

    if (!task) throw new Error("Task not found");
    
    // Conflict detection
    if (task.assigneeId) {
      if (task.assigneeId === userId) {
        throw new Error("You have already claimed this task");
      }
      throw new Error("Task has already been claimed by another member");
    }

    // 2. Assign the task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assigneeId: userId,
        status: TaskStatus.IN_PROGRESS,
      },
      include: {
        assignee: {
          select: { firstName: true, email: true },
        },
      },
    });

    // 3. Log activity
    await prisma.activityLog.create({
      data: {
        userId: userId,
        action: "TASK_CLAIMED",
        details: { taskId, taskTitle: task.title },
      },
    });

    // 4. Emit real-time update
    emitActivity("TASK_CLAIMED", {
      taskId,
      taskTitle: task.title,
      assigneeName: updatedTask.assignee?.firstName,
      projectId: task.projectId,
    });

    return updatedTask;
  },

  /**
   * Update task status
   */
  async updateStatus(
    prisma: ExtendedPrismaClient | PrismaClient,
    taskId: string,
    status: TaskStatus,
    userId: string
  ) {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      select: { id: true, title: true, projectId: true },
    });

    await prisma.activityLog.create({
      data: {
        userId: userId,
        action: "TASK_STATUS_UPDATED",
        details: { taskId, taskTitle: task.title, status },
      },
    });

    emitActivity("TASK_STATUS_UPDATED", {
      taskId,
      taskTitle: task.title,
      status,
      projectId: task.projectId,
    });

    return task;
  },


  /**
   * Get all tasks across all projects (Dashboard view)
   */
  async getAllTasks(prisma: ExtendedPrismaClient | PrismaClient) {
    return await prisma.task.findMany({
      include: {
        project: { select: { name: true } },
        assignee: { select: { firstName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
