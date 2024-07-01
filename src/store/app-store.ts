import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type AppStore = {
  projectId?: string;
  boardId?: string;
  usersMap?: Record<string, string>;
  jiraProjectId?: string;
  jiraTasksTypeId?: string;
  statusesMap?: Record<string, string>;
  setProjectId: (id: string) => void;
  resetProjectId: () => void;
  setBoardId: (id: string) => void;
  resetBoardId: () => void;
  setUsersMap: (map: Record<string, string>) => void;
  resetUsersMap: () => void;
  setJiraProjectId: (id: string) => void;
  resetJiraProjectId: () => void;
  setJiraTasksTypeId: (id: string) => void;
  resetJiraTasksTypeId: () => void;
  setTaskStatusesMap: (map: Record<string, string>) => void;
  resetTaskStatusesMap: () => void;
}

export const useAppStore = create(
  persist<AppStore>(
    (set) => ({
      userId: undefined,
      projectId: undefined,
      boardId: undefined,
      usersMap: undefined,
      setProjectId: (id: string) => set({ projectId: id, boardId: undefined, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined }),
      resetProjectId: () => set({ projectId: undefined, boardId: undefined, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined }),
      setBoardId: (id: string) => set({ boardId: id, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined }),
      resetBoardId: () => set({ boardId: undefined, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined }),
      setUsersMap: (map: Record<string, string>) => set({ usersMap: map, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined }),
      resetUsersMap: () => set({ usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined }),
      setJiraProjectId: (id: string) => set({ jiraProjectId: id, jiraTasksTypeId: undefined, statusesMap: undefined }),
      resetJiraProjectId: () => set({ jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined }),
      setJiraTasksTypeId: (id: string) => set({ jiraTasksTypeId: id, statusesMap: undefined }),
      resetJiraTasksTypeId: () => set({ jiraTasksTypeId: undefined, statusesMap: undefined }),
      setTaskStatusesMap: (map: Record<string, string>) => set({ statusesMap: map }),
      resetTaskStatusesMap: () => set({ statusesMap: undefined }),
    }),
    {
      name: 'weeek-store'
    }
  ))