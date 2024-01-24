"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { DeleteSellArea, InputType, ReturnType } from "./shema";
import { getTranslations } from "next-intl/server";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId, has } = auth();
	const _ = await getTranslations("error");
	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	if (!has({ permission: "org:sells:manage" })) {
		return { error: _("no_permission") };
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

	if (area.endedAt === null) {
		return { error: _("delete_active_area") };
	}

	try {
		const deleted = await db.sellArea.delete({
			where: {
				id,
			},
		});

		revalidatePath("/panel/area/dashboard");

		return { data: deleted };
	} catch {
		return { error: _("error") };
	}
};

export const deleteSellArea = createSafeAction(DeleteSellArea, handler);
