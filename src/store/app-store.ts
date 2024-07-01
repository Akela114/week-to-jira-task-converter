import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type AppStore = {
  projectId?: string;
  boardId?: string;
  usersMap?: Record<string, string>;
  jiraProjectId?: string;
  jiraRoleId?: string;
  jiraTasksTypeId?: string;
  jiraSubtasksTypeId?: string;
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
  setJiraRoleId: (id: string) => void;
  resetJiraRoleId: () => void;
  setJiraTasksTypeId: (id: string) => void;
  resetJiraTasksTypeId: () => void;
  setJiraSubtasksTypeId: (id: string) => void;
  resetJiraSubtasksTypeId: () => void;
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
      setProjectId: (id: string) => set({ projectId: id, boardId: undefined, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false, jiraRoleId: undefined, jiraSubtasksTypeId: undefined }),
      resetProjectId: () => set({ projectId: undefined, boardId: undefined, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false, jiraRoleId: undefined, jiraSubtasksTypeId: undefined }),
      setBoardId: (id: string) => set({ boardId: id, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false, jiraRoleId: undefined, jiraSubtasksTypeId: undefined }),
      resetBoardId: () => set({ boardId: undefined, usersMap: undefined, jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false, jiraRoleId: undefined, jiraSubtasksTypeId: undefined }),
      setJiraProjectId: (id: string) => set({ jiraProjectId: id, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false, jiraRoleId: undefined, jiraSubtasksTypeId: undefined }),
      resetJiraProjectId: () => set({ jiraProjectId: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false, jiraRoleId: undefined, jiraSubtasksTypeId: undefined }),
      setJiraRoleId: (id: string) => set({ jiraRoleId: id, usersMap: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false, jiraSubtasksTypeId: undefined }),
      resetJiraRoleId: () => set({ jiraRoleId: undefined, usersMap: undefined, jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false, jiraSubtasksTypeId: undefined }),
      setUsersMap: (map: Record<string, string>) => set({ usersMap: map, statusesMap: undefined, isReadyAddTasks: false, jiraSubtasksTypeId: undefined }),
      resetUsersMap: () => set({ usersMap: undefined, statusesMap: undefined, isReadyAddTasks: false, jiraSubtasksTypeId: undefined }),
      setJiraTasksTypeId: (id: string) => set({ jiraTasksTypeId: id, statusesMap: undefined, isReadyAddTasks: false, jiraSubtasksTypeId: undefined }),
      resetJiraTasksTypeId: () => set({ jiraTasksTypeId: undefined, statusesMap: undefined, isReadyAddTasks: false, jiraSubtasksTypeId: undefined }),
      setJiraSubtasksTypeId: (id: string) => set({ statusesMap: undefined, isReadyAddTasks: false, jiraSubtasksTypeId: id }),
      resetJiraSubtasksTypeId: () => set({ statusesMap: undefined, isReadyAddTasks: false, jiraSubtasksTypeId: undefined }),
      setTaskStatusesMap: (map: Record<string, string>) => set({ statusesMap: map }),
      resetTaskStatusesMap: () => set({ statusesMap: undefined, isReadyAddTasks: false }),
      setIsReadyAddTasks: (isReady: boolean) => set(({ isReadyAddTasks: isReady })),
    }),
    {
      name: 'weeek-store'
    }
  ))