import { SellArea } from "@prisma/client";
import { DataSells } from "../_components/sells-data-table";
import { PaginationComponent } from "@/components/pagination";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { getAreaSells } from "@/fetchs/sells";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

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
	const messages = await getMessages();

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<NextIntlClientProvider
			messages={{
				sells: messages.sells,
				alert: messages.alert,
				pagination: messages.pagination,
			}}
		>
			<DataSells sells={response.data} />
			<PaginationComponent page={page} max={max} total={response?.total || 0} />
		</NextIntlClientProvider>
	);
}
