"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ComparisonPicker({ processors }: { processors: { processorId: string; model: string }[] }) {

    const [selected, setSelected] = useState<string[]>([]);
    const router = useRouter();

    function toggle(id: string) {
        setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : s.length < 4 ? [...s, id] : s);
    }

    return (
        <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
                {processors.map((p) => (
                <button key={p.processorId} onClick={() => toggle(p.processorId)}
                    className={`text-xs border rounded px-2 py-1 ${selected.includes(p.processorId) ? "bg-primary text-primary-foreground" : ""}`}>
                    {p.model}
                </button>
                ))}
            </div>
            <Button size="sm" disabled={selected.length < 2}
                onClick={() => router.push(`/compare?ids=${selected.join(",")}`)}>
                Compare Selected ({selected.length})
            </Button>
        </div>
    );
}
