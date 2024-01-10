import { Chart } from "./_components/chart";
import { getAllSellsAreaProducts } from "@/fetchs/sell-area";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { CardsStadistics } from "./_components/cards-stadistics";

export async function SellsChart({ limit }: { limit: number }) {
	const response = await getAllSellsAreaProducts(limit);

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<>
			<Chart data={response.data} limit={limit} />
			<CardsStadistics data={response.data} />
		</>
	);
}
