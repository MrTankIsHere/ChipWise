import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="pt-28 px-6 pb-12">
            <Skeleton className="h-9 w-56 mb-6" />
            <div className="bg-card border border-border rounded-2xl p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-14 w-40" />
                    <Skeleton className="h-14 w-44" />
                    <Skeleton className="h-14 w-64" />
                    <Skeleton className="h-14 w-48" />
                </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
                {
                    Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full mb-2" />
                    ))
                }
            </div>
        </div>
    );
}
