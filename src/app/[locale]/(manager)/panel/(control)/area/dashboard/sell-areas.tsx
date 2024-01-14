import { getAllSellAreas } from "@/fetchs/sell-area";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { AreasTable } from "./_components/areas-table";
import { PaginationComponent } from "@/components/pagination";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

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
	const messages = await getMessages();

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<NextIntlClientProvider
			messages={{
				pagination: messages.pagination,
				alert: messages.alert,
				areas: messages.areas,
			}}
		>
			<div className="flex flex-col space-y-5">
				<AreasTable areas={response.data} />
				<PaginationComponent
					max={max}
					page={page}
					total={response.total || 0}
				/>
			</div>
		</NextIntlClientProvider>
	);
}
