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
	} catch {
		return { error: "An error ocurred" };
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
	} catch {
		return { error: "An error ocurred" };
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
	} catch {
		return { error: "An error ocurred" };
	}
}

export async function getProductsStats(): Promise<
	ReturnFetch<{ total: number; total_can_earn: number }>
> {
	const { orgId, userId } = auth();

	if (!orgId || !userId) {
		return { error: "Unauthorized" };
	}

	try {
		const products: Array<{ total: number; total_can_earn: number }> =
			await db.$queryRaw`select count(*), sum (aviable * price) from products where org = ${orgId}`;

		return { data: products[0] };
	} catch {
		return { error: "An error ocurred" };
	}
}
