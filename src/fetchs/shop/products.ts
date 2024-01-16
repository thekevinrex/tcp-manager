import db from "@/lib/db";
import {
	ProductsWithPrices,
	ProductsWithPricesAndOrg,
	ReturnFetch,
} from "@/lib/types";

export async function getTopProducts(
	max: number = 8,
	not: number = 0
): Promise<ReturnFetch<ProductsWithPrices[]>> {
	try {
		// #TODO get top products

		const products = await db.product.findMany({
			where: {
				status: {
					not: "hidden",
				},
				organization: {
					visible: true,
				},
				id: {
					not: not,
				},
			},
			take: max,
			include: {
				prices: true,
			},
		});

		return { data: products };
	} catch {
		return { error: "An error ocurred" };
	}
}

export async function getProduct(
	productId: number
): Promise<ReturnFetch<ProductsWithPricesAndOrg>> {
	try {
		// #TODO get top products

		const products = await db.product.findUnique({
			where: {
				id: productId,
			},
			include: {
				prices: true,
				organization: true,
			},
		});

		return { data: products };
	} catch {
		return { error: "An error ocurred" };
	}
}
