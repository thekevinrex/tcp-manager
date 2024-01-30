"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { EditInventory, InputType, ReturnType } from "./shema";
import { Prisma } from "@prisma/client";
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

	const area = await getActiveArea();

	if (area.data) {
		return {
			error: _("inventory_edit_active_area"),
		};
	}

	const { cant, cost, id, update_all } = data;

	try {
		const inventory = await db.inventory.findUnique({
			where: {
				id,
				Product: {
					org: orgId,
				},
			},
		});

		if (!inventory) {
			return { error: _("no_inventory") };
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
					where: {
						price: {
							gt: 0,
						},
					},
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

		const Inventory = await db.inventory.update(updateData);

		revalidatePath("/panel/inventory");

		return { data: [] };
	} catch {
		return { error: _("error") };
	}
};

export const editInventory = createSafeAction(EditInventory, handler);
