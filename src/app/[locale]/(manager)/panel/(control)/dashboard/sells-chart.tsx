import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { Chart } from "./_components/chart";
import { getAllSellsAreaProducts } from "@/fetchs/sell-area";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { CardsStadistics } from "./_components/cards-stadistics";

export async function SellsChart({ limit }: { limit: number }) {
	const response = await getAllSellsAreaProducts(limit);

	const messages = await getMessages();

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<NextIntlClientProvider messages={{ dashboard: messages.dashboard }}>
			<Chart data={response.data} limit={limit} />
			<CardsStadistics data={response.data} />
		</NextIntlClientProvider>
	);
}
