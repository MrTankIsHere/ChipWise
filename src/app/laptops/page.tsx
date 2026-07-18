import LaptopTable from "@/components/laptopTable";

async function getData() {

    const [laptopsRes, processorsRes] = await Promise.all([
        fetch("/api/laptops", { cache: "no-store" }),
        fetch("/api/processors", { cache: "no-store" }),
    ]);
    const laptops = await laptopsRes.json();
    const processors = await processorsRes.json();
    const procMap = Object.fromEntries(processors.map((p: any) => [p.processorId, p]));
    return laptops.map((l: any) => ({ ...l, processor: procMap[l.processorId] }));

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
