import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="pt-28 px-6 pb-12">
            <Skeleton className="h-9 w-48 mb-6" />
            <div className="bg-card border border-border rounded-2xl p-4 mb-8">
                {
                    Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-full mb-2" />
                    ))
                }
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="bg-card border border-border rounded-2xl p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    );
}
