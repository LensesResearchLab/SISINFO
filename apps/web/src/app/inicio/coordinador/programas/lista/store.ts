import { create } from 'zustand';

interface ProgramsState {
  period?: string;

  ids: string[];

  setPeriod: (period: string) => void;
  setIds: (ids: string[]) => void;
}

export const useProgramsStore = create<ProgramsState>((set) => ({
  period: undefined,
  ids: [],
  setPeriod: (period) => set(() => ({ period })),
  setIds: (ids) => set(() => ({ ids })),
}));