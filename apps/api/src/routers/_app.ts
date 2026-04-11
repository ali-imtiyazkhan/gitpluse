import { router } from "../trpc.js";
import { userRouter } from "./user.js";
import { projectRouter } from "./projects.js";
import { authRouter } from "./auth.js";
import { memberRouter } from "./member.js";
import { taskRouter } from "./task.js";
import { githubExploreRouter } from "./github-explore.js";
import { adminRouter } from "./admin.js";

export const appRouter = router({
  user: userRouter,
  project: projectRouter,
  auth: authRouter,
  member: memberRouter,
  task: taskRouter,
  githubExplore: githubExploreRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
