"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Processor = { processorId: string; model: string; brand: string };

export default function ComparisonPicker({ processors }: { processors: Processor[] }) {
    const router = useRouter();
    const [slots, setSlots] = useState<{ brand: string; processorId: string }[]>([
        { brand: "", processorId: "" },
        { brand: "", processorId: "" },
        { brand: "", processorId: "" },
        { brand: "", processorId: "" },
    ]);

    const brands = useMemo(() => [...new Set(processors.map((p) => p.brand))], [processors]);

    function modelsForBrand(brand: string) {
        if (!brand) return [];
        return processors.filter((p) => p.brand === brand);
    }

    function updateSlotBrand(index: number, brand: string) {
        setSlots( (prev) => {
            const next = [...prev];
            next[index] = { brand, processorId: "" }; // reset model pick when brand changes
            return next;
        });
    }

    function updateSlotModel(index: number, processorId: string) {
        setSlots( (prev) => {
            const next = [...prev];
            next[index] = { ...next[index], processorId };
            return next;
        });
    }

    const selectedIds = slots.map((s) => s.processorId).filter(Boolean);

    return (
        <div className="bg-card border border-border rounded-2xl p-4 mb-6">
            <div className="text-sm font-medium mb-3">Pick up to 4 processors to compare</div>
            <div className="flex flex-wrap items-end gap-3">
                {
                    slots.map((slot, i) => (
                        <div key={i} className="flex flex-col gap-2 w-40">

                            <Select value={slot.brand} onValueChange={(v) => updateSlotBrand(i, v ?? "")}>
                                <SelectTrigger className="rounded-full text-xs h-9">
                                    <SelectValue placeholder={`Brand ${i + 1}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Select value={slot.processorId} onValueChange={(v) => updateSlotModel(i, v ?? "")} disabled={!slot.brand}>
                                <SelectTrigger className="rounded-full text-xs h-9">
                                    <SelectValue placeholder="Select model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modelsForBrand(slot.brand).map((p) => (
                                    <SelectItem key={p.processorId} value={p.processorId}>{p.model}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                        </div>
                    ))
                }

                <Button disabled={selectedIds.length < 2} onClick={() => router.push(`/compare?ids=${selectedIds.join(",")}`)}>
                    Compare ({selectedIds.length})
                </Button>
            </div>
        </div>
    );
}
