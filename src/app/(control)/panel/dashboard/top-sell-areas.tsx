import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getTopSellAreas } from "@/fetchs/sell-area";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function TopSellAreas({ limit }: { limit: number }) {
	const response = await getTopSellAreas(limit);

	if (response.error) {
		return;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Top products</CardTitle>
				<CardDescription>Los productos con mas recaudacion</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col space-y-5">
				{response.data && response.data.length > 0 ? (
					response.data.map((area, i) => {
						return (
							<div key={i} className="w-full flex justify-between items-center">
								<span className="text-base font-semibold">
									{formatDate({ f: area.createdAt, t: false })}
								</span>

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
					<p>No enoung data to show</p>
				)}
			</CardContent>
		</Card>
	);
}
