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

                {/* Stats Row - Spaced out like the diagram */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-32">
                    <Card className="p-8 text-center bg-black/40 backdrop-blur-md border-white/10 text-white shadow-2xl">
                        <div className="text-4xl font-bold mb-3">{stats.processorCount}</div>
                        <div className="text-sm font-medium text-white/60 tracking-wider uppercase">Processors</div>
                    </Card>
                    <Card className="p-8 text-center bg-black/40 backdrop-blur-md border-white/10 text-white shadow-2xl">
                        <div className="text-4xl font-bold mb-3">{stats.laptopCount}</div>
                        <div className="text-sm font-medium text-white/60 tracking-wider uppercase">Laptops</div>
                    </Card>
                    <Card className="p-8 text-center bg-black/40 backdrop-blur-md border-white/10 text-white shadow-2xl">
                        <div className="text-4xl font-bold mb-3">{stats.brandCount}</div>
                        <div className="text-sm font-medium text-white/60 tracking-wider uppercase">Brands</div>
                    </Card>
                </div>

                {/* Modules Grid - 2 Columns, generous padding */}
                <div className="w-full max-w-4xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {
                            modules.map( (m) => (
                                <Link key={m.href} href={m.href} className="block">
                                    <Card className="h-full p-8 bg-black/40 backdrop-blur-md border-white/10 text-white hover:bg-white/10 transition-all duration-300 cursor-pointer shadow-lg">
                                        <h3 className="text-xl font-semibold mb-2">{m.title}</h3>
                                        <p className="text-sm text-white/70 leading-relaxed">{m.desc}</p>
                                    </Card>
                                </Link>
                            ))
                        }
                    </div>
                </div>

            </div>
        </ScrollVideoHero>
    );
}
