import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type WeeekStore = {
  projectId?: string;
  boardId?: string;
  usersMap?: Record<string, string>;
  setProjectId: (id: string) => void;
  resetProjectId: () => void;
  setBoardId: (id: string) => void;
  resetBoardId: () => void;
  setUsersMap: (map: Record<string, string>) => void;
}

export const useWeeekStore = create(
  persist<WeeekStore>(
    (set) => ({
      userId: undefined,
      projectId: undefined,
      boardId: undefined,
      usersMap: undefined,
      setProjectId: (id: string) => set({ projectId: id, boardId: undefined, usersMap: undefined }),
      resetProjectId: () => set({ projectId: undefined, boardId: undefined, usersMap: undefined }),
      setBoardId: (id: string) => set({ boardId: id, usersMap: undefined }),
      resetBoardId: () => set({ boardId: undefined, usersMap: undefined }),
      setUsersMap: (map: Record<string, string>) => set({ usersMap: map }),
    }),
    {
      name: 'weeek-store'
    }
  ))