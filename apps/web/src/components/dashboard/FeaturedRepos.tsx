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
} from "lucide-react";

type FeaturedRepo = {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  issues: number;
  url: string;
  topics: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  hottness: "trending" | "popular" | "rising";
};

const FEATURED_REPOS: FeaturedRepo[] = [
  {
    id: "1",
    name: "next.js",
    fullName: "vercel/next.js",
    description:
      "The React Framework for the Web. Build full-stack web applications with server-side rendering and static generation.",
    language: "TypeScript",
    stars: 128000,
    forks: 27200,
    issues: 3420,
    url: "https://github.com/vercel/next.js",
    topics: ["react", "nextjs", "ssr", "framework"],
    difficulty: "intermediate",
    hottness: "trending",
  },
  {
    id: "2",
    name: "shadcn-ui",
    fullName: "shadcn-ui/ui",
    description:
      "Beautifully designed components built with Radix UI and Tailwind CSS. Copy and paste into your apps.",
    language: "TypeScript",
    stars: 76000,
    forks: 4800,
    issues: 1250,
    url: "https://github.com/shadcn-ui/ui",
    topics: ["components", "tailwindcss", "radix-ui", "design-system"],
    difficulty: "beginner",
    hottness: "trending",
  },
  {
    id: "3",
    name: "langchain",
    fullName: "langchain-ai/langchain",
    description:
      "Build context-aware reasoning applications with LangChain. Integrate LLMs with external data sources and tools.",
    language: "Python",
    stars: 98000,
    forks: 15800,
    issues: 2100,
    url: "https://github.com/langchain-ai/langchain",
    topics: ["ai", "llm", "python", "machine-learning"],
    difficulty: "intermediate",
    hottness: "popular",
  },
  {
    id: "4",
    name: "cal.com",
    fullName: "calcom/cal.com",
    description:
      "Scheduling infrastructure for absolutely everyone. The open-source Calendly alternative.",
    language: "TypeScript",
    stars: 33000,
    forks: 8200,
    issues: 890,
    url: "https://github.com/calcom/cal.com",
    topics: ["scheduling", "nextjs", "prisma", "typescript"],
    difficulty: "intermediate",
    hottness: "rising",
  },
  {
    id: "5",
    name: "deno",
    fullName: "denoland/deno",
    description:
      "A modern runtime for JavaScript and TypeScript. Secure by default with no file, network, or env access unless enabled.",
    language: "Rust",
    stars: 98500,
    forks: 5400,
    issues: 1580,
    url: "https://github.com/denoland/deno",
    topics: ["runtime", "javascript", "typescript", "rust"],
    difficulty: "advanced",
    hottness: "popular",
  },
  {
    id: "6",
    name: "hono",
    fullName: "honojs/hono",
    description:
      "Web framework built on Web Standards. Fast, lightweight, and works on any JavaScript runtime.",
    language: "TypeScript",
    stars: 22000,
    forks: 620,
    issues: 310,
    url: "https://github.com/honojs/hono",
    topics: ["web-framework", "edge", "cloudflare", "bun"],
    difficulty: "beginner",
    hottness: "trending",
  },
];

const languageColorMap: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  Rust: "#DEA584",
  Go: "#00ADD8",
  Java: "#B07219",
};

const difficultyConfig = {
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

const hottnessConfig = {
  trending: { icon: <Flame className="size-3" />, color: "text-orange-400" },
  popular: { icon: <Star className="size-3" />, color: "text-yellow-400" },
  rising: { icon: <TrendingUp className="size-3" />, color: "text-green-400" },
};

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

const FeaturedRepos = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {FEATURED_REPOS.map((repo, index) => {
          const diff = difficultyConfig[repo.difficulty];
          const hot = hottnessConfig[repo.hottness];
          const langColor = languageColorMap[repo.language] || "#888";
          const isHovered = hoveredId === repo.id;

          return (
            <motion.a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
              onMouseEnter={() => setHoveredId(repo.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative flex flex-col rounded-2xl bg-dash-surface border border-dash-border p-5 transition-all duration-300 hover:border-brand-purple/30 hover:shadow-[0_0_30px_rgba(85,25,247,0.08)] cursor-pointer overflow-hidden"
            >
              {/* Subtle gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-transparent to-transparent transition-opacity duration-500 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />

              <div className="relative z-10 flex flex-col gap-3 flex-1">
                {/* Difficulty + Hottness badges — top of card */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full ${diff.bg} ${diff.color} ${diff.border} border`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        repo.difficulty === "beginner"
                          ? "bg-emerald-400"
                          : repo.difficulty === "intermediate"
                          ? "bg-amber-400"
                          : "bg-rose-400"
                      }`}
                    />
                    {diff.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/5 border border-white/10 ${hot.color}`}
                  >
                    {hot.icon}
                    {repo.hottness}
                  </span>
                </div>

                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-8 rounded-lg bg-black/40 border border-dash-border flex items-center justify-center shrink-0">
                      <Code2 className="size-4 text-text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-text-primary group-hover:text-brand-purple transition-colors truncate">
                        {repo.name}
                      </h4>
                      <p className="text-[10px] text-text-muted font-mono">
                        {repo.fullName}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="size-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>

                {/* Description */}
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {repo.description}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-1.5">
                  {repo.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/30 border border-dash-border text-text-muted"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer */}
                <div className="flex items-center gap-4 pt-3 border-t border-dash-border">
                  {/* Language */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: langColor }}
                    />
                    <span className="text-[11px] text-text-secondary font-medium">
                      {repo.language}
                    </span>
                  </div>
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-text-muted">
                    <Star className="size-3" />
                    <span className="text-[11px] font-medium">
                      {formatNumber(repo.stars)}
                    </span>
                  </div>
                  {/* Forks */}
                  <div className="flex items-center gap-1 text-text-muted">
                    <GitFork className="size-3" />
                    <span className="text-[11px] font-medium">
                      {formatNumber(repo.forks)}
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
