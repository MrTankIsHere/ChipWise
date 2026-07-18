import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db/db";
import Laptop from "@/lib/models/laptop.model";
import Processor from "@/lib/models/processor.model";

// Initialize the Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Try to pull a budget number out of the question
function extractBudget(question: string): number | null {
    // Matches "1.5 lakh" or "1 lakh"
    const lakhMatch = question.match(/(\d+\.?\d*)\s*lakh/i);
    if (lakhMatch) return parseFloat(lakhMatch[1]) * 100000;

    // Matches "80k" or "80 k"
    const kMatch = question.match(/(\d+)\s*k\b/i);
    if (kMatch) return parseInt(kMatch[1]) * 1000;

    // Matches raw numbers like "80000"
    const plainNumMatch = question.match(/(\d{4,6})/);
    if (plainNumMatch) return parseInt(plainNumMatch[1]);

    return null;
}

export async function POST(req: Request) {

    const { question } = await req.json();

    await connectDB();

    // 1. Extract the budget from the user's question
    const budget = extractBudget(question);

    // 2. Build the MongoDB query
    const dbQuery: any = {};
    if (budget) {
        // Add a 15% buffer so we don't rigidly exclude a great laptop that is 1k over budget
        dbQuery.priceINR = { $lte: budget * 1.15 };
    }

    // 3. Fetch pre-filtered laptops and cap at 15 to keep the prompt small
    const laptops = await Laptop.find(dbQuery).limit(15).lean();

    // 4. Fetch processors so we can join the data
    const processors = await Processor.find({}).lean();
    const procMap: Record<string, any> = {};
    for (let i = 0; i < processors.length; i++) {
        procMap[processors[i].processorId] = processors[i];
    }

    // 5. Join the data into a clean, flat array for the AI
    const joinedData = [];
    for (let i = 0; i < laptops.length; i++) {
        const laptop = laptops[i];
        const processor = procMap[laptop.processorId];
        joinedData.push({
            model: laptop.modelName,
            brand: laptop.brand,
            priceINR: laptop.priceINR,
            ramGB: laptop.ramGB,
            dgpu: laptop.dgpu,
            processor: processor ? processor.model : "Unknown",
            npuTops: processor ? processor.npuTops : "N/A",
        });
    }

    // 6. Ask Groq to answer using ONLY the filtered data
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "Here is real laptop data from our database: " + JSON.stringify(joinedData) +
                        "\n\nAnswer the user's question using ONLY the data above. Mention specific laptop names and specs. If nothing fits well, say so honestly. Do not use Markdown bolding (**text**) because our UI does not support it."
                },
                {
                    role: "user",
                    content: question
                }
            ],
            max_tokens: 1000,
        });

        const answerText = response.choices[0]?.message?.content || "Sorry, no answer generated.";
        return NextResponse.json({ answer: answerText });

    } catch (error: any) {
        console.error("Groq API Error:", error);
        return NextResponse.json(
            { answer: "Sorry, there was an error communicating with the AI." },
            { status: 500 }
        );
    }
}
