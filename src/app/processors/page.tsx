import ProcessorTable from "@/components/processorTable";
import ProcessorFilters from "@/components/processorFilters";
import { parsePriceRange, parseNpuTops } from "@/lib/utils/parse";
import ComparisonPicker from "@/components/comparisonPicker";

async function getProcessors() {
    const res = await fetch("/api/processors", { cache: "no-store" });
    return res.json();
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
