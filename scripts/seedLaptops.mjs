import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("Missing MONGO_URI in .env.local");

async function seed() {
    const csvPath = path.resolve("src/data/laptops.csv");
    const csvText = fs.readFileSync(csvPath, "utf-8");

    const records = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
    });

    await mongoose.connect(MONGO_URI);
    console.log(`Connected. Found ${records.length} rows in laptops.csv.`);

    const { default: Laptop } = await import("../src/lib/models/laptop.model.js");
    const { default: Processor } = await import("../src/lib/models/processor.model.js");

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

        for (const row of records) {
            const processorId = row["processorId"]?.trim();

        // Validate the processorId actually exists — catches CSV typos before they silently break links
        const exists = await Processor.exists({ processorId });
        if (!exists) {
            console.warn(`⚠ Skipped "${row["laptopId"]}" — processorId "${processorId}" not found in Processor collection.`);
            skipped++;
            continue;
        }

            const doc = {
            laptopId: row["laptopId"],
            processorId,
            brand: row["brand"],
            modelName: row["modelName"],
            ramGB: Number(row["ramGB"]) || undefined,
            storageGB: Number(row["storageGB"]) || undefined,
            displayInch: Number(row["displayInch"]) || undefined,
            displayRefreshHz: Number(row["displayRefreshHz"]) || undefined,
            dgpu: row["dgpu"],
            batteryWh: Number(row["batteryWh"]) || undefined,
            weightKg: Number(row["weightKg"]) || undefined,
            priceINR: Number(row["priceINR"]) || undefined,
        };

        const result = await Laptop.updateOne(
            { laptopId: doc.laptopId },
            { $set: doc },
            { upsert: true }
        );

        if (result.upsertedCount > 0) inserted++;
        else updated++;
    }

    console.log(`Done. Inserted: ${inserted}, Updated: ${updated}, Skipped (bad processorId): ${skipped}`);
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
