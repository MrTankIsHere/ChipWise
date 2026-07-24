"use client";
import { useWizardStore } from "@/lib/store/wizardStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Slider({ label, field }: { label: string; field: keyof ReturnType<typeof useWizardStore.getState> }) {
    const value = useWizardStore((s) => s[field] as number);
    const set = useWizardStore((s) => s.set);
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">{label}</label>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{value}/5</span>
            </div>
            <input type="range" min={0} max={5} value={value}
                onChange={(e) => set({ [field]: Number(e.target.value) } as any)} className="w-full" />
        </div>
    );
}

export default function WizardPage() {
    const { budget, linuxNeeded, set } = useWizardStore();
    const router = useRouter();

    return (
        <div className="pt-28 px-6 pb-12 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Recommendation Wizard</h1>
            <p className="text-muted-foreground mb-8">Answer a few questions, get real laptop matches.</p>

            <div className="bg-card border border-border rounded-2xl p-6">

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Budget (INR)</label>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{budget.toLocaleString()}</span>
                    </div>
                    <input type="range" min={30000} max={300000} step={5000} value={budget}
                        onChange={(e) => set({ budget: Number(e.target.value) })} className="w-full" />
                </div>

                <Slider label="Gaming priority" field="gaming" />
                <Slider label="Programming priority" field="programming" />
                <Slider label="AI/ML priority" field="aiml" />
                <Slider label="Editing/Creator priority" field="editing" />
                <Slider label="Office work priority" field="office" />
                <Slider label="Battery life priority" field="batteryPriority" />
                <Slider label="Portability priority" field="portability" />
                <Slider label="Years you plan to use it" field="yearsOfUsage" />

                <label className="flex items-center gap-2 mb-2 mt-2">
                    <input type="checkbox" checked={linuxNeeded} onChange={(e) => set({ linuxNeeded: e.target.checked })}
                        className="h-4 w-4 rounded border-input accent-primary" />
                    <span className="text-sm">I need good Linux compatibility</span>
                </label>

                <Button className="w-full mt-4" onClick={() => router.push("/wizard/results")}>
                    Get My Recommendations
                </Button>
            </div>
        </div>
    );
}
