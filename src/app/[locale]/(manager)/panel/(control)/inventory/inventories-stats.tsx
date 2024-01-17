import { CreditCard, DollarSign, Hash, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CardStatItem } from "@/components/card-stat-item";
import { getInventoriesStats } from "@/fetchs/inventories";
import { formatCurrency } from "@/lib/utils";

export async function InventoriesStats() {
	const response = await getInventoriesStats();
	const _ = await getTranslations("inventories");

	if (response.error || !response.data) {
		return;
	}

	const { total_cant, total_invert, total_left, total_selled } = response.data;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
			<CardStatItem
				title={_("total_inventories")}
				icon={<Hash />}
				total={Number(total_cant)}
			/>
			<CardStatItem
				title={_("total_sells")}
				icon={<CreditCard />}
				total={Number(total_selled)}
			/>

			<CardStatItem
				title={_("total_actual_invertido")}
				icon={<TrendingUp />}
				total={formatCurrency(total_left)}
			/>

			<CardStatItem
				title={_("total_invertido")}
				icon={<DollarSign />}
				total={formatCurrency(total_invert)}
			/>
		</div>
	);
}
