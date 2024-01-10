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

	const { selecteds } = data;

	if (selecteds.length <= 0) {
		return { error: "Add at least one product to the sell area" };
	}

	for (const selected of selecteds) {
		const product = await db.product.findUnique({
			where: {
				id: selected.id,
			},
		});

		if (!product) {
			return { error: "Product not found" };
		}

		if (product.aviable < selected.cant) {
			return {
				error:
					"total is greater than the aviable of the product" + product.name,
			};
		}
	}

	try {
		const Area = await db.sellArea.create({
			data: {
				org: orgId,
				Products: {
					createMany: {
						data: selecteds.map((selected) => {
							return { productId: selected.id, aviable: selected.cant };
						}),
					},
				},
			},
		});

		revalidatePath("/panel/area/dashboard");

		return { data: Area };
	} catch (error: any) {
		return { error: error.message };
	}
};

export const createSellArea = createSafeAction(CreateSellArea, handler);
