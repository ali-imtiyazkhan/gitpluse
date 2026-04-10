import { create } from "zustand";

interface showSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  activeSidebar: "general" | "community";
  setActiveSidebar: (value: "general" | "community") => void;
}

export const useShowSidebar = create<showSidebarProps>((set) => ({
  showSidebar: false,
  setShowSidebar: (value) => set({ showSidebar: value }),
  isCollapsed: false,
  toggleCollapsed: () =>
    set((state) => ({ isCollapsed: !state.isCollapsed })),
  activeSidebar: "general",
  setActiveSidebar: (value) => set({ activeSidebar: value }),
}));
