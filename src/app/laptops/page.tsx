import LaptopTable from "@/components/laptopTable";
import { connectDB } from "@/lib/db/db";
import Laptop from "@/lib/models/laptop.model";
import Processor from "@/lib/models/processor.model";

async function getData() {
    await connectDB();
    const laptops = await Laptop.find({}).lean();
    const processors = await Processor.find({}).lean();
    const procMap: Record<string, any> = {};
    for (let i = 0; i < processors.length; i++) {
        procMap[processors[i].processorId] = processors[i];
    }
    const joined = laptops.map((l: any) => ({ ...l, processor: procMap[l.processorId] }));
    return JSON.parse(JSON.stringify(joined));
}

export default async function LaptopsPage() {

    const data = await getData();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Laptop Explorer</h1>
            <LaptopTable data={data} />
        </div>
    );
}
