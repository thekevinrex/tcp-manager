import { BarChart3, Edit, EyeIcon, ListMinus } from "lucide-react";
import Link from "next/link";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { DeleteArea } from "../_components/delete-area";
import { formatDate } from "@/lib/utils";
import { SellAreaWithTotalSells } from "@/lib/types";
import { useTranslations } from "next-intl";

export function AreasTable({ areas }: { areas: SellAreaWithTotalSells[] }) {
	const _ = useTranslations("areas");

	return (
		<div className="w-full rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{_("started")}</TableHead>
						<TableHead>{_("ended")}</TableHead>
						<TableHead>{_("sells")}</TableHead>
						<TableHead>{_("actions")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{areas && areas.length > 0 ? (
						areas.map((area) => {
							return (
								<TableRow key={area.id}>
									<TableCell>{formatDate({ f: area.createdAt })}</TableCell>
									<TableCell>
										{area.endedAt
											? formatDate({ f: area.createdAt })
											: _("active")}
									</TableCell>
									<TableCell>{area._count.Sells}</TableCell>
									<TableCell>
										<div className="flex space-x-2">
											<Link href={`/panel/area/dashboard/${area.id}`}>
												<Button variant={"ghost"}>
													<BarChart3 />
												</Button>
											</Link>

											<Link href={`/panel/area/dashboard/${area.id}/sells`}>
												<Button variant={"ghost"}>
													<ListMinus />
												</Button>
											</Link>

											{area.endedAt && <DeleteArea area={area} />}
										</div>
									</TableCell>
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell className="h-24 text-center">
								{_("no_sell_areas")}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
