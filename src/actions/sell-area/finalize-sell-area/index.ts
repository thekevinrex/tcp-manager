"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { FinalizeSellArea, InputType, ReturnType } from "./shema";
import { getTranslations } from "next-intl/server";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();
	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	const { id } = data;

	const area = await db.sellArea.findFirst({
		where: {
			id,
			org: orgId,
		},
	});

	if (!area) {
		return { error: _("no_area_found") };
	}

	try {
		const [updated, rows] = await db.$transaction([
			db.sellArea.update({
				where: {
					id,
				},
				data: {
					endedAt: new Date(),
				},
			}),
			db.$executeRaw`delete from inventories where "productId" in (select id from products where org = ${orgId}) and selled = cant`,
		]);

		revalidatePath("/panel/area/dashboard");

		return { data: updated };
	} catch (err: any) {
		return { error: _("error") };
	}
};

export const finalizeSellArea = createSafeAction(FinalizeSellArea, handler);
