"use client";
import { useEffect, useState } from "react";
import { useWizardStore } from "@/lib/store/wizardStore";
import { rankLaptops } from "@/lib/recommend";
import { Card } from "@/components/ui/card";

export default function ResultsPage() {
    const wizard = useWizardStore();
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
        const [lRes, pRes] = await Promise.all([fetch("/api/laptops"), fetch("/api/processors")]);
        const laptops = await lRes.json();
        const processors = await pRes.json();
        const procMap = Object.fromEntries(processors.map((p: any) => [p.processorId, p]));
        const joined = laptops.map((l: any) => ({ ...l, processor: procMap[l.processorId] })).filter((l: any) => l.processor);
        setResults(rankLaptops(joined, wizard));
        })();
    }, []);

    if (results.length === 0) {
        return <div className="p-6">
                    No matching laptops found — try increasing your budget.
                </div>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold mb-4">Top Recommendations</h1>
            {results.map((r) => (
                <Card key={r.laptop.laptopId} className="p-4">
                <h3 className="font-semibold">{r.laptop.brand} {r.laptop.modelName}</h3>
                <p className="text-sm text-muted-foreground">Rs {r.laptop.priceINR?.toLocaleString()} — {r.laptop.processor.model}</p>
                <p className="text-sm mt-2">Why: {r.explanation || "Balanced overall fit for your priorities."}</p>
                </Card>
            ))}
        </div>
    );
}
