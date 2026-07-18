"use client";
import { useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
    PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#a4de6c", "#d0ed57"];

// dark tooltip so text is readable (default is too light)
const tooltipStyle = { backgroundColor: "#1f2937", color: "#fff", border: "none", borderRadius: 6 };

export default function AnalyticsCharts({ data }: { data: any[] }) {
    const [selectedFamily, setSelectedFamily] = useState("");

    // Step 1: count processors per brand
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

    // Step 2: count processors per family, keep top 8
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

    // Step 3: count how many have NPU vs not
    let withNpu = 0;
    let withoutNpu = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].npu === "Yes") {
        withNpu = withNpu + 1;
        } else {
        withoutNpu = withoutNpu + 1;
        }
    }
    const npuData = [
        { name: "Has NPU", value: withNpu },
        { name: "No NPU", value: withoutNpu },
    ];

    // Step 4: average NPU TOPS per launch year
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

    // Which family is currently clicked (for the info box below the pie)
    const clickedFamily = familyData.find((f) => f.family === selectedFamily);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div>
                <h3 className="font-semibold mb-2">Processors by Brand</h3>
                <ResponsiveContainer width="100%" height={220}>
                <BarChart data={brandData}>
                    <XAxis dataKey="brand" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
                </ResponsiveContainer>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Top 8 Families (click a slice)</h3>
                <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                    data={familyData}
                    dataKey="count"
                    nameKey="family"
                    cx="50%" cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    onClick={(entry: any) => setSelectedFamily(entry.family)}
                    >
                    {familyData.map((entry, i) => (
                        <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                        // make the clicked slice pop out visually with a thicker white border
                        stroke={entry.family === selectedFamily ? "#000" : "#fff"}
                        strokeWidth={entry.family === selectedFamily ? 3 : 1}
                        />
                    ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
                </ResponsiveContainer>

                {/* Show clicked family's name here instead of cramming it inside the donut hole */}
                <div className="text-center text-sm mt-2 border rounded p-2">
                {clickedFamily
                    ? clickedFamily.family + ": " + clickedFamily.count + " processors"
                    : "Click a slice to see details"}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2">NPU vs No-NPU Split</h3>
                <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie data={npuData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {npuData.map((entry, i) => (
                        <Cell key={i} fill={i === 0 ? "#00C49F" : "#ccc"} />
                    ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
                </ResponsiveContainer>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Avg NPU TOPS by Launch Year</h3>
                <ResponsiveContainer width="100%" height={220}>
                <BarChart data={yearData}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="avgTops" fill="#ffc658" />
                </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}
