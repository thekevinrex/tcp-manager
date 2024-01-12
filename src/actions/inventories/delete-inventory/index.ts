"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { DeleteInventory, InputType, ReturnType } from "./shema";
import { getActiveArea } from "@/fetchs/sell-area";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "User not authenticated or not in a organization" };
	}

	const { id } = data;

	const inventory = await db.inventory.findFirst({
		where: {
			id,
		},
	});

	if (!inventory) {
		return { error: "No inventory found" };
	}

	const area = await getActiveArea();

	if (area.data) {
		return {
			error: "You cant delete a inventory if there is a active sell area",
		};
	}

	try {
		const [deleted, product] = await db.$transaction([
			db.inventory.delete({
				where: {
					id,
				},
			}),
			db.product.update({
				where: {
					id: inventory.productId,
				},
				data: {
					aviable: {
						decrement: inventory.cant - inventory.selled,
					},
				},
			}),
		]);

		revalidatePath("/panel/inventory");
		return { data: inventory };
	} catch {
		return { error: "An error ocurred" };
	}
};

export const deleteInventory = createSafeAction(DeleteInventory, handler);
