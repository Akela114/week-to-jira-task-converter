import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type WeeekStore = {
  selectedProjectId?: string;
  setSelectedProjectId: (id: string) => void;
}

export const useWeeekStore = create(
  persist<WeeekStore>(
    (set) => ({
      selectedProjectId: undefined,
      setSelectedProjectId: (id: string) => set({ selectedProjectId: id }),
    }),
    {
      name: 'weeek-store'
    }
  ))