import { create } from "zustand";

interface RenderProjectProps {
  renderProjects: boolean;
  setRenderProjects: (value: boolean) => void;
  toggleRenderProjects: () => void;
}

export const useRenderProjects = create<RenderProjectProps>((set) => ({
  renderProjects: false,
  setRenderProjects: (value) => set({ renderProjects: value }),
  toggleRenderProjects: () =>
    set((state) => ({ renderProjects: !state.renderProjects })),
}));
