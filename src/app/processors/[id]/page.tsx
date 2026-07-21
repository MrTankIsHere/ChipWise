import ScoreRadar from "@/components/scoreRadar";
import { computeScores } from "@/lib/utils/score";
import { connectDB } from "@/lib/db/db";
import Processor from "@/lib/models/processor.model";

async function getProcessor(id: string) {
    await connectDB();
    const processor = await Processor.findOne({ processorId: id }).lean();
    if (!processor) return null;
    return JSON.parse(JSON.stringify(processor));
}

export default async function ProcessorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const p = await getProcessor(id);
    if (!p) return <div className="p-6">Processor not found.</div>;

    const scores = computeScores(p);
    const chartData = [
        { subject: "Gaming", value: scores.gaming },
        { subject: "Battery", value: scores.battery },
        { subject: "Programming", value: scores.programming },
        { subject: "Creator", value: scores.creator },
        { subject: "Linux", value: scores.linux },
        { subject: "Future-Proof", value: scores.futureProof },
    ];

    return (
        <div className="pt-28 px-6 pb-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">{p.model}</h1>
            <p className="text-muted-foreground mb-4">{p.brand} — {p.family}</p>

            <div className="grid grid-cols-2 gap-2 text-sm mb-6">
                <div><b>Series:</b> {p.series}</div>
                <div><b>Launch:</b> {p.launch}</div>
                <div><b>Cores/Threads:</b> {p.coresThreads}</div>
                <div><b>Power:</b> {p.basePower} / {p.maxPower}</div>
                <div><b>NPU:</b> {p.npu} ({p.npuTops} TOPS)</div>
                <div><b>iGPU:</b> {p.igpu}</div>
                <div><b>GPU Pairing:</b> {p.gpuCompatibility}</div>
                <div><b>Price:</b> {p.priceRangeINR}</div>
            </div>

            <ScoreRadar chartData={chartData} />
        </div>
    );
}
