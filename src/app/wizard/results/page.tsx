"use client";
import { useEffect, useState } from "react";
import { useWizardStore } from "@/lib/store/wizardStore";
import { rankLaptops } from "@/lib/recommend";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ResultsPage() {
    const wizard = useWizardStore();
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [lRes, pRes] = await Promise.all([fetch("/api/laptops"), fetch("/api/processors")]);
            const laptops = await lRes.json();
            const processors = await pRes.json();
            const procMap = Object.fromEntries(processors.map((p: any) => [p.processorId, p]));
            const joined = laptops.map((l: any) => ({ ...l, processor: procMap[l.processorId] })).filter((l: any) => l.processor);
            setResults(rankLaptops(joined, wizard));
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (
            <div className="pt-28 px-6 pb-12 max-w-2xl mx-auto space-y-4">
                <Skeleton className="h-8 w-64 mb-4" />
                {
                    Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-2">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    ))
                }
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="pt-28 px-6 pb-6">
                <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground max-w-md mx-auto">
                    No matching laptops found, try increasing your budget.
                </div>
            </div>
        );
    }

    return (
        <div className="pt-28 px-6 pb-12 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Top Recommendations</h1>
            <div className="space-y-4">
                {
                    results.map((r, i) => (
                        <Link key={r.laptop.laptopId} href={`/laptops/${r.laptop.laptopId}`}>
                            <Card
                                className={`p-5 hover:border-primary transition-colors cursor-pointer ${
                                    i === 0 ? "border-accent" : ""
                                }`} >
                                {i === 0 && (
                                    <span className="inline-block text-xs font-semibold text-accent-foreground bg-accent px-2.5 py-1 rounded-full mb-3">
                                    Best Match
                                    </span>
                                )}
                                <div className="flex items-baseline justify-between mb-1">
                                    <h3 className="font-semibold">{r.laptop.brand} {r.laptop.modelName}</h3>
                                    <span className="text-sm font-medium">Rs {r.laptop.priceINR?.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{r.laptop.processor.model}</p>
                                <div className="flex gap-2 items-start text-sm">
                                    <span className="text-primary shrink-0">✓</span>
                                    <span className="text-muted-foreground">{r.explanation || "Balanced overall fit for your priorities."}</span>
                                </div>
                            </Card>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}
