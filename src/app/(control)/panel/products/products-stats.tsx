import { Hash, TrendingUp } from "lucide-react";

import { CardStatItem } from "@/components/card-stat-item";
import { getProductsStats } from "@/fetchs/products";
import { formatCurrency } from "@/lib/utils";

export async function ProductsStats() {
	const stats = await getProductsStats();
	if (stats.error || !stats.data) {
		return;
	}

	const { total, total_can_earn } = stats.data;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
			<CardStatItem
				title="Total products"
				icon={<Hash />}
				total={Number(total)}
			/>
			<CardStatItem
				title="can earn"
				icon={<TrendingUp />}
				total={formatCurrency(Number(total_can_earn))}
			/>
		</div>
	);
}
