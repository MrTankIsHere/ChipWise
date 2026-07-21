import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="pt-28 px-6 pb-6 max-w-2xl mx-auto">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40 mb-4" />
            <div className="grid grid-cols-2 gap-2 mb-6">
                {
                    Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-5 w-full" />
                    ))
                }
            </div>
            <Skeleton className="h-64 w-full" />
        </div>
    );
}
