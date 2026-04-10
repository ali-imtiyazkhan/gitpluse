import { useCallback } from "react";
import { FilterProps, RepositoryProps } from "@opensox/shared/types";
import { trpc } from "@/lib/trpc";

export const useGetProjects = () => {
  const utils = trpc.useUtils();

  const func = useCallback(
    async (filters: FilterProps): Promise<RepositoryProps[]> => {
      const data = await (utils.client.project.getGithubProjects as any).query({
        filters: filters as any,
        options: {
          sort: "stars" as const,
          order: "desc" as const,
          per_page: 30,
          page: 1,
        },
      });
      return data;
    },
    [utils]
  );
  return func;
};
