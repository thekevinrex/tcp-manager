import { DataType } from "@/lib/types";
import { Product } from "@prisma/client";

import { InventoryForm } from "./_components/inventory-form";
import { getProductsBasic } from "@/fetchs/products";

export async function AddInventory() {
	const products = await getProductsBasic();

	const productsMapped: DataType[] =
		products?.data?.map((product: Product) => {
			return {
				value: String(product.id),
				label: product.name,
			};
		}) || [];

	return <InventoryForm products={productsMapped} />;
}
