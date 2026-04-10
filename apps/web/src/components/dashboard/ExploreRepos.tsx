"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { keepPreviousData } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import {
  Star,
  GitFork,
  ExternalLink,
  Code2,
  AlertCircle,
  ChevronDown,
  Search,
  Flame,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────
type Difficulty = "beginner" | "intermediate" | "advanced";
type SortOption = "stars" | "updated" | "forks" | "best-match";
type PopularityTier = "any" | "rising" | "popular" | "mega";

const POPULARITY_MAP: Record<PopularityTier, number | undefined> = {
  any: undefined,
  rising: 500,
  popular: 5000,
  mega: 25000,
};

const LANGUAGES = [
  "All",
  "TypeScript",
  "JavaScript",
  "Python",
  "Rust",
  "Go",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "Dart",
  "Shell",
];

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  Rust: "#DEA584",
  Go: "#00ADD8",
  Java: "#B07219",
  "C++": "#F34B7D",
  "C#": "#178600",
  Ruby: "#CC342D",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89E051",
  C: "#555555",
  Lua: "#000080",
  Zig: "#EC915C",
};

const DIFFICULTY_CONFIG = {
  beginner: {
    label: "Good First Issue",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    icon: <Sparkles className="size-3" />,
  },
  intermediate: {
    label: "Intermediate",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    icon: <TrendingUp className="size-3" />,
  },
  advanced: {
    label: "Advanced",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    icon: <Flame className="size-3" />,
  },
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "stars", label: "Most Stars" },
  { value: "updated", label: "Recently Updated" },
  { value: "forks", label: "Most Forks" },
  { value: "best-match", label: "Best Match" },
];

const POPULARITY_OPTIONS: { value: PopularityTier; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "rising", label: "Rising (500+★)" },
  { value: "popular", label: "Popular (5k+★)" },
  { value: "mega", label: "Mega (25k+★)" },
];

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

