"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { CreateInventory, InputType, ReturnType } from "./shema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "User not authenticated or not in a organization" };
	}

	const { cant, cost, product: productId } = data;

	const product = await db.product.findFirst({
		where: {
			org: orgId,
			id: productId,
		},
	});

	if (!product) {
		return { error: "Product not found" };
	}

	try {
		const [product] = await db.$transaction([
			db.product.update({
				data: {
					aviable: {
						increment: cant,
					},
					inventories: {
						create: {
							cant,
							total: cost,
						},
					},
				},
				where: {
					id: productId,
				},
			}),
		]);

		revalidatePath("/panel/inventory");
		return { data: product };
	} catch {
		return { error: "An error ocurred" };
	}
};

export const createInventory = createSafeAction(CreateInventory, handler);
