import mongoose, { Schema, models } from "mongoose";

const ProcessorSchema = new Schema(
    {
        brand: String,
        family: String,
        series: String,
        model: String,
        launch: String,
        coresThreads: String,
        basePower: String,
        maxPower: String,
        npu: String,
        npuTops: String,
        igpu: String,
        gpuCompatibility: String,
        priceRangeINR: String,
    },
    { timestamps: true }
);

export default models.Processor || mongoose.model("Processor", ProcessorSchema);
