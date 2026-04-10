import { create } from "zustand";

interface ProjectTitleProps {
  projectTitle: string;
  setProjectTitle: (value: string) => void;
}

export const useProjectTitleStore = create<ProjectTitleProps>((set) => ({
  projectTitle: "Projects for you",
  setProjectTitle: (value) => set({ projectTitle: value }),
}));
