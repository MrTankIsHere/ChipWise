import Link from "next/link";
import { Card } from "@/components/ui/card";

const links = [
    { href: "/processors", title: "Processor Explorer", desc: "Browse and filter all processors" },
    { href: "/laptops", title: "Laptop Explorer", desc: "Browse laptops with linked processor specs" },
    { href: "/wizard", title: "Recommendation Wizard", desc: "Get laptop suggestions based on your needs" },
    { href: "/advisor", title: "AI Advisor", desc: "Ask questions about laptops in plain English" },
    { href: "/analytics", title: "Analytics", desc: "Charts and stats across the database" },
];

export default function HomePage() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">ChipWise</h1>
            <p className="text-muted-foreground mb-6">Find the right processor and laptop, backed by real data.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {
                    links.map((link) => (
                        <Link key={link.href} href={link.href}>
                            <Card className="p-4 hover:bg-muted/50 cursor-pointer">
                                <h3 className="font-semibold">{link.title}</h3>
                                <p className="text-sm text-muted-foreground">{link.desc}</p>
                            </Card>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}
