import { create } from 'zustand';

interface ProfessorThesisListState {
  expandedProject: string | null
  searchQuery: string
  sortDirection: number;

  setExpandedProject: (expandedProject: string | null) => void
  setSearchQuery: (searchQuery: string) => void

  toggleExpandedProject: (id: string) => void
  toggleSortDirection: () => void

  reset(): void
}

export const useProfessorThesisListStore = create<ProfessorThesisListState>((set) => ({
  expandedProject: null,
  searchQuery: "",
  sortDirection: 1,
    
  setExpandedProject: (expandedProject: string | null) => set({ expandedProject }),
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),

  toggleExpandedProject: (id: string) => set((state) => ({ expandedProject: state.expandedProject === id ? null : id })),
  toggleSortDirection: () => set((state) => ({ sortDirection: state.sortDirection * -1 })),
  reset: () => set({ expandedProject: null, searchQuery: "" }),
}));
