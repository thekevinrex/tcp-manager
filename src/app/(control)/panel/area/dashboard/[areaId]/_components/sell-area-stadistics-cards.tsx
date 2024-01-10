"use client";

import { CreditCard, DollarSign, Hash, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SellWithProductAndInventories } from "@/lib/types";
import { useMemo } from "react";
import { calcStadisticsSell, formatCurrency } from "@/lib/utils";

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
			<CardItem title="Operations" icon={<Hash />} total={total} />
			<CardItem
				title="Cant Sells items"
				icon={<CreditCard />}
				total={sellsData.sells}
			/>
			<CardItem
				title="Total Sells"
				icon={<DollarSign />}
				total={formatCurrency(sellsData.total)}
			/>
			<CardItem
				title="Earns"
				icon={<TrendingUp />}
				total={formatCurrency(sellsData.earned)}
			/>
		</div>
	);
}

const CardItem = ({
	title,
	total,
	icon,
}: {
	title: string;
	total: number | string;
	icon: JSX.Element;
}) => {
	return (
		<Card className="">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>

			<CardContent>
				<div className="text-2xl font-bold">{total}</div>
			</CardContent>
		</Card>
	);
};
