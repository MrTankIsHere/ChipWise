"use client";
import { useWizardStore } from "@/lib/store/wizardStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Slider({ label, field }: { label: string; field: keyof ReturnType<typeof useWizardStore.getState> }) {
    const value = useWizardStore((s) => s[field] as number);
    const set = useWizardStore((s) => s.set);
    return (
        <div className="mb-4">
            <label className="block text-sm mb-1">{label}: {value}/5</label>
            <input type="range" min={0} max={5} value={value}
                onChange={(e) => set({ [field]: Number(e.target.value) } as any)} className="w-full" />
        </div>
    );
}

export default function WizardPage() {
    const { budget, linuxNeeded, set } = useWizardStore();
    const router = useRouter();

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Recommendation Wizard</h1>

            <div className="mb-4">
                <label className="block text-sm mb-1">Budget (INR): {budget.toLocaleString()}</label>
                <input type="range" min={30000} max={300000} step={5000} value={budget}
                onChange={(e) => set({ budget: Number(e.target.value) })} className="w-full" />
            </div>

            <Slider label="Gaming priority" field="gaming" />
            <Slider label="Programming priority" field="programming" />
            <Slider label="AI/ML priority" field="aiml" />
            <Slider label="Editing/Creator priority" field="editing" />
            <Slider label="Office work priority" field="office" />
            <Slider label="Battery life priority" field="batteryPriority" />
            <Slider label="Portability priority (lighter/thinner)" field="portability" />
            <Slider label="Years you plan to use it" field="yearsOfUsage" />

            <label className="flex items-center gap-2 mb-6">
                <input type="checkbox" checked={linuxNeeded} onChange={(e) => set({ linuxNeeded: e.target.checked })} />
                <span className="text-sm">I need good Linux compatibility</span>
            </label>

            <Button onClick={() => router.push("/wizard/results")}>Get Recommendations</Button>
        </div>
    );
}
