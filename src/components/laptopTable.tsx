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
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id} className="hover:bg-transparent border-border">
                            {hg.headers.map((h) => (
                                <TableHead
                                    key={h.id}
                                    onClick={h.column.getToggleSortingHandler()}
                                    className="cursor-pointer select-none text-xs uppercase tracking-wide text-muted-foreground"
                                    >
                                    {flexRender(h.column.columnDef.header, h.getContext())}
                                    {{ asc: " ↑", desc: " ↓" }[h.column.getIsSorted() as string] ?? ""}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {
                        table.getRowModel().rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-10 text-muted-foreground">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows.map((row) => (
                                <TableRow key={row.original.laptopId} className="hover:bg-muted/50 border-border">
                                    {
                                        row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="p-0">
                                                <Link href={`/laptops/${row.original.laptopId}`} className="block px-4 py-3">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </Link>
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            <div className="flex justify-center items-center gap-4 px-4 py-3 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Prev
                </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    );
}
