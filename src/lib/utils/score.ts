import { parseNpuTops } from "./parse";

// Rough, temporary heuristic scores (0-10) — refined properly in Goal 9
export function computeScores(p: any) {
    const maxW = parseInt(p.maxPower) || 0;
    const npu = parseNpuTops(p.npuTops);
    const isHX = p.gpuCompatibility?.includes("High-end");
    const isH = p.gpuCompatibility?.includes("Mid dGPU");

    return {
            gaming: isHX ? 9 : isH ? 6.5 : 3,
            battery: maxW > 0 ? Math.max(1, 10 - maxW / 20) : 5,
            programming: 7, // placeholder — most modern chips are fine for this
            creator: npu > 0 ? Math.min(10, 5 + npu / 10) : 4,
            linux: p.brand === "Intel" ? 8 : 7, // rough placeholder
            futureProof: npu >= 40 ? 9 : npu > 0 ? 6 : 4,
    };
}
