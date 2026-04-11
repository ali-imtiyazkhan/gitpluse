"use client";

import React, { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Search,
  Filter,
  UserCog,
  Trash2,
  ChevronDown,
  RefreshCcw,
  Mail,
  Calendar,
  Shield,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Role } from "@prisma/client";

// ─── Stat Card Component ──────────────────────────────────────────
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
  <div className="flex flex-col p-6 rounded-2xl bg-dash-surface border border-dash-border group hover:border-brand-purple/20 transition-all duration-300">
    <div className="flex justify-between items-center mb-3">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
        {label}
      </span>
      <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon as React.ReactElement, { className: `size-5 ${color.replace('bg-', 'text-')}` })}
      </div>
    </div>
    <p className="text-3xl font-bold text-text-primary tracking-tight">{value}</p>
  </div>
);

// ─── Main Admin Page ───────────────────────────────────────────────
export default function AdminPage() {
  const { data: session } = useSession();
  const currentUser = session?.user as any;
  const isAuthorized = currentUser?.role === "OWNER" || currentUser?.role === "MAINTAINER";

  // Security redirect
  if (session && !isAuthorized) {
    redirect("/dashboard/home");
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries
  const { data, isLoading, refetch } = trpc.admin.listUsers.useQuery({
    search: searchQuery || undefined,
  });

  // Mutations
  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: (updated) => {
      toast.success(`Role updated successfully`);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("User deleted permanently");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const users = data?.users || [];
  const totalUsers = data?.total || 0;

  const filteredUsers = useMemo(() => {
    return users.filter(u => activeRoleFilter === "ALL" || u.role === activeRoleFilter);
  }, [users, activeRoleFilter]);

  if (isLoading && !users.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <RefreshCcw className="size-8 text-brand-purple opacity-50" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 xl:p-10 max-w-[1600px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight flex items-center gap-3">
            <Shield className="size-10 text-brand-purple" />
            System Control
          </h1>
          <p className="text-text-secondary mt-2 text-lg">
            Global member management and platform permissions.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dash-surface border border-dash-border text-sm font-semibold text-text-primary hover:bg-dash-hover transition-all group"
        >
          <RefreshCcw className={`size-4 group-hover:rotate-180 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Registry
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Users"
          value={totalUsers}
          icon={<Users />}
          color="bg-brand-purple"
        />
        <StatCard
          label="Administrators"
          value={users.filter(u => u.role === "OWNER" || u.role === "MAINTAINER").length}
          icon={<ShieldCheck />}
          color="bg-green-500"
        />
        <StatCard
          label="Contributors"
          value={users.filter(u => u.role === "CONTRIBUTOR").length}
          icon={<UserCog />}
          color="bg-blue-500"
        />
      </div>

      {/* Controls & Table */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-dash-surface border border-dash-border shadow-xl shadow-black/20">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/40 border border-dash-border rounded-xl text-sm text-text-primary focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 border border-dash-border">
            {["ALL", "OWNER", "MAINTAINER", "CONTRIBUTOR"].map((role) => (
              <button
                key={role}
                onClick={() => setActiveRoleFilter(role)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
                  activeRoleFilter === role
                    ? "bg-brand-purple text-text-primary shadow-lg shadow-brand-purple/20"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-dash-surface border border-dash-border overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dash-border text-[11px] font-black text-text-muted uppercase tracking-[0.2em] bg-white/[0.02]">
                  <th className="px-8 py-5">User Identity</th>
                  <th className="px-8 py-5">Access Level</th>
                  <th className="px-8 py-5">Membership Date</th>
                  <th className="px-8 py-5 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dash-border">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-white/[0.03] transition-colors group/row"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-2xl bg-gradient-to-br from-brand-purple/20 to-brand-purple/5 border border-brand-purple/20 flex items-center justify-center font-black text-brand-purple text-lg shadow-inner">
                            {user.firstName[0]}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-base font-bold text-text-primary truncate tracking-tight">{user.firstName}</span>
                            <span className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                              <Mail className="size-3 opacity-50" /> {user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="relative inline-block w-44">
                          <select
                            value={user.role}
                            disabled={user.id === currentUser.id || (user.role === "OWNER" && currentUser.role !== "OWNER")}
                            onChange={(e) => updateRoleMutation.mutate({ userId: user.id, role: e.target.value as Role })}
                            className="w-full appearance-none bg-black/40 border border-dash-border rounded-xl px-4 py-2.5 text-xs font-bold text-text-secondary focus:border-brand-purple outline-none cursor-pointer pr-10 hover:bg-black/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {Object.values(Role).map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-text-secondary flex items-center gap-2">
                            <Calendar className="size-3.5 opacity-50" />
                            {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono uppercase">
                            Last active: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all duration-300">
                          {currentUser.role === "OWNER" && user.id !== currentUser.id && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to delete ${user.firstName}? This cannot be undone.`)) {
                                  deleteUserMutation.mutate({ userId: user.id });
                                }
                              }}
                              className="p-3 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500/20 hover:scale-105 transition-all cursor-pointer border border-red-500/10 active:scale-95"
                              title="Terminate Account"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          )}
                          <button className="p-3 rounded-xl bg-dash-surface border border-dash-border text-text-muted hover:text-text-primary hover:border-text-muted/50 transition-all cursor-help">
                            <RefreshCcw className="size-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {(!isLoading && filteredUsers.length === 0) && (
            <div className="py-32 text-center">
              <div className="inline-flex p-6 rounded-full bg-black/20 mb-4">
                <Users className="size-12 text-text-muted opacity-20" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Ghost Registry</h3>
              <p className="text-text-muted mt-2">No members match your current filter parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
