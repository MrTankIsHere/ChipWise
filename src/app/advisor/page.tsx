"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdvisorPage() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
    const [loading, setLoading] = useState(false);

    async function askQuestion() {
        if (!question.trim()) return;
        const userMsg = { role: "user", text: question };
        setMessages((m) => [...m, userMsg]);
        setLoading(true);
        setQuestion("");

        const res = await fetch("/api/advisor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userMsg.text }),
        });
        const data = await res.json();

        setMessages((m) => [...m, { role: "ai", text: data.answer }]);
        setLoading(false);
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">AI Advisor</h1>

            <div className="space-y-3 mb-4">
                {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                    <div className="inline-block bg-muted rounded p-2 text-sm max-w-[80%]">{m.text}</div>
                </div>
                ))}

                {loading && (
                    <div className="text-left">
                        <div className="inline-block bg-muted rounded p-2 max-w-[80%] space-y-1">
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                placeholder="e.g. best laptop under 80k for editing"
                className="border rounded px-2 py-1 flex-1 text-sm text-black"
                />
                <Button onClick={askQuestion}>Ask</Button>
            </div>
        </div>
    );
}
