import { getTranslations } from "next-intl/server";

import { CardFetchError } from "@/components/error/CardFetchError";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getTopProducts } from "@/fetchs/sell-area";
import { formatCurrency } from "@/lib/utils";

export async function TopProducts({ limit }: { limit: number }) {
	const response = await getTopProducts(limit);
	const _ = await getTranslations("dashboard");

	if (response.error) {
		return <CardFetchError error={response.error} />;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{_("top_products")}</CardTitle>
				<CardDescription>{_("top_products_des")}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col space-y-5">
				{response.data && response.data.length > 0 ? (
					response.data.map((area) => {
						return (
							<div
								key={area.name}
								className="w-full flex justify-between items-center"
							>
								<span className="text-base font-semibold">{area.name}</span>

								<div className="flex flex-col items-end shrink-0">
									<span className="text-lg font-bold">
										{formatCurrency(area.total_sells)}
									</span>
									<span className="text-sm font-semibold text-muted-foreground">
										{formatCurrency(area.total_earns)}
									</span>
								</div>
							</div>
						);
					})
				) : (
					<p>{_("no_data")}</p>
				)}
			</CardContent>
		</Card>
	);
}
