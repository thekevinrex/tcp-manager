import { getActiveArea } from "@/fetchs/sell-area";
import { getAllProductsWithPrices } from "@/fetchs/products";

import { FetchFailedError } from "@/components/error/FetchFailed";
import { SellArea } from "./sell-area";
import { CreateArea } from "../area/_components/create-area";
import {
	getMessages,
	getTranslations,
	unstable_setRequestLocale,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { auth } from "@clerk/nextjs";
import { NoPermission } from "@/components/page/no-permission";

export default async function Page({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	const { has } = auth();

	if (!has({ permission: "org:sells:manage" })) {
		return (
			<ErrorLayout>
				<NoPermission />
			</ErrorLayout>
		);
	}
	const areaResponse = await getActiveArea();

	const _ = await getTranslations("areas");
	const messages = await getMessages();

	if (areaResponse.error) {
		return (
			<ErrorLayout>
				<FetchFailedError error={areaResponse.error} />
			</ErrorLayout>
		);
	}

	if (!areaResponse.data) {
		return (
			<ErrorLayout>
				<div className="w-full flex justify-center items-center space-y-5 flex-col min-h-[450px]">
					<h2 className="text-2xl font-bold tracking-widest uppercase text-pretty text-center">
						{_("no_active_area")}
					</h2>

					<p>{_("no_active_area_des")}</p>

					<NextIntlClientProvider
						messages={{ areas: messages.areas, alert: messages.alert }}
					>
						<CreateArea />
					</NextIntlClientProvider>
				</div>
			</ErrorLayout>
		);
	}

	const areaProducts = await getAllProductsWithPrices();

	if (areaProducts.error || !areaProducts.data) {
		return (
			<ErrorLayout>
				<FetchFailedError error={areaProducts.error} />
			</ErrorLayout>
		);
	}

	return (
		<NextIntlClientProvider
			messages={{
				alert: messages.alert,
				areas: messages.areas,
				sells: messages.sells,
			}}
		>
			<SellArea
				area={areaResponse.data}
				areaProducts={areaProducts?.data || []}
			/>
		</NextIntlClientProvider>
	);
}

const ErrorLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<main className="[grid-area:main] flex flex-col">{children}</main>
			<aside className="[grid-area:aside]"></aside>
		</>
	);
};
