import Link from "next/link";
import { Card } from "@/components/ui/card";
import { connectDB } from "@/lib/db/db";
import Processor from "@/lib/models/processor.model";
import Laptop from "@/lib/models/laptop.model";
import ScrollVideoHero from "@/components/scrollVideoHero";

async function getStats() {
    await connectDB();
    const processorCount = await Processor.countDocuments({});
    const laptopCount = await Laptop.countDocuments({});
    const brands = await Processor.distinct("brand");
    return { processorCount, laptopCount, brandCount: brands.length };
}

const modules = [
    { href: "/processors", title: "Processor Explorer", desc: "Browse and filter every processor" },
    { href: "/laptops", title: "Laptop Explorer", desc: "Browse laptops with linked processor specs" },
    { href: "/compare", title: "Comparison", desc: "Compare 2 to 4 processors side by side" },
    { href: "/advisor", title: "AI Advisor", desc: "Ask questions about laptops in plain English" },
    { href: "/analytics", title: "Analytics", desc: "Charts and stats across the database" },
];

export default async function HomePage() {
    const stats = await getStats();

    return (
        <ScrollVideoHero>
            <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">

                {/* Module 1: Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-24 relative z-10">
                    <div className="glass rounded-2xl p-6 text-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-4xl font-bold text-white">{stats.processorCount}</div>
                        <div className="text-sm text-white/70 tracking-wide uppercase mt-2 font-medium">Processors</div>
                    </div>
                    <div className="glass rounded-2xl p-6 text-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-4xl font-bold text-white">{stats.laptopCount}</div>
                        <div className="text-sm text-white/70 tracking-wide uppercase mt-2 font-medium">Laptops</div>
                    </div>
                    <div className="glass rounded-2xl p-6 text-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-4xl font-bold text-white">{stats.brandCount}</div>
                        <div className="text-sm text-white/70 tracking-wide uppercase mt-2 font-medium">Brands</div>
                    </div>
                </div>

                {/* Module 2: Links Grid */}
                <div className="w-full max-w-4xl pb-24 relative z-10">
                    <h2 className="text-2xl font-semibold mb-8 text-center text-white drop-shadow-md">Or explore directly</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {modules.map((m) => (
                            <Link key={m.href} href={m.href} className="block group">
                                <Card className="relative overflow-hidden glass !bg-transparent p-8 h-full transition-all duration-500 hover:-translate-y-1 hover:border-white/40 cursor-pointer shadow-lg">

                                    {/* Animated Hover Background (Base Gradient) */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

                                    {/* Animated Glowing Orbs */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/40 blur-3xl rounded-full group-hover:scale-[2] group-hover:bg-primary/50 transition-all duration-700 ease-out z-0"></div>
                                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-secondary/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0 delay-75"></div>

                                    {/* Content layer */}
                                    <div className="relative z-10 flex flex-col h-full justify-center">
                                        <h3 className="text-xl font-semibold mb-2 text-white drop-shadow-sm transition-colors duration-300">
                                            {m.title}
                                        </h3>
                                        <p className="text-sm text-white/80 leading-relaxed">
                                            {m.desc}
                                        </p>
                                    </div>

                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </ScrollVideoHero>
    );
}
