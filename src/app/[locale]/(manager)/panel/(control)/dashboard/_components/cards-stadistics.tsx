"use client";

import { useMemo } from "react";
import { CreditCard, DollarSign, Hash, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { calcStadisticsSell, formatCurrency } from "@/lib/utils";
import { SellAreaWithProductAndSells } from "@/lib/types";
import { CardStatItem } from "@/components/card-stat-item";

export function CardsStadistics({
	data,
}: {
	data: SellAreaWithProductAndSells[];
}) {
	const _ = useTranslations("dashboard");

	const sellsData = useMemo(() => {
		const Data = {
			oper: 0,
			sells: 0,
			total: 0,
			earned: 0,
		};

		for (const area of data) {
			for (const sell of area.Sells) {
				const stats = calcStadisticsSell(sell);

				Data.sells += stats.cant;
				Data.total += stats.total;
				Data.earned += stats.earend;
			}

			Data.oper += area.Sells.length;
		}

		return Data;
	}, [data]);

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 my-5">
			<CardStatItem
				title={_("operations")}
				icon={<Hash />}
				total={sellsData.oper}
			/>
			<CardStatItem
				title={_("cant_sell_items")}
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
