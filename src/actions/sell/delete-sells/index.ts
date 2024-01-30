"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { DeleteSells, InputType, ReturnType } from "./shema";
import { getActiveArea } from "@/fetchs/sell-area";
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

	const { sells } = data;

	const area = await getActiveArea();

	if (area.error) {
		return { error: area.error };
	}

	if (!area.data) {
		return { error: _("sell_delete_active_area") };
	}

	try {
		const selleds = await db.sell.findMany({
			where: {
				id: {
					in: sells,
				},
			},
			include: {
				inventories: true,
			},
		});

		if (selleds.length !== sells.length) {
			return { error: _("sell_and_selleds_not_coincide") };
		}

		const productsUpdate: Array<{
			id: number;
			cant: number;
			inventories: Array<{ id: number; cant: number }>;
		}> = [];

		for (const sell of selleds) {
			if (sell.areaId !== area.data.id) {
				return { error: _("sell_delete_active_area") };
			}

			const product = productsUpdate.find((p) => p.id === sell.productId);

			const inventories = product ? product.inventories : [];

			for (const inventory of sell.inventories) {
				if (inventory.inventoryId === null) {
					continue;
				}

				const alreadyInventory = inventories.find(
					(i) => i.id === inventory.inventoryId
				);

				if (alreadyInventory) {
					alreadyInventory.cant += inventory.cant;
				} else {
					inventories.push({
						id: inventory.inventoryId,
						cant: inventory.cant,
					});
				}
			}

			if (product) {
				product.cant += sell.cant;
				product.inventories = inventories;
			} else {
				productsUpdate.push({
					id: sell.productId,
					cant: sell.cant,
					inventories,
				});
			}
		}

		await db.$transaction([
			db.sell.deleteMany({
				where: {
					id: {
						in: sells,
					},
				},
			}),

			...productsUpdate.map((product) => {
				return db.product.update({
					where: {
						id: product.id,
					},
					data: {
						aviable: {
							increment: product.cant,
						},
						inventories: {
							updateMany: product.inventories.map((invent) => {
								return {
									data: {
										selled: {
											decrement: invent.cant,
										},
										archived: false,
									},
									where: {
										id: invent.id,
									},
								};
							}),
						},
					},
				});
			}),
		]);

		revalidatePath(`/panel/area/dashboard/${area.data.id}/sells`);

		return { data: [] };
	} catch {
		return { error: _("error") };
	}
};

export const deleteSells = createSafeAction(DeleteSells, handler);
