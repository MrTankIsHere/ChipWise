import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProcessorSchema = new Schema(
    {
        // Custom human-readable ID, e.g. "intel-core-ultra-7-265h" - separate from Mongo's auto _id.
        // Useful for stable re-seeding, clean URLs, and cross-referencing from the Laptop model later.
        processorId: { type: String, required: true, unique: true, index: true },

        // Manufacturer, e.g. "Intel" or "AMD"
        brand: { type: String, required: true, index: true },

        // Generation/codename, e.g. "Arrow Lake-H/HX", "Strix Point (Ryzen AI 300)"
        family: { type: String, index: true },

        // Product line within the family, e.g. "Core Ultra 7", "Ryzen AI 9"
        series: { type: String, index: true },

        // Full model name, e.g. "Core Ultra 7 265H", "Ryzen AI 9 HX 370"
        model: { type: String, required: true, unique: true },

        // Launch year or status, e.g. "2025", "2026 (exp.)", "Q1 2025"
        launch: { type: String },

        // Core/thread config as given in source, e.g. "16 (6P+8E+2LPE) (22T)", "8C/16T"
        coresThreads: { type: String },

        // Sustained/base power draw, e.g. "28W", "15-30W"
        basePower: { type: String },

        // Peak/max turbo power, e.g. "115W", "75W+"
        maxPower: { type: String },

        // Whether it has a dedicated Neural Processing Unit, e.g. "Yes" or "No"
        npu: { type: String, enum: ["Yes", "No"], default: "No" },

        // NPU performance in TOPS if present, e.g. "13", "50", "-" if no NPU
        npuTops: { type: String, default: "-" },

        // Integrated GPU name/spec, e.g. "Intel Arc 140T (4 Xe)", "Radeon 890M"
        igpu: { type: String },

        // Recommended discrete GPU pairing tier, e.g. "Mid dGPU: RTX 4050/4060/4070 - gaming"
        gpuCompatibility: { type: String },

        // Typical laptop retail price band in India, e.g. "Rs 65,000 - 95,000"
        priceRangeINR: { type: String },
    },
    { timestamps: true } // adds createdAt / updatedAt automatically
);

// Prevent OverwriteModelError during development / hot reload
const Processor =
    mongoose.models.Processor ||
    mongoose.model("Processor", ProcessorSchema);

export default Processor;
