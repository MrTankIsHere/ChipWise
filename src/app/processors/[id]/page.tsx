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
    if (!p) return <div className="pt-28 px-6 pb-6">Processor not found.</div>;

    const scores = computeScores(p);
    const chartData = [
        { subject: "Gaming", value: scores.gaming },
        { subject: "Battery", value: scores.battery },
        { subject: "Programming", value: scores.programming },
        { subject: "Creator", value: scores.creator },
        { subject: "Linux", value: scores.linux },
        { subject: "Future-Proof", value: scores.futureProof },
    ];

    const specs = [
        { label: "Series", value: p.series },
        { label: "Launch", value: p.launch },
        { label: "Cores/Threads", value: p.coresThreads },
        { label: "Power", value: `${p.basePower} / ${p.maxPower}` },
        { label: "NPU", value: `${p.npu} (${p.npuTops} TOPS)` },
        { label: "iGPU", value: p.igpu },
        { label: "GPU Pairing", value: p.gpuCompatibility },
        { label: "Price", value: p.priceRangeINR },
    ];

    return (
        <div className="pt-28 px-6 pb-12 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{p.model}</h1>
                <p className="text-muted-foreground mt-1">{p.brand} — {p.family}</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {specs.map((s) => (
                        <div key={s.label} className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</span>
                            <span className="text-sm font-medium mt-0.5">{s.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Score Breakdown</h2>
                <ScoreRadar chartData={chartData} />
            </div>
        </div>
    );
}
