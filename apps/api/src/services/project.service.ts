import { PrismaClient, ProjectStatus } from "@prisma/client";
import type { ExtendedPrismaClient } from "../prisma.js";
import { emitActivity } from "../socket/index.js";

export const projectService = {
  /**
   * Create a new project
   */
  async createProject(
    prisma: ExtendedPrismaClient | PrismaClient,
    data: { name: string; description?: string | undefined; repoUrl?: string | undefined; ownerId: string }
  ) {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        repoUrl: data.repoUrl ?? null,
        ownerId: data.ownerId,
      },
    });

    emitActivity("PROJECT_CREATED", {
      projectId: project.id,
      name: project.name,
    });

    return project;
  },


  /**
   * List all projects
   */
  async listProjects(prisma: ExtendedPrismaClient | PrismaClient) {
    return await prisma.project.findMany({
      include: {
        owner: {
          select: {
            firstName: true,
            email: true,
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Get project stats
   */
  async getProjectStats(prisma: ExtendedPrismaClient | PrismaClient) {
    const [total, active] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: ProjectStatus.ACTIVE } }),
    ]);

    return { total, active };
  },

  /**
   * Get single project detail
   */
  async getProject(prisma: ExtendedPrismaClient | PrismaClient, id: string) {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: { firstName: true, email: true },
        },
        tasks: {
          include: {
            assignee: {
              select: { firstName: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  /**
   * Update project
   */
  async updateProject(
    prisma: ExtendedPrismaClient | PrismaClient,
    id: string,
    data: { name?: string | undefined; description?: string | undefined; status?: ProjectStatus | undefined; repoUrl?: string | undefined }
  ) {
    return await prisma.project.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description ?? null }),
        ...(data.status && { status: data.status }),
        ...(data.repoUrl !== undefined && { repoUrl: data.repoUrl ?? null }),
      },
    });
  },

  /**
   * Delete project
   */
  async deleteProject(prisma: ExtendedPrismaClient | PrismaClient, id: string) {
    return await prisma.project.delete({
      where: { id },
    });
  },
};
