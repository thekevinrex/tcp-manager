import { auth } from "@clerk/nextjs";
import { SellArea } from "@prisma/client";

import { ReturnFetch, SellWithProduct } from "@/lib/types";
import db from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function getAreaSells(
	area: SellArea,
	query: string,
	page: number = 1,
	max: number = 5
): Promise<ReturnFetch<SellWithProduct[]>> {
	const { orgId } = auth();
	const _ = await getTranslations("error");

	if (!orgId) {
		return { error: _("unauthorized") };
	}

	try {
		const [sells, total] = await db.$transaction([
			db.sell.findMany({
				take: max,
				skip: (page - 1) * max,
				where: {
					areaId: area.id,
					Product: {
						name: {
							contains: query ? query : "",
							mode: "insensitive",
						},
					},
				},
				include: {
					Product: true,
				},
				orderBy: {
					id: "desc",
				},
			}),
			db.sell.count({
				where: {
					areaId: area.id,
				},
			}),
		]);
		return { data: sells, total };
	} catch {
		return { error: _("error") };
	}
}

export async function getProductSelledArea(area: SellArea) {
	const { orgId } = auth();
	const _ = await getTranslations("error");

	if (!orgId) {
		return { error: _("unauthorized") };
	}

	try {
		const [sells, total] = await db.$transaction([
			db.sell.findMany({
				where: {
					areaId: area.id,
				},
				orderBy: {
					id: "desc",
				},
				include: {
					Product: true,
					inventories: true,
				},
			}),
			db.sell.count({
				where: {
					areaId: area.id,
				},
			}),
		]);
		return { data: sells, total };
	} catch {
		return { error: _("error") };
	}
}
