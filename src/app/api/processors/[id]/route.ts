import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/db";
import Processor from "@/lib/models/processor.model";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectDB();
    const processor = await Processor.findOne({ processorId: id });
    if (!processor) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(processor);
}
