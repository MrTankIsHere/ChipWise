import { computeScores } from "./utils/score";

export function rankLaptops(laptops: any[], wizard: any) {
    return laptops
        .filter((l) => l.priceINR <= wizard.budget * 1.15) // 15% budget flexibility
        .map((l) => {
            const s = computeScores(l.processor);
            const weighted =
                s.gaming * wizard.gaming +
                s.programming * wizard.programming +
                s.creator * wizard.aiml + // AI/ML leans on creator/NPU-adjacent score for now
                s.creator * wizard.editing +
                s.battery * wizard.batteryPriority +
                (wizard.office ? 5 * wizard.office : 0); // office is CPU-agnostic baseline
            const linuxPenalty = wizard.linuxNeeded && s.linux < 7 ? -50 : 0;

            const reasons: string[] = [];
            if (wizard.gaming >= 3 && s.gaming >= 7) reasons.push(`strong Gaming Score (${s.gaming}/10)`);
            if (wizard.programming >= 3 && s.programming >= 7) reasons.push(`strong Programming Score (${s.programming}/10)`);
            if (l.priceINR <= wizard.budget) reasons.push(`fits your ₹${wizard.budget.toLocaleString()} budget`);
            if (wizard.linuxNeeded) reasons.push(s.linux >= 7 ? "good Linux compatibility" : "weaker Linux support — check driver compatibility first");

            return { laptop: l, scores: s, score: weighted + linuxPenalty, explanation: reasons.join("; ") };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}
