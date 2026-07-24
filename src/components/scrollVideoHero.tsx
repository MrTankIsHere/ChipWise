"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// change this to match your actual frame count from step 1
const TOTAL_FRAMES = 240;
const FRAME_PATH = (i: number) => `/frames/frame-${String(i).padStart(4, "0")}.png`;

export default function ScrollVideoHero({ children }: { children?: React.ReactNode }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);
    const targetFrameRef = useRef(0);
    const [loaded, setLoaded] = useState(false);

    // Step 1: preload every frame image up front
    useEffect(() => {
        let loadedCount = 0;
        const images: HTMLImageElement[] = [];

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = FRAME_PATH(i);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) {
                    setLoaded(true);
                }
            };
            images.push(img);
        }

        imagesRef.current = images;
    }, []);

    // Step 2: draw whichever frame matches scroll position, eased for smoothness
    useEffect(() => {
        if (!loaded) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        function resizeCanvas() {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        function drawFrame(index: number) {
            const img = imagesRef.current[index];
            if (!img || !ctx || !canvas) return;

            // cover-fit the image into the canvas, same idea as CSS object-cover
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgRatio > canvasRatio) {
                drawHeight = canvas.height;
                drawWidth = img.width * (drawHeight / img.height);
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }
            else {
                drawWidth = canvas.width;
                drawHeight = img.height * (drawWidth / img.width);
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }

        function updateTargetFrame() {
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const totalScrollDistance = container.offsetHeight - window.innerHeight;
            const scrolled = -rect.top;
            let progress = scrolled / totalScrollDistance;
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            targetFrameRef.current = Math.round(progress * (TOTAL_FRAMES - 1));
        }

        let rafId: number;
        function animate() {
            // ease toward the target frame instead of snapping, smooths fast scrolls
            currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * 0.3;
            drawFrame(Math.round(currentFrameRef.current));
            rafId = requestAnimationFrame(animate);
        }

        function handleScroll() {
            updateTargetFrame();
        }

        window.addEventListener("scroll", handleScroll);
        updateTargetFrame();
        drawFrame(0);
        rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(rafId);
        };
    }, [loaded]);

    return (
        <div ref={containerRef} className="grid w-full min-h-[250vh]">
            <div className="col-start-1 row-start-1 w-full h-full z-0">
                <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                    <div className="absolute inset-0 bg-black/50" />

                    {
                        !loaded && (
                            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                            Loading...
                            </div>
                        )
                    }
                </div>
            </div>

            <div className="col-start-1 row-start-1 w-full z-10 flex flex-col">
                <div className="h-screen flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                        Find the right chip. Find the right laptop.
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mb-10">
                        Real processor data, honest scoring, and a recommendation you can actually understand, not a guess.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/wizard">
                            <button className="bg-accent text-accent-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
                                Get My Recommendation
                            </button>
                        </Link>
                        <Link href="/processors">
                            <button className="glass-nav text-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
                                Just Browse
                            </button>
                        </Link>
                    </div>
                    </div>

                <div className="h-[50vh] w-full pointer-events-none flex-shrink-0" />

                <div className="w-full pb-32">
                    {children}
                </div>
            </div>
        </div>
    );
}
