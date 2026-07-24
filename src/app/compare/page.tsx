import ScoreRadar from "@/components/scoreRadar";
import { computeScores } from "@/lib/utils/score";
import { connectDB } from "@/lib/db/db";
import Processor from "@/lib/models/processor.model";

async function getProcessor(id: string) {
    await connectDB();
    const p = await Processor.findOne({ processorId: id }).lean();
    return p ? JSON.parse(JSON.stringify(p)) : null;
}

const rows = [
    { key: "model", label: "Model" },
    { key: "brand", label: "Brand" },
    { key: "series", label: "Series" },
    { key: "launch", label: "Launch" },
    { key: "coresThreads", label: "Cores/Threads" },
    { key: "basePower", label: "Base Power" },
    { key: "maxPower", label: "Max Power" },
    { key: "npu", label: "NPU" },
    { key: "npuTops", label: "NPU TOPS" },
    { key: "igpu", label: "iGPU" },
    { key: "gpuCompatibility", label: "GPU Pairing" },
    { key: "priceRangeINR", label: "Price" },
];

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
    const { ids } = await searchParams;
    const idList = ids?.split(",") ?? [];
    const processors = (await Promise.all(idList.map(getProcessor))).filter(Boolean);

    if (processors.length < 2) {
        return (
            <div className="pt-28 px-6 pb-6">
                <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground max-w-md mx-auto">
                    Select at least 2 processors to compare.
                </div>
            </div>
        );
    }

    return (
        <div className="pt-28 px-6 pb-12">
            <h1 className="text-3xl font-bold mb-6">Comparison</h1>

            <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="text-sm w-full">
                        <tbody>
                            {
                                rows.map((row, i) => (
                                    <tr key={row.key} className={i !== rows.length - 1 ? "border-b border-border" : ""}>
                                        <td className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap bg-muted/40">
                                            {row.label}
                                        </td>
                                        {
                                            processors.map((p: any) => (
                                                <td key={p.processorId} className="p-3 whitespace-nowrap">
                                                    {p[row.key]}
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {
                    processors.map((p: any) => {
                        const s = computeScores(p);
                        const chartData = [
                            { subject: "Gaming", value: s.gaming }, { subject: "Battery", value: s.battery },
                            { subject: "Programming", value: s.programming }, { subject: "Creator", value: s.creator },
                            { subject: "Linux", value: s.linux }, { subject: "Future-Proof", value: s.futureProof },
                        ];
                        return (
                            <div key={p.processorId} className="bg-card border border-border rounded-2xl p-6">
                                <h3 className="font-semibold mb-2">{p.model}</h3>
                                <ScoreRadar chartData={chartData} />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}
