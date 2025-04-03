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
  tasks: Array.from({ length: 20 }, (_, i) => ({
    id: "1",
    title: "Tarea 1",
    description: "Descripción de la tarea 1",
    status: "pendiente",
    date: new Date(),
  })),

  setRoles: (roles: string[]) => set({ roles }),
  setTasks: (tasks: Task[]) => set({ tasks }),
}));
