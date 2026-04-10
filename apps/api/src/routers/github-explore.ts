import { router, publicProcedure } from "../trpc.js";
import { z } from "zod";
import { githubExploreService } from "../services/github-explore.service.js";

export const githubExploreRouter = router({
  /**
   * Search GitHub repos with filters
   */
  explore: publicProcedure
    .input(
      z.object({
        language: z.string().optional(),
        minStars: z.number().optional(),
        difficulty: z
          .enum(["beginner", "intermediate", "advanced"])
          .optional(),
        sortBy: z
          .enum(["stars", "updated", "forks", "best-match"])
          .optional(),
        page: z.number().min(1).max(34).optional(),
        perPage: z.number().min(1).max(30).optional(),
      })
    )
    .query(async ({ input }) => {
      return await githubExploreService.searchRepositories({
        language: input.language,
        minStars: input.minStars,
        difficulty: input.difficulty,
        sortBy: input.sortBy,
        page: input.page,
        perPage: input.perPage,
      });
    }),

  /**
   * Get available filter options
   */
  languages: publicProcedure.query(() => {
    return githubExploreService.getLanguages();
  }),
});
