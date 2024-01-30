"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { CreateSellArea, InputType, ReturnType } from "./shema";
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

	try {
		const Area = await db.sellArea.create({
			data: {
				org: orgId,
			},
		});

		revalidatePath("/panel/area/dashboard");

		return { data: [] };
	} catch {
		return { error: _("error") };
	}
};

export const createSellArea = createSafeAction(CreateSellArea, handler);
