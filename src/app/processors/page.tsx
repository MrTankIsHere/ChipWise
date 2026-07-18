import ProcessorTable from "@/components/processorTable";
import ProcessorFilters from "@/components/processorFilters";
import { parsePriceRange, parseNpuTops } from "@/lib/utils/parse";
import ComparisonPicker from "@/components/comparisonPicker";
import { connectDB } from "@/lib/db/db";
import Processor from "@/lib/models/processor.model";

async function getProcessors() {
    await connectDB();
    const processors = await Processor.find({}).lean();
    return JSON.parse(JSON.stringify(processors));
}

export default async function ProcessorsPage() {
    const processors = await getProcessors();
    const priceRanges = processors.map((p: any) => parsePriceRange(p.priceRangeINR));
    const npuVals = processors.map((p: any) => parseNpuTops(p.npuTops));

    const priceBounds: [number, number] = [Math.min(...priceRanges.map((r: number[]) => r[0])), Math.max(...priceRanges.map((r: number[]) => r[1]))];
    const npuBounds: [number, number] = [Math.min(...npuVals), Math.max(...npuVals)];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Processor Explorer</h1>
            <ProcessorFilters processors={processors} priceBounds={priceBounds} npuBounds={npuBounds} />
            <ComparisonPicker processors={processors} />
            <ProcessorTable data={processors} />
        </div>
    );
}
