import { create } from 'zustand';

interface ProjectInscriptionState {
    isApplying: boolean;
    motivation: string;
    contacted: boolean;

    setIsApplying: (isApplying: boolean) => void;
    setMotivation: (motivation: string) => void;
    setContacted: (contacted: boolean) => void;
    reset(): void;
}

export const useProjectInscriptionStore = create<ProjectInscriptionState>((set) => ({
    isApplying: false,
    motivation: "",
    contacted: false,

    setIsApplying: (isApplying: boolean) => set({ isApplying }),
    setMotivation: (motivation: string) => set({ motivation }),
    setContacted: (contacted: boolean) => set({ contacted }),
    reset: () => set({ isApplying: false, motivation: "", contacted: false }),
}));
