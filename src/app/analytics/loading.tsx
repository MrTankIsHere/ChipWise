import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="pt-28 px-6 pb-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                    ))
                }
            </div>
        </div>
    );
}
