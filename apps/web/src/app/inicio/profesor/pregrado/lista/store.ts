import { create } from 'zustand';

interface ProfessorThesisListState {
  expandedProject: number | null
  searchQuery: string
  sortDirection: number;

  setExpandedProject: (expandedProject: number | null) => void
  setSearchQuery: (searchQuery: string) => void

  toggleExpandedProject: (id: number) => void
  toggleSortDirection: () => void

  reset(): void
}

export const useProfessorThesisListStore = create<ProfessorThesisListState>((set) => ({
  expandedProject: null,
  searchQuery: "",
  sortDirection: 1,
    
  setExpandedProject: (expandedProject: number | null) => set({ expandedProject }),
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),

  toggleExpandedProject: (id: number) => set((state) => ({ expandedProject: state.expandedProject === id ? null : id })),
  toggleSortDirection: () => set((state) => ({ sortDirection: state.sortDirection * -1 })),
  reset: () => set({ expandedProject: null, searchQuery: "" }),
}));