// ─── Filter Chip Component ────────────────────────────────────────
const FilterChip = ({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
      flex items-center gap-1.5 shrink-0 cursor-pointer
      ${
        active
          ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30 shadow-[0_0_10px_rgba(85,25,247,0.1)]"
          : "bg-dash-surface border border-dash-border text-text-muted hover:text-text-secondary hover:border-text-muted/30"
      }
    `}
  >
    {icon}
    {label}
  </button>
);

// ─── Dropdown Component ────────────────────────────────────────────
const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-dash-surface border border-dash-border text-text-secondary hover:border-text-muted/30 transition-all cursor-pointer"
      >
        <span className="text-text-muted">{label}:</span>
        <span className="text-text-primary">{selected?.label || value}</span>
        <ChevronDown
          className={`size-3 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-1 z-50 min-w-[160px] p-1 rounded-xl bg-dash-raised border border-dash-border shadow-2xl"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    opt.value === value
                      ? "bg-brand-purple/15 text-brand-purple"
                      : "text-text-secondary hover:bg-dash-hover hover:text-text-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Skeleton Card ─────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex flex-col rounded-2xl bg-dash-surface border border-dash-border p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="size-9 rounded-lg bg-dash-hover" />
      <div className="flex-1">
        <div className="h-4 w-28 bg-dash-hover rounded mb-1.5" />
        <div className="h-3 w-20 bg-dash-hover rounded" />
      </div>
    </div>
    <div className="h-3 w-full bg-dash-hover rounded mb-2" />
    <div className="h-3 w-3/4 bg-dash-hover rounded mb-4" />
    <div className="flex gap-2 mb-4">
      <div className="h-5 w-14 bg-dash-hover rounded-full" />
      <div className="h-5 w-16 bg-dash-hover rounded-full" />
    </div>
    <div className="mt-auto pt-3 border-t border-dash-border flex justify-between">
      <div className="flex gap-3">
        <div className="h-4 w-12 bg-dash-hover rounded" />
        <div className="h-4 w-12 bg-dash-hover rounded" />
      </div>
      <div className="h-5 w-20 bg-dash-hover rounded-full" />
    </div>
  </div>
);

// ─── Repo Card Component ──────────────────────────────────────────
const RepoCard = ({
  repo,
  index,
}: {
  repo: any;
  index: number;
}) => {
  const langColor = LANGUAGE_COLORS[repo.language] || "#888";

  // Determine difficulty based on stars and issues
  const difficulty: Difficulty =
    repo.openIssues > 100 && repo.stars > 10000
      ? "advanced"
      : repo.stars > 2000
        ? "intermediate"
        : "beginner";

  const diff = DIFFICULTY_CONFIG[difficulty];

  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.04, 0.4),
        duration: 0.4,
        ease: "easeOut",
      }}
      className="group relative flex flex-col rounded-2xl bg-dash-surface border border-dash-border p-5 transition-all duration-300 hover:border-brand-purple/30 hover:shadow-[0_0_40px_rgba(85,25,247,0.06)] cursor-pointer overflow-hidden"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={repo.owner.avatarUrl}
              alt={repo.owner.login}
              className="size-9 rounded-lg border border-dash-border bg-dash-hover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-text-primary group-hover:text-brand-purple transition-colors truncate">
                {repo.name}
              </h4>
              <p className="text-[10px] text-text-muted font-mono truncate">
                {repo.fullName}
              </p>
            </div>
          </div>
          <ArrowUpRight className="size-4 text-text-muted opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-1" />
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
          {repo.description || "No description available."}
        </p>

        {/* Topics */}
        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 4).map((topic: string) => (
              <span
                key={topic}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/30 border border-dash-border text-text-muted"
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > 4 && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/20 text-text-muted">
                +{repo.topics.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-dash-border">
          <div className="flex items-center gap-3">
            {/* Language */}
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: langColor }}
                />
                <span className="text-[11px] text-text-secondary font-medium">
                  {repo.language}
                </span>
              </div>
            )}
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

          <div className="flex items-center gap-2">
            {/* Activity */}
            <span className="text-[10px] text-text-muted">
              {timeAgo(repo.pushedAt)}
            </span>
            {/* Difficulty */}
            <span
              className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${diff.bg} ${diff.color} ${diff.border} border`}
            >
              {diff.icon}
              {diff.label}
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
};

// ─── Main Component ───────────────────────────────────────────────
const ExploreRepos = () => {
  const [language, setLanguage] = useState("All");
  const [popularity, setPopularity] = useState<PopularityTier>("any");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  const queryInput = useMemo(
    () => ({
      language: language === "All" ? undefined : language,
      minStars: POPULARITY_MAP[popularity],
      difficulty: difficulty === "all" ? undefined : (difficulty as Difficulty),
      sortBy,
      page,
      perPage: 24,
    }),
    [language, popularity, difficulty, sortBy, page]
  );

  const { data, isLoading, isFetching, error } =
    trpc.githubExplore.explore.useQuery(queryInput, {
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000,
    });

  const hasActiveFilters =
    language !== "All" ||
    popularity !== "any" ||
    difficulty !== "all" ||
    sortBy !== "stars";

  const clearFilters = () => {
    setLanguage("All");
    setPopularity("any");
    setDifficulty("all");
    setSortBy("stars");
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20">
            <Search className="size-5 text-brand-purple" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary tracking-tight">
              Explore Open Source
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {data
                ? `${formatNumber(data.totalCount)} repos found`
                : "Discover projects to contribute to"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-text-muted hover:text-text-secondary rounded-lg hover:bg-dash-hover transition-colors cursor-pointer"
            >
              <X className="size-3" />
              Clear
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              showFilters
                ? "bg-brand-purple/15 text-brand-purple border border-brand-purple/20"
                : "bg-dash-surface border border-dash-border text-text-muted hover:text-text-secondary"
            }`}
          >
            <SlidersHorizontal className="size-3.5" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-dash-surface/50 border border-dash-border">
              {/* Language chips */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Language
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((lang) => (
                    <FilterChip
                      key={lang}
                      label={lang}
                      active={language === lang}
                      onClick={() => {
                        setLanguage(lang);
                        setPage(1);
                      }}
                      icon={
                        lang !== "All" ? (
                          <span
                            className="size-2 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                LANGUAGE_COLORS[lang] || "#888",
                            }}
                          />
                        ) : undefined
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Second row: Popularity, Difficulty, Sort */}
              <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-dash-border">
                <FilterDropdown
                  label="Popularity"
                  value={popularity}
                  options={POPULARITY_OPTIONS}
                  onChange={(v) => {
                    setPopularity(v as PopularityTier);
                    setPage(1);
                  }}
                />

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mr-1">
                    Difficulty
                  </span>
                  {(["all", "beginner", "intermediate", "advanced"] as const).map(
                    (d) => (
                      <FilterChip
                        key={d}
                        label={
                          d === "all"
                            ? "All"
                            : DIFFICULTY_CONFIG[d].label
                        }
                        active={difficulty === d}
                        onClick={() => {
                          setDifficulty(d);
                          setPage(1);
                        }}
                        icon={
                          d !== "all" ? DIFFICULTY_CONFIG[d].icon : undefined
                        }
                      />
                    )
                  )}
                </div>

                <div className="ml-auto">
                  <FilterDropdown
                    label="Sort"
                    value={sortBy}
                    options={SORT_OPTIONS}
                    onChange={(v) => {
                      setSortBy(v as SortOption);
                      setPage(1);
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator for refetch */}
      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Loader2 className="size-3 animate-spin" />
          <span>Updating results...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <AlertCircle className="size-5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Failed to load repositories</p>
            <p className="text-xs opacity-75 mt-0.5">
              {error.message || "Please try again later."}
            </p>
          </div>
        </div>
      )}

      {/* Repo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading &&
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}

        {!isLoading &&
          data?.repos.map((repo, index) => (
            <RepoCard key={repo.id} repo={repo} index={index} />
          ))}
      </div>

      {/* Empty state */}
      {!isLoading && data?.repos.length === 0 && (
        <div className="py-16 text-center rounded-2xl border border-dashed border-dash-border">
          <Code2 className="size-10 text-text-muted mx-auto mb-3 opacity-50" />
          <p className="text-text-muted text-sm">
            No repositories found with these filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-3 text-xs text-brand-purple hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {data && data.repos.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-text-muted">
            Page {page} · Showing {data.repos.length} of{" "}
            {formatNumber(data.totalCount)} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-dash-surface border border-dash-border text-text-secondary hover:border-text-muted/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={data.repos.length < 24}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-purple/15 border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Next Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreRepos;
