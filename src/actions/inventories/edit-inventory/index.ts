"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { EditInventory, InputType, ReturnType } from "./shema";
import { Prisma } from "@prisma/client";
import { getActiveArea } from "@/fetchs/sell-area";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "User not authenticated or not in a organization" };
	}

	const area = await getActiveArea();

	if (area.data) {
		return {
			error: "You cant edit a inventory if there is a active sell area",
		};
	}

	const { cant, cost, id, update_all } = data;

	const inventory = await db.inventory.findUnique({
		where: {
			id,
			Product: {
				org: orgId,
			},
		},
	});

	if (!inventory) {
		return { error: "Inventory not found" };
	}

	const updateData: Prisma.InventoryUpdateArgs = {
		where: {
			id,
		},
		data: {
			total: cost,
		},
	};

	if (update_all) {
		updateData.data.sell = {
			updateMany: {
				data: {
					price: cost,
				},
				where: {},
			},
		};
	}

	if (cant && cant > 0) {
		updateData.data.Product = {
			update: {
				aviable: {
					increment: cant - (inventory.cant - inventory.selled),
				},
			},
		};
		updateData.data.cant = cant;
		updateData.data.selled = 0;
	}

	try {
		const Inventory = await db.inventory.update(updateData);

		revalidatePath("/panel/inventory");

		return { data: inventory };
	} catch (err: any) {
		// return { error: "An error ocurred" };
		return { error: err.message };
	}
};

export const editInventory = createSafeAction(EditInventory, handler);
