import { NextIntlClientProvider } from "next-intl";
import {
	getMessages,
	getTranslations,
	unstable_setRequestLocale,
} from "next-intl/server";
import { redirect } from "next/navigation";

import { getProduct } from "@/fetchs/products";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { PaginationComponent } from "@/components/pagination";
import { ProductSellsTable } from "./product-sells";
import { ProductInfoRow } from "../_components/product-info";

export default async function ProductSells({
	params: { locale, productId },
	searchParams: { q, page, max },
}: {
	params: { locale: string; productId: string };
	searchParams: { q: string; page: string; max: string };
}) {
	unstable_setRequestLocale(locale);
	const _ = await getTranslations("products");
	const messages = await getMessages();

	const response = await getProduct(parseInt(productId), {
		selleds: {
			skip: ((parseInt(page) || 1) - 1) * (parseInt(max) || 10),
			take: parseInt(max) || 10,
			orderBy: {
				id: "desc",
			},
		},
		inventories: false,
		_count: {
			select: {
				selleds: true,
			},
		},
	});

	if (response.error) {
		return <FetchFailedError error={response.error} />;
	}

	if (!response.data) {
		redirect(`/${locale}/panel/products`);
	}

	return (
		<section className="flex flex-col gap-y-5">
			<header className="flex flex-col gap-y-3">
				<ProductInfoRow product={response.data} />
				<h2 className="text-xl font-semibold md:text-2xl">{_("sells")}</h2>
			</header>

			<div className="flex flex-col space-y-5">
				<ProductSellsTable sells={response.data.selleds} />

				<NextIntlClientProvider messages={{ pagination: messages.pagination }}>
					<PaginationComponent
						page={parseInt(page) || 1}
						total={response?.data._count.selleds || 0}
						max={parseInt(max) || 10}
					/>
				</NextIntlClientProvider>
			</div>
		</section>
	);
}
