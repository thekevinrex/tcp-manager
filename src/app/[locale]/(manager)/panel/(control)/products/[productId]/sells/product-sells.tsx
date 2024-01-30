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
import { Sell } from "@prisma/client";

export function ProductSellsTable({ sells }: { sells: Sell[] }) {
	const _ = useTranslations("sells");

	return (
		<div className="w-full rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{_("cant")}</TableHead>
						<TableHead>{_("sell_price")}</TableHead>
						<TableHead>{_("total_sell")}</TableHead>
						<TableHead>{_("date")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sells.length ? (
						sells.map((row) => {
							return (
								<TableRow key={row.id}>
									<TableCell>{row.cant}</TableCell>
									<TableCell>{formatCurrency(row.price)}</TableCell>
									<TableCell>
										<div className="flex">
											<div className="font-semibold text-lg text-green-500">
												{formatCurrency(row.cant * row.price)}
											</div>
										</div>
									</TableCell>
									<TableCell>{formatDate({ f: row.selledAt })}</TableCell>
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell className="h-24 text-center">
								{_("no_sells")}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
