import Link from "next/link";

export default function Home_Page() {
    return (
        <div className="p-20 flex justify-between">
            <h1 className="text-5xl font-bold m-17">Home Page.</h1>
            <div className="my-17 flex gap-7">
                <Link href={`/processors`} className="text-xl font-bold hover:text-gray-700">Processors</Link>
                <Link href={`/laptops`} className="text-xl font-bold hover:text-gray-700">Laptops</Link>
                <Link href={`/wizard`} className="text-xl font-bold hover:text-gray-700">Wizard</Link>
            </div>
        </div>
    )
}
