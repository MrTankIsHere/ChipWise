"use client";
import { useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
    PieChart, Pie, Cell,
} from "recharts";

// theme-aware tooltip, uses CSS variables so it adapts to light/dark automatically
const tooltipStyle = {
    backgroundColor: "var(--popover)",
    color: "var(--popover-foreground)",
    border: "1px solid var(--border)",
    borderRadius: 10,
};

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="rounded-lg border px-3 py-2 text-sm shadow-sm"
            style={{ background: "var(--popover)", borderColor: "var(--border)" }} >
            {
                label && <div className="font-medium mb-1" style={{ color: "var(--popover-foreground)" }}>{label}</div>
            }
            {
                payload.map((entry: any, i: number) => (
                    <div key={i} style={{ color: "var(--popover-foreground)" }}>
                        {entry.name}: {entry.value}
                    </div>
                ))
            }
        </div>
    );
}

// categorical colors built from the palette, not an arbitrary rainbow
// Signal Red is reserved for exactly one highlighted slice (the largest), everything
// else uses tints of Steel Blue / Powder Teal, matching the "red is a sparing accent" rule
const FAMILY_COLORS = [
    "var(--accent)",
    "var(--primary)",
    "var(--secondary)",
    "color-mix(in oklch, var(--primary) 70%, transparent)",
    "color-mix(in oklch, var(--secondary) 70%, transparent)",
    "var(--foreground)",
    "color-mix(in oklch, var(--primary) 45%, transparent)",
    "color-mix(in oklch, var(--secondary) 45%, transparent)",
];

export default function AnalyticsCharts({ data }: { data: any[] }) {
    const [selectedFamily, setSelectedFamily] = useState("");

    const brandCounts: Record<string, number> = {};
    for (let i = 0; i < data.length; i++) {
        const brand = data[i].brand;
        if (!brandCounts[brand]) brandCounts[brand] = 0;
        brandCounts[brand] = brandCounts[brand] + 1;
    }

    const brandData = [];
    for (const brand in brandCounts) {
        brandData.push({ brand: brand, count: brandCounts[brand] });
    }

    const familyCounts: Record<string, number> = {};
    for (let i = 0; i < data.length; i++) {
        const family = data[i].family;
        if (!familyCounts[family]) familyCounts[family] = 0;
        familyCounts[family] = familyCounts[family] + 1;
    }
    let familyData = [];
    for (const family in familyCounts) {
        familyData.push({ family: family, count: familyCounts[family] });
    }
    familyData.sort((a, b) => b.count - a.count);
    familyData = familyData.slice(0, 8);

    let withNpu = 0;
    let withoutNpu = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].npu === "Yes") withNpu = withNpu + 1;
        else withoutNpu = withoutNpu + 1;
    }
    const npuData = [
        { name: "Has NPU", value: withNpu },
        { name: "No NPU", value: withoutNpu },
    ];

    const yearTotals: Record<string, number> = {};
    const yearCounts: Record<string, number> = {};
    for (let i = 0; i < data.length; i++) {
        const yearMatch = (data[i].launch || "").match(/\d{4}/);
        const tops = parseInt(data[i].npuTops);
        if (yearMatch && !isNaN(tops)) {
            const year = yearMatch[0];
            if (!yearTotals[year]) { yearTotals[year] = 0; yearCounts[year] = 0; }
            yearTotals[year] = yearTotals[year] + tops;
            yearCounts[year] = yearCounts[year] + 1;
        }
    }
    const yearData = [];
    for (const year in yearTotals) {
        yearData.push({ year: year, avgTops: Math.round(yearTotals[year] / yearCounts[year]) });
    }
    yearData.sort((a, b) => a.year.localeCompare(b.year));

    const clickedFamily = familyData.find((f) => f.family === selectedFamily);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Processors by Brand</h3>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={brandData}>
                        <XAxis dataKey="brand" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
                        <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Top 8 Families (click a slice)</h3>
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Pie
                        data={familyData}
                        dataKey="count"
                        nameKey="family"
                        cx="50%" cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        onClick={(entry: any) => setSelectedFamily(entry.family)} >
                            {
                                familyData.map((entry, i) => (
                                    <Cell
                                        key={i} fill={FAMILY_COLORS[i % FAMILY_COLORS.length]}
                                        stroke={entry.family === selectedFamily ? "var(--foreground)" : "var(--card)"}
                                        strokeWidth={entry.family === selectedFamily ? 3 : 1} />
                                ))
                            }
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="text-center text-sm mt-2 border border-border rounded-lg p-2 text-muted-foreground">
                    {clickedFamily
                        ? `${clickedFamily.family}: ${clickedFamily.count} processors`
                        : "Click a slice to see details"}
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">NPU vs No-NPU Split</h3>
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie data={npuData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            <Cell fill="var(--primary)" />
                            <Cell fill="var(--muted)" />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Avg NPU TOPS by Launch Year</h3>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={yearData}>
                        <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
                        <Bar dataKey="avgTops" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}
