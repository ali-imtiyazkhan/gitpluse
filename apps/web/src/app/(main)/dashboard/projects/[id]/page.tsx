"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { 
  ChevronLeft, 
  Github, 
  ExternalLink, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  X,
  Target,
  ListTodo
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "@/components/ui/custom-button";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee: { firstName: string } | null;
  createdAt: string;
}

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = useSession();
  const [showCreateTask, setShowCreateTask] = useState(false);
  
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

  if (isLoading) return (
    <div className="flex flex-col gap-8 p-10">
      <div className="h-8 w-48 bg-dash-surface animate-pulse rounded" />
      <div className="h-20 w-full bg-dash-surface animate-pulse rounded" />
      <div className="grid grid-cols-3 gap-6 h-64">
        {[1, 2, 3].map(i => <div key={i} className="bg-dash-surface animate-pulse rounded-2xl" />)}
      </div>
    </div>
  );
  
  if (!project) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <AlertCircle className="size-12 text-text-muted" />
      <h2 className="text-xl font-bold text-text-primary">Project Not Found</h2>
      <PrimaryButton onClick={() => router.push("/dashboard/projects")}>Back to Projects</PrimaryButton>
    </div>
  );

  const tasks = (project.tasks as any[]) || [];
  const todoTasks = tasks.filter((t: any) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t: any) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t: any) => t.status === "DONE" || t.status === "IN_REVIEW");

  const userStatus = (session?.user as any)?.status;
  const userRole = (session?.user as any)?.role;
  const currentUser = session?.user as any;
  const canClaim = userStatus === "APPROVED";
  const isMaintainer = userRole === "OWNER" || userRole === "MAINTAINER" || project.ownerId === currentUser?.id;

  return (
    <div className="flex flex-col gap-8 pb-20 px-6 xl:px-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Breadcrumbs & Actions */}
      <div className="flex justify-between items-start">
        <span 
          onClick={() => router.push("/dashboard/projects")} 
          className="flex items-center gap-1 text-sm text-text-tertiary hover:text-brand-purple transition-colors cursor-pointer group"
        >
          <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </span>
        <div className="flex items-center gap-3">
          {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-dash-border text-xs text-text-secondary hover:text-text-primary transition-colors">
                  <Github className="size-4" /> View Repo
              </a>
          )}
          {isMaintainer && (
            <PrimaryButton 
              onClick={() => setShowCreateTask(true)}
              classname="flex items-center gap-2 py-1.5 px-4 h-auto text-xs"
            >
              <Plus className="size-4" /> Add Task
            </PrimaryButton>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col gap-2 relative">
         {/* Background ambient glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-purple/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
            <h1 className="text-4xl font-bold text-text-primary tracking-tight">{project.name}</h1>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
              project.status === "ACTIVE" 
                ? "bg-green-500/10 text-green-500 border-green-500/20" 
                : "bg-dash-surface text-text-muted border-dash-border"
            }`}>
                {project.status}
            </span>
        </div>
        <p className="relative z-10 text-text-secondary max-w-3xl text-lg leading-relaxed">{project.description || "Building the future of open source, one task at a time."}</p>
        
        <div className="relative z-10 flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-dash-border/30">
             <div className="flex items-center gap-2 py-1 px-3 rounded-full bg-brand-purple/5 border border-brand-purple/10">
                <div className="size-5 rounded-full bg-brand-purple/20 flex items-center justify-center text-[10px] font-bold text-brand-purple">{project.owner.firstName[0]}</div>
                <span className="text-xs text-text-secondary">Lead: <span className="text-text-primary font-medium">{project.owner.firstName}</span></span>
             </div>
             <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <Clock className="size-4" />
                <span>Launched {new Date(project.createdAt).toLocaleDateString()}</span>
             </div>
             {project.repoUrl && (
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                   <Target className="size-4" />
                   <span>Open Collaboration</span>
                </div>
             )}
        </div>
      </div>

      {/* Task Board */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20">
                <ListTodo className="size-5 text-brand-purple" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary italic">Resource Kanban</h2>
            </div>
            {!canClaim && (
                <div className="flex items-center gap-2 text-[10px] font-medium text-yellow-500 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20 animate-pulse">
                    <AlertCircle className="size-3" /> Approval required to claim tasks
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
          {/* TODO COLUMN */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <div className="size-2 rounded-full bg-text-muted" /> Available
                </span>
                <span className="text-[10px] bg-dash-surface border border-dash-border px-2 py-0.5 rounded-full text-text-tertiary font-bold">{todoTasks.length}</span>
            </div>
            <div className="flex flex-col gap-4 p-3 rounded-2xl bg-black/20 border border-dash-border/50 flex-grow h-fit">
                {todoTasks.map((task: any) => (
                    <motion.div 
                      layoutId={task.id}
                      key={task.id} 
                      className="p-5 rounded-xl bg-dash-surface border border-dash-border shadow-sm hover:border-brand-purple/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all group relative overflow-hidden"
                    >
                         <div className="flex justify-between items-start mb-3">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                                task.priority === "HIGH" 
                                  ? "text-rose-400 bg-rose-400/10 border-rose-400/20" 
                                  : task.priority === "MEDIUM" 
                                    ? "text-brand-purple bg-brand-purple/10 border-brand-purple/20" 
                                    : "text-text-muted bg-dash-base border-dash-border"
                            }`}>
                                {task.priority} Priority
                            </span>
                         </div>
                         <h4 className="text-[15px] font-bold text-text-primary mb-2 group-hover:text-brand-purple transition-colors">{task.title}</h4>
                         <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{task.description}</p>
                         
                         <button 
                            disabled={!canClaim || claimMutation.isPending}
                            onClick={() => claimMutation.mutate({ taskId: task.id })}
                            className="w-full mt-5 py-2.5 rounded-lg bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-widest hover:bg-brand-purple hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-brand-purple/20"
                         >
                            {claimMutation.isPending ? "Syncing..." : "Claim Task"}
                         </button>
                    </motion.div>
                ))}
                {todoTasks.length === 0 && (
                    <div className="py-10 text-center flex flex-col items-center gap-2 opacity-50">
                        <CheckCircle2 className="size-8 text-text-muted" />
                        <p className="text-xs text-text-muted font-medium italic">No open resources</p>
                    </div>
                )}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-brand-purple uppercase tracking-widest flex items-center gap-2">
                    <div className="size-2 rounded-full bg-brand-purple" /> In Progress
                </span>
                <span className="text-[10px] bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-full text-brand-purple font-bold">{inProgressTasks.length}</span>
            </div>
            <div className="flex flex-col gap-4 p-3 rounded-2xl bg-brand-purple/5 border border-brand-purple/10 flex-grow h-fit">
                {inProgressTasks.map((task: any) => (
                    <motion.div 
                      layoutId={task.id}
                      key={task.id} 
                      className="p-5 rounded-xl bg-dash-surface border border-brand-purple/30 shadow-md relative overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-brand-purple/20 to-transparent opacity-50" />
                         <span className="text-[9px] font-bold uppercase tracking-widest text-brand-purple mb-3 block">Development</span>
                         <h4 className="text-[15px] font-bold text-text-primary mb-3">{task.title}</h4>
                         
                         <div className="flex items-center gap-3 mt-4 pt-4 border-t border-dash-border/50">
                            <div className="size-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-[10px] font-bold text-brand-purple border border-brand-purple/20">
                                {task.assignee?.firstName[0]}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-text-tertiary">Contributor</span>
                              <span className="text-[11px] text-text-primary font-bold">{task.assignee?.firstName}</span>
                            </div>
                         </div>
                    </motion.div>
                ))}
                {inProgressTasks.length === 0 && (
                   <div className="py-10 text-center text-[10px] text-text-tertiary italic">Nothing actively being built</div>
                )}
            </div>
          </div>

          {/* DONE COLUMN */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" /> Finished
                </span>
                <span className="text-[10px] bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full text-emerald-400 font-bold">{doneTasks.length}</span>
            </div>
            <div className="flex flex-col gap-4 p-3 rounded-2xl bg-emerald-400/5 border border-emerald-400/10 flex-grow h-fit">
                {doneTasks.map((task: any) => (
                    <motion.div 
                      layoutId={task.id}
                      key={task.id} 
                      className="p-4 rounded-xl bg-dash-surface border border-emerald-500/10 opacity-70 border-dashed"
                    >
                         <h4 className="text-sm font-semibold text-text-tertiary mb-1 line-through">{task.title}</h4>
                         <div className="flex items-center gap-2 mt-2">
                            <CheckCircle2 className="size-3 text-emerald-400" />
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tight">Verified & Merged</span>
                         </div>
                    </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal 
        isOpen={showCreateTask} 
        projectId={id}
        onClose={() => setShowCreateTask(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

/* --- Create Task Modal --- */
const CreateTaskModal = ({ isOpen, projectId, onClose, onSuccess }: { isOpen: boolean, projectId: string, onClose: () => void, onSuccess: () => void }) => {
  const [formData, setFormData] = useState({ title: "", description: "", priority: "MEDIUM" });
  
  const createMutation = trpc.task.create.useMutation({
    onSuccess: () => {
      toast.success("Task created!", {
        description: "Your team can now claim this resource.",
      });
      onSuccess();
      onClose();
      setFormData({ title: "", description: "", priority: "MEDIUM" });
    },
    onError: (err) => {
      toast.error("Error creating task", { description: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Title is required");
    createMutation.mutate({ ...formData, projectId });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-dash-surface border border-dash-border rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-7 border-b border-dash-border/50">
          <div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Initialize Task</h2>
            <p className="text-xs text-text-muted mt-0.5">Define a new contribution resource.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dash-hover text-text-muted hover:text-text-primary transition-colors">
            <X className="size-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Task Title</label>
            <input 
              required
              autoFocus
              className="w-full px-5 py-3 bg-dash-base border border-dash-border rounded-2xl text-text-primary text-sm focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple outline-none transition-all"
              placeholder="e.g. Implement Socket.io Activity Feed"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Contribution Details</label>
            <textarea 
              className="w-full px-5 py-3 bg-dash-base border border-dash-border rounded-2xl text-text-primary text-sm focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple outline-none resize-none h-32 transition-all"
              placeholder="Describe what needs to be built..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Priority Matrix</label>
            <div className="grid grid-cols-3 gap-3">
              {["LOW", "MEDIUM", "HIGH"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`py-2 text-[10px] font-bold rounded-xl border transition-all ${
                    formData.priority === p 
                      ? "bg-brand-purple border-brand-purple text-white shadow-lg shadow-brand-purple/25" 
                      : "bg-dash-base border-dash-border text-text-muted hover:border-text-tertiary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <PrimaryButton 
              type="submit"
              loading={createMutation.isPending}
              classname="w-full h-14 text-base font-bold tracking-tight rounded-2xl shadow-xl shadow-brand-purple/20"
            >
              🚀 {createMutation.isPending ? "Syncing..." : "Launch Task"}
            </PrimaryButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectDetailPage;
