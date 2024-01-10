"use client";

import { Suspense, useState } from "react";
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
import { Badge, BadgeProps } from "@/components/ui/badge";

import { SelectedProducts } from "./selected-products";
import { formatCurrency } from "@/lib/utils";
import { SupabaseImage } from "@/components/Image";
import { ProductsWithPrices } from "@/lib/types";

const StatusMapVariant: Record<string, BadgeProps["variant"]> = {
	hidden: "secondary",
	visible: "green",
	out_stock: "destructive",
};

export const columns: ColumnDef<ProductsWithPrices>[] = [
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
				<div className="capitalize flex flex-row items-center gap-5">
					<picture className="w-[180px] h-[120px] flex items-center justify-center shrink-0">
						<SupabaseImage
							alt={row.original.name}
							src={row.original.image}
							width={180}
							height={120}
						/>
					</picture>
					<div className="flex flex-col space-y-2 max-w-lg">
						<span className="text-lg font-semibold capitalize tracking-tight">
							{row.getValue("name")}
						</span>
						{row.original.description && (
							<p className="text-sm text-ellipsis line-clamp-3">
								{row.original.description}
							</p>
						)}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "aviable",
		header: () => {
			return <div className="text-center">Aviable</div>;
		},
		cell: ({ row }) => {
			return <div className="text-center">{row.original.aviable}</div>;
		},
	},
	{
		accessorKey: "status",
		header: () => {
			return <div className="text-center">Status</div>;
		},
		cell: ({ row }) => {
			return (
				<div className="text-center">
					<Badge
						variant={StatusMapVariant[row.original.status]}
						className="capitalize"
					>
						{row.getValue("status")}
					</Badge>
				</div>
			);
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
					<div className="flex flex-col w-auto items-end space-y-2">
						<div className="font-semibold text-lg text-green-500">
							{formatCurrency(amount)}
						</div>
						{row.original.prices && row.original.prices?.length > 0 ? (
							<div className="">
								{row.original.prices?.map(({ id, cant, value }) => {
									return (
										<span key={id} className="text-sm text-muted-foreground">
											{cant} {">"} {formatCurrency(value)}
										</span>
									);
								})}
							</div>
						) : null}
					</div>
				</div>
			);
		},
	},
];

export function DataProducts({ products }: { products: ProductsWithPrices[] }) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable<ProductsWithPrices>({
		data: products,
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
				<SelectedProducts table={table} />
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
									No product created.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
