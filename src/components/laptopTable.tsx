"use client";
import { useState } from "react";
import {
    useReactTable, getCoreRowModel, getSortedRowModel,
    getPaginationRowModel, flexRender, createColumnHelper, SortingState,
} from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const columnHelper = createColumnHelper<any>();
const columns = [
    columnHelper.accessor("brand", { header: "Brand" }),
    columnHelper.accessor("modelName", { header: "Model" }),
    columnHelper.accessor((r) => r.processor?.model ?? "—", { id: "cpu", header: "Processor" }),
    columnHelper.accessor((r) => `${r.ramGB}GB / ${r.storageGB}GB`, { id: "specs", header: "RAM/Storage" }),
    columnHelper.accessor("dgpu", { header: "dGPU" }),
    columnHelper.accessor((r) => `Rs ${r.priceINR?.toLocaleString()}`, { id: "price", header: "Price" }),
];

export default function LaptopTable({ data }: { data: any[] }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
        data, columns, state: { sorting }, onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 15 } },
    });

    return (
        <div>
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                        <TableHead key={h.id} onClick={h.column.getToggleSortingHandler()} className="cursor-pointer">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {{ asc: " ↑", desc: " ↓" }[h.column.getIsSorted() as string] ?? ""}
                        </TableHead>
                    ))}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                    <TableRow><TableCell colSpan={columns.length} className="text-center py-6 text-muted-foreground">No data found.</TableCell></TableRow>
                ) : table.getRowModel().rows.map((row) => (
                    <TableRow key={row.original.laptopId}>
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                        <Link href={`/laptops/${row.original.laptopId}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Link>
                        </TableCell>
                    ))}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</Button>
                <span className="text-sm">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
            </div>
        </div>
    );
}
