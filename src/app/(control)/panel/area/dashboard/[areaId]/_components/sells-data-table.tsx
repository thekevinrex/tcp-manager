"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { formatCurrency, formatDate } from "@/lib/utils";
import { SellWithProduct } from "@/lib/types";
import { SelectedSells } from "./selected-area-sell";

export const columns: ColumnDef<SellWithProduct>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			return (
				<span className="text-lg font-semibold capitalize tracking-tight">
					{row.original.Product.name}
				</span>
			);
		},
	},
	{
		accessorKey: "cant",
		header: () => {
			return <div className="text-center">Cant</div>;
		},
		cell: ({ row }) => {
			return <div className="text-center">{row.getValue("cant")}</div>;
		},
	},
	{
		accessorKey: "price",
		header: ({ column }) => {
			return (
				<div className="text-center">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Price
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("price"));

			return (
				<div className="flex items-center justify-center">
					{formatCurrency(amount)}
				</div>
			);
		},
	},
	{
		accessorKey: "total",
		header: () => {
			return <div className="text-center">Total price</div>;
		},
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("price"));
			return (
				<div className="flex items-center justify-center">
					<div className="font-semibold text-lg text-green-500">
						{formatCurrency(amount * row.original.cant)}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "selledAt",
		header: () => {
			return <div className="text-center">Date</div>;
		},
		cell: ({ row }) => {
			return (
				<div className="flex items-center justify-center">
					{formatDate({ f: row.original.selledAt || "" })}
				</div>
			);
		},
	},
];

export function DataSells({ sells }: { sells: SellWithProduct[] }) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable<SellWithProduct>({
		data: sells,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			rowSelection,
		},
	});

	return (
		<>
			{table.getSelectedRowModel()?.rows?.length > 0 && (
				<SelectedSells table={table} />
			)}

			<div className="w-full rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel()?.rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No sells madded.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
