import { connectDB } from "@/lib/db/db";
import Laptop from "@/lib/models/laptop.model";
import Processor from "@/lib/models/processor.model";

export default async function LaptopDetailPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    await connectDB();
    const laptop = await Laptop.findOne({ laptopId: id }).lean();
    if (!laptop) return <div className="p-6">Laptop not found.</div>;
    const processor = await Processor.findOne({ processorId: laptop.processorId }).lean();

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">{laptop.modelName}</h1>
            <p className="text-muted-foreground mb-4">{laptop.brand} — Rs {laptop.priceINR?.toLocaleString()}</p>
            <div className="grid grid-cols-2 gap-2 text-sm mb-6">
                <div><b>RAM:</b> {laptop.ramGB}GB</div>
                <div><b>Storage:</b> {laptop.storageGB}GB</div>
                <div><b>Display:</b> {laptop.displayInch}" @ {laptop.displayRefreshHz}Hz</div>
                <div><b>dGPU:</b> {laptop.dgpu}</div>
                <div><b>Battery:</b> {laptop.batteryWh}Wh</div>
                <div><b>Weight:</b> {laptop.weightKg}kg</div>
            </div>
            {processor && (
                <div>
                    <h2 className="font-semibold mb-2">Processor: {processor.model}</h2>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><b>Series:</b> {processor.series}</div>
                        <div><b>Power:</b> {processor.basePower} / {processor.maxPower}</div>
                        <div><b>NPU:</b> {processor.npu} ({processor.npuTops} TOPS)</div>
                        <div><b>iGPU:</b> {processor.igpu}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
