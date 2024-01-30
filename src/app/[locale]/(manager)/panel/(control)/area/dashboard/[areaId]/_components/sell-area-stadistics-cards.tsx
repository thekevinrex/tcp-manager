import { CreditCard, DollarSign, Hash, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { SellWithProductAndInventories } from "@/lib/types";
import { calcStadisticsSell, formatCurrency } from "@/lib/utils";
import { CardStatItem } from "@/components/card-stat-item";

export function SellAreaStadisticsCard({
	sells,
	total,
}: {
	sells: SellWithProductAndInventories[];
	total: number;
}) {
	const _ = useTranslations("areas");

	const sellsData = useMemo(() => {
		const Data = {
			sells: 0,
			total: 0,
			earned: 0,
		};

		for (const sell of sells) {
			const stats = calcStadisticsSell(sell);

			Data.sells += stats.cant;
			Data.total += stats.total;
			Data.earned += stats.earend;
		}

		return Data;
	}, [sells]);

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
			<CardStatItem title={_("sells")} icon={<Hash />} total={total} />
			<CardStatItem
				title={_("sells_unit")}
				icon={<CreditCard />}
				total={sellsData.sells}
			/>
			<CardStatItem
				title={_("total_sells")}
				icon={<DollarSign />}
				total={formatCurrency(sellsData.total)}
			/>
			<CardStatItem
				title={_("total_earn")}
				icon={<TrendingUp />}
				total={formatCurrency(sellsData.earned)}
			/>
		</div>
	);
}
