import { PrismaClient, Role, MemberStatus } from "@prisma/client";
import type { ExtendedPrismaClient } from "../prisma.js";
import { emitActivity } from "../socket/index.js";

export const memberService = {
  /**
   * Apply to join the community
   */
  async applyToJoin(prisma: ExtendedPrismaClient | PrismaClient, userId: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        status: MemberStatus.PENDING,
      },
    });

    emitActivity("MEMBER_APPLIED", {
      userId,
      email: user.email,
    });

    return user;
  },

  /**
   * Approve a member's application
   */
  async approveMember(
    prisma: ExtendedPrismaClient | PrismaClient,
    userId: string,
    adminId: string
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        status: MemberStatus.APPROVED,
        role: Role.CONTRIBUTOR, // Default role after approval
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: "MEMBER_APPROVED",
        details: { memberId: userId, memberEmail: user.email },
      },
    });

    emitActivity("MEMBER_APPROVED", {
      userId,
      email: user.email,
    });

    return user;
  },

  /**
   * Ban a member
   */
  async banMember(
    prisma: ExtendedPrismaClient | PrismaClient,
    userId: string,
    adminId: string
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        status: MemberStatus.BANNED,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: "MEMBER_BANNED",
        details: { memberId: userId, memberEmail: user.email },
      },
    });

    emitActivity("MEMBER_BANNED", {
      userId,
      email: user.email,
    });

    return user;
  },

  /**
   * Update a member's role
   */
  async updateRole(
    prisma: ExtendedPrismaClient | PrismaClient,
    userId: string,
    newRole: Role,
    adminId: string
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        role: newRole,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: "ROLE_UPDATED",
        details: { memberId: userId, role: newRole },
      },
    });

    emitActivity("ROLE_UPDATED", {
      userId,
      role: newRole,
    });

    return user;
  },


  /**
   * Get all members
   */
  async listMembers(prisma: ExtendedPrismaClient | PrismaClient) {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Get audit logs
   */
  async getAuditLogs(prisma: ExtendedPrismaClient | PrismaClient) {
    return await prisma.activityLog.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  },
};
