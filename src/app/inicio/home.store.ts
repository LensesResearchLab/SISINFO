import { create } from 'zustand';

interface HomeState {
  roles: string[];

  setRoles: (roles: string[]) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  roles: [],

  setRoles: (roles: string[]) => set({ roles }),
}));