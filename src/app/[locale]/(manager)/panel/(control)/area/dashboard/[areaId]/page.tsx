import { FetchFailedError } from "@/components/error/FetchFailed";
import { getArea } from "@/fetchs/sell-area";
import { getProductSelledArea } from "@/fetchs/sells";
import { SellAreaStadisticsCard } from "./_components/sell-area-stadistics-cards";
import { SellsStadisticsTable } from "./_components/sells-stadistics-table";
import {
	getMessages,
	getTranslations,
	unstable_setRequestLocale,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export default async function Area({
	params,
}: {
	params: {
		areaId: string;
		locale: string;
	};
}) {
	unstable_setRequestLocale(params.locale);
	const _ = await getTranslations("areas");
	const messages = await getMessages();

	const areaResponse = await getArea(Number(params.areaId));

	if (areaResponse.error || !areaResponse.data) {
		return <FetchFailedError error={areaResponse.error} />;
	}

	const response = await getProductSelledArea(areaResponse.data);

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<NextIntlClientProvider messages={{ areas: messages.areas }}>
			<SellAreaStadisticsCard sells={response.data} total={response.total} />
			<div className="flex flex-col space-y-2">
				<h2 className="text-xl font-semibold">{_("sell_stats_products")}</h2>
				<p className="text-base text-muted-foreground">
					{_("sell_stats_products_des")}
				</p>

				<SellsStadisticsTable sells={response.data} />
			</div>
		</NextIntlClientProvider>
	);
}
