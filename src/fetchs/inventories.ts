import { auth } from "@clerk/nextjs";
import supabaseClient from "@/lib/supabaseClient";
import { InventoryWithProduct, ReturnFetch } from "@/lib/types";
import { Inventory, Prisma } from "@prisma/client";
import db from "@/lib/db";

export async function getAllInventories({
	query,
	page = 1,
	max = 5,
}: {
	query?: string;
	page?: number;
	max?: number;
}): Promise<ReturnFetch<InventoryWithProduct[]>> {
	const { orgId, userId } = auth();

	if (!orgId || !userId) {
		return { error: "Unauthorized" };
	}

	const where: Prisma.InventoryWhereInput = {
		Product: {
			org: orgId,
			name: {
				contains: query ? query : "",
				mode: "insensitive",
			},
		},
	};

	try {
		const [inventories, total] = await db.$transaction([
			db.inventory.findMany({
				where,
				take: max,
				skip: (page - 1) * max,
				orderBy: {
					id: "desc",
				},
				include: {
					Product: true,
				},
			}),
			db.inventory.count({
				where,
			}),
		]);

		return { data: inventories, total };
	} catch (e: any) {
		return { error: e };
	}
}
