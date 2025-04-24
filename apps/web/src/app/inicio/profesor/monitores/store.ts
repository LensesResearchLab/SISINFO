import { create } from 'zustand';

interface TeachingAssistantListState {
  searchTerm: string;
  sortDirection: number;
  order: string[];

  setSearchTerm: (searchTerm: string) => void;
  setSortDirection: (sortDirection: number) => void;
  setOrder: (order: string[]) => void;
}

export const useTeachingAssistantListStore = create<TeachingAssistantListState>((set) => ({
  searchCategory: "professor",
  searchTerm: "202510",
  sortDirection: 1,
  order: [],

  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  setSortDirection: (sortDirection: number) => set({ sortDirection }),
  setOrder: (order: string[]) => set({ order }),
}));