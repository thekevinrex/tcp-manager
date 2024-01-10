"use client";

import { useMemo } from "react";
import { CreditCard, DollarSign, Hash, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { calcStadisticsSell, formatCurrency } from "@/lib/utils";
import { SellAreaWithProductAndSells } from "@/lib/types";

export function CardsStadistics({
	data,
}: {
	data: SellAreaWithProductAndSells[];
}) {
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
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
			<CardItem title="Operations" icon={<Hash />} total={sellsData.oper} />
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
