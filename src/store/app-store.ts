import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type AppStore = {
  projectId?: string;
  boardId?: string;
  usersMap?: Record<string, string>;
  jiraProjectId?: string;
  jiraTasksTypeId?: string;
  statusesMap?: Record<string, string>;
  isReadyAddTasks?: boolean;
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
  setIsReadyAddTasks: (isReady: boolean) => void;
}

export const useAppStore = create(
  persist<AppStore>(
    (set) => ({
      userId: undefined,
      projectId: undefined,
      boardId: undefined,
      usersMap: undefined,
      isReadyAddTasks: false,
      setProjectId: (id: string) => set({ projectId: id, boardId: undefined, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false }),
      resetProjectId: () => set({ projectId: undefined, boardId: undefined, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false }),
      setBoardId: (id: string) => set({ boardId: id, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false }),
      resetBoardId: () => set({ boardId: undefined, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false }),
      setUsersMap: (map: Record<string, string>) => set({ usersMap: map, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false }),
      resetUsersMap: () => set({ usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false }),
      setJiraProjectId: (id: string) => set({ jiraProjectId: id, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false }),
      resetJiraProjectId: () => set({ jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false }),
      setJiraTasksTypeId: (id: string) => set({ jiraTasksTypeId: id, statusesMap: undefined, isReadyAddTasks: false }),
      resetJiraTasksTypeId: () => set({ jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false }),
      setTaskStatusesMap: (map: Record<string, string>) => set({ statusesMap: map }),
      resetTaskStatusesMap: () => set({ statusesMap: undefined, isReadyAddTasks: false }),
      setIsReadyAddTasks: (isReady: boolean) => set(({ isReadyAddTasks: isReady }))
    }),
    {
      name: 'weeek-store'
    }
  ))