import { TRPCError } from "@trpc/server";

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  url: string;
  homepage: string | null;
  topics: string[];
  pushedAt: string;
  createdAt: string;
  license: string | null;
  hasGoodFirstIssues: boolean;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

export interface ExploreFilters {
  language?: string | undefined;
  minStars?: number | undefined;
  difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
  sortBy?: "stars" | "updated" | "forks" | "best-match" | undefined;
  page?: number | undefined;
  perPage?: number | undefined;
}

interface CacheEntry {
  data: { repos: GitHubRepo[]; totalCount: number };
  expiresAt: number;
}

// In-memory cache to avoid hitting GitHub rate limits
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCacheKey(filters: ExploreFilters): string {
  return JSON.stringify(filters);
}

function buildSearchQuery(filters: ExploreFilters): string {
  const parts: string[] = [];

  // Language filter
  if (filters.language && filters.language !== "all") {
    parts.push(`language:${filters.language}`);
  }

  // Stars / popularity filter
  if (filters.minStars) {
    parts.push(`stars:>=${filters.minStars}`);
  } else {
    // Default: at least 100 stars to filter out noise
    parts.push("stars:>=100");
  }

  // Difficulty filter — based on "good first issue" labels and issue count
  switch (filters.difficulty) {
    case "beginner":
      parts.push("good-first-issues:>5");
      break;
    case "intermediate":
      parts.push("good-first-issues:>0");
      parts.push("stars:>=500");
      break;
    case "advanced":
      parts.push("stars:>=5000");
      break;
  }

  // Only repos active in the last year
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  parts.push(`pushed:>${oneYearAgo.toISOString().split("T")[0]}`);

  // If no specific filters, search for popular open source repos
  if (parts.length <= 2) {
    parts.push("is:public");
  }

  return parts.join(" ");
}

function mapSortBy(
  sortBy?: string
): { sort: string; order: string } | undefined {
  switch (sortBy) {
    case "stars":
      return { sort: "stars", order: "desc" };
    case "updated":
      return { sort: "updated", order: "desc" };
    case "forks":
      return { sort: "forks", order: "desc" };
    case "best-match":
    default:
      return undefined; // GitHub defaults to best match
  }
}

export const githubExploreService = {
  async searchRepositories(
    filters: ExploreFilters
  ): Promise<{ repos: GitHubRepo[]; totalCount: number }> {
    // Check cache
    const cacheKey = getCacheKey(filters);
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    if (!token) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "GitHub access token not configured",
      });
    }

    const query = buildSearchQuery(filters);
    const sortConfig = mapSortBy(filters.sortBy);
    const page = filters.page || 1;
    const perPage = filters.perPage || 24;

    // Build URL
    const params = new URLSearchParams({
      q: query,
      per_page: String(perPage),
      page: String(page),
    });

    if (sortConfig) {
      params.set("sort", sortConfig.sort);
      params.set("order", sortConfig.order);
    }

    const url = `https://api.github.com/search/repositories?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "GitPulse-App",
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `GitHub API error: ${response.status} - ${errorBody}`
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `GitHub API returned ${response.status}`,
        });
      }

      const data = await response.json();

      const repos: GitHubRepo[] = (data.items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        fullName: item.full_name,
        description: item.description,
        language: item.language,
        stars: item.stargazers_count,
        forks: item.forks_count,
        openIssues: item.open_issues_count,
        url: item.html_url,
        homepage: item.homepage,
        topics: item.topics || [],
        pushedAt: item.pushed_at,
        createdAt: item.created_at,
        license: item.license?.spdx_id || null,
        hasGoodFirstIssues: (item.topics || []).includes("good-first-issue"),
        owner: {
          login: item.owner?.login,
          avatarUrl: item.owner?.avatar_url,
        },
      }));

      const result = {
        repos,
        totalCount: Math.min(data.total_count || 0, 1000), // GitHub caps at 1000
      };

      // Store in cache
      cache.set(cacheKey, {
        data: result,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

      return result;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error("GitHub explore error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to search GitHub repositories",
      });
    }
  },

  /**
   * Get available languages from GitHub's linguist
   */
  getLanguages(): string[] {
    return [
      "TypeScript",
      "JavaScript",
      "Python",
      "Rust",
      "Go",
      "Java",
      "C++",
      "C",
      "C#",
      "Ruby",
      "PHP",
      "Swift",
      "Kotlin",
      "Dart",
      "Shell",
      "Lua",
      "Zig",
      "Elixir",
      "Haskell",
      "Scala",
    ];
  },
};
