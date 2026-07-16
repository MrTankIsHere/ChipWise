import { create } from "zustand";

type WizardState = {
    budget: number;
    gaming: number;      // 0-5 priority
    programming: number;
    aiml: number;
    editing: number;
    office: number;
    linuxNeeded: boolean;
    batteryPriority: number;
    set: (partial: Partial<WizardState>) => void;
};

export const useWizardStore = create<WizardState>((set) => ({
    budget: 100000,
    gaming: 2, programming: 2, aiml: 2, editing: 2, office: 2,
    linuxNeeded: false, batteryPriority: 2,
    set: (partial) => set(partial),
}));
