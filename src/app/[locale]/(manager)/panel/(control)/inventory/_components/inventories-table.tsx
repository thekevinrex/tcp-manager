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
import { useTranslations } from "next-intl";

export function InventoriesTable({
	inventories,
}: {
	inventories: InventoryWithProduct[];
}) {
	const _ = useTranslations("inventories");

	return (
		<div className="w-full rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{_("product")}</TableHead>
						<TableHead>{_("selled")}</TableHead>
						<TableHead>{_("cant")}</TableHead>
						<TableHead>{_("cost")}</TableHead>
						<TableHead>{_("total")}</TableHead>
						<TableHead>{_("date")}</TableHead>
						<TableHead>{_("actions")}</TableHead>
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
								{_("no_inventories")}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
