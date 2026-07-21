import AnalyticsCharts from "@/components/analyticsCharts";
import { connectDB } from "@/lib/db/db";
import Processor from "@/lib/models/processor.model";

async function getData() {
    await connectDB();
    const processors = await Processor.find({}).lean();
    return JSON.parse(JSON.stringify(processors));
}

export default async function AnalyticsPage() {
    const processors = await getData();
    return (
        <div className="pt-28 px-6 pb-6">
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
            <AnalyticsCharts data={processors} />
        </div>
    );
}
