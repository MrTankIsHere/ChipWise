// Used to read files from the filesystem.
import fs from "fs";

// Used to create OS-independent file paths. -> Example: Windows -> C:\Users\... or Linux   -> /home/user/...
import path from "path";

// Parses CSV data into JavaScript objects.
// Example: John,25 -> [{ Name: "John", Age: "25" }]
import { parse } from "csv-parse/sync";

// MongoDB ODM (Object Data Modeling) -> Lets us communicate with MongoDB using JavaScript objects.
import mongoose from "mongoose";

// Loads environment variables from .env.local
import dotenv from "dotenv";

// Import the Processor model. This represents the "processors" collection in MongoDB.
import Processor from "../src/lib/models/processor.model.js";

// Load Environment Variables -> Next.js automatically loads .env.local, but standalone Node.js scripts do not. So we have to load it manually.
dotenv.config({
    path: ".env.local",
});

// Read MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;

// Stop execution if URI is missing.
if (!MONGO_URI) {
    throw new Error("Missing MONGO_URI in .env.local");
}


// Helper Function -> Creates a unique, URL-friendly ID. -> This ID is used as processorId in MongoDB.
// Example: Intel + Core Ultra 7 265H -> intel-core-ultra-7-265h
function makeSlug(brand, model) {
    return `${brand}-${model}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

// Main Seed Function
async function seed() {

    // Read CSV File -> Absolute path to CSV file
    const csvPath = path.resolve("src/data/all_processors.csv");

    // Read CSV as plain text
    const csvText = fs.readFileSync(csvPath, "utf8");

    // Parse CSV
    const records = parse(csvText, {

        // Uses first row as object keys.
        // Example: Brand,Processor -> Intel,Core Ultra 5 -> { Brand: "Intel", Processor: "Core Ultra 5" }
        columns: true,

        // Ignore blank lines
        skip_empty_lines: true,
    });

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);

    console.log(`Connected to MongoDB`);
    console.log(`Found ${records.length} processors in CSV.`);

    let inserted = 0;
    let updated = 0;


    // Loop through every CSV row
    for (const row of records) {

        // Read values from CSV columns
        const brand = row["Brand"];
        const model = row["Processor"];

        // Generate our custom unique ID
        const processorId = makeSlug(brand, model);

        // Build MongoDB document
        const doc = {

            processorId,
            brand,
            family: row["Family/Codename"],
            series: row["Series"],
            model,
            launch: row["Launch"],
            coresThreads: row["Cores/Threads"],
            basePower: row["Base Power"],
            maxPower: row["Max Power"],
            npu: row["NPU"],
            npuTops: row["NPU TOPS"],
            igpu: row["iGPU"],
            gpuCompatibility:
                row["GPU Compatibility / Recommended Pairing"],
            priceRangeINR:
                row["Approx. Laptop Price (INR)"],
        };

        // Insert or Update: updateOne() looks for an existing processor having the same processorId.
        // If found -> then ->  update it.
        // If not found -> then ->  insert a new document.
        // This allows the script to be run  multiple times without duplicates.
        const result = await Processor.updateOne(
            {
                processorId,
            },
            {
                $set: doc,
            },
            {
                upsert: true,
            }
        );

        // Count inserted vs updated documents.
        if (result.upsertedCount > 0) {
            inserted++;
        } else {
            updated++;
        }
    }

    // Finished
    console.log("----------------------------");
    console.log(`Inserted : ${inserted}`);
    console.log(`Updated  : ${updated}`);
    console.log("----------------------------");


    // Close MongoDB connection
    await mongoose.disconnect();

    console.log("Disconnected from MongoDB.");
}



// Run the Script: Execute the seed function.
// If any error occurs, print it and exit with code 1.
seed().catch((err) => {
    console.error("Seed failed:");
    console.error(err);
    process.exit(1);
});
