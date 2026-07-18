import AnalyticsCharts from "@/components/analyticsCharts";

async function getData() {
    const res = await fetch("http://localhost:3000/api/processors", { cache: "no-store" });
    return res.json();
}

export default async function AnalyticsPage() {
    const processors = await getData();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
            <AnalyticsCharts data={processors} />
        </div>
    );
}
