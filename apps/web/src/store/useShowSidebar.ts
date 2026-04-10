import { create } from "zustand";

interface showSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

export const useShowSidebar = create<showSidebarProps>((set) => ({
  showSidebar: false,
  setShowSidebar: (value) => set({ showSidebar: value }),
  isCollapsed: false,
  toggleCollapsed: () =>
    set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
