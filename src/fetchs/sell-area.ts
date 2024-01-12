import { auth } from "@clerk/nextjs";
import db from "../lib/db";
import {
	ProductsWithPrices,
	ReturnFetch,
	SellAreaProductWithProduct,
	SellAreaWithProductAndSells,
	SellAreaWithTotalSells,
} from "@/lib/types";
import { SellArea } from "@prisma/client";

export async function getAllSellAreas({
	page = 1,
	max = 10,
}: {
	page?: number;
	max?: number;
}): Promise<ReturnFetch<SellAreaWithTotalSells[]>> {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "Unauthorized" };
	}

	try {
		const [Areas, total] = await db.$transaction([
			db.sellArea.findMany({
				where: {
					org: orgId,
				},
				take: max,
				skip: (page - 1) * max,
				orderBy: {
					id: "desc",
				},
				include: {
					_count: {
						select: {
							Sells: true,
						},
					},
				},
			}),
			db.sellArea.count({
				where: {
					org: orgId,
				},
			}),
		]);

		return { data: Areas, total };
	} catch {
		return { error: "An error ocurred" };
	}
}

export async function getAllSellsAreaProducts(
	limit?: number
): Promise<ReturnFetch<SellAreaWithProductAndSells[]>> {
	const { orgId } = auth();

	if (!orgId) {
		return { error: "Unauthorized" };
	}

	try {
		const Areas = await db.sellArea.findMany({
			where: {
				org: orgId,
			},
			take: limit ? limit : 7,
			include: {
				Products: true,
				Sells: {
					include: {
						inventories: true,
					},
				},
			},
			orderBy: {
				id: "desc",
			},
		});

		return { data: Areas };
	} catch {
		return { error: "An error ocurred" };
	}
}

export async function getActiveArea(): Promise<ReturnFetch<SellArea>> {
	const { orgId } = auth();

	if (!orgId) {
		return { error: "Unauthorized" };
	}

	try {
		const Area = await db.sellArea.findFirst({
			where: {
				org: orgId,
				endedAt: null,
			},
		});

		return { data: Area };
	} catch {
		return { error: "An error ocurred" };
	}
}

export async function getArea(areaId: number): Promise<ReturnFetch<SellArea>> {
	const { orgId } = auth();

	if (!orgId) {
		return { error: "Unauthorized" };
	}

	if (!areaId) {
		return { error: "Invalid area id" };
	}

	try {
		const area = await db.sellArea.findUnique({
			where: {
				id: areaId,
				org: orgId,
			},
		});

		if (!area) {
			return { error: "No area found" };
		}

		return { data: area };
	} catch {
		return { error: "An error ocurred" };
	}
}

export async function getTopProducts(limit: number): Promise<
	ReturnFetch<
		{
			name: string;
			total_sells: number;
			total_earns: number;
		}[]
	>
> {
	const { orgId } = auth();

	if (!orgId) {
		return { error: "Unauthorized" };
	}

	try {
		const response: Array<{
			name: string;
			total_sells: number;
			total_earns: number;
		}> = await db.$queryRaw`with Areas as (
				select id from "sell-areas" where org = ${orgId} order by id desc limit ${limit}
			  )
			  select
				p.name,
				sum(sl.cant * sl.price) as total_sells,
				sum( (sl.price - si.price) * si.cant ) as total_earns
			  from
				products as p join sells as sl on p.id = sl."productId" join Areas as ar on sl."areaId" = ar.id
				join "sells-inventories" as si on sl.id = si."sellId"
			  group by
				p.id
			  order by
				total_earns desc,
				total_sells desc
			  limit
				5;`;

		return { data: response };
	} catch {
		return { error: "An error ocurred" };
	}
}

export async function getTopSellAreas(limit: number): Promise<
	ReturnFetch<
		{
			createdAt: Date;
			total_sells: number;
			total_earns: number;
		}[]
	>
> {
	const { orgId } = auth();

	if (!orgId) {
		return { error: "Unauthorized" };
	}

	try {
		const response: Array<{
			createdAt: Date;
			total_sells: number;
			total_earns: number;
		}> = await db.$queryRaw`with Areas as (
				select id from "sell-areas" where org = ${orgId} order by id desc limit ${limit}
			  )
			  select
	  sa."createdAt",
	  sum(sl.cant * sl.price) as total_sells,
	  sum( (sl.price - si.price) * si.cant ) as total_earns
	from
	  products as p join sells as sl on p.id = sl."productId" join Areas as ar on sl."areaId" = ar.id
	  join "sells-inventories" as si on sl.id = si."sellId" join "sell-areas" as sa on sl."areaId" = sa.id
	group by
	  sa.id
	order by
	  total_earns desc,
	  total_sells desc
	limit
	  5`;

		return { data: response };
	} catch {
		return { error: "An error ocurred" };
	}
}
