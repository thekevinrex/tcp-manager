import db from "@/lib/db";
import { ProductsWithPrices, ReturnFetch } from "@/lib/types";

export async function getTopProducts(
	max: number = 8
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
