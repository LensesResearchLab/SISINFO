import { create } from "zustand";
import { Task } from "../types/entities/task.type";

interface HomeState {
  roles: string[];
  tasks: Task[];

  setRoles: (roles: string[]) => void;
  setTasks: (tasks: Task[]) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  roles: [],
  tasks: [],

  setRoles: (roles: string[]) => set({ roles }),
  setTasks: (tasks: Task[]) => set({ tasks }),
}));
