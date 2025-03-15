import { create } from 'zustand';

interface ThesisListState {
  searchCategory: string;
  searchTerm: string;
  sortDirection: number;
  order: string[];

  setSearchCategory: (searchCategory: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSortDirection: (sortDirection: number) => void;
  setOrder: (order: string[]) => void;
}

export const useThesisListStore = create<ThesisListState>((set) => ({
  searchCategory: "professor",
  searchTerm: "",
  sortDirection: 1,
  order: [],
    
  setSearchCategory: (searchCategory: string) => set({ searchCategory }),
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  setSortDirection: (sortDirection: number) => set({ sortDirection }),
  setOrder: (order: string[]) => set({ order }),
}));