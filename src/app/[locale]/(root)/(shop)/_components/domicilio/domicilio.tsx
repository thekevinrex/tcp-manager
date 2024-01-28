import { NextIntlClientProvider, useTranslations } from "next-intl";

import { getOrganizationsProductsAviable } from "@/fetchs/shop/products";

import { DomicilioForm } from "./domicilioModal";
import { getMessages, getTranslations } from "next-intl/server";

export const DomicilioDo = async ({
	orgId,
	productId,
}: {
	orgId: string;
	productId?: number;
}) => {
	const _ = await getTranslations("home");
	const messages = await getMessages();

	const products = await getOrganizationsProductsAviable(orgId);

	if (products.error || !products.data) {
		return;
	}

	return (
		<NextIntlClientProvider messages={{ home: messages.home }}>
			<DomicilioForm
				orgId={orgId}
				products={products.data}
				productId={productId}
			/>
		</NextIntlClientProvider>
	);
};
