"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { formatCurrency, formatDate } from "@/lib/utils";
import { InventoryWithProduct } from "@/lib/types";

import { EditInventory } from "./edit-inventory";
import { DeleteBotton } from "./delete-inventory";

export function InventoriesTable({
	inventories,
}: {
	inventories: InventoryWithProduct[];
}) {
	return (
		<div className="w-full rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Product</TableHead>
						<TableHead>Selled</TableHead>
						<TableHead>Cant</TableHead>
						<TableHead>Cost</TableHead>
						<TableHead>Total</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{inventories.length ? (
						inventories.map((row) => {
							return (
								<TableRow key={row.id}>
									<TableCell>{row.Product.name}</TableCell>
									<TableCell>{row.selled}</TableCell>
									<TableCell>{row.cant}</TableCell>
									<TableCell>{formatCurrency(row.total)}</TableCell>
									<TableCell>{formatCurrency(row.cant * row.total)}</TableCell>
									<TableCell>
										{formatDate({ f: row.createdAt, t: false })}
									</TableCell>
									<TableCell>
										<div className="flex gap-x-2">
											<EditInventory inventory={row} />
											<DeleteBotton inventory={row} />
										</div>
									</TableCell>
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell className="h-24 text-center">
								No inventories added.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
