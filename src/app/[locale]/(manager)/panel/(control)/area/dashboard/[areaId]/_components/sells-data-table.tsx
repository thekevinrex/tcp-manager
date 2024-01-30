"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

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
import Link from "@/components/link";

export function DataSells({ sells }: { sells: SellWithProduct[] }) {
	const _ = useTranslations("sells");

	const [sorting, setSorting] = useState<SortingState>([]);
	const [rowSelection, setRowSelection] = useState({});

	const columns: ColumnDef<SellWithProduct>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label={_("select_all")}
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label={_("select_row")}
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "Product.name",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					{_("product")}
					{column.getIsSorted() ? (
						column.getIsSorted() === "asc" ? (
							<ArrowDown className="ml-2 h-4 w-4" />
						) : (
							<ArrowUp className="ml-2 h-4 w-4" />
						)
					) : (
						<ArrowUpDown className="ml-2 h-4 w-4" />
					)}
				</Button>
			),
			cell: ({ row }) => {
				return (
					<Link
						href={`/panel/products/${row.original.Product.id}`}
						className="text-lg font-semibold capitalize tracking-tight"
					>
						{row.original.Product.name}
					</Link>
				);
			},
		},
		{
			accessorKey: "cant",
			header: () => {
				return <div className="text-center">{_("cant")}</div>;
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
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
						>
							{_("sell_price")}
							{column.getIsSorted() ? (
								column.getIsSorted() === "asc" ? (
									<ArrowDown className="ml-2 h-4 w-4" />
								) : (
									<ArrowUp className="ml-2 h-4 w-4" />
								)
							) : (
								<ArrowUpDown className="ml-2 h-4 w-4" />
							)}
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
				return <div className="text-center">{_("total_sell")}</div>;
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
				return <div className="text-center">{_("date")}</div>;
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
									{_("no_sells")}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
