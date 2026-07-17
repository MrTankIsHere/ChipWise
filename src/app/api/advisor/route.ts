import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db/db";
import Laptop from "@/lib/models/laptop.model";

// Initialize the Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 1. Define the Tool using the standard format
const tools = [
    {
        type: "function",
        function: {
            name: "search_mongodb_laptops",
            description: "Search the database for laptops based on the user's budget and needs.",
            parameters: {
                type: "object",
                properties: {
                    maxPrice: {
                        type: "number",
                        description: "The maximum budget in INR (e.g., 80000)"
                    },
                    isGamingOrEditing: {
                        type: "boolean",
                        description: "True if the user mentions gaming, video editing, or needs a dedicated GPU"
                    }
                },
                required: ["maxPrice"],
            }
        }
    }
];

export async function POST(req: Request) {
    const { question } = await req.json();

    try {
        // 2. Initial setup: Give the AI ONLY the search instructions.
        // Do NOT include formatting rules here.
        const messages: any[] = [
            {
                role: "system",
                content: "You are a helpful laptop advisor. You must use the search_mongodb_laptops tool to fetch data based on the user's request."
            },
            {
                role: "user",
                content: question
            }
        ];

        // We use Llama 3.3 70B, which is incredibly smart for tool calling and blazingly fast on Groq
        let response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            tools: tools as any,
            tool_choice: "auto",
            max_tokens: 1000,
        });

        const responseMessage = response.choices[0].message;

        // 3. Check if Groq decided it needs to search the database
        if (responseMessage.tool_calls) {
            const toolCall = responseMessage.tool_calls[0];

            // Safely parse the arguments Groq returns
            const args = JSON.parse(toolCall.function.arguments);
            const { maxPrice, isGamingOrEditing } = args;

            // 4. Run the targeted MongoDB query
            await connectDB();
            const dbQuery: any = {};
            if (maxPrice) dbQuery.priceINR = { $lte: maxPrice };
            if (isGamingOrEditing) dbQuery.dgpu = { $ne: "None" };

            // Fetch only the top 5 matching laptops to keep token usage incredibly low
            const matchedLaptops = await Laptop.find(dbQuery).limit(5).lean();

            // 5. Add the AI's tool request AND the database results to the message history
            messages.push(responseMessage);
            messages.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name: toolCall.function.name,
                content: JSON.stringify(matchedLaptops),
            });

            // 5b. The Trick: Now that the JSON tool call is finished, we safely pass our formatting rules!
            messages.push({
                role: "system",
                content: "Now formulate your final answer using the database results. Mention specific laptop names and specs. Do NOT use Markdown bolding (**text**) because our UI does not support it."
            });

            // 6. Call Groq a second time so it can format the final text answer
            const finalResponse = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: messages,
                max_tokens: 1000,
            });

            return NextResponse.json({ answer: finalResponse.choices[0].message.content });
        }

        // If no tool was needed (e.g., user just said "hello"), return standard text
        return NextResponse.json({ answer: responseMessage.content || "Sorry, I couldn't generate an answer." });

    }
    catch (error: any) {
        console.error("Groq API Error:", error);
        return NextResponse.json(
            { answer: "Sorry, there was an error communicating with the AI." },
            { status: 500 }
        );
    }
}
