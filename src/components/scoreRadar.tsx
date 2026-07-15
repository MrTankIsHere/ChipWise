"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

export default function ScoreRadar({ chartData }: { chartData: { subject: string; value: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
            </RadarChart>
        </ResponsiveContainer>
    );
}
