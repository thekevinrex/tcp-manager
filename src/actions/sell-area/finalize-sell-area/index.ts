"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { FinalizeSellArea, InputType, ReturnType } from "./shema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "User not authenticated or not in a organization" };
	}

	const { id } = data;

	const area = await db.sellArea.findFirst({
		where: {
			id,
			org: orgId,
		},
	});

	if (!area) {
		return { error: "Area not found" };
	}

	try {
		const updated = await db.sellArea.update({
			where: {
				id,
			},
			data: {
				endedAt: new Date(),
				Products: {
					deleteMany: {},
				},
			},
		});

		revalidatePath("/panel/area/dashboard");

		return { data: updated };
	} catch {
		return { error: "An error ocurred" };
	}
};

export const finalizeSellArea = createSafeAction(FinalizeSellArea, handler);
