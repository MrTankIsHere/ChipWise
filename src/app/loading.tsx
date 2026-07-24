import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div>
            <div className="w-full h-screen bg-background flex items-center justify-center">
                <Skeleton className="h-8 w-64" />
            </div>
            <div className="max-w-5xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {
                        Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
