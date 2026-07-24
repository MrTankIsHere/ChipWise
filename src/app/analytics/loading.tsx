import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="pt-28 px-6 pb-12">
            <Skeleton className="h-9 w-40 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-6">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <Skeleton className="h-56 w-full" />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
