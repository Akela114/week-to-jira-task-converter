import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type WeeekStore = {
  projectId?: string;
  boardId?: string;
  userId?: string;
  setProjectId: (id: string) => void;
  resetProjectId: () => void;
  setBoardId: (id: string) => void;
  resetBoardId: () => void;
  setUserId: (id: string) => void;
}

export const useWeeekStore = create(
  persist<WeeekStore>(
    (set) => ({
      userId: undefined,
      projectId: undefined,
      boardId: undefined,
      setProjectId: (id: string) => set({ projectId: id, boardId: undefined }),
      resetProjectId: () => set({ projectId: undefined, boardId: undefined }),
      setBoardId: (id: string) => set({ boardId: id }),
      resetBoardId: () => set({ boardId: undefined }),
      setUserId: (id: string) => set({ userId: id }),
    }),
    {
      name: 'weeek-store'
    }
  ))