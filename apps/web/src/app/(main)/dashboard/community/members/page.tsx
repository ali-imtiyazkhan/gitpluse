"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useSession } from "next-auth/react";
import { 
  UserGroupIcon, 
  CheckBadgeIcon, 
  NoSymbolIcon, 
  ShieldCheckIcon,
  FingerPrintIcon,
  EllipsisHorizontalIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Role, MemberStatus } from "@prisma/client";

export default function MembersManagementPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"members" | "audit">("members");
  
  const { data: members, isLoading: loadingMembers, refetch: refetchMembers } = trpc.member.list.useQuery();
  const { data: auditLogs, isLoading: loadingAudit } = trpc.member.getAuditLogs.useQuery();

  const approveMutation = trpc.member.approve.useMutation({
    onSuccess: () => {
      toast.success("Member approved!");
      refetchMembers();
    },
    onError: (err) => toast.error(err.message)
  });

  const banMutation = trpc.member.ban.useMutation({
    onSuccess: () => {
      toast.success("Member banned.");
      refetchMembers();
    },
    onError: (err) => toast.error(err.message)
  });

  const updateRoleMutation = trpc.member.updateRole.useMutation({
    onSuccess: () => {
      toast.success("Role updated!");
      refetchMembers();
    },
    onError: (err) => toast.error(err.message)
  });

  const isAdmin = (session?.user as any)?.role === "OWNER" || (session?.user as any)?.role === "MAINTAINER";

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <ShieldCheckIcon className="size-16 text-red-500/20 mb-4" />
        <h2 className="text-2xl font-bold text-text-primary">Admin Access Only</h2>
        <p className="text-text-secondary mt-2">You don't have permission to manage community members.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-dash-base">
      <header className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              <UserGroupIcon className="size-8 text-brand-purple" />
              Community Control
            </h1>
            <p className="text-text-secondary mt-2">
              Manage permissions, approve applications, and audit activities.
            </p>
          </div>
          
          <div className="flex bg-dash-surface border border-dash-border p-1 rounded-xl">
             <button 
                onClick={() => setActiveTab("members")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "members" ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" : "text-text-muted hover:text-text-primary"}`}
             >
                Members
             </button>
             <button 
                onClick={() => setActiveTab("audit")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "audit" ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" : "text-text-muted hover:text-text-primary"}`}
             >
                Audit Trail
             </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === "members" ? (
          <motion.div 
            key="members-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-dash-surface border border-dash-border rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dash-base/50 text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-dash-border">
                    <th className="px-6 py-4">Contributor</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dash-border/50">
                  {loadingMembers ? (
                    [1,2,3].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-dash-hover rounded w-1/3" /></td>
                      </tr>
                    ))
                  ) : members?.map((member) => (
                    <tr key={member.id} className="hover:bg-dash-hover/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-brand-purple/10 flex items-center justify-center font-bold text-brand-purple">
                            {member.firstName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-primary">{member.firstName}</p>
                            <p className="text-[10px] text-text-muted">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          member.status === "APPROVED" ? "bg-green-500/10 border-green-500/20 text-green-500" :
                          member.status === "PENDING" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                          "bg-red-500/10 border-red-500/20 text-red-500"
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-text-secondary">
                        {member.role}
                      </td>
                      <td className="px-6 py-4 text-xs text-text-muted">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {member.status === "PENDING" && (
                            <button 
                              onClick={() => approveMutation.mutate({ userId: member.id })}
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                              title="Approve Member"
                            >
                              <CheckBadgeIcon className="size-5" />
                            </button>
                          )}
                          
                          {member.status !== "BANNED" && member.role !== "OWNER" && (
                            <button 
                              onClick={() => banMutation.mutate({ userId: member.id })}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                              title="Ban Member"
                            >
                              <NoSymbolIcon className="size-5" />
                            </button>
                          )}

                          <div className="relative group/menu">
                             <button className="p-1.5 rounded-lg bg-dash-hover text-text-muted hover:text-text-primary transition-all">
                                <EllipsisHorizontalIcon className="size-5" />
                             </button>
                             {/* Mini Role Menu */}
                             <div className="hidden group-hover/menu:block absolute right-0 top-full mt-1 w-32 bg-dash-surface border border-dash-border rounded-xl shadow-2xl z-20 py-2">
                               {([Role.MAINTAINER, Role.CONTRIBUTOR, Role.GUEST] as Role[]).map(r => (
                                 <button 
                                   key={r}
                                   onClick={() => updateRoleMutation.mutate({ userId: member.id, role: r })}
                                   className="w-full text-left px-4 py-1.5 text-[10px] font-bold uppercase hover:bg-brand-purple hover:text-white transition-colors"
                                 >
                                   Set {r}
                                 </button>
                               ))}
                             </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="audit-trail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {loadingAudit ? (
              <div className="py-20 text-center text-text-muted">Analyzing records...</div>
            ) : auditLogs?.map((log) => (
              <div key={log.id} className="bg-dash-surface border border-dash-border p-4 rounded-xl flex items-center gap-4 group">
                <div className="size-10 rounded-full bg-dash-base border border-dash-border flex items-center justify-center text-brand-purple">
                  <FingerPrintIcon className="size-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-text-primary">{log.user.firstName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple font-mono uppercase">
                      {log.action.replace("_", " ")}
                    </span>
                  </div>
                  <pre className="text-[10px] text-text-muted overflow-hidden text-ellipsis italic">
                    {JSON.stringify(log.details)}
                  </pre>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-text-muted">{new Date(log.createdAt).toLocaleDateString()}</p>
                   <p className="text-[9px] text-text-muted/50">{new Date(log.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
