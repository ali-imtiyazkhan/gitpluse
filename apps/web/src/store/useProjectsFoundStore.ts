import { create } from "zustand";

interface ProjectNotFoundProps {
  projectsNotFound: boolean;
  setProjectsNotFound: (value: boolean) => void;
}

export const useProjectsNotFoundStore = create<ProjectNotFoundProps>((set) => ({
  projectsNotFound: false,
  setProjectsNotFound: (value) => set({ projectsNotFound: value }),
}));
