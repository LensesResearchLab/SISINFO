import { create } from "zustand";

interface TutorialState {
  roles: string[];
  setRoles: (roles: string[]) => void;
}

export const useTutorialStore = create<TutorialState>((set) => ({
  roles: [],
  setRoles: (roles: string[]) => set({ roles }),
}));
