import type { PrismaClient, Role } from "@prisma/client";
import type { ExtendedPrismaClient } from "../prisma.js";

export const userService = {
  /**
   * Get total count of users
   */
  async getUserCount(prisma: ExtendedPrismaClient | PrismaClient) {
    const userCount = await prisma.user.count();

    return {
      total_users: userCount,
    };
  },


  /**
   * Get user's completed steps
   */
  async getCompletedSteps(
    prisma: ExtendedPrismaClient | PrismaClient,
    userId: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { completedSteps: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const completedSteps = user.completedSteps as string[] | null;
    return completedSteps || [];
  },

  /**
   * Update user's completed steps
   */
  async updateCompletedSteps(
    prisma: ExtendedPrismaClient | PrismaClient,
    userId: string,
    completedSteps: string[]
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        completedSteps: completedSteps,
      },
      select: { completedSteps: true },
    });

    return (user.completedSteps as string[]) || [];
  },

  /**
   * Get all users (Admin only)
   */
  async getAllUsers(
    prisma: ExtendedPrismaClient | PrismaClient,
    params: { skip?: number; take?: number; search?: string }
  ) {
    const { skip = 0, take = 50, search } = params;
    
    const where = search ? {
      OR: [
        { email: { contains: search } },
        { firstName: { contains: search } },
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          role: true,
          status: true,
          createdAt: true,
          lastLogin: true,
        }
      }),
      prisma.user.count({ where })
    ]);

    return { users, total };
  },

  /**
   * Update user role (Admin only)
   */
  async updateRole(
    prisma: ExtendedPrismaClient | PrismaClient,
    userId: string,
    role: Role
  ) {
    return await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, role: true }
    });
  },

  /**
   * Delete user (Owner only)
   */
  async deleteUser(
    prisma: ExtendedPrismaClient | PrismaClient,
    userId: string
  ) {
    return await prisma.user.delete({
      where: { id: userId }
    });
  }
};
