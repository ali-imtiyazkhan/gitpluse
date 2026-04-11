import { useCallback } from "react";
import { FilterProps, RepositoryProps } from "@opensox/shared/types";
import { trpc } from "@/lib/trpc";

export const useGetProjects = () => {
  const utils = trpc.useUtils();

  const func = useCallback(
    async (filters: FilterProps): Promise<RepositoryProps[]> => {
      // Use the new githubExplore router which replaces the old project.getGithubProjects
      const data = await utils.client.githubExplore.explore.query({
        language: filters.language || undefined,
        sortBy: "stars",
        page: 1,
        perPage: 30,
      });

      // Map the new service response to the legacy RepositoryProps expected by the UI
      return data.repos.map((repo: any) => ({
        id: String(repo.id),
        name: repo.name,
        description: repo.description || "",
        url: repo.url,
        owner: {
          avatarUrl: repo.owner.avatarUrl,
        },
        issues: {
          totalCount: repo.openIssues,
        },
        primaryLanguage: {
          name: repo.language || "Unknown",
        },
      }));
    },
    [utils]
  );
  return func;
};
