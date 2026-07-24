"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdvisorPage() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

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
        <div className="pt-28 px-6 pb-6 max-w-xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
            <h1 className="text-2xl font-bold mb-4">AI Advisor</h1>

            <div className="flex-1 overflow-y-auto bg-card border border-border rounded-2xl p-4 mb-4 space-y-3">
                {messages.length === 0 && !loading && (
                    <p className="text-sm text-muted-foreground text-center mt-8">
                        Ask something like "best laptop under 80k for editing"
                    </p>
                )}

                {messages.map((m, i) => (
                    <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                        <div
                            className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] ${
                                m.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-br-sm"
                                    : "bg-muted text-foreground rounded-bl-sm"
                            }`}
                        >
                            {m.text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 space-y-1.5">
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <div className="flex gap-4 items-center">
                <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                    placeholder="e.g. best laptop under 80k for editing"
                    className="border border-input bg-background rounded-full px-4 py-2.5 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button onClick={askQuestion} className="rounded-full px-6">Ask</Button>
            </div>
        </div>
    );
}
