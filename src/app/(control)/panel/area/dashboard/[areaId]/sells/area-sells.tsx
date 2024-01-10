import { SellArea } from "@prisma/client";
import { DataSells } from "../_components/sells-data-table";
import { PaginationComponent } from "@/components/pagination";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { getAreaSells } from "@/fetchs/sells";

export async function AreaSellAll({
	area,
	max,
	query,
	page,
}: {
	area: SellArea;
	max: number;
	query: string;
	page: number;
}) {
	const response = await getAreaSells(area, query, page, max);

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<>
			<DataSells sells={response.data} />
			<PaginationComponent page={page} max={max} total={response?.total || 0} />
		</>
	);
}
