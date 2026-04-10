"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, LayoutGrid, List as ListIcon, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import PrimaryButtom from "@/components/ui/custom-button";

const ProjectsPage = () => {
  const { data: session } = useSession();
  const { data: projects, isLoading } = trpc.project.list.useQuery();
  const { data: stats } = trpc.project.getStats.useQuery();
  
  const userRole = (session?.user as any)?.role;
  const canCreate = userRole === "OWNER" || userRole === "MAINTAINER";

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Community Projects</h1>
          <p className="text-text-secondary mt-1">Explore and contribute to our active open-source initiatives.</p>
        </div>
        {canCreate && (
          <PrimaryButtom classname="flex items-center gap-2">
            <Plus className="size-4" />
            New Project
          </PrimaryButtom>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-dash-surface border border-dash-border">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Projects</span>
          <p className="text-2xl font-semibold text-text-primary mt-1">{stats?.total || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-dash-surface border border-dash-border">
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Active</span>
          <p className="text-2xl font-semibold text-text-primary mt-1">{stats?.active || 0}</p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && [1, 2, 3].map(i => (
          <div key={i} className="h-64 rounded-2xl bg-dash-surface/50 border border-dash-border animate-pulse"></div>
        ))}

        {projects?.map((project) => (
          <div key={project.id} className="group relative flex flex-col p-6 rounded-2xl bg-dash-surface border border-dash-border hover:border-brand-purple/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20">
                <LayoutGrid className="size-5 text-brand-purple" />
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                project.status === "ACTIVE" ? "bg-green-500/10 text-green-500" : "bg-text-tertiary/10 text-text-tertiary"
              }`}>
                {project.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-purple transition-colors">{project.name}</h3>
            <p className="text-sm text-text-secondary line-clamp-2 mt-2 flex-grow">{project.description || "No description provided."}</p>

            <div className="mt-6 pt-6 border-t border-dash-border flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-tertiary uppercase font-medium">Tasks</span>
                <span className="text-sm font-semibold text-text-secondary">{project._count.tasks} Open</span>
              </div>
              <Link 
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center gap-1 text-sm font-medium text-brand-purple hover:gap-2 transition-all"
              >
                View Project <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ))}

        {projects?.length === 0 && (
          <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-dash-border">
            <p className="text-text-muted italic">No community projects found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
