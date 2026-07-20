"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function ScrollVideoHero() {
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
        // full width, no max-w wrapper anywhere around this
        <div ref={containerRef} style={{ height: "400vh" }} className="relative w-full">
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* video fills the entire viewport */}
                <video
                    ref={videoRef}
                    src="/hero-video.mp4"
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover" />

                {/* dark overlay so text stays readable no matter which video frame is showing */}
                <div className="absolute inset-0 bg-black/40" />

                {/* hero text, layered on top of the video, not below it */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Find the right chip. Find the right laptop.
                    </h1>
                    <p className="text-white/80 max-w-xl mb-8">
                        Real processor data, honest scoring, and a recommendation you can actually understand, not a guess.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/wizard">
                        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium">
                            Get My Recommendation
                        </button>
                        </Link>
                        <Link href="/processors">
                        <button className="border border-white text-white px-6 py-3 rounded-lg font-medium">
                            Just Browse
                        </button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
