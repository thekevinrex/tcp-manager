import { Organization } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { FetchFailedError } from "@/components/error/FetchFailed";
import { getOrganizationTransactions } from "@/fetchs/organization";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function Transactions({ org }: { org: Organization }) {
	const response = await getOrganizationTransactions(org.org);
	const _ = await getTranslations("organization");

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<div className="w-full rounded-md border mt-6">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{_("plan")}</TableHead>
						<TableHead>{_("method")}</TableHead>
						<TableHead>{_("price")}</TableHead>
						<TableHead>{_("date")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{response.data.length ? (
						response.data.map((row) => {
							return (
								<TableRow key={row.id}>
									<TableCell>{_(row.plan)}</TableCell>
									<TableCell>{_(row.method)}</TableCell>
									<TableCell>
										{row.price === 0 ? _("free") : formatCurrency(row.price)}
									</TableCell>
									<TableCell>
										{formatDate({ f: row.createdAt, t: false })}
									</TableCell>
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell className="h-24 text-center">
								{_("no_transactions")}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
