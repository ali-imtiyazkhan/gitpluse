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
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PrimaryButtom from "@/components/ui/custom-button";
import ExploreRepos from "@/components/dashboard/ExploreRepos";
import { motion } from "framer-motion";

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

  const { data: projects, isLoading } = trpc.project.getSuggested.useQuery(undefined, {
    enabled: activeTab === "community",
  });
  const { data: stats } = trpc.project.getStats.useQuery(undefined, {
    enabled: activeTab === "community",
  });

  const userRole = (session?.user as any)?.role;
  const canCreate = userRole === "OWNER" || userRole === "MAINTAINER";

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto">
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
          <PrimaryButtom classname="flex items-center gap-2">
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
      {activeTab === "explore" && <ExploreRepos />}

      {activeTab === "community" && (
        <div className="flex flex-col gap-6">
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
                className="group relative flex flex-col p-6 rounded-2xl bg-dash-surface border border-dash-border hover:border-brand-purple/50 transition-all duration-300"
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
                <p className="text-sm text-text-secondary line-clamp-2 mt-2 flex-grow">
                  {project.description || "No description provided."}
                </p>

                <div className="mt-6 pt-6 border-t border-dash-border flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-tertiary uppercase font-medium">
                      Tasks
                    </span>
                    <span className="text-sm font-semibold text-text-secondary">
                      {project._count.tasks} Open
                    </span>
                  </div>
                  <span
                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    className="flex items-center gap-1 text-sm font-medium text-brand-purple hover:gap-2 transition-all cursor-pointer"
                  >
                    View Project <ArrowRight className="size-4" />
                  </span>
                </div>
              </div>
            ))}

            {projects?.length === 0 && (
              <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-dash-border">
                <p className="text-text-muted italic">
                  No community projects found yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
