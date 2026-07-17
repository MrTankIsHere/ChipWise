import { computeScores } from "./utils/score";

export function rankLaptops(laptops: any[], wizard: any) {
    const results = [];

  // Step 1: go through every laptop one by one
    for (let i = 0; i < laptops.length; i++) {
        const laptop = laptops[i];

        // Step 2: skip laptops that are too expensive (allow 15% over budget)
        const maxAllowedPrice = wizard.budget * 1.15;
        if (laptop.priceINR > maxAllowedPrice) {
        continue; // skip this one, go to next laptop
        }

        // Step 3: get the processor's scores (gaming, programming, etc.)
        const scores = computeScores(laptop.processor);

        // Step 4: add up points based on what the user cares about
        let totalPoints = 0;
        totalPoints = totalPoints + scores.gaming * wizard.gaming;
        totalPoints = totalPoints + scores.programming * wizard.programming;
        totalPoints = totalPoints + scores.creator * wizard.aiml;
        totalPoints = totalPoints + scores.creator * wizard.editing;
        totalPoints = totalPoints + scores.battery * wizard.batteryPriority;

        // Office work doesn't depend much on the processor, give a flat bonus
        if (wizard.office > 0) {
        totalPoints = totalPoints + 5 * wizard.office;
        }

        // Step 5: if user needs Linux and this chip is weak on Linux, reduce points a lot
        if (wizard.linuxNeeded === true && scores.linux < 7) {
            totalPoints = totalPoints - 50;
        }

        // Step 6: build a simple explanation message
        const reasons = [];

        if (wizard.gaming >= 3 && scores.gaming >= 7) {
            reasons.push("strong Gaming Score (" + scores.gaming + "/10)");
        }
        if (wizard.programming >= 3 && scores.programming >= 7) {
            reasons.push("strong Programming Score (" + scores.programming + "/10)");
        }
        if (laptop.priceINR <= wizard.budget) {
            reasons.push("fits your budget of Rs " + wizard.budget.toLocaleString());
        }
        if (wizard.linuxNeeded === true) {
            if (scores.linux >= 7) {
                reasons.push("good Linux compatibility");
            } else {
                reasons.push("weaker Linux support - check driver compatibility first");
            }
        }
        if (wizard.yearsOfUsage >= 3 && scores.futureProof >= 7) {
            reasons.push("future-proof enough to last " + wizard.yearsOfUsage + "+ years");
        }
        if (wizard.portability >= 3 && laptop.weightKg && laptop.weightKg <= 1.8) {
            reasons.push("lightweight (" + laptop.weightKg + "kg) for portability");
        }

        // Portability: lighter laptops score higher if user cares about this
        if (wizard.portability > 0 && laptop.weightKg) {
            const portabilityScore = Math.max(0, 10 - laptop.weightKg * 3); // lighter = higher
            totalPoints = totalPoints + portabilityScore * wizard.portability;
        }

        // Years of usage: if user wants it for many years, future-proof score matters more
        if (wizard.yearsOfUsage >= 3) {
            totalPoints = totalPoints + scores.futureProof * (wizard.yearsOfUsage - 2);
        }

        // Step 7: save this laptop's result
        results.push({
            laptop: laptop,
            scores: scores,
            totalPoints: totalPoints,
            explanation: reasons.join("; "),
        });
    }

    // Step 8: sort so the highest totalPoints comes first
    results.sort(function (a, b) {
        return b.totalPoints - a.totalPoints;
    });

    // Step 9: only return the top 5
    const topFive = results.slice(0, 5);
    return topFive;
}
