"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "Home" },
    { href: "/processors", label: "Processors" },
    { href: "/laptops", label: "Laptops" },
    { href: "/wizard", label: "Wizard" },
    { href: "/advisor", label: "AI Advisor" },
    { href: "/analytics", label: "Analytics" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="border-b px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg">ChipWise</Link>
            <div className="flex gap-4 text-sm">
                {
                    links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={pathname === link.href ? "font-semibold" : "text-muted-foreground"} >
                                {link.label}
                        </Link>
                ))
                }
            </div>
        </nav>
    );
}
