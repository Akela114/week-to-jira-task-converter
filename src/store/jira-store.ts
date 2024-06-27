import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type JiraStore = {
  selectedProjectId?: string;
  setSelectedProjectId: (id: string) => void;
  selectedJiraUser?: string;
  setSelectedJiraUser: (id: string) => void;
  selectedTaskType?: string;
  setSelectedTypeTasks: (id: string) => void;
}

export const useJiraStore = create(
  persist<JiraStore>(
    (set) => ({
      selectedProjectId: undefined,
      setSelectedProjectId: (id: string) => set({ selectedProjectId: id }),
      selectedJiraUser: undefined,
      setSelectedJiraUser: (id) => set({ selectedJiraUser: id }),
      selectedTaskType: undefined,
      setSelectedTypeTasks: (id) => set({ selectedTaskType: id }),
    }),
    {
      name: 'jira-store'
    }
))