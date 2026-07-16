import { parseNpuTops, parseCoresThreads } from "./parse";

function clamp(n: number, min = 0, max = 10) {
    return Math.max(min, Math.min(max, n));
}

function gpuTierScore(p: any) {
    if (p.gpuCompatibility?.includes("High-end")) return 9;
    if (p.gpuCompatibility?.includes("Mid dGPU")) return 6;
    return 3;
}

function recencyScore(p: any) {
    const year = parseInt(p.launch?.match(/\d{4}/)?.[0]) || 2022;
    return clamp((year - 2021) * 1.6);
}

export function computeScores(p: any) {
    const maxW = parseInt(p.maxPower) || 0;
    const npu = parseNpuTops(p.npuTops);
    const { threads } = parseCoresThreads(p.coresThreads);
    const tier = gpuTierScore(p);

    const battery = maxW > 0 ? clamp(10 - maxW / 20) : 5;
    const programming = threads > 0 ? clamp((threads - 4) / 2) : clamp(tier);
    const creator = clamp(programming * 0.5 + tier * 0.3 + (npu > 0 ? npu / 10 : 0) * 0.2 * 10);
    const futureProof = clamp((npu > 0 ? clamp(npu / 6) : 3) * 0.5 + recencyScore(p) * 0.5);

    return { gaming: tier, battery, programming, creator, linux: p.brand === "Intel" ? 8 : 7, futureProof };
}
