"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

export default function ScoreRadar({ chartData }: { chartData: { subject: string; value: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={chartData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <Radar dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} />
            </RadarChart>
        </ResponsiveContainer>
    );
}
