"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { 
  ChevronLeft, 
  Github, 
  ExternalLink, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Circle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = useSession();
  
  const { data: project, isLoading, refetch } = trpc.project.getById.useQuery({ id });
  const claimMutation = trpc.task.claim.useMutation({
    onSuccess: (data) => {
      toast.success("Task claimed!", {
        description: `You are now assigned to: ${data.title}`,
      });
      refetch();
    },
    onError: (error) => {
      toast.error("Conflict detected!", {
        description: error.message,
      });
    },
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse">Loading project details...</div>;
  if (!project) return <div className="p-20 text-center">Project not found.</div>;

  interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    assignee: { firstName: string } | null;
  }

  const tasks = (project.tasks as Task[]) || [];
  const todoTasks = tasks.filter((t: Task) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t: Task) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t: Task) => t.status === "DONE" || t.status === "IN_REVIEW");


  const userStatus = (session?.user as any)?.status;
  const canClaim = userStatus === "APPROVED";

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Breadcrumbs & Actions */}
      <div className="flex justify-between items-start">
        <span 
          onClick={() => router.push("/dashboard/projects")} 
          className="flex items-center gap-1 text-sm text-text-tertiary hover:text-brand-purple transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-4" /> Back to Projects
        </span>
        {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-dash-border text-xs text-text-secondary hover:text-text-primary transition-colors">
                <Github className="size-4" /> View Repo
            </a>
        )}
      </div>

      {/* Hero Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-text-primary tracking-tight">{project.name}</h1>
            <span className="px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-wider border border-brand-purple/20">
                {project.status}
            </span>
        </div>
        <p className="text-text-secondary max-w-2xl">{project.description || "Building the future of open source, one task at a time."}</p>
        <div className="flex items-center gap-4 mt-2">
             <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                <span className="w-2 h-2 rounded-full bg-brand-purple"></span>
                Maintainer: {project.owner.firstName}
             </div>
             <div className="text-xs text-text-tertiary tabular-nums">
                Launched: {new Date(project.createdAt).toLocaleDateString()}
             </div>
        </div>
      </div>

      {/* Task Board */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Resource Board</h2>
            {!canClaim && (
                <div className="flex items-center gap-2 text-[10px] font-medium text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                    <AlertCircle className="size-3" /> Approval required to claim tasks
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
          {/* TODO COLUMN */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Circle className="size-3" /> Available
                </span>
                <span className="text-[10px] bg-dash-surface border border-dash-border px-2 py-0.5 rounded-full text-text-tertiary">{todoTasks.length}</span>
            </div>
            <div className="flex flex-col gap-3 p-2 rounded-2xl bg-black/20 border border-dash-border/50 min-h-64 h-full">
                {todoTasks.map(task => (
                    <div key={task.id} className="p-4 rounded-xl bg-dash-surface border border-dash-border shadow-sm hover:border-brand-purple/30 transition-all group">
                         <div className="flex justify-between items-start mb-2">
                            <span className={`text-[9px] font-bold uppercase tracking-tighter ${
                                task.priority === "HIGH" ? "text-red-500" : task.priority === "MEDIUM" ? "text-brand-purple" : "text-text-tertiary"
                            }`}>
                                {task.priority} Priority
                            </span>
                         </div>
                         <h4 className="text-sm font-semibold text-text-primary mb-1">{task.title}</h4>
                         <p className="text-[10px] text-text-secondary line-clamp-2">{task.description}</p>
                         
                         <button 
                            disabled={!canClaim || claimMutation.isPending}
                            onClick={() => claimMutation.mutate({ taskId: task.id })}
                            className="w-full mt-4 py-2 rounded-lg bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-wider hover:bg-brand-purple hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                         >
                            {claimMutation.isPending ? "Claiming..." : "Claim Task"}
                         </button>
                    </div>
                ))}
                {todoTasks.length === 0 && (
                    <div className="flex-grow flex items-center justify-center text-text-muted text-[10px] italic">No tasks available.</div>
                )}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Clock className="size-3 text-brand-purple" /> In Progress
                </span>
                <span className="text-[10px] bg-dash-surface border border-dash-border px-2 py-0.5 rounded-full text-text-tertiary">{inProgressTasks.length}</span>
            </div>
            <div className="flex flex-col gap-3 p-2 rounded-2xl bg-black/20 border border-dash-border/50 min-h-64 h-full">
                {inProgressTasks.map(task => (
                    <div key={task.id} className="p-4 rounded-xl bg-dash-surface border border-brand-purple/30 shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-8 h-8 opacity-10">
                            <Clock className="size-full text-brand-purple" />
                         </div>
                         <h4 className="text-sm font-semibold text-text-primary mb-1">{task.title}</h4>
                         <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dash-border">
                            <div className="size-5 rounded-full bg-brand-purple/20 flex items-center justify-center text-[10px] font-bold text-brand-purple">
                                {task.assignee?.firstName[0]}
                            </div>
                            <span className="text-[10px] text-text-secondary">Assigned to <span className="text-text-primary font-medium">{task.assignee?.firstName}</span></span>
                         </div>
                    </div>
                ))}
            </div>
          </div>

          {/* DONE COLUMN */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="size-3 text-green-500" /> Finished
                </span>
                <span className="text-[10px] bg-dash-surface border border-dash-border px-2 py-0.5 rounded-full text-text-tertiary">{doneTasks.length}</span>
            </div>
            <div className="flex flex-col gap-3 p-2 rounded-2xl bg-black/20 border border-dash-border/50 min-h-64 h-full">
                {doneTasks.map(task => (
                    <div key={task.id} className="p-4 rounded-xl bg-dash-surface border border-green-500/20 shadow-sm opacity-80">
                         <h4 className="text-sm font-semibold text-text-tertiary mb-1 line-through">{task.title}</h4>
                         <span className="text-[8px] font-bold text-green-500 uppercase">Completed</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
