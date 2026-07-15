"use client";

import { useState, useMemo } from "react";
import {
    useReactTable, getCoreRowModel, getSortedRowModel,
    getPaginationRowModel, flexRender, createColumnHelper, SortingState,
} from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/lib/store/filterStore";
import { parsePriceRange, parseNpuTops } from "@/lib/utils/parse";
import Link from "next/link";

type Processor = {
    processorId: string; brand: string; model: string; series: string;
    basePower: string; maxPower: string; npuTops: string; priceRangeINR: string;
};

const columnHelper = createColumnHelper<Processor>();
const columns = [
    columnHelper.accessor("brand", { header: "Brand" }),
    columnHelper.accessor("model", { header: "Model" }),
    columnHelper.accessor("series", { header: "Series" }),
    columnHelper.accessor((row) => `${row.basePower} / ${row.maxPower}`, { id: "power", header: "TDP" }),
    columnHelper.accessor("npuTops", { header: "NPU TOPS" }),
    columnHelper.accessor("priceRangeINR", { header: "Price (INR)" }),
];

export default function ProcessorTable({ data }: { data: Processor[] }) {

    const [sorting, setSorting] = useState<SortingState>([]);

    const { brand, series, priceMin, priceMax, npuMin, npuMax } = useFilterStore();
    const filteredData = useMemo(() => {
        return data.filter((p) => {
            if (brand && p.brand !== brand) return false;
            if (series && p.series !== series) return false;
            const [pMin, pMax] = parsePriceRange(p.priceRangeINR);
            if (priceMax > 0 && (pMax < priceMin || pMin > priceMax)) return false;
            const npuVal = parseNpuTops(p.npuTops);
            if (npuMax > 0 && (npuVal < npuMin || npuVal > npuMax)) return false;
            return true;
        });
    }, [data, brand, series, priceMin, priceMax, npuMin, npuMax]);

    const table = useReactTable({
        data: filteredData, columns, state: { sorting }, onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
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
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-6 text-muted-foreground">
                                No data found matching these filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.original.processorId} className="cursor-pointer hover:bg-muted/50">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                    <Link href={`/processors/${row.original.processorId}`} className="block">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Link>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
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
