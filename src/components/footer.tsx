export default function Footer() {
    return (
        <footer className="relative pt-20 px-6 pb-12 overflow-hidden">
            {/* Dark/Light base overlay to ensure the colors pop correctly */}
            <div className="absolute inset-0 bg-background/80 -z-20"></div>

            {/*   Vibrant Mesh Gradient   */}

            {/* 1. The Teal Sweep (Center/Left) */}
            <div className="absolute top-1/2 left-[10%] w-[50vw] max-w-[600px] h-[250px] bg-secondary/80 dark:bg-secondary/50 rounded-[100%] blur-[80px] sm:blur-[120px] -translate-y-1/2 rotate-[-15deg] -z-10 dark:mix-blend-screen opacity-90 pointer-events-none"></div>

            {/* 2. The Red Glow (Right) */}
            <div className="absolute top-1/2 right-[5%] w-[40vw] max-w-[500px] h-[300px] bg-accent/60 dark:bg-accent/40 rounded-[100%] blur-[80px] sm:blur-[120px] -translate-y-1/2 rotate-[10deg] -z-10 dark:mix-blend-screen opacity-90 pointer-events-none"></div>

            {/* 3. The Deep Blue Anchor (Bottom Left) */}
            <div className="absolute -bottom-16 left-[-5%] w-[45vw] max-w-[550px] h-[350px] bg-primary/70 dark:bg-primary/50 rounded-[100%] blur-[90px] sm:blur-[130px] rotate-[25deg] -z-10 dark:mix-blend-screen opacity-80 pointer-events-none"></div>

            {/*   Glass Container   */}
            <div className="glass-sm rounded-2xl px-6 py-5 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 shadow-2xl dark:shadow-none border-white/20 dark:border-white/10">

                {/* Left Side: Brand with an optional subtle icon layer */}
                <span className="font-semibold text-lg tracking-tight text-foreground">ChipWise</span>

                {/* Right Side: Copy */}
                <span className="text-foreground/80 font-medium text-center sm:text-right">
                    Built with real processor and laptop data.
                </span>
            </div>
        </footer>
    );
}
