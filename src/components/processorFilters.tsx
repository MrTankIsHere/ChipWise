"use client";

import { useMemo, useEffect } from "react";
import { useFilterStore } from "@/lib/store/filterStore";
import { Button } from "@/components/ui/button";

type Props = {
    processors: { brand: string; series: string }[];
    priceBounds: [number, number];
    npuBounds: [number, number];
};

export default function ProcessorFilters({ processors, priceBounds, npuBounds }: Props) {
    const { brand, series, priceMin, priceMax, npuMin, npuMax,
        setBrand, setSeries, setPriceRange, setNpuRange, reset } = useFilterStore();

    const brands = useMemo(() => [...new Set(processors.map((p) => p.brand))], [processors]);

    // Series list depends on currently selected brand
    const seriesList = useMemo(() => {
        const scoped = brand ? processors.filter((p) => p.brand === brand) : processors;
        return [...new Set(scoped.map((p) => p.series))];
    }, [processors, brand]);

    // Set initial range values to full dataset bounds, once
    useEffect(() => {
        if (priceMin === 0 && priceMax === 0) setPriceRange(priceBounds[0], priceBounds[1]);
        if (npuMin === 0 && npuMax === 0) setNpuRange(npuBounds[0], npuBounds[1]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-wrap gap-4 mb-4 items-end">
            <div>
                <label className="block text-xs mb-1">Brand</label>
                <select value={brand} onChange={(e) => setBrand(e.target.value)} className="border rounded px-2 py-1 text-sm">
                <option value="">All Brands</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs mb-1">Series</label>
                <select value={series} onChange={(e) => setSeries(e.target.value)} className="border rounded px-2 py-1 text-sm">
                <option value="">All Series</option>
                {seriesList.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs mb-1">Price (INR): {priceMin.toLocaleString()} - {priceMax.toLocaleString()}</label>
                <div className="flex gap-2">
                <input type="number" value={priceMin} onChange={(e) => setPriceRange(Number(e.target.value), priceMax)} className="border rounded px-2 py-1 text-sm w-28" />
                <input type="number" value={priceMax} onChange={(e) => setPriceRange(priceMin, Number(e.target.value))} className="border rounded px-2 py-1 text-sm w-28" />
                </div>
            </div>

            <div>
                <label className="block text-xs mb-1">NPU TOPS: {npuMin} - {npuMax}</label>
                <div className="flex gap-2">
                <input type="number" value={npuMin} onChange={(e) => setNpuRange(Number(e.target.value), npuMax)} className="border rounded px-2 py-1 text-sm w-20" />
                <input type="number" value={npuMax} onChange={(e) => setNpuRange(npuMin, Number(e.target.value))} className="border rounded px-2 py-1 text-sm w-20" />
                </div>
            </div>

            <Button variant="outline" size="sm"
                onClick={() => reset({ priceMin: priceBounds[0], priceMax: priceBounds[1], npuMin: npuBounds[0], npuMax: npuBounds[1] })}>
                Reset
            </Button>
        </div>
    );
}
