import { create } from "zustand";

interface LoadingProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export const useLoading = create<LoadingProps>((set) => ({
  loading: false,
  setLoading: (value) => set({ loading: value }),
}));
