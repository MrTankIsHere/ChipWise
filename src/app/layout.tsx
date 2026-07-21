import { ThemeProvider } from "@/components/themeProvider";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://chipwise.vercel.app"),

    title: {
        default:
            "ChipWise - compare and choose Intel & AMD Processors and Find the Right Laptop",
        template: "%s | ChipWise",
    },

    description:
        "ChipWise is an open-source platform for comparing Intel and AMD processors, exploring real CPU specifications, benchmarking mobile processors, comparing laptops, and receiving transparent laptop recommendations for students, developers, gamers, AI engineers, creators, Linux users, and professionals.",

    applicationName: "ChipWise",

    keywords: [
        "ChipWise",
        "Intel processors",
        "AMD processors",
        "processor comparison",
        "CPU comparison",
        "mobile processors",
        "Intel vs AMD",
        "CPU database",
        "processor benchmarks",
        "laptop recommendation",
        "best laptop",
        "laptop finder",
        "gaming laptop",
        "programming laptop",
        "developer laptop",
        "AI laptop",
        "machine learning laptop",
        "Linux laptop",
        "student laptop",
        "creator laptop",
        "processor explorer",
        "CPU specifications",
        "laptop comparison",
        "processor analytics",
        "computer hardware",
        "CPU buying guide",
        "tech comparison",
        "Intel Core Ultra",
        "AMD Ryzen AI",
    ],

    authors: [
        {
            name: "ChipWise",
        },
    ],

    creator: "ChipWise",

    publisher: "ChipWise",

    category: "Technology",

    alternates: {
        canonical: "https://chipwise.vercel.app",
    },

    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
        },
    },

    openGraph: {
        type: "website",
        url: "https://chipwise.vercel.app",
        siteName: "ChipWise",
        title:
            "ChipWise - compare and choose Intel & AMD Processors and Find the Right Laptop",
        description:
            "Explore Intel and AMD processor specifications, compare CPUs side by side, discover laptops powered by real processor data, and receive transparent recommendations tailored to your needs.",
        locale: "en_US",
    },

    twitter: {
        card: "summary",
        title:
            "ChipWise - compare and choose Intel & AMD Processors and Find the Right Laptop",
        description:
            "Compare processors, browse laptops, analyze specifications, and get transparent recommendations powered by real hardware data.",
    },

    other: {
        "apple-mobile-web-app-title": "ChipWise",
        "mobile-web-app-capable": "yes",
        "format-detection": "telephone=no",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en"
                className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
                suppressHydrationWarning >
            <body className="min-h-full flex flex-col">
                <ThemeProvider>
                    <Navbar />
                        <main className="flex-1">
                            {children}
                        </main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
