"use client";

import React, { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  CheckCircle2,
  Ban,
  UserCog,
  History,
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  MoreVertical,
  Mail,
  MoreHorizontal,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─── Stats Card Component ──────────────────────────────────────────
const StatCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="flex flex-col p-5 rounded-2xl bg-dash-surface border border-dash-border group hover:border-text-muted/20 transition-all duration-300">
    <div className="flex justify-between items-center mb-2">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
        {label}
      </span>
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon as React.ReactElement, { className: `size-4 ${color.replace('bg-', 'text-')}` })}
      </div>
    </div>
    <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
  </div>
);

// ─── Role Badge Component ──────────────────────────────────────────
const RoleBadge = ({ role }: { role: string }) => {
  const styles = {
    OWNER: "bg-red-500/10 text-red-500 border-red-500/20",
    MAINTAINER: "bg-brand-purple/10 text-brand-purple border-brand-purple/20",
    CONTRIBUTOR: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    GUEST: "bg-text-muted/10 text-text-muted border-text-muted/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${styles[role as keyof typeof styles] || styles.GUEST}`}>
      {role}
    </span>
  );
};

// ─── Main Members Page ─────────────────────────────────────────────
const MembersPage = () => {
  const { data: session } = useSession();
  const currentUser = session?.user as any;
  const isAdmin = currentUser?.role === "OWNER" || currentUser?.role === "MAINTAINER";

  if (session && !isAdmin) {
    redirect("/dashboard/home");
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const { data: members, refetch: refetchMembers, isLoading } = trpc.member.list.useQuery();
  const { data: stats, refetch: refetchStats } = trpc.member.getStats.useQuery();
  const { data: logs, refetch: refetchLogs } = trpc.member.getAuditLogs.useQuery();

  const refreshAll = () => {
    refetchMembers();
    refetchStats();
    refetchLogs();
  };

  const approveMutation = trpc.member.approve.useMutation({
    onSuccess: () => {
      toast.success("Member approved!");
      refreshAll();
    },
  });

  const banMutation = trpc.member.ban.useMutation({
    onSuccess: () => {
      toast.error("Member banned");
      refreshAll();
    },
  });

  const updateRoleMutation = trpc.member.updateRole.useMutation({
    onSuccess: (data) => {
      toast.success(`Role updated to ${data.role}`);
      setUpdatingUserId(null);
      refreshAll();
    },
    onError: (err) => {
      toast.error(err.message);
      setUpdatingUserId(null);
    }
  });

  // Client-side filtering
  const filteredMembers = useMemo(() => {
    if (!members) return [];
    return members.filter((member) => {
      const matchesSearch =
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.firstName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === "ALL" || member.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [members, searchQuery, activeFilter]);

  const formatLogAction = (action: string, log: any) => {
    const details = log.details as any;
    switch (action) {
      case "MEMBER_APPROVED":
        return `approved membership for ${details?.memberEmail || "a member"}`;
      case "MEMBER_BANNED":
        return `banned ${details?.memberEmail || "a member"}`;
      case "ROLE_UPDATED":
        return `updated role for ${details?.memberEmail || details?.memberId} to ${details?.role}`;
      default:
        return action.replace(/_/g, " ").toLowerCase();
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot change your own role.");
      return;
    }
    setUpdatingUserId(userId);
    updateRoleMutation.mutate({ userId, role: newRole as any });
  };

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Community & Roles
          </h1>
          <p className="text-text-secondary mt-1">
            Manage permissions, assign roles, and audit administrative actions.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Members"
          value={stats?.total || 0}
          icon={<Users />}
          color="bg-brand-purple"
        />
        <StatCard
          label="Approved"
          value={stats?.approved || 0}
          icon={<ShieldCheck />}
          color="bg-green-500"
        />
        <StatCard
          label="Pending Applications"
          value={stats?.pending || 0}
          icon={<UserPlus />}
          color="bg-yellow-500"
        />
        <StatCard
          label="Banned"
          value={stats?.banned || 0}
          icon={<ShieldAlert />}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content: Members List */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-dash-surface border border-dash-border">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-dash-border rounded-lg text-sm text-text-primary focus:border-brand-purple outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 p-1 rounded-lg bg-black/20 border border-dash-border w-full md:w-auto overflow-x-auto">
              {["ALL", "APPROVED", "PENDING", "BANNED"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    activeFilter === filter
                      ? "bg-brand-purple text-text-primary"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table */}
          <div className="rounded-2xl bg-dash-surface border border-dash-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-dash-border text-[10px] font-bold text-text-muted uppercase tracking-wider bg-black/10">
                    <th className="px-6 py-4">Contributor</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Tasks</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dash-border">
                  {isLoading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="inline-block"
                        >
                          <History className="size-6 text-brand-purple opacity-50" />
                        </motion.div>
                        <p className="mt-2 text-sm text-text-muted italic">Fetching community data...</p>
                      </td>
                    </tr>
                  )}
                  {filteredMembers.map((member, i) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-dash-hover transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center font-bold text-brand-purple shadow-sm">
                            {member.firstName[0]}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-text-primary truncate">{member.firstName}</span>
                            <span className="text-xs text-text-muted flex items-center gap-1">
                              {member.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block group/role">
                          <select
                            value={member.role}
                            disabled={updatingUserId === member.id || (member.role === "OWNER" && currentUser?.role !== "OWNER")}
                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                            className="appearance-none bg-black/20 border border-dash-border rounded-lg px-3 py-1.5 text-xs text-text-secondary focus:border-brand-purple outline-none cursor-pointer pr-8 hover:bg-black/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="OWNER">Owner</option>
                            <option value="MAINTAINER">Maintainer</option>
                            <option value="CONTRIBUTOR">Contributor</option>
                            <option value="GUEST">Guest</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-text-muted pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tight border ${
                          member.status === "APPROVED" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                          member.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                          "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-mono text-text-secondary bg-black/20 px-2.5 py-1 rounded-md border border-dash-border">
                          {(member as any)._count?.assignedTasks || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          {member.status === "PENDING" && (
                            <button
                              onClick={() => approveMutation.mutate({ userId: member.id })}
                              className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors cursor-pointer border border-green-500/20"
                              title="Approve Member"
                            >
                              <CheckCircle2 className="size-4" />
                            </button>
                          )}
                          {member.status !== "BANNED" && member.role !== "OWNER" && (
                            <button
                              onClick={() => banMutation.mutate({ userId: member.id })}
                              className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer border border-red-500/20"
                              title="Ban Member"
                            >
                              <ShieldAlert className="size-4" />
                            </button>
                          )}
                          <button className="p-2 rounded-lg bg-dash-surface border border-dash-border text-text-muted hover:text-text-primary transition-colors cursor-help">
                            <MoreHorizontal className="size-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {(!isLoading && filteredMembers.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-12 py-20 text-center text-text-muted italic">
                        No members found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit Log Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl bg-dash-surface border border-dash-border flex flex-col h-fit sticky top-6">
            <div className="p-4 border-b border-dash-border bg-black/10 font-bold text-xs text-text-muted uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-2">
                <History className="size-4 text-brand-purple" /> Audit Trail
              </span>
            </div>
            <div className="p-2 flex flex-col gap-1 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
              {logs?.map((log: any, i: number) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-xl hover:bg-black/20 border border-transparent hover:border-dash-border transition-all flex flex-col gap-1"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold text-brand-purple uppercase tracking-tight">
                      {log.action.split("_")[1]}
                    </span>
                    <span className="text-[9px] text-text-muted flex items-center gap-1">
                      <Clock className="size-3" /> {getTimeAgo(log.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-snug">
                    <span className="font-semibold text-text-primary">{log.user?.firstName || "System"}</span> {formatLogAction(log.action, log)}
                  </p>
                </motion.div>
              ))}
              {(!logs || logs.length === 0) && (
                <div className="py-12 text-center text-text-muted text-xs italic opacity-50">
                  No activities logged.
                </div>
              )}
            </div>
            <div className="p-4 border-t border-dash-border text-center">
              <button className="text-[10px] font-bold text-brand-purple uppercase tracking-widest hover:underline cursor-pointer">
                View All Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
