import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';

type AppStore = {
  projectId?: string;
  boardId?: string;
  usersMap?: Record<string, string>;
  jiraProjectId?: string;
  jiraRoleId?: string;
  jiraTasksTypeId?: string;
  jiraSubtasksTypeId?: string;
  statusesMap?: Record<string, string>;
  priorityMap?: Record<string, string>;
  disabledTaskFields?: { id: string; name: string; }[];
  disabledSubTaskFields?: { id: string; name: string; }[];
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
  setPriorityMap: (map: Record<string, string>) => void;
  resetPriorityMap: () => void;
  setTasksDisabledFields: (data: { id: string, name: string }[]) => void;
  setSubtasksDisabledFields: (data: { id: string, name: string }[]) => void;
}

const resetNextSteps = (step: number) => {
  if (step < 1 || step > 10) return {};

  const values: Partial<{
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    [key in keyof AppStore as AppStore[key] extends (...args: any) => any ? never : key]: AppStore[key]
  }> = {}

  if (step < 11) {
    values.priorityMap = undefined;
  }
  if (step < 10) {
    values.statusesMap = undefined;
  }
  if (step < 9) {
    values.usersMap = undefined;
  }
  if (step < 8) {
    values.jiraRoleId = undefined;
  }
  if (step < 7) {
    values.jiraSubtasksTypeId = undefined;
    values.disabledSubTaskFields = undefined;
  }
  if (step < 6) {
    values.jiraTasksTypeId = undefined;
    values.disabledTaskFields = undefined;
  }
  if (step < 5) {
    values.jiraProjectId = undefined;
  }
  if (step < 3) {
    values.boardId = undefined;
  }
  if (step < 2) {
    values.projectId = undefined;
  }

  return values;
}


export const useAppStore = create(
  persist<AppStore>(
    (set) => ({
      userId: undefined,
      projectId: undefined,
      boardId: undefined,
      usersMap: undefined,
      isReadyAddTasks: false,
      disabledTaskFields: undefined,
      disabledSubTaskFields: undefined,
      setProjectId: (id: string) => set({ ...resetNextSteps(1), projectId: id }),
      resetProjectId: () => set({ ...resetNextSteps(1) }),
      setBoardId: (id: string) => set({ ...resetNextSteps(2), boardId: id, }),
      resetBoardId: () => set({ ...resetNextSteps(2) }),
      setJiraProjectId: (id: string) => set({ ...resetNextSteps(4), jiraProjectId: id }),
      resetJiraProjectId: () => set({ ...resetNextSteps(4) }),
      setJiraRoleId: (id: string) => set({ ...resetNextSteps(7), jiraRoleId: id }),
      resetJiraRoleId: () => set({ ...resetNextSteps(7) }),
      setUsersMap: (map: Record<string, string>) => set({ ...resetNextSteps(8), usersMap: map }),
      resetUsersMap: () => set({ ...resetNextSteps(8) }),
      setJiraTasksTypeId: (id: string) => set({ ...resetNextSteps(5), jiraTasksTypeId: id }),
      resetJiraTasksTypeId: () => set({ ...resetNextSteps(5) }),
      setJiraSubtasksTypeId: (id: string) => set({ ...resetNextSteps(6), jiraSubtasksTypeId: id }),
      resetJiraSubtasksTypeId: () => set({ ...resetNextSteps(6) }),
      setTaskStatusesMap: (map: Record<string, string>) => set({ ...resetNextSteps(9), statusesMap: map }),
      resetTaskStatusesMap: () => set({ ...resetNextSteps(9) }),
      setPriorityMap: (map: Record<string, string>) => set({ ...resetNextSteps(10), priorityMap: map }),
      resetPriorityMap: () => set({ ...resetNextSteps(10) }),
      setTasksDisabledFields: (data: { id: string, name: string }[]) => set({disabledTaskFields: data }),
      setSubtasksDisabledFields: (data: { id: string, name: string }[]) => set({disabledSubTaskFields: data })
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  ))