import { DataType } from "@/lib/types";
import { Product } from "@prisma/client";

import { InventoryForm } from "./_components/inventory-form";
import { getProductsBasic } from "@/fetchs/products";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export async function AddInventory() {
	const products = await getProductsBasic();
	const messages = await getMessages();

	const productsMapped: DataType[] =
		products?.data?.map((product: Product) => {
			return {
				value: String(product.id),
				label: product.name,
			};
		}) || [];

	return (
		<NextIntlClientProvider messages={{ inventories: messages.inventories }}>
			<InventoryForm products={productsMapped} />
		</NextIntlClientProvider>
	);
}
