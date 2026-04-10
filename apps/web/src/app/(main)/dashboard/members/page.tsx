"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle2, Ban, UserCog, History } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const MembersPage = () => {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "OWNER" || userRole === "MAINTAINER";

  // Redirect if not admin (though middleware/procedure protects it)
  if (session && !isAdmin) {
    redirect("/dashboard/home");
  }

  const { data: members, refetch: refetchMembers, isLoading } = trpc.member.list.useQuery();
  const { data: logs } = trpc.member.getAuditLogs.useQuery();

  interface ActivityLog {
    id: string;
    action: string;
    createdAt: string;
    user: {
      firstName: string;
      email: string;
    };
    details: any;
  }

  const approveMutation = trpc.member.approve.useMutation({

    onSuccess: () => {
      toast.success("Member approved!");
      refetchMembers();
    },
  });

  const banMutation = trpc.member.ban.useMutation({
    onSuccess: () => {
      toast.error("Member banned");
      refetchMembers();
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Community Members</h1>
          <p className="text-text-secondary mt-1">Manage contributors, review applications, and audit activities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Members Table */}
        <div className="xl:col-span-2 rounded-2xl bg-dash-surface border border-dash-border overflow-hidden">
          <div className="p-4 border-b border-dash-border bg-black/20 font-medium text-xs text-text-muted uppercase tracking-wider">
            Active Members & Applicants
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dash-border text-xs text-text-tertiary">
                  <th className="px-6 py-4 font-medium italic">Name / Email</th>
                  <th className="px-6 py-4 font-medium italic">Status</th>
                  <th className="px-6 py-4 font-medium italic">Role</th>
                  <th className="px-6 py-4 font-medium italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dash-border">
                {isLoading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-muted italic">Loading members...</td>
                  </tr>
                )}
                {members?.map((member) => (
                  <tr key={member.id} className="hover:bg-black/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">{member.firstName}</span>
                        <span className="text-xs text-text-muted">{member.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        member.status === "APPROVED" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                        member.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                        "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-brand-purple">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {member.status === "PENDING" && (
                          <button 
                            onClick={() => approveMutation.mutate({ userId: member.id })}
                            className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 className="size-4" />
                          </button>
                        )}
                        {member.status !== "BANNED" && member.role !== "OWNER" && (
                          <button 
                            onClick={() => banMutation.mutate({ userId: member.id })}
                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                            title="Ban"
                          >
                            <Ban className="size-4" />
                          </button>
                        )}
                        <button className="p-2 rounded-lg bg-dash-hover text-text-muted hover:text-text-primary transition-colors">
                          <UserCog className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs Sidebar */}
        <div className="rounded-2xl bg-dash-surface border border-dash-border flex flex-col h-fit">
          <div className="p-4 border-b border-dash-border bg-black/20 font-medium text-xs text-text-muted uppercase tracking-wider flex items-center gap-2">
            <History className="size-4" /> Audit Trail
          </div>
          <div className="p-4 flex flex-col gap-4 max-h-[600px] overflow-y-auto">
             {logs?.map((log: ActivityLog) => (
               <div key={log.id} className="p-3 rounded-xl bg-black/10 border border-dash-border flex flex-col gap-1">


                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-brand-purple uppercase tracking-tight">{log.action}</span>
                    <span className="text-[9px] text-text-tertiary">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {log.user.firstName} performed administrative action.
                  </p>
                  {log.details && (
                    <div className="mt-1 p-2 rounded bg-black/20 text-[10px] font-mono text-text-muted break-all">
                      {JSON.stringify(log.details)}
                    </div>
                  )}
               </div>
             ))}
             {(!logs || logs.length === 0) && (
               <div className="py-12 text-center text-text-muted text-xs italic">No activities logged yet.</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
