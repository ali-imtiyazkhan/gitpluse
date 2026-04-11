"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  ExternalLink,
  Code2,
  TrendingUp,
  Flame,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const languageColorMap: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  Rust: "#DEA584",
  Go: "#00ADD8",
  Java: "#B07219",
};

const difficultyConfig: Record<string, any> = {
  beginner: {
    label: "Good First Issue",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  intermediate: {
    label: "Intermediate",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  advanced: {
    label: "Advanced",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
  },
};

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

const FeaturedRepos = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { data, isLoading, error } = trpc.githubExplore.explore.useQuery({
    sortBy: "stars",
    perPage: 6,
    page: 1,
  });

  const repos = data?.repos || [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20">
            <Code2 className="size-5 text-brand-purple" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary tracking-tight">
              Featured Repositories
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Trending open-source projects looking for contributors
            </p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-dash-surface border border-dash-border animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-10 text-center rounded-2xl border border-dashed border-dash-border bg-dash-surface/50">
          <p className="text-sm text-text-muted italic">Failed to load trending repositories. Public API rate limits may apply.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {!isLoading && !error && repos.map((repo, index) => {
          // Heuristic for difficulty based on issues (just for UI flavor)
          const difficultyList = ["beginner", "intermediate", "advanced"];
          const difficulty = difficultyList[repo.id % 3] as "beginner";
          const diff = difficultyConfig[difficulty];
          const langColor = languageColorMap[repo.language || ""] || "#888";
          const isHovered = hoveredId === String(repo.id);

          return (
            <motion.a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
              onMouseEnter={() => setHoveredId(String(repo.id))}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative flex flex-col rounded-2xl bg-dash-surface border border-dash-border p-5 transition-all duration-300 hover:border-brand-purple/30 hover:shadow-[0_0_30px_rgba(85,25,247,0.08)] cursor-pointer overflow-hidden h-full"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-transparent to-transparent transition-opacity duration-500 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />

              <div className="relative z-10 flex flex-col gap-3 flex-1 h-full">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-8 rounded-lg bg-black/40 border border-dash-border flex items-center justify-center shrink-0 overflow-hidden">
                       <img src={repo.owner.avatarUrl} alt={repo.owner.login} className="size-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-text-primary group-hover:text-brand-purple transition-colors truncate">
                        {repo.name}
                      </h4>
                      <p className="text-[10px] text-text-muted font-mono truncate">
                        {repo.fullName}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="size-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>

                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 min-h-[32px]">
                  {repo.description || "No description provided."}
                </p>

                <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
                  {(repo.topics as string[] || []).slice(0, 2).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/30 border border-dash-border text-text-muted"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="flex-1" />

                <div className="flex items-center justify-between pt-3 border-t border-dash-border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: langColor }}
                      />
                      <span className="text-[11px] text-text-secondary font-medium">
                        {repo.language || "Text"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-text-muted">
                      <Star className="size-3" />
                      <span className="text-[11px] font-medium">
                        {formatNumber(repo.stars)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                     {repo.openIssues > 50 && (
                        <span className={`flex items-center gap-1 text-[10px] font-semibold uppercase text-orange-400`}>
                           <Flame className="size-3" />
                        </span>
                     )}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${diff.bg} ${diff.color} ${diff.border} border`}
                    >
                      {diff.label}
                    </span>
                  </div>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedRepos;
