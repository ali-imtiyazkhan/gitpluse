import { PrismaClient, ProjectStatus } from "@prisma/client";
import type { ExtendedPrismaClient } from "../prisma.js";
import { emitActivity } from "../socket/index.js";

export const projectService = {
  /**
   * Create a new project
   */
  async createProject(
    prisma: ExtendedPrismaClient | PrismaClient,
    data: { name: string; description?: string | undefined; repoUrl?: string | undefined; ownerId: string; skills?: any | undefined }
  ) {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        repoUrl: data.repoUrl ?? null,
        ownerId: data.ownerId,
        skills: data.skills ?? null,
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
   * Get project suggestions based on user skills
   */
  async getSuggestedProjects(prisma: ExtendedPrismaClient | PrismaClient, userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { skills: true },
    });

    const projects = await prisma.project.findMany({
      where: { status: ProjectStatus.ACTIVE },
      include: {
        owner: { select: { firstName: true } },
        _count: { select: { tasks: true } },
      },
    });

    if (!user?.skills || !Array.isArray(projects)) return projects;

    // Flatten user skills
    const userSkillsSet = new Set<string>();
    const userSkills = user.skills as any;
    
    Object.values(userSkills).forEach((category: any) => {
      if (Array.isArray(category)) {
        category.forEach((skill: string) => userSkillsSet.add(skill.toLowerCase()));
      }
    });

    // Score projects
    const scoredProjects = projects.map(project => {
      const projectSkills = (project.skills as string[]) || [];
      if (projectSkills.length === 0) return { ...project, matchScore: 0 };

      const matches = projectSkills.filter(skill => 
        userSkillsSet.has(skill.toLowerCase())
      );

      const matchScore = Math.round((matches.length / projectSkills.length) * 100);
      return { ...project, matchScore };
    });

    // Sort by score
    return scoredProjects.sort((a, b) => b.matchScore - a.matchScore);
  },

  /**
   * Get project stats
   */
  async getProjectStats(prisma: ExtendedPrismaClient | PrismaClient) {
    const [total, active, members] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: ProjectStatus.ACTIVE } }),
      prisma.user.count(),
    ]);

    return { total, active, members };
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
    data: { 
      name?: string | undefined; 
      description?: string | undefined; 
      status?: ProjectStatus | undefined; 
      repoUrl?: string | undefined; 
      skills?: any | undefined 
    }
  ) {
    return await prisma.project.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description ?? null }),
        ...(data.status && { status: data.status }),
        ...(data.repoUrl !== undefined && { repoUrl: data.repoUrl ?? null }),
        ...(data.skills !== undefined && { skills: data.skills }),
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
