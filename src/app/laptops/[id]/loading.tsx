import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="pt-28 px-6 pb-12 max-w-3xl mx-auto">
            <Skeleton className="h-9 w-72 mb-2" />
            <Skeleton className="h-4 w-40 mb-8" />

            <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {
                        Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
