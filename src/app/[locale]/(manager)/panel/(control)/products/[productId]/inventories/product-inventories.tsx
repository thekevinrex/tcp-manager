import { useTranslations } from "next-intl";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { formatCurrency, formatDate } from "@/lib/utils";
import { Inventory } from "@prisma/client";

export function ProductInventoriesTable({
	inventories,
}: {
	inventories: Inventory[];
}) {
	const _ = useTranslations("inventories");

	return (
		<div className="w-full rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{_("selled")}</TableHead>
						<TableHead>{_("cant")}</TableHead>
						<TableHead>{_("cost")}</TableHead>
						<TableHead>{_("total")}</TableHead>
						<TableHead>{_("date")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{inventories.length ? (
						inventories.map((row) => {
							return (
								<TableRow key={row.id}>
									<TableCell>{row.selled}</TableCell>
									<TableCell>{row.cant}</TableCell>
									<TableCell>{formatCurrency(row.total)}</TableCell>
									<TableCell>{formatCurrency(row.cant * row.total)}</TableCell>
									<TableCell>
										{formatDate({ f: row.createdAt, t: false })}
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
