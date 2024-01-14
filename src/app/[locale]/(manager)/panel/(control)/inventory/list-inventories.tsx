import { PaginationComponent } from "@/components/pagination";
import { getAllInventories } from "@/fetchs/inventories";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { InventoriesTable } from "./_components/inventories-table";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export async function ListInventories({
	query,
	page = 1,
	max,
}: {
	query: string;
	page: number;
	max: number;
}) {
	const response = await getAllInventories({ query, page, max });
	const messages = await getMessages();

	if (response?.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<NextIntlClientProvider
			messages={{
				inventories: messages.inventories,
				pagination: messages.pagination,
				alert: messages.alert,
			}}
		>
			<div className="flex flex-col space-y-5">
				<InventoriesTable inventories={response.data} />
				<PaginationComponent
					page={page}
					total={response?.total || 0}
					max={max}
				/>
			</div>
		</NextIntlClientProvider>
	);
}
