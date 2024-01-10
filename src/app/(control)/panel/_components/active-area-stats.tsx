"use client";

import { SellWithProductAndInventories } from "@/lib/types";
import { calcStadisticsSell, formatCurrency } from "@/lib/utils";
import { useMemo } from "react";

export function ActiveAreaStats({
	sells,
}: {
	sells: SellWithProductAndInventories[];
}) {
	const sellsData = useMemo(() => {
		const Data = {
			total: 0,
			earned: 0,
		};

		for (const sell of sells) {
			const stats = calcStadisticsSell(sell);

			Data.total += stats.total;
			Data.earned += stats.earend;
		}

		return Data;
	}, [sells]);

	return (
		<div className="flex flex-col space-y-3">
			<div className="flex justify-between items-center">
				<span>Sells :</span>
				<span className="text-green-500 font-semibold tracking-wider">
					{formatCurrency(sellsData.total)}
				</span>
			</div>

			<div className="flex justify-between items-center">
				<span>Earns :</span>
				<span className="text-green-500 font-semibold tracking-wider">
					{formatCurrency(sellsData.earned)}
				</span>
			</div>
		</div>
	);
}
