import { auth } from "@clerk/nextjs";
import { Prisma, Product } from "@prisma/client";

import db from "@/lib/db";
import { ProductsWithPrices, ReturnFetch } from "@/lib/types";

export async function fetchAllProducts({
	query = "",
	page = 1,
	ids,
	max = 5,
}: {
	query?: string;
	page?: number;
	max?: number;
	ids?: Array<number>;
}): Promise<ReturnFetch<ProductsWithPrices[]>> {
	const { orgId, userId } = auth();

	if (!orgId || !userId) {
		return { error: "Unauthorized" };
	}

	const where: Prisma.ProductWhereInput = {
		org: orgId,
	};

	if (query) {
		where.name = {
			contains: query,
			mode: "insensitive",
		};
	}

	if (ids) {
		where.id = {
			in: ids,
		};
	}

	try {
		const [products, total] = await db.$transaction([
			db.product.findMany({
				where,
				take: max,
				skip: (page - 1) * max,
				orderBy: {
					id: "desc",
				},
				include: {
					prices: true,
				},
			}),
			db.product.count({
				where,
			}),
		]);

		return { data: products, total };
	} catch (e: any) {
		return { error: e };
	}
}

export async function getProductsBasic(): Promise<ReturnFetch<Product[]>> {
	const { orgId, userId } = auth();

	if (!orgId || !userId) {
		return { error: "Unauthorized" };
	}

	try {
		const products = await db.product.findMany({
			where: {
				org: orgId,
			},
			orderBy: {
				id: "desc",
			},
		});

		return { data: products };
	} catch (e: any) {
		return { error: e };
	}
}

export async function getAllProductsWithPrices(): Promise<
	ReturnFetch<ProductsWithPrices[]>
> {
	const { orgId, userId } = auth();

	if (!orgId || !userId) {
		return { error: "Unauthorized" };
	}

	try {
		const products = await db.product.findMany({
			where: {
				org: orgId,
			},
			orderBy: {
				id: "desc",
			},
			include: {
				prices: true,
			},
		});

		return { data: products };
	} catch (e: any) {
		return { error: e };
	}
}
