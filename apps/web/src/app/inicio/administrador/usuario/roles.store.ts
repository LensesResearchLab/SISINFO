import { create } from "zustand";

interface RolesState {
  userId: string;
  setUserId: (id: string) => void;
}

export const useRolesStore = create<RolesState>((set) => ({
  userId: "",
  setUserId: (id: string) => set({ userId: id }),
}));
