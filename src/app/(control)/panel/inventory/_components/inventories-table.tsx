"use client";

import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { formatCurrency, formatDate } from "@/lib/utils";
import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { InventoryWithProduct } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { deleteInventory } from "@/actions/inventories/delete-inventory";

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
										<DeleteBotton inventory={row} />
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

const DeleteBotton = ({ inventory }: { inventory: InventoryWithProduct }) => {
	const { execute, isLoading: loading } = useAction(deleteInventory, {
		onSuccess: () => {
			toast.success("Inventory deleted successfully");
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const handleAction = () => {
		execute({ id: inventory.id });
	};

	return (
		<AlertModal
			title={"Delete inventory"}
			description="Are you sure you want to delete the inventory, if yoy delete the inventory the product aviable cant is going to decrease in the cant of the inventory?"
			trigger={
				<AlertDialogTrigger asChild>
					<Button variant="destructive" disabled={loading}>
						{loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
					</Button>
				</AlertDialogTrigger>
			}
			onAction={handleAction}
		/>
	);
};
