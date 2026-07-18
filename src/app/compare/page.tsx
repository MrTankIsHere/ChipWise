import ScoreRadar from "@/components/scoreRadar";
import { computeScores } from "@/lib/utils/score";

async function getProcessor(id: string) {
    const res = await fetch(`/api/processors/${id}`, { cache: "no-store" });
    return res.ok ? res.json() : null;
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {

    const { ids } = await searchParams;
    const idList = ids?.split(",") ?? [];
    const processors = (await Promise.all(idList.map(getProcessor))).filter(Boolean);

    if (processors.length < 2) return <div className="p-6">Select at least 2 processors to compare.</div>;

    return (
        <div className="p-6">
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
