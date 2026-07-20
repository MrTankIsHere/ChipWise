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
        <>
        <ScrollVideoHero />

            <div className="max-w-4xl mx-auto p-6">
                <div className="grid grid-cols-3 gap-4 my-16">
                    <Card className="p-4 text-center">
                        <div className="text-2xl font-bold">{stats.processorCount}</div>
                        <div className="text-sm text-muted-foreground">Processors</div>
                    </Card>
                    <Card className="p-4 text-center">
                        <div className="text-2xl font-bold">{stats.laptopCount}</div>
                        <div className="text-sm text-muted-foreground">Laptops</div>
                    </Card>
                    <Card className="p-4 text-center">
                        <div className="text-2xl font-bold">{stats.brandCount}</div>
                        <div className="text-sm text-muted-foreground">Brands</div>
                    </Card>
                </div>

                <h2 className="text-lg font-semibold mb-4">Or explore directly</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {
                        modules.map((m) => (
                            <Link key={m.href} href={m.href}>
                            <Card className="p-4 hover:bg-muted/50 cursor-pointer">
                                <h3 className="font-semibold">{m.title}</h3>
                                <p className="text-sm text-muted-foreground">{m.desc}</p>
                            </Card>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </>
    );
}
