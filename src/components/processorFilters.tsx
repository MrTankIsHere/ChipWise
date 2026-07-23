"use client";

import { useMemo, useEffect } from "react";
import { useFilterStore } from "@/lib/store/filterStore";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
    processors: { brand: string; series: string }[];
    priceBounds: [number, number];
    npuBounds: [number, number];
};

const ALL = "_all"; // Radix Select can't use an empty string as a value, use a sentinel instead

export default function ProcessorFilters({ processors, priceBounds, npuBounds }: Props) {
    const { brand, series, priceMin, priceMax, npuMin, npuMax,
        setBrand, setSeries, setPriceRange, setNpuRange, reset } = useFilterStore();

    const brands = useMemo(() => [...new Set(processors.map((p) => p.brand))], [processors]);

    const seriesList = useMemo(() => {
        const scoped = brand ? processors.filter((p) => p.brand === brand) : processors;
        return [...new Set(scoped.map((p) => p.series))];
    }, [processors, brand]);

    useEffect(() => {
        if (priceMin === 0 && priceMax === 0) setPriceRange(priceBounds[0], priceBounds[1]);
        if (npuMin === 0 && npuMax === 0) setNpuRange(npuBounds[0], npuBounds[1]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const inputClass =
        "border border-input bg-background rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring";
    const labelClass = "block text-xs text-muted-foreground mb-1.5";

    return (
        <div className="bg-card border border-border rounded-2xl p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-end">

                <div>
                    <label className={labelClass}>Brand</label>
                    <Select value={brand || ALL} onValueChange={(v) => setBrand(v === ALL ? "" : (v || ""))}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Brands">
                                {brand === "" ? "All Brands" : brand}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All Brands</SelectItem>
                            {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className={labelClass}>Series</label>
                    <Select value={series || ALL} onValueChange={(v) => setSeries(v === ALL ? "" : (v || ""))}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="All Series">
                                {series === "" ? "All Series" : series}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All Series</SelectItem>
                            {seriesList.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className={labelClass}>Price (INR): {priceMin.toLocaleString()} - {priceMax.toLocaleString()}</label>
                    <div className="flex gap-2">
                        <input type="number" value={priceMin} onChange={(e) => setPriceRange(Number(e.target.value), priceMax)} className={`${inputClass} w-28`} />
                        <input type="number" value={priceMax} onChange={(e) => setPriceRange(priceMin, Number(e.target.value))} className={`${inputClass} w-28`} />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>NPU TOPS: {npuMin} - {npuMax}</label>
                    <div className="flex gap-2">
                        <input type="number" value={npuMin} onChange={(e) => setNpuRange(Number(e.target.value), npuMax)} className={`${inputClass} w-20`} />
                        <input type="number" value={npuMax} onChange={(e) => setNpuRange(npuMin, Number(e.target.value))} className={`${inputClass} w-20`} />
                    </div>
                </div>

                <Button variant="outline" size="sm"
                    onClick={() => reset({ priceMin: priceBounds[0], priceMax: priceBounds[1], npuMin: npuBounds[0], npuMax: npuBounds[1] })} >
                        Reset
                </Button>
            </div>
        </div>
    );
}
