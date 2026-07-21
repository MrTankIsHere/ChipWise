import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div>
            {/* placeholder matching the video hero's height, so the page doesn't jump when real content loads in */}
            <div className="w-full h-screen bg-black flex items-center justify-center">
                <Skeleton className="h-8 w-64 bg-white/10" />
            </div>

            <div className="max-w-4xl mx-auto p-6">
                <div className="grid grid-cols-3 gap-4 my-16">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>

                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {
                        Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
