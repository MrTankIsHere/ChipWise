import ScoreRadar from "@/components/scoreRadar";
import { computeScores } from "@/lib/utils/score";
import { connectDB } from "@/lib/db/db";
import Processor from "@/lib/models/processor.model";

async function getProcessor(id: string) {
    await connectDB();
    const p = await Processor.findOne({ processorId: id }).lean();
    return p ? JSON.parse(JSON.stringify(p)) : null;
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {

    const { ids } = await searchParams;
    const idList = ids?.split(",") ?? [];
    const processors = (await Promise.all(idList.map(getProcessor))).filter(Boolean);

    if (processors.length < 2) return <div className="p-6">Select at least 2 processors to compare.</div>;

    return (
        <div className="pt-28 px-6 pb-6">
            <h1 className="text-2xl font-bold mb-4">Comparison</h1>
            <div className="overflow-x-auto mb-8">
                <table className="text-sm border w-full">
                <tbody>
                    {["model","brand","series","launch","coresThreads","basePower","maxPower","npu","npuTops","igpu","gpuCompatibility","priceRangeINR"].map((key) => (
                    <tr key={key} className="border-b">
                        <td className="p-2 font-semibold capitalize">{key}</td>
                        {processors.map((p: any) => <td key={p.processorId} className="p-2">{p[key]}</td>)}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {processors.map((p: any) => {
                const s = computeScores(p);
                const chartData = [
                    { subject: "Gaming", value: s.gaming }, { subject: "Battery", value: s.battery },
                    { subject: "Programming", value: s.programming }, { subject: "Creator", value: s.creator },
                    { subject: "Linux", value: s.linux }, { subject: "Future-Proof", value: s.futureProof },
                ];
                return (
                    <div key={p.processorId}>
                    <h3 className="font-semibold mb-2">{p.model}</h3>
                    <ScoreRadar chartData={chartData} />
                    </div>
                );
                })}
            </div>
        </div>
    );
}
