"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { DeleteSellArea, InputType, ReturnType } from "./shema";

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

	if (area.endedAt === null) {
		return { error: "You cant not delete the active sell area" };
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
		return { error: "An error ocurred" };
	}
};

export const deleteSellArea = createSafeAction(DeleteSellArea, handler);
