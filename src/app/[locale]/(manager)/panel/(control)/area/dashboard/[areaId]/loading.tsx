import { useTranslations } from "next-intl";
import { CardListSkeleton } from "@/components/skeletons/card-list";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

export default function LoadingAreaStadistics() {
	const _ = useTranslations("areas");

	return (
		<>
			<CardListSkeleton />

			<div className="flex flex-col space-y-2">
				<h2 className="text-xl font-semibold">{_("sell_stats_products")}</h2>
				<p className="text-base text-muted-foreground">
					{_("sell_stats_products_des")}
				</p>

				<DataTableSkeleton />
			</div>
		</>
	);
}
