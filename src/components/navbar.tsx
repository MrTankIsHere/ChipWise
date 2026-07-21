"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";

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
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // theme is undefined on first server render,
    // so wait until mounted before showing the icon
    // to avoid a light/dark mismatch flash
    useEffect(() => {
        setMounted(true);
    }, []);

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    return (
        // fixed + centered, floats above page content, doesn't push content down
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
            <nav className="glass-nav rounded-full px-4 py-2 w-full max-w-3xl flex items-center justify-between">

                <Link href="/" className="font-bold text-lg px-2">ChipWise</Link>

                {/* desktop links, hidden below md breakpoint */}
                <div className="hidden md:flex items-center gap-1 text-sm">
                    {
                        links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-1.5 rounded-full transition-colors ${
                                    pathname === link.href
                                    ? "bg-primary text-primary-foreground font-semibold"
                                    : "text-muted-foreground hover:text-foreground"
                                }`} >
                                {link.label}
                            </Link>
                        ))
                    }
                </div>

                <div className="flex items-center gap-1">
                    {/* theme toggle, only render the real icon once mounted client-side */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="p-2 rounded-full hover:bg-muted transition-colors" >
                        {
                            mounted && theme === "dark" ?
                                ( <Sun className="h-4 w-4" /> )
                                    :
                                ( <Moon className="h-4 w-4" /> )
                        }
                    </button>

                    {/* hamburger, only shown below md breakpoint */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                        className="md:hidden p-2 rounded-full hover:bg-muted transition-colors" >
                            {
                                mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />
                            }
                    </button>
                </div>
            </nav>

            {/* mobile dropdown menu, only appears when hamburger is open, sits just below the pill */}
            {
                mobileOpen && (
                    <div className="absolute top-16 md:hidden glass rounded-2xl p-2 w-[calc(100%-2rem)] max-w-3xl flex flex-col gap-1">
                        {
                            links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`px-4 py-2.5 rounded-xl text-sm ${
                                        pathname === link.href
                                        ? "bg-primary text-primary-foreground font-semibold"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`} >
                                        {link.label}
                                </Link>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}
