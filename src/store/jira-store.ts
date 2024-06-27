import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type JiraStore = {
  selectedProjectId?: string;
  setSelectedProjectId: (id: string) => void;
}

export const useJiraStore = create(
  persist<JiraStore>(
    (set) => ({
      selectedProjectId: undefined,
      setSelectedProjectId: (id: string) => set({ selectedProjectId: id }),
    }),
    {
      name: 'jira-store'
    }
))