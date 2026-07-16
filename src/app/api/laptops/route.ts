import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/db";
import Laptop from "@/lib/models/laptop.model";

export async function GET() {
    await connectDB();
    const laptops = await Laptop.find({});
    return NextResponse.json(laptops);
}
