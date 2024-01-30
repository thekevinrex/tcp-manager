import { auth } from "@clerk/nextjs";
import { Prisma, Product } from "@prisma/client";

import db from "@/lib/db";
import {
	ProductsWithAll,
	ProductsWithPrices,
	ProductsWithPricesAndOrg,
	ReturnFetch,
} from "@/lib/types";
import { getTranslations } from "next-intl/server";

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
	const _ = await getTranslations("error");

	if (!orgId || !userId) {
		return { error: _("unauthorized") };
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
		return { error: _("error") };
	}
}

export async function getProductsBasic(): Promise<ReturnFetch<Product[]>> {
	const { orgId, userId } = auth();
	const _ = await getTranslations("error");

	if (!orgId || !userId) {
		return { error: _("unauthorized") };
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
		return { error: _("error") };
	}
}

export async function getAllProductsWithPrices(): Promise<
	ReturnFetch<ProductsWithPrices[]>
> {
	const { orgId, userId } = auth();
	const _ = await getTranslations("error");

	if (!orgId || !userId) {
		return { error: _("unauthorized") };
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
		return { error: _("error") };
	}
}

export async function getProductsStats(): Promise<
	ReturnFetch<{ total: number; total_can_earn: number }>
> {
	const { orgId, userId } = auth();
	const _ = await getTranslations("error");

	if (!orgId || !userId) {
		return { error: _("unauthorized") };
	}

	try {
		const products: Array<{ total: number; total_can_earn: number }> =
			await db.$queryRaw`select count(*) as total, sum (aviable * price) as total_can_earn from products where org = ${orgId}`;

		return { data: products[0] };
	} catch {
		return { error: _("error") };
	}
}

export async function getProduct(
	productId: number,
	options?: Prisma.ProductInclude
): Promise<ReturnFetch<ProductsWithAll>> {
	const { orgId, userId } = auth();
	const _ = await getTranslations("error");

	if (!orgId || !userId) {
		return { error: _("unauthorized") };
	}

	try {
		const product = await db.product.findUnique({
			where: {
				org: orgId,
				id: productId,
			},
			include: {
				prices: true,
				selleds:
					options && options.selleds !== undefined
						? options.selleds
						: {
								include: {
									inventories: true,
								},
								orderBy: {
									id: "desc",
								},
						  },
				inventories:
					options && options.inventories !== undefined
						? options.inventories
						: {
								orderBy: {
									id: "desc",
								},
						  },
				_count:
					options && options._count !== undefined
						? options._count
						: {
								select: {
									inventories: true,
									selleds: true,
								},
						  },
			},
		});

		return { data: product as ProductsWithAll };
	} catch {
		return { error: _("error") };
	}
}
