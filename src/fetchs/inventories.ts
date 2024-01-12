import { auth } from "@clerk/nextjs";
import { InventoryWithProduct, ReturnFetch } from "@/lib/types";
import { Prisma } from "@prisma/client";
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
		return { error: "An error occurred" };
	}
}

export type InventoriesStats = {
	total_selled: number;
	total_cant: number;
	total_invert: number;
	total_left: number;
};

export async function getInventoriesStats(): Promise<
	ReturnFetch<InventoriesStats>
> {
	const { orgId } = auth();

	if (!orgId) {
		return { error: "Unauthorized" };
	}

	try {
		const stats: InventoriesStats[] =
			await db.$queryRaw`select sum(cant) as total_cant, sum(selled) as total_selled, sum(cant * total) as total_invert, sum ( (cant - selled) * total ) as total_left
		from inventories join products on inventories."productId" = products.id
		where org = ${orgId}`;

		return { data: stats[0] };
	} catch {
		return { error: "A error occurred" };
	}
}
