"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { CreateSellArea, InputType, ReturnType } from "./shema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "User not authenticated or not in a organization" };
	}

	try {
		const Area = await db.sellArea.create({
			data: {
				org: orgId,
			},
		});

		revalidatePath("/panel/area/dashboard");

		return { data: Area };
	} catch {
		return { error: "An error ocurred" };
	}
};

export const createSellArea = createSafeAction(CreateSellArea, handler);
