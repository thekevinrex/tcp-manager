import { CreditCard, DollarSign, Hash, TrendingUp } from "lucide-react";

import { CardStatItem } from "@/components/card-stat-item";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { getInventoriesStats } from "@/fetchs/inventories";
import { formatCurrency } from "@/lib/utils";

export async function InventoriesStats() {
	const response = await getInventoriesStats();

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	const { total_cant, total_invert, total_left, total_selled } = response.data;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
			<CardStatItem
				title="Total elements"
				icon={<Hash />}
				total={Number(total_cant)}
			/>
			<CardStatItem
				title="Total selled"
				icon={<CreditCard />}
				total={Number(total_selled)}
			/>

			<CardStatItem
				title="Money invertido"
				icon={<TrendingUp />}
				total={formatCurrency(total_left)}
			/>

			<CardStatItem
				title="Total Money Invertido"
				icon={<DollarSign />}
				total={formatCurrency(total_invert)}
			/>
		</div>
	);
}
