import { create } from "zustand";

interface FilterState {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  toggleShowFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  showFilters: false,
  setShowFilters: (value) => set({ showFilters: value }),
  toggleShowFilters: () =>
    set((state) => ({ showFilters: !state.showFilters })),
}));
