"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/providers/socket-provider";
import { trpc } from "@/lib/trpc";
import {
  Shield,
  Crown,
  Wifi,
  WifiOff,
  Users,
  FolderGit2,
  GitPullRequest,
} from "lucide-react";

const statusColors: Record<string, { text: string; glow: string; label: string }> = {
  APPROVED: {
    text: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]",
    label: "Active Member",
  },
  PENDING: {
    text: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    label: "Pending Review",
  },
  BANNED: {
    text: "text-rose-400",
    glow: "shadow-[0_0_20px_rgba(251,113,133,0.15)]",
    label: "Restricted",
  },
  GUEST: {
    text: "text-text-muted",
    glow: "",
    label: "Guest",
  },
};

const roleIcons: Record<string, React.ReactNode> = {
  OWNER: <Crown className="size-5 text-amber-400" />,
  MAINTAINER: <Shield className="size-5 text-brand-purple" />,
  CONTRIBUTOR: <GitPullRequest className="size-5 text-emerald-400" />,
  GUEST: <Users className="size-5 text-text-muted" />,
};

const QuickStats = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { isConnected } = useSocket();
  const { data: globalStats } = trpc.project.getStats.useQuery();
  
  const status = (session?.user as any)?.status || "GUEST";
  const role = (session?.user as any)?.role || "GUEST";
  const statusConfig = statusColors[status] || statusColors.GUEST;

  const stats = [
    {
      label: "Status",
      value: statusConfig.label,
      icon: isConnected ? (
        <Wifi className="size-4 text-emerald-400" />
      ) : (
        <WifiOff className="size-4 text-rose-400" />
      ),
      subtext: isConnected ? "Connected" : "Offline",
      valueClass: statusConfig.text,
      glowClass: statusConfig.glow,
    },
    {
      label: "Your Role",
      value: role,
      icon: roleIcons[role] || roleIcons.GUEST,
      subtext: role === "OWNER" ? "Full access" : role === "MAINTAINER" ? "Manage projects" : role === "CONTRIBUTOR" ? "Contribute" : "View only",
      valueClass: role === "OWNER" ? "text-amber-400" : role === "MAINTAINER" ? "text-brand-purple" : role === "CONTRIBUTOR" ? "text-emerald-400" : "text-text-muted",
      glowClass: "",
      onClick: () => router.push("/dashboard/community/members"),
    },
    {
      label: "Open Projects",
      value: globalStats?.active?.toString() || "0",
      icon: <FolderGit2 className="size-4 text-brand-purple" />,
      subtext: "Active this week",
      valueClass: "text-text-primary",
      glowClass: "",
      onClick: () => router.push("/dashboard/projects"),
    },
    {
      label: "Contributors",
      value: globalStats?.members?.toString() || "0",
      icon: <Users className="size-4 text-cyan-400" />,
      subtext: "Community members",
      valueClass: "text-text-primary",
      glowClass: "",
      onClick: () => router.push("/dashboard/community/members"),
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          onClick={stat.onClick}
          className={`group relative p-5 rounded-2xl bg-dash-surface border border-dash-border hover:border-brand-purple/20 transition-all duration-300 overflow-hidden cursor-pointer ${stat.glowClass}`}
        >
          {/* Decorative corner gradient */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-purple/5 rounded-full blur-2xl group-hover:bg-brand-purple/10 transition-colors duration-500" />
          
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                {stat.label}
              </span>
              <div className="p-1.5 rounded-lg bg-black/20 border border-dash-border">
                {stat.icon}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className={`text-xl font-bold ${stat.valueClass} tracking-tight`}>
                {stat.value}
              </span>
              <span className="text-[10px] text-text-muted">
                {stat.subtext}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
