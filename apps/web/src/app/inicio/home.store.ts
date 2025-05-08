import { create } from "zustand";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  date: Date;
}

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
