"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Plus,
  LayoutGrid,
  ExternalLink,
  ArrowRight,
  Globe,
  FolderOpen,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PrimaryButtom from "@/components/ui/custom-button";
import ExploreRepos from "@/components/dashboard/ExploreRepos";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type TabId = "explore" | "community";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "explore",
    label: "Explore Open Source",
    icon: <Globe className="size-4" />,
  },
  {
    id: "community",
    label: "Community Projects",
    icon: <FolderOpen className="size-4" />,
  },
];

const ProjectsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("explore");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: projects, isLoading, refetch } = trpc.project.getSuggested.useQuery(undefined, {
    enabled: activeTab === "community",
  });
  const { data: stats, refetch: refetchStats } = trpc.project.getStats.useQuery(undefined, {
    enabled: activeTab === "community",
  });

  const userRole = (session?.user as any)?.role;
  const canCreate = userRole === "OWNER" || userRole === "MAINTAINER";

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Projects
          </h1>
          <p className="text-text-secondary mt-1">
            Explore open source or manage community initiatives.
          </p>
        </div>
        {canCreate && activeTab === "community" && (
          <PrimaryButtom 
            onClick={() => setShowCreateModal(true)}
            classname="flex items-center gap-2"
          >
            <Plus className="size-4" />
            New Project
          </PrimaryButtom>
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-dash-surface border border-dash-border w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                activeTab === tab.id
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }
            `}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeProjectTab"
                className="absolute inset-0 bg-brand-purple/15 border border-brand-purple/20 rounded-lg"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "explore" ? (
          <motion.div
            key="explore"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ExploreRepos />
          </motion.div>
        ) : (
          <motion.div
            key="community"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-dash-surface border border-dash-border">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Total Projects
                </span>
                <p className="text-2xl font-semibold text-text-primary mt-1">
                  {stats?.total || 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-dash-surface border border-dash-border">
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
                  Active
                </span>
                <p className="text-2xl font-semibold text-text-primary mt-1">
                  {stats?.active || 0}
                </p>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading &&
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 rounded-2xl bg-dash-surface/50 border border-dash-border animate-pulse"
                  ></div>
                ))}

              {projects?.map((project) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                  className="group relative flex flex-col p-6 rounded-2xl bg-dash-surface border border-dash-border hover:border-brand-purple/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20">
                      <LayoutGrid className="size-5 text-brand-purple" />
                    </div>
                    <div className="flex items-center gap-2">
                      {(project as any).matchScore > 0 && (
                        <span className="px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase border border-brand-purple/20">
                          {Math.floor((project as any).matchScore)}% Match
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          project.status === "ACTIVE"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-text-tertiary/10 text-text-tertiary"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-purple transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2 mt-2 flex-grow min-h-[40px]">
                    {project.description || "No description provided."}
                  </p>

                  <div className="mt-6 pt-6 border-t border-dash-border flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-tertiary uppercase font-medium">
                        Tasks
                      </span>
                      <span className="text-sm font-semibold text-text-secondary">
                        {(project as any)._count?.tasks || 0} Open
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-brand-purple group-hover:gap-2 transition-all">
                      View Project <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              ))}

              {projects?.length === 0 && !isLoading && (
                <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-dash-border bg-dash-surface/30">
                  <div className="size-16 rounded-full bg-dash-surface border border-dash-border flex items-center justify-center mx-auto mb-4">
                     <FolderOpen className="size-8 text-text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">No community projects</h3>
                  <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto">
                    Be the first to create a community initiative to help others contribute.
                  </p>
                  {canCreate && (
                     <PrimaryButtom 
                        onClick={() => setShowCreateModal(true)}
                        classname="mt-6 mx-auto"
                     >
                        Initialize First Project
                     </PrimaryButtom>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onSuccess={() => {
          refetch();
          refetchStats();
        }}
      />
    </div>
  );
};

const CreateProjectModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) => {
  const [formData, setFormData] = useState({ name: "", description: "", repoUrl: "" });
  
  const createMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      toast.success("Project created successfully!", {
        description: `${formData.name} is now live in the community hub.`,
      });
      onSuccess();
      onClose();
      setFormData({ name: "", description: "", repoUrl: "" });
    },
    onError: (err) => {
      toast.error("Failed to create project", {
        description: err.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Project name is required");
    createMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-dash-surface border border-dash-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-dash-border">
          <h2 className="text-xl font-bold text-text-primary">New Community Project</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X className="size-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Project Name</label>
            <input 
              required
              className="w-full px-4 py-2.5 bg-dash-base border border-dash-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple outline-none"
              placeholder="e.g. Opensox AI Dashboard"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Description</label>
            <textarea 
              className="w-full px-4 py-2.5 bg-dash-base border border-dash-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple outline-none resize-none h-24"
              placeholder="Tell us what this project is about..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">GitHub Repository (Optional)</label>
            <input 
              className="w-full px-4 py-2.5 bg-dash-base border border-dash-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple outline-none"
              placeholder="https://github.com/org/repo"
              value={formData.repoUrl}
              onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-text-secondary hover:bg-dash-hover rounded-xl transition-all"
            >
              Cancel
            </button>
            <PrimaryButtom 
              type="submit"
              loading={createMutation.isPending}
              classname="flex-1"
            >
              {createMutation.isPending ? "Creating..." : "Create Project"}
            </PrimaryButtom>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
