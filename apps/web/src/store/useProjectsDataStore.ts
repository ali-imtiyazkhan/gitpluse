import { create } from "zustand";
import { DashboardProjectsProps } from "@/types";

interface ProjectsDataProps {
  data: DashboardProjectsProps[];
  setData: (value: DashboardProjectsProps[]) => void;
  eraseData: () => void;
}

export const useProjectsData = create<ProjectsDataProps>((set) => ({
  data: [],
  setData: (value) => set({ data: value }),
  eraseData: () => set({ data: [] }),
}));
