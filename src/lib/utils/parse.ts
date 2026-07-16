export function parsePriceRange(str: string): [number, number] {
    if (!str) return [0, 0];
    const nums = str.match(/[\d,]+/g)?.map((n) => parseInt(n.replace(/,/g, ""), 10)) ?? [];
    if (nums.length === 0) return [0, 0];
    if (nums.length === 1) return [nums[0], nums[0]];
    return [nums[0], nums[1]];
}

export function parseNpuTops(str: string): number {
    if (!str || str === "-") return 0;
    const n = parseInt(str, 10);
    return isNaN(n) ? 0 : n;
}

export function parseCoresThreads(str: string): { cores: number; threads: number } {
    if (!str || str === "N/A") return { cores: 0, threads: 0 };
    const threadMatch = str.match(/(\d+)\s*T\)?/i) || str.match(/\/(\d+)T/i);
    const coreMatch = str.match(/(\d+)\s*C/i) || str.match(/^(\d+)/);
    const cores = coreMatch ? parseInt(coreMatch[1]) : 0;
    const threads = threadMatch ? parseInt(threadMatch[1]) : cores; // fallback: assume no SMT
    return { cores, threads };
}
