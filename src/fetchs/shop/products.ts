import db from "@/lib/db";
import {
	ProductsWithPrices,
	ProductsWithPricesAndOrg,
	ReturnFetch,
} from "@/lib/types";
import { getTranslations } from "next-intl/server";

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

export async function getOrganizationsProductsAviable(
	orgId: string
): Promise<ReturnFetch<ProductsWithPrices[]>> {
	const _ = await getTranslations("error");

	try {
		const products = await db.product.findMany({
			where: {
				org: orgId,
				aviable: {
					gt: 0,
				},
			},
			include: {
				prices: true,
			},
		});

		return { data: products };
	} catch {
		return { error: _("error") };
	}
}
