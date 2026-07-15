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
