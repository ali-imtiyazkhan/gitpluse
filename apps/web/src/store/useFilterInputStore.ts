import { create } from "zustand";

interface FilterInputState {
  filters: object;
  updateFilters: (newFilter: Record<string, string>) => void;
  resetFilters: () => void;
}

export const useFilterInputStore = create<FilterInputState>((set) => ({
  filters: {},
  updateFilters: (newFilter) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilter },
    })),
  resetFilters: () => set({ filters: {} }),
}));
