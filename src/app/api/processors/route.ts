import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/db";
import Processor from "@/lib/models/processor.model";

export async function GET() {
    await connectDB();
    const processors = await Processor.find({});
    return NextResponse.json(processors);
}
