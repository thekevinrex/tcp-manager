"use server";

import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function Products({
	q,
	page,
	max: pageSize,
	filters: { min, order, max },
	org,
}: {
	q?: string;
	page: number;
	max: number;
	filters: { min?: string; order?: string; max?: string };
	org?: string;
}) {
	const where: Prisma.ProductWhereInput = {
		status: {
			not: "hidden",
		},
		organization: {
			visible: true,
		},
		org: org ? org : undefined,
		price: {
			gte: min ? parseInt(min) : undefined,
			lte: max ? parseInt(max) : undefined,
		},
	};

	if (q) {
		where.name = {
			contains: q,
			mode: "insensitive",
		};
	}

	try {
		const products = await db.product.findMany({
			where,
			skip: (page - 1) * pageSize,
			take: pageSize,
			orderBy: {
				price: order ? (order === "price_asc" ? "asc" : "desc") : undefined,
			},
			include: {
				prices: true,
			},
		});

		products.forEach((p) => (p.aviable = p.aviable > 0 ? 1 : 0));

		return {
			products,
			status: 200,
		};
	} catch (err: any) {
		return { error: "error" };
	}
}
