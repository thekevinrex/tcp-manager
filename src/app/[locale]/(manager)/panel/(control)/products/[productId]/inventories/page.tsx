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
import { ProductInventoriesTable } from "./product-inventories";
import { ProductInfoRow } from "../_components/product-info";

export default async function ProductInventories({
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
		inventories: {
			skip: ((parseInt(page) || 1) - 1) * (parseInt(max) || 10),
			take: parseInt(max) || 10,
		},
		selleds: false,
		_count: {
			select: {
				inventories: true,
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

				<h2 className="text-xl font-semibold md:text-2xl">
					{_("inventories")}
				</h2>
			</header>

			<div className="flex flex-col space-y-5">
				<ProductInventoriesTable inventories={response.data.inventories} />
				<NextIntlClientProvider messages={{ pagination: messages.pagination }}>
					<PaginationComponent
						page={parseInt(page) || 1}
						total={response?.data._count.inventories || 0}
						max={parseInt(max) || 10}
					/>
				</NextIntlClientProvider>
			</div>
		</section>
	);
}
