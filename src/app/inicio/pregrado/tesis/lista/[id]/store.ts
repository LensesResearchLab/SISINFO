import { create } from 'zustand';

interface ThesisInscriptionState {
    isApplying: boolean;
    motivation: string;
    contacted: boolean;

    setIsApplying: (isApplying: boolean) => void;
    setMotivation: (motivation: string) => void;
    setContacted: (contacted: boolean) => void;
    reset(): void;
}

export const useThesisInscriptionStore = create<ThesisInscriptionState>((set) => ({
    isApplying: false,
    motivation: "",
    contacted: false,

    setIsApplying: (isApplying: boolean) => set({ isApplying }),
    setMotivation: (motivation: string) => set({ motivation }),
    setContacted: (contacted: boolean) => set({ contacted }),
    reset: () => set({ isApplying: false, motivation: "", contacted: false }),
}));
