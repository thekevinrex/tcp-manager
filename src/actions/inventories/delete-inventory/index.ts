"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { DeleteInventory, InputType, ReturnType } from "./shema";
import { getActiveArea } from "@/fetchs/sell-area";
import { getTranslations } from "next-intl/server";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId, has } = auth();
	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	if (!has({ permission: "org:inventories:manage" })) {
		return { error: _("no_permission") };
	}

	const { id } = data;

	const inventory = await db.inventory.findFirst({
		where: {
			id,
		},
	});

	if (!inventory) {
		return { error: _("no_inventory") };
	}

	const area = await getActiveArea();

	if (area.data) {
		return {
			error: _("inventory_delete_active_area"),
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
		return { error: _("error") };
	}
};

export const deleteInventory = createSafeAction(DeleteInventory, handler);
