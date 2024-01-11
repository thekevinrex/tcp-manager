import { getAllSellAreas } from "@/fetchs/sell-area";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { AreasTable } from "./_components/areas-table";
import { PaginationComponent } from "@/components/pagination";

export async function SellAreas({
	filters,
	page = 1,
	max = 5,
}: {
	filters?: string;
	page?: number;
	max?: number;
}) {
	const response = await getAllSellAreas({ page, max });

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<div className="flex flex-col space-y-5">
			<AreasTable areas={response.data} />
			<PaginationComponent max={max} page={page} total={response.total || 0} />
		</div>
	);
}
