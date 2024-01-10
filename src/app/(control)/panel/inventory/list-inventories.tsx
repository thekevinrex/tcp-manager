import { PaginationComponent } from "@/components/pagination";
import { getAllInventories } from "@/fetchs/inventories";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { InventoriesTable } from "./_components/inventories-table";

export async function ListInventories({
	query,
	page = 1,
}: {
	query: string;
	page: number;
}) {
	const response = await getAllInventories({ query, page, max: 5 });

	if (response?.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<div className="flex flex-col space-y-5">
			<InventoriesTable inventories={response.data} />
			<PaginationComponent page={page} total={response?.total || 0} max={5} />
		</div>
	);
}
