import {
	getMessages,
	getTranslations,
	unstable_setRequestLocale,
} from "next-intl/server";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

import { getProduct } from "@/fetchs/products";
import { FetchFailedError } from "@/components/error/FetchFailed";

import { ProductPublicSettings } from "../_components/product-public";
import { ProductInfo } from "../_components/product-info";

export default async function ProductSettingsPage({
	params: { locale, productId },
}: {
	params: { locale: string; productId: string };
}) {
	unstable_setRequestLocale(locale);

	const _ = await getTranslations("products");
	const messages = await getMessages();

	const response = await getProduct(parseInt(productId), {
		inventories: false,
		selleds: false,
		_count: false,
	});

	if (response.error) {
		return <FetchFailedError error={response.error} />;
	}

	if (!response.data) {
		redirect(`/${locale}/panel/products`);
	}

	return (
		<section className="flex flex-col gap-y-5">
			<div className="flex flex-col md:flex-row gap-5">
				<div className="w-full max-w-sm flex flex-col">
					<NextIntlClientProvider
						messages={{
							products: messages.products,
							alert: messages.alert,
							fieldsErrors: messages.fieldsErrors,
						}}
					>
						<ProductInfo product={response.data} />
					</NextIntlClientProvider>
				</div>

				<div className="w-full flex flex-col">
					<header className="flex flex-col gap-y-3">
						<h2 className="text-xl font-semibold md:text-2xl">
							{_("product_settings")}
						</h2>

						<div className="flex"></div>
					</header>

					<NextIntlClientProvider
						messages={{
							products: messages.products,
							fieldsErrors: messages.fieldsErrors,
						}}
					>
						<ProductPublicSettings product={response.data} />
					</NextIntlClientProvider>
				</div>
			</div>
		</section>
	);
}
