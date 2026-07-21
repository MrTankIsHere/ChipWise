"use client";
import { useEffect, useState } from "react";
import { useWizardStore } from "@/lib/store/wizardStore";
import { rankLaptops } from "@/lib/recommend";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsPage() {
    const wizard = useWizardStore();
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // start true, we ARE loading on first render

    useEffect(() => {
        (async () => {
        const [lRes, pRes] = await Promise.all([fetch("/api/laptops"), fetch("/api/processors")]);
        const laptops = await lRes.json();
        const processors = await pRes.json();
        const procMap = Object.fromEntries(processors.map((p: any) => [p.processorId, p]));
        const joined = laptops.map((l: any) => ({ ...l, processor: procMap[l.processorId] })).filter((l: any) => l.processor);
        setResults(rankLaptops(joined, wizard));
        setLoading(false); // done loading now
        })();
    }, []);

    // Show skeleton cards while fetching
    if (loading) {
        return (
            <div className="p-6 max-w-2xl mx-auto space-y-4">
                <Skeleton className="h-8 w-64 mb-4" />
                {
                    Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i} className="p-4 space-y-2">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                        </Card>
                    ))
                }
            </div>
        );
    }

    if (results.length === 0) return <div className="p-6">No matching laptops found — try increasing your budget.</div>;

    return (
        <div className="pt-28 px-6 pb-6 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold mb-4">Top Recommendations</h1>
            {
                results.map((r) => (
                    <Card key={r.laptop.laptopId} className="p-4">
                        <h3 className="font-semibold">{r.laptop.brand} {r.laptop.modelName}</h3>
                        <p className="text-sm text-muted-foreground">Rs {r.laptop.priceINR?.toLocaleString()} — {r.laptop.processor.model}</p>
                        <p className="text-sm mt-2">Why: {r.explanation || "Balanced overall fit for your priorities."}</p>
                    </Card>
                ))
            }
        </div>
    );
}
