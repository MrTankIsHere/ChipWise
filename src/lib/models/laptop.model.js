import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LaptopSchema = new Schema(
    {
        // Human-readable ID, e.g. "asus-tuf-a15-2024"
        laptopId: { type: String, required: true, unique: true, index: true },

        // Links to Processor.processorId — NOT a Mongo ref, just a string match (simpler, matches your existing pattern)
        processorId: { type: String, required: true, index: true },

        brand: { type: String, required: true, index: true },   // e.g. "ASUS", "Lenovo"
        modelName: { type: String, required: true },             // e.g. "TUF Gaming A15"

        ramGB: { type: Number },                                  // e.g. 16
        storageGB: { type: Number },                               // e.g. 512
        displayInch: { type: Number },                             // e.g. 15.6
        displayRefreshHz: { type: Number },                        // e.g. 144
        dgpu: { type: String },                                    // e.g. "RTX 4060", "None"

        batteryWh: { type: Number },                                // e.g. 90
        weightKg: { type: Number },                                 // e.g. 2.2

        priceINR: { type: Number, required: true },                 // actual listed price, single number (not a range like processors)
    },
    { timestamps: true }
);

// Prevent OverwriteModelError during development / hot reload
const Laptop =
    mongoose.models.Laptop ||
    mongoose.model("Laptop", LaptopSchema);

export default Laptop;
