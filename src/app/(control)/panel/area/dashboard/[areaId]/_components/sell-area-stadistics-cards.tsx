"use client";

import { CreditCard, DollarSign, Hash, TrendingUp } from "lucide-react";

import { SellWithProductAndInventories } from "@/lib/types";
import { useMemo } from "react";
import { calcStadisticsSell, formatCurrency } from "@/lib/utils";
import { CardStatItem } from "@/components/card-stat-item";

export function SellAreaStadisticsCard({
	sells,
	total,
}: {
	sells: SellWithProductAndInventories[];
	total: number;
}) {
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
			<CardStatItem title="Operations" icon={<Hash />} total={total} />
			<CardStatItem
				title="Cant Sells items"
				icon={<CreditCard />}
				total={sellsData.sells}
			/>
			<CardStatItem
				title="Total Sells"
				icon={<DollarSign />}
				total={formatCurrency(sellsData.total)}
			/>
			<CardStatItem
				title="Earns"
				icon={<TrendingUp />}
				total={formatCurrency(sellsData.earned)}
			/>
		</div>
	);
}
