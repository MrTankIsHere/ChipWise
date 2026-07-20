"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

interface ScrollVideoHeroProps {
    children?: React.ReactNode;
}

export default function ScrollVideoHero({ children }: ScrollVideoHeroProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const tickingRef = useRef(false);

    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        function updateVideoFrame() {
            if (!video || !container) return;
            const rect = container.getBoundingClientRect();
            // This now dynamically calculates based on true content height
            const totalScrollDistance = container.offsetHeight - window.innerHeight;
            const scrolled = -rect.top;
            let progress = scrolled / totalScrollDistance;
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            if (video.duration && !isNaN(video.duration)) {
                video.currentTime = progress * video.duration;
            }
            tickingRef.current = false;
        }

        function handleScroll() {
            if (!tickingRef.current) {
                tickingRef.current = true;
                requestAnimationFrame(updateVideoFrame);
            }
        }

        window.addEventListener("scroll", handleScroll);
        updateVideoFrame();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        // Changed to a CSS Grid container with a minimum height.
        // If mobile content gets taller than 250vh, the container will automatically stretch to fit it!
        <div ref={containerRef} className="grid w-full min-h-[250vh]">

            {/* 1. STICKY VIDEO BACKGROUND (Grid Cell 1) */}
            <div className="col-start-1 row-start-1 w-full h-full z-0">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    <video
                        ref={videoRef}
                        src="/hero-video.mp4"
                        muted
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
            </div>

            {/* 2. SCROLLING CONTENT OVERLAY (Grid Cell 1) */}
            {/* This sits in the exact same grid cell as the video, but scrolls naturally */}
            <div className="col-start-1 row-start-1 w-full z-10 flex flex-col">

                {/* Hero Text */}
                <div className="h-screen flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                        Find the right chip. Find the right laptop.
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mb-10">
                        Real processor data, honest scoring, and a recommendation you can actually understand, not a guess.
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <Link href="/wizard">
                        <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                            Get My Recommendation
                        </button>
                        </Link>
                        <Link href="/processors">
                        <button className="border border-white/50 text-white backdrop-blur-sm px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                            Just Browse
                        </button>
                        </Link>
                    </div>
                </div>

                {/* Spacer for scrubbing */}
                <div className="h-[50vh] w-full pointer-events-none flex-shrink-0" />

                {/* Bottom Content - no longer constrained by absolute positioning */}
                <div className="w-full pb-32">
                    {children}
                </div>

            </div>
        </div>
    );
}
