import { auth } from "@clerk/nextjs";
import db from "../lib/db";
import {
	ReturnFetch,
	SellAreaWithProductAndSells,
	SellAreaWithTotalSells,
} from "@/lib/types";
import { SellArea } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export async function getAllSellAreas({
	page = 1,
	max = 10,
}: {
	page?: number;
	max?: number;
}): Promise<ReturnFetch<SellAreaWithTotalSells[]>> {
	const { userId, orgId } = auth();
	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
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
		return { error: _("error") };
	}
}

export async function getAllSellsAreaProducts(
	limit?: number
): Promise<ReturnFetch<SellAreaWithProductAndSells[]>> {
	const { orgId } = auth();
	const _ = await getTranslations("error");

	if (!orgId) {
		return { error: _("unauthorized") };
	}

	try {
		const Areas = await db.sellArea.findMany({
			where: {
				org: orgId,
			},
			take: limit ? limit : 7,
			include: {
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
		return { error: _("error") };
	}
}

export async function getActiveArea(): Promise<ReturnFetch<SellArea>> {
	const { orgId } = auth();
	const _ = await getTranslations("error");

	if (!orgId) {
		return { error: _("unauthorized") };
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
		return { error: _("error") };
	}
}

export async function getArea(areaId: number): Promise<ReturnFetch<SellArea>> {
	const { orgId } = auth();
	const _ = await getTranslations("error");

	if (!orgId) {
		return { error: _("unauthorized") };
	}

	if (!areaId) {
		return { error: _("invalid_area_id") };
	}

	try {
		const area = await db.sellArea.findUnique({
			where: {
				id: areaId,
				org: orgId,
			},
		});

		if (!area) {
			return { error: _("no_area_found") };
		}

		return { data: area };
	} catch {
		return { error: _("error") };
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
	const _ = await getTranslations("error");

	if (!orgId) {
		return { error: _("unauthorized") };
	}

	try {
		const response: Array<{
			name: string;
			total_sells: number;
			total_earns: number;
		}> = await db.$queryRaw`with
		Areas as (
		  select
			id
		  from
			"sell-areas"
		  where
			org = ${orgId}
		  order by
			id desc
		  limit
			${limit}
		),
		"SELLS" as (
		  select
			products.id as idd,
			sum(sells.cant * sells.price) as total_sells
		  from
			sells
			join products on sells."productId" = products.id
			join Areas as ar on ar.id = sells."areaId"
		  where
			org = ${orgId}
		  group by
			products.id
		),
		earns as (
		  select
			products.id as ide,
			sum((sll.price - sii.price) * sii.cant) as total_earns
		  from
			sells sll
			join "sells-inventories" as sii on sii."sellId" = sll.id
			join Areas as ar on ar.id = sll."areaId"
			join products on sll."productId" = products.id
		  where
			org = ${orgId}
		  group by
			products.id
		)
	  select
		p.name,
		total_sells,
		total_earns
	  from
		products as p
		join "SELLS" as slss on slss.idd = p.id
		join earns as ear on ear.ide = p.id
	  order by
		total_earns desc,
		total_sells desc
	  limit
		5
	  `;

		return { data: response };
	} catch {
		return { error: _("error") };
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
	const _ = await getTranslations("error");

	if (!orgId) {
		return { error: _("unauthorized") };
	}

	try {
		const response: Array<{
			createdAt: Date;
			total_sells: number;
			total_earns: number;
		}> = await db.$queryRaw`with
		Areas as (
		  select
			id
		  from
			"sell-areas"
		  where
			org = ${orgId}
		  order by
			id desc
		  limit
			${limit}
		),
		"SELLS" as (
		  select
			saa.id as idd,
			sum(cant * price) as total_sells
		  from
			sells
			join "sell-areas" as saa on sells."areaId" = saa.id
		  where
			saa.org = ${orgId}
		  group by
			saa.id
		),
		earns as (
		  select
			saa.id as iad,
			sum((sll.price - sii.price) * sii.cant) as total_earns
		  from
			sells sll
			join "sells-inventories" as sii on sii."sellId" = sll.id
			join "sell-areas" as saa on saa.id = sll."areaId"
		  where
			saa.org = ${orgId}
		  group by
			saa.id
		)
	  select
		sa."createdAt",
		total_sells,
		total_earns
	  from
		"sell-areas" as sa
		join Areas as a on sa.id = a.id
		join "SELLS" on sa.id = "SELLS".idd
		join earns on sa.id = earns.iad
	  order by
		total_earns desc,
		total_sells desc
	  limit
		5;`;

		return { data: response };
	} catch (arr: any) {
		return { error: arr.message + " " + orgId };
		// return { error: _("error") };
	}
}
