"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useSession } from "next-auth/react";
import { 
  CommandLineIcon, 
  CpuChipIcon, 
  FireIcon, 
  BoltIcon,
  CheckCircleIcon,
  LockClosedIcon,
  UserCircleIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "@/components/ui/custom-button";
import { toast } from "sonner";

export default function TasksDiscoveryPage() {
  const { data: session } = useSession();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  
  // Form States
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const { data: tasks, isLoading, refetch } = trpc.task.getAll.useQuery();
  const { data: projects } = trpc.project.list.useQuery();

  const createProjectMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      toast.success("Project created!");
      setIsCreatingProject(false);
      setProjectName("");
      setProjectDesc("");
    }
  });

  const createTaskMutation = trpc.task.create.useMutation({
    onSuccess: () => {
      toast.success("Task added to grid!");
      setIsCreatingTask(false);
      setTaskTitle("");
      setTaskDesc("");
      refetch();
    }
  });

  const claimMutation = trpc.task.claim.useMutation({
    onSuccess: () => {
      toast.success("Task claimed successfully!");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const isAdmin = (session?.user as any)?.role === "OWNER" || (session?.user as any)?.role === "MAINTAINER";
  const userSkills = (session?.user as any)?.skills || { languages: [], frameworks: [], tools: [] };

  // Calculate "Pulse Match" score
  const calculatePulseMatch = (taskDescription: string) => {
    if (!taskDescription) return 0;
    
    const allUserSkills = [
      ...(userSkills.languages || []),
      ...(userSkills.frameworks || []),
      ...(userSkills.tools || [])
    ].map(s => s.toLowerCase());

    if (allUserSkills.length === 0) return 45; // Baseline for new users

    let matches = 0;
    allUserSkills.forEach(skill => {
      if (taskDescription.toLowerCase().includes(skill)) {
        matches++;
      }
    });

    const score = 50 + (matches * 15);
    return Math.min(score, 99);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-dash-base">
      <header className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              <CommandLineIcon className="size-8 text-brand-purple" />
              Task Discovery
            </h1>
            <p className="text-text-secondary mt-2">
              Browse available tasks and find your perfect "Pulse Match".
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin && (
              <div className="flex bg-dash-surface border border-dash-border p-1 rounded-xl gap-1">
                <button 
                  onClick={() => setIsCreatingProject(true)}
                  className="px-4 py-2 rounded-lg bg-dash-hover text-xs font-bold text-text-primary hover:bg-brand-purple hover:text-white transition-all"
                >
                  + Project
                </button>
                <button 
                  onClick={() => setIsCreatingTask(true)}
                  className="px-4 py-2 rounded-lg bg-dash-hover text-xs font-bold text-text-primary hover:bg-brand-purple hover:text-white transition-all"
                >
                  + Task
                </button>
              </div>
            )}
            
            <div className="bg-brand-purple/5 border border-brand-purple/20 p-4 rounded-2xl hidden lg:flex items-center gap-4">
              <div className="size-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
                <BoltIcon className="size-6 text-brand-purple" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">AI Engine Active</p>
                <p className="text-xs text-text-primary">Calculating personalized matches...</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <AnimatePresence>
        {isCreatingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreatingProject(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-lg bg-dash-surface border border-dash-border rounded-3xl p-8 z-10">
              <h2 className="text-2xl font-bold mb-6 text-text-primary">Create New Project</h2>
              <div className="space-y-4">
                <input 
                  type="text" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project Name" 
                  className="w-full bg-dash-base border border-dash-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-purple/50 outline-none" 
                />
                <textarea 
                  rows={4} value={projectDesc} onChange={e => setProjectDesc(e.target.value)} placeholder="Description..." 
                  className="w-full bg-dash-base border border-dash-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-purple/50 outline-none resize-none" 
                />
                <div className="flex gap-3">
                  <button onClick={() => setIsCreatingProject(false)} className="flex-1 px-4 py-3 rounded-xl border border-dash-border text-sm font-semibold">Cancel</button>
                  <PrimaryButton onClick={() => createProjectMutation.mutate({ name: projectName, description: projectDesc })} loading={createProjectMutation.isPending} classname="flex-[2]">Create Project</PrimaryButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isCreatingTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreatingTask(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-lg bg-dash-surface border border-dash-border rounded-3xl p-8 z-10">
              <h2 className="text-2xl font-bold mb-6 text-text-primary">Add New Task</h2>
              <div className="space-y-4">
                <select 
                  value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)}
                  className="w-full bg-dash-base border border-dash-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-purple/50 outline-none"
                >
                  <option value="">Select Project</option>
                  {projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input 
                  type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Task Title" 
                  className="w-full bg-dash-base border border-dash-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-purple/50 outline-none" 
                />
                <textarea 
                  rows={4} value={taskDesc} onChange={e => setTaskDesc(e.target.value)} placeholder="Requirements & details..." 
                  className="w-full bg-dash-base border border-dash-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-purple/50 outline-none resize-none" 
                />
                <div className="flex gap-3">
                  <button onClick={() => setIsCreatingTask(false)} className="flex-1 px-4 py-3 rounded-xl border border-dash-border text-sm font-semibold">Cancel</button>
                  <PrimaryButton onClick={() => createTaskMutation.mutate({ title: taskTitle, description: taskDesc, projectId: selectedProjectId })} loading={createTaskMutation.isPending} classname="flex-[2]">Broadcast Task</PrimaryButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-dash-surface animate-pulse border border-dash-border" />
          ))}
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <div className="text-center py-20 bg-dash-surface border border-dash-border rounded-3xl">
           <CpuChipIcon className="size-16 mx-auto text-text-muted mb-4" />
           <h3 className="text-xl font-bold text-text-primary">No tasks available yet</h3>
           <p className="text-text-secondary mt-2">Check back later or ask an admin to create tasks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const matchScore = calculatePulseMatch(task.description || "");
            const isClaimed = !!task.assigneeId;
            const isMe = task.assigneeId === (session?.user as any)?.id;

            return (
              <motion.div 
                key={task.id}
                layout
                whileHover={{ y: -5 }}
                className={`flex flex-col bg-dash-surface border rounded-2xl overflow-hidden transition-all ${
                  isClaimed ? "border-dash-border opacity-70" : "border-dash-border shadow-sm hover:border-brand-purple/40 shadow-brand-purple/5"
                }`}
              >
                {/* Match Header */}
                {!isClaimed && (
                  <div className="px-4 py-2 bg-gradient-to-r from-brand-purple/20 to-transparent flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FireIcon className={`size-4 ${matchScore > 80 ? "text-orange-500 animate-pulse" : "text-brand-purple"}`} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Pulse Match: {matchScore}%</span>
                    </div>
                    {matchScore > 85 && (
                       <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-500 text-[8px] font-bold uppercase">Perfect Fit</span>
                    )}
                  </div>
                )}

                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      task.priority === "HIGH" ? "bg-red-500/10 text-red-500" : 
                      task.priority === "MEDIUM" ? "bg-yellow-500/10 text-yellow-500" : "bg-blue-500/10 text-blue-500"
                    }`}>
                      {task.priority || "MEDIUM"}
                    </span>
                    <span className="text-[10px] font-medium text-text-muted">{task.project.name}</span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1">{task.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-3 mb-6 leading-relaxed">
                    {task.description || "No description provided."}
                  </p>

                  <div className="mt-auto pt-6 border-t border-dash-border/50 flex items-center justify-between">
                    {isClaimed ? (
                      <div className="flex items-center gap-2">
                        <UserCircleIcon className="size-5 text-text-muted" />
                        <span className="text-xs text-text-muted">
                           {isMe ? "You claimed this" : "Taken by others"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <BoltIcon className="size-4 text-brand-purple" />
                        <span className="text-xs text-brand-purple font-semibold">Open for Pulse</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      {isClaimed ? (
                        <CheckCircleIcon className="size-6 text-green-500" />
                      ) : (
                        <div className="size-2 rounded-full bg-green-500 animate-ping" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4">
                   <PrimaryButton
                    onClick={() => claimMutation.mutate({ taskId: task.id })}
                    loading={claimMutation.isPending}
                    disabled={isClaimed}
                    classname={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${
                      isClaimed ? "bg-dash-hover border-transparent grayscale text-text-muted" : ""
                    }`}
                   >
                     {isClaimed ? (
                        <>
                          <LockClosedIcon className="size-4" />
                          Already Claimed
                        </>
                     ) : (
                        <>
                          Claim Task
                          <ArrowRightIcon className="size-4" />
                        </>
                     )}
                   </PrimaryButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
