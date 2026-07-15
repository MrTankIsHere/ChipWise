import Link from "next/link";

export default function Home_Page() {
    return (
        <div className="p-20 flex justify-between">
            <h1 className="text-5xl font-bold m-17">Home Page.</h1>
            <Link href={`/processors`} className="text-xl font-bold my-17 hover:text-gray-700">Processors</Link>
        </div>
    )
}
