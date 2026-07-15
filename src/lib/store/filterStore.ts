import { create } from "zustand";

type FilterState = {
    brand: string; series: string;
    priceMin: number; priceMax: number;
    npuMin: number; npuMax: number;
    setBrand: (v: string) => void;
    setSeries: (v: string) => void;
    setPriceRange: (min: number, max: number) => void;
    setNpuRange: (min: number, max: number) => void;
    reset: (d: { priceMin: number; priceMax: number; npuMin: number; npuMax: number }) => void;
};

export const useFilterStore = create<FilterState>((set) => ({
    brand: "", series: "", priceMin: 0, priceMax: 0, npuMin: 0, npuMax: 0,
    setBrand: (v) => set({ brand: v, series: "" }), // series always resets when brand changes
    setSeries: (v) => set({ series: v }),
    setPriceRange: (min, max) => set({ priceMin: min, priceMax: max }),
    setNpuRange: (min, max) => set({ npuMin: min, npuMax: max }),
    reset: (d) => set({ brand: "", series: "", ...d }),
}));
