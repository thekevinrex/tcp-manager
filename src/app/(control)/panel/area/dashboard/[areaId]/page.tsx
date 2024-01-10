import { FetchFailedError } from "@/components/error/FetchFailed";
import { getArea } from "@/fetchs/sell-area";
import { getProductSelledArea } from "@/fetchs/sells";
import { SellAreaStadisticsCard } from "./_components/sell-area-stadistics-cards";
import { SellsStadisticsTable } from "./_components/sells-stadistics-table";

export default async function Area({
	params,
}: {
	params: {
		areaId: string;
	};
}) {
	const areaResponse = await getArea(Number(params.areaId));

	if (areaResponse.error || !areaResponse.data) {
		return <FetchFailedError error={areaResponse.error} />;
	}

	const response = await getProductSelledArea(areaResponse.data);

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<>
			<SellAreaStadisticsCard sells={response.data} total={response.total} />
			<div className="flex flex-col space-y-2">
				<h2 className="text-xl font-semibold">Stadistics of each product</h2>
				<p className="text-base text-muted-foreground">
					This is the list of all the products selled in this sell area, with
					the total of sell per product, and the aproximate earn of the product
				</p>

				<SellsStadisticsTable sells={response.data} />
			</div>
		</>
	);
}
